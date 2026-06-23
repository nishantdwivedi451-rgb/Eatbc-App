import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await ensureDb();

  const token = req.headers.authorization?.slice(7);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const rows = await sql`SELECT user_id FROM sessions WHERE token = ${token}`;
  if (!rows.length) return res.status(401).json({ error: "Invalid session" });

  const userId = rows[0].user_id;
  /* CASCADE handles sessions, plans, tracking, community rows */
  await sql`DELETE FROM users WHERE id = ${userId}`;

  return res.status(200).json({ ok: true });
}
