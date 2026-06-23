import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sql, ensureDb } from "./_lib/db.js";
import { allow, clientIp } from "./_lib/ratelimit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await ensureDb();

    // Throttle mass account creation: 5 sign-ups / hour per IP.
    const ip = clientIp(req);
    if (!(await allow(`register:ip:${ip}`, 5, 3600)))
      return res.status(429).json({ error: "Too many sign-ups from this network — please try later." });

    const { id, name, password } = req.body ?? {};
    if (!id || !name || !password)
      return res.status(400).json({ error: "Missing fields" });

    const userId = String(id).toLowerCase().trim();
    // Allow email addresses, phone numbers, and alphanumeric usernames.
    if (!/^[a-z0-9_.@+\-]{3,60}$/.test(userId))
      return res.status(400).json({ error: "ID must be 3–60 chars (letters, numbers, @, ., _)" });

    const existing = await sql`SELECT id FROM users WHERE id = ${userId}`;
    if ((existing as unknown[]).length > 0)
      return res.status(409).json({ error: "That ID is already registered — try logging in." });

    const passwordHash = await bcrypt.hash(String(password), 12);
    await sql`INSERT INTO users (id, name, password_hash) VALUES (${userId}, ${String(name)}, ${passwordHash})`;

    const token = randomUUID();
    await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, NOW() + INTERVAL '30 days')`;

    return res.status(200).json({ token, user: { id: userId, name: String(name) } });
  } catch (e) {
    console.error("[register]", e);
    return res.status(503).json({ error: "Registration is temporarily unavailable. Please try again shortly." });
  }
}
