import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureWearableDb } from "../_lib/db.js";
import { verifyToken } from "../_lib/auth.js";
import { encrypt } from "../_lib/crypto.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { code, state, error } = req.query as { code?: string; state?: string; error?: string };

  if (error) return res.redirect(302, "/?fitError=access_denied");
  if (!code || !state) return res.redirect(302, "/?fitError=invalid_callback");

  // state = session token
  const userId = await verifyToken(`Bearer ${state}`);
  if (!userId) return res.redirect(302, "/?fitError=invalid_session");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return res.redirect(302, "/?fitError=not_configured");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) return res.redirect(302, "/?fitError=token_exchange_failed");

  const tokenData = await tokenRes.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  };

  await ensureWearableDb();

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
  const accessEnc = encrypt(tokenData.access_token);
  const refreshEnc = tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null;

  await sql`
    INSERT INTO wearable_connections
      (user_id, provider, access_token_enc, refresh_token_enc, expires_at, scopes, updated_at)
    VALUES
      (${userId}, 'googlefit', ${accessEnc}, ${refreshEnc}, ${expiresAt}, ${tokenData.scope}, NOW())
    ON CONFLICT (user_id, provider) DO UPDATE SET
      access_token_enc = ${accessEnc},
      refresh_token_enc = COALESCE(${refreshEnc}, wearable_connections.refresh_token_enc),
      expires_at = ${expiresAt},
      scopes = ${tokenData.scope},
      updated_at = NOW()
  `;

  return res.redirect(302, "/?fitConnected=true");
}
