import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sql, ensureDb } from "./_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await ensureDb();

  const { id, name, password } = req.body ?? {};
  if (!id || !name || !password)
    return res.status(400).json({ error: "Missing fields" });

  const userId = String(id).toLowerCase().trim();
  if (!/^[a-z0-9_]{3,30}$/.test(userId))
    return res.status(400).json({ error: "Username must be 3–30 chars (letters, numbers, _)" });

  const existing = await sql`SELECT id FROM users WHERE id = ${userId}`;
  if ((existing as unknown[]).length > 0)
    return res.status(409).json({ error: "Username already taken" });

  const passwordHash = await bcrypt.hash(String(password), 12);
  await sql`INSERT INTO users (id, name, password_hash) VALUES (${userId}, ${String(name)}, ${passwordHash})`;

  const token = randomUUID();
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, NOW() + INTERVAL '30 days')`;

  return res.status(200).json({ token, user: { id: userId, name: String(name) } });
}
