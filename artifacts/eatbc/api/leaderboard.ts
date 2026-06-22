import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";

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
    const { name, streak, points } = req.body ?? {};
    const safeName = String(name ?? "Warrior").slice(0, 40);
    const s = Math.max(0, Math.min(100000, Math.floor(Number(streak) || 0)));
    const p = Math.max(0, Math.min(10000000, Math.floor(Number(points) || 0)));
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
