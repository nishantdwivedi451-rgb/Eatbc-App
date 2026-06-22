import { sql } from "./db";

export async function verifyToken(
  authHeader: string | undefined
): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const rows = await sql`SELECT user_id FROM sessions WHERE token = ${token}`;
  return (rows[0] as { user_id: string } | undefined)?.user_id ?? null;
}
