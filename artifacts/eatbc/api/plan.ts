import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";
import { encrypt, decrypt } from "./_lib/crypto.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const rows = await sql`SELECT plan_enc, profile_enc FROM plans WHERE user_id = ${userId}`;
    const row = rows[0] as { plan_enc: string; profile_enc?: string } | undefined;
    if (!row) return res.status(200).json({ plan: null });
    try {
      const plan = JSON.parse(decrypt(row.plan_enc));
      const profile = row.profile_enc ? JSON.parse(decrypt(row.profile_enc)) : null;
      return res.status(200).json({ plan, profile });
    } catch {
      return res.status(200).json({ plan: null });
    }
  }

  if (req.method === "POST") {
    const { plan, profile } = req.body ?? {};
    if (!plan) return res.status(400).json({ error: "Missing plan" });
    const planEnc = encrypt(JSON.stringify(plan));
    const profileEnc = profile ? encrypt(JSON.stringify(profile)) : null;
    await sql`
      INSERT INTO plans (user_id, plan_enc, profile_enc, updated_at)
      VALUES (${userId}, ${planEnc}, ${profileEnc}, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET plan_enc = ${planEnc}, profile_enc = ${profileEnc}, updated_at = NOW()
    `;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
