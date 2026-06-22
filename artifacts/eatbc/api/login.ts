import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sql, ensureDb } from "./_lib/db.js";
import { decrypt } from "./_lib/crypto.js";
import { allow, clientIp } from "./_lib/ratelimit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await ensureDb();

  const { id, password } = req.body ?? {};
  if (!id || !password)
    return res.status(400).json({ error: "Missing fields" });

  const userId = String(id).toLowerCase().trim();

  // Throttle brute-force: 10 attempts / 15 min per IP, 8 per account.
  const ip = clientIp(req);
  const okIp = await allow(`login:ip:${ip}`, 10, 900);
  const okAcct = await allow(`login:acct:${userId}`, 8, 900);
  if (!okIp || !okAcct)
    return res.status(429).json({ error: "Too many attempts — please wait a few minutes and try again." });

  const rows = await sql`SELECT id, name, password_hash FROM users WHERE id = ${userId}`;
  const user = rows[0] as { id: string; name: string; password_hash: string } | undefined;
  if (!user) return res.status(401).json({ error: "Invalid username or password" });

  const valid = await bcrypt.compare(String(password), user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid username or password" });

  const token = randomUUID();
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, NOW() + INTERVAL '30 days')`;

  const planRows = await sql`SELECT plan_enc, profile_enc FROM plans WHERE user_id = ${userId}`;
  const trackRows = await sql`SELECT tracking_enc FROM tracking WHERE user_id = ${userId}`;

  let plan = null, tracking = {};
  const pr = planRows[0] as { plan_enc: string; profile_enc?: string } | undefined;
  const tr = trackRows[0] as { tracking_enc: string } | undefined;
  try { if (pr?.plan_enc) plan = JSON.parse(decrypt(pr.plan_enc)); } catch {}
  try { if (tr?.tracking_enc) tracking = JSON.parse(decrypt(tr.tracking_enc)); } catch {}

  return res.status(200).json({ token, user: { id: user.id, name: user.name }, plan, tracking });
}
