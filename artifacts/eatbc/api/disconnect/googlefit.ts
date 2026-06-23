import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "../_lib/db.js";
import { verifyToken } from "../_lib/auth.js";
import { decrypt } from "../_lib/crypto.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const rows = await sql`
    SELECT access_token_enc FROM wearable_connections
    WHERE user_id = ${userId} AND provider = 'googlefit'
  `;

  if (rows.length) {
    const row = rows[0] as { access_token_enc: string };
    try {
      const accessToken = decrypt(row.access_token_enc);
      // Revoke token with Google (best-effort, don't fail if this errors)
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(accessToken)}`, {
        method: "POST",
      });
    } catch {
      // ignore revoke errors
    }
  }

  await sql`
    DELETE FROM wearable_connections
    WHERE user_id = ${userId} AND provider = 'googlefit'
  `;

  return res.status(200).json({ ok: true });
}
