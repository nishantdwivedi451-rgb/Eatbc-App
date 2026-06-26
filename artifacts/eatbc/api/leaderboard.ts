import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";
import { decrypt } from "./_lib/crypto.js";

/* Replicate client-side streak/points logic so values can't be spoofed. */
function isoShift(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface HistEntry { onTrack: boolean; cal: number; protein: number; }

function computeStreak(history: Record<string, HistEntry>): number {
  let streak = 0, graceUsed = false;
  for (let i = 0; i < 400; i++) {
    const iso = isoShift(-i);
    const ok = history[iso]?.onTrack;
    if (ok) { streak++; continue; }
    if (i === 0) continue;
    if (!graceUsed) { graceUsed = true; continue; }
    break;
  }
  return streak;
}

function computePoints(history: Record<string, HistEntry>): number {
  const onTrackDays = Object.values(history).filter(e => e?.onTrack).length;
  return onTrackDays * 10 + computeStreak(history) * 5;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const rows = await sql`
      SELECT name, streak, points FROM community
      ORDER BY points DESC, streak DESC
      LIMIT 50
    `;
    return res.status(200).json({ leaders: rows });
  }

  if (req.method === "POST") {
    const { name } = req.body ?? {};
    const safeName = String(name ?? "Warrior").slice(0, 40);

    /* Compute streak/points from the server-side tracking blob — never trust client. */
    let s = 0, p = 0;
    try {
      const rows = await sql`SELECT tracking_enc FROM tracking WHERE user_id = ${userId}`;
      const row = rows[0] as { tracking_enc: string } | undefined;
      if (row) {
        const tracking = JSON.parse(decrypt(row.tracking_enc));
        const history: Record<string, HistEntry> = tracking.history || {};
        s = computeStreak(history);
        p = computePoints(history);
      }
    } catch {
      /* Fallback: leave s=0, p=0 — never let bad data override with spoofed values. */
    }

    await sql`
      INSERT INTO community (user_id, name, streak, points, updated_at)
      VALUES (${userId}, ${safeName}, ${s}, ${p}, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET name = ${safeName}, streak = ${s}, points = ${p}, updated_at = NOW()
    `;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
