import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { sql, ensureDb } from "../_lib/db.js";
import { verifyToken } from "../_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  await ensureDb();

  if (req.method === "DELETE") {
    const { endpoint } = req.body ?? {};
    if (endpoint) {
      await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { endpoint, p256dh, auth } = req.body ?? {};
  if (!endpoint || !p256dh || !auth)
    return res.status(400).json({ error: "Missing subscription fields" });

  // Link subscription to user if authenticated (optional — anonymous subscriptions are OK too)
  let userId: string | null = null;
  try {
    userId = await verifyToken(req.headers.authorization);
  } catch {}

  const id = randomUUID();
  await sql`
    INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth)
    VALUES (${id}, ${userId}, ${endpoint}, ${p256dh}, ${auth})
    ON CONFLICT (endpoint) DO UPDATE
      SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth
  `;

  return res.status(200).json({ ok: true });
}
