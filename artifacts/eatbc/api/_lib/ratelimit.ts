import type { VercelRequest } from "@vercel/node";
import { sql } from "./db.js";

/* Best-effort client IP from Vercel's proxy headers. */
export function clientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw?.split(",")[0].trim()) || req.socket?.remoteAddress || "unknown";
}

/* Fixed-window rate limiter backed by Postgres so it works across the
   stateless serverless fleet. Returns true if the request is allowed.
   On any DB hiccup it fails OPEN (allows) — never locks legit users out. */
export async function allow(
  bucket: string,
  max: number,
  windowSec: number
): Promise<boolean> {
  try {
    const rows = await sql`
      INSERT INTO rate_limits (bucket, count, window_start)
      VALUES (${bucket}, 1, NOW())
      ON CONFLICT (bucket) DO UPDATE SET
        count = CASE
          WHEN rate_limits.window_start < NOW() - (${windowSec} || ' seconds')::interval
          THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start < NOW() - (${windowSec} || ' seconds')::interval
          THEN NOW()
          ELSE rate_limits.window_start
        END
      RETURNING count
    `;
    const count = Number((rows[0] as { count: number } | undefined)?.count ?? 1);
    return count <= max;
  } catch {
    return true;
  }
}
