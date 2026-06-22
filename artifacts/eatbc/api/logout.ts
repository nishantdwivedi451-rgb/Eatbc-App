import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await ensureDb();

  const token = req.headers.authorization?.slice(7);
  if (token) await sql`DELETE FROM sessions WHERE token = ${token}`;

  return res.status(200).json({ ok: true });
}
