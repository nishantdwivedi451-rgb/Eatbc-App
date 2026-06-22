import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";
import { encrypt, decrypt } from "./_lib/crypto.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const rows = await sql`SELECT tracking_enc FROM tracking WHERE user_id = ${userId}`;
    const row = rows[0] as { tracking_enc: string } | undefined;
    if (!row) return res.status(200).json({ tracking: {} });
    try {
      return res.status(200).json({ tracking: JSON.parse(decrypt(row.tracking_enc)) });
    } catch {
      return res.status(200).json({ tracking: {} });
    }
  }

  if (req.method === "POST") {
    const { tracking } = req.body ?? {};
    if (!tracking) return res.status(400).json({ error: "Missing tracking" });
    const enc = encrypt(JSON.stringify(tracking));
    await sql`
      INSERT INTO tracking (user_id, tracking_enc, updated_at)
      VALUES (${userId}, ${enc}, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET tracking_enc = ${enc}, updated_at = NOW()
    `;
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
