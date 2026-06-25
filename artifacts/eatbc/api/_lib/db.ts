import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

let ready = false;

export async function ensureDb() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS plans (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      plan_enc TEXT NOT NULL,
      profile_enc TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS tracking (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      tracking_enc TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  /* Opt-in public leaderboard. Stores only display name + streak/points —
     never health data — so it is intentionally NOT encrypted. */
  await sql`
    CREATE TABLE IF NOT EXISTS community (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      streak INTEGER NOT NULL DEFAULT 0,
      points INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  /* Brute-force / abuse throttle for auth endpoints. Keyed by IP+action. */
  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      bucket TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  /* Veer AI coach usage counter (per user / per guest IP). */
  await sql`
    CREATE TABLE IF NOT EXISTS veer_usage (
      user_id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  ready = true;
}

/* Wearable tables are provisioned lazily — only when a user actually
   connects a device — so cold starts of the core app stay lean. */
let wearableReady = false;

export async function ensureWearableDb() {
  if (wearableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS wearable_connections (
      user_id   TEXT    NOT NULL,
      provider  TEXT    NOT NULL,
      access_token_enc  TEXT NOT NULL,
      refresh_token_enc TEXT,
      expires_at        TIMESTAMPTZ,
      scopes            TEXT,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, provider)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS wearable_sync (
      user_id         TEXT    NOT NULL,
      date            TEXT    NOT NULL,
      provider        TEXT    NOT NULL,
      steps           INTEGER DEFAULT 0,
      active_calories INTEGER DEFAULT 0,
      sleep_minutes   INTEGER DEFAULT 0,
      synced_at       TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, date, provider)
    )
  `;
  wearableReady = true;
}
