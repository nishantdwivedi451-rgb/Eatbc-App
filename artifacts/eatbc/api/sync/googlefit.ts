import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureWearableDb } from "../_lib/db.js";
import { verifyToken } from "../_lib/auth.js";
import { encrypt, decrypt } from "../_lib/crypto.js";

interface WearableRow {
  access_token_enc: string;
  refresh_token_enc: string | null;
  expires_at: string;
}

interface SyncRow {
  steps: number;
  active_calories: number;
}

async function refreshAccessToken(userId: string, refreshTokenEnc: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const refreshToken = decrypt(refreshTokenEnc);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return null;

  const data = await res.json() as { access_token: string; expires_in: number };
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
  const newEnc = encrypt(data.access_token);

  await sql`
    UPDATE wearable_connections
    SET access_token_enc = ${newEnc}, expires_at = ${expiresAt}, updated_at = NOW()
    WHERE user_id = ${userId} AND provider = 'googlefit'
  `;

  return data.access_token;
}

function deriveIsoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function derivePalTier(avgSteps: number): string {
  if (avgSteps >= 10000) return "Physically active";
  if (avgSteps >= 5000) return "On feet / moderate";
  return "Mostly desk job";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await ensureWearableDb();

  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const rows = await sql`
    SELECT access_token_enc, refresh_token_enc, expires_at
    FROM wearable_connections
    WHERE user_id = ${userId} AND provider = 'googlefit'
  `;
  if (!rows.length) return res.status(404).json({ error: "Google Fit not connected" });

  const row = rows[0] as WearableRow;
  let accessToken: string;

  if (new Date(row.expires_at) <= new Date(Date.now() + 60_000)) {
    if (!row.refresh_token_enc) return res.status(401).json({ error: "Token expired, reconnect Google Fit" });
    const refreshed = await refreshAccessToken(userId, row.refresh_token_enc);
    if (!refreshed) return res.status(401).json({ error: "Token refresh failed, reconnect Google Fit" });
    accessToken = refreshed;
  } else {
    accessToken = decrypt(row.access_token_enc);
  }

  // Pull 7 days of step + calorie aggregates from Google Fit
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const fitRes = await fetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.calories.expended" },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: sevenDaysAgo,
        endTimeMillis: now,
      }),
    }
  );

  if (!fitRes.ok) {
    const err = await fitRes.text();
    return res.status(502).json({ error: "Google Fit API error", detail: err });
  }

  const fitData = await fitRes.json() as {
    bucket: {
      startTimeMillis: string;
      dataset: {
        dataSourceId: string;
        point: { value: { intVal?: number; fpVal?: number }[] }[];
      }[];
    }[];
  };

  // Parse daily buckets
  const dailyStats: { date: string; steps: number; calories: number }[] = [];
  for (const bucket of fitData.bucket) {
    const dateStr = new Date(+bucket.startTimeMillis).toISOString().slice(0, 10);
    let steps = 0, calories = 0;
    for (const ds of bucket.dataset) {
      for (const point of ds.point) {
        if (ds.dataSourceId.includes("step_count")) {
          steps += point.value[0]?.intVal ?? 0;
        } else {
          calories += Math.round(point.value[0]?.fpVal ?? 0);
        }
      }
    }
    dailyStats.push({ date: dateStr, steps, calories });
  }

  // Upsert each day into wearable_sync
  for (const day of dailyStats) {
    await sql`
      INSERT INTO wearable_sync (user_id, date, provider, steps, active_calories, synced_at)
      VALUES (${userId}, ${day.date}, 'googlefit', ${day.steps}, ${day.calories}, NOW())
      ON CONFLICT (user_id, date, provider) DO UPDATE SET
        steps = ${day.steps},
        active_calories = ${day.calories},
        synced_at = NOW()
    `;
  }

  const todayStr = deriveIsoDate(0);
  const todayData = dailyStats.find(d => d.date === todayStr) ?? { steps: 0, calories: 0 };
  const avgSteps = dailyStats.length
    ? Math.round(dailyStats.reduce((s, d) => s + d.steps, 0) / dailyStats.length)
    : 0;
  const palTier = derivePalTier(avgSteps);

  return res.status(200).json({
    todaySteps: todayData.steps,
    todayCalories: todayData.calories,
    avgSteps,
    palTier,
    days: dailyStats,
  });
}
