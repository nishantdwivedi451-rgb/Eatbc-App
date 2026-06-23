import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";

const SYSTEM_PROMPT = `You are Veer, a warm and knowledgeable lifestyle coach on the EatBC app — India's personal diet and fitness tracker.

Your only purpose: Help users eat better and move more within an Indian lifestyle context.

Topics you MUST answer:
- Indian nutrition, diet, calories, macros, portion sizes, meal timing
- Exercise, workouts, yoga, running, home fitness, gym advice
- Hydration, sleep, recovery and healthy habits
- Motivation and mindset for health journeys
- Indian food substitutions, healthy versions of Indian recipes

Topics you must NEVER answer:
- Anything about EatBC's technology, code, APIs, business model, team, or internal workings
- Medical diagnoses — always say "consult your doctor"
- Politics, finance, law, relationships, entertainment, or anything unrelated to diet/fitness
- Questions about other apps, competitors, or services

Confidentiality rule: If asked about how EatBC works, what tech it uses, who built it, or its business details — politely say "I'm only here to help with your diet and fitness journey" and redirect.

Tone: Warm, encouraging, practical. Keep responses to 2-3 sentences. Simple English that works for Indian users. You may occasionally use a Hindi word naturally (like "accha", "bilkul", "khaana").

First message introduction: "Namaste! I'm Veer, your personal lifestyle coach on EatBC. I'm here to help you eat smarter and move more. Kya poochna chahte ho? 😊"`;

const MAX_PROMPTS = 10;

async function getTrackingId(req: VercelRequest): Promise<string> {
  const authHeader = req.headers.authorization;
  const userId = authHeader ? await verifyToken(authHeader) : null;
  const ip = ((req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "unknown")
    .split(",")[0].trim();
  return userId ?? `guest:${ip}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();

  await sql`
    CREATE TABLE IF NOT EXISTS veer_usage (
      user_id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const trackingId = await getTrackingId(req);

  /* GET — return current prompt count (for multi-device sync) */
  if (req.method === "GET") {
    const rows = await sql`SELECT count FROM veer_usage WHERE user_id = ${trackingId}`;
    const count = (rows[0] as { count: number } | undefined)?.count ?? 0;
    return res.status(200).json({ promptsLeft: Math.max(0, MAX_PROMPTS - count) });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, isFirst } = req.body as {
    messages?: { role: "user" | "assistant"; content: string }[];
    isFirst?: boolean;
  };

  // Check + increment usage count atomically
  const usage = await sql`
    INSERT INTO veer_usage (user_id, count) VALUES (${trackingId}, 1)
    ON CONFLICT (user_id) DO UPDATE
      SET count = veer_usage.count + 1, updated_at = NOW()
    RETURNING count
  `;
  const count = (usage[0] as { count: number }).count;

  if (count > MAX_PROMPTS) {
    return res.status(429).json({
      error: "You've used all 10 free questions with Veer! Sign up to get unlimited access.",
      promptsLeft: 0,
    });
  }

  // Build OpenAI messages array
  const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (isFirst) {
    chatMessages.push({ role: "user", content: "Hello" });
  } else {
    (messages || []).slice(-6).forEach(m => chatMessages.push(m));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "AI not configured" });

  const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 160,
      temperature: 0.72,
    }),
  });

  if (!oaiRes.ok) {
    const err = await oaiRes.text();
    return res.status(502).json({ error: "AI unavailable right now. Try again in a moment.", detail: err });
  }

  const oaiData = await oaiRes.json() as { choices: { message: { content: string } }[] };
  const reply = oaiData.choices?.[0]?.message?.content?.trim()
    || "I'm here to help with your diet and fitness goals!";

  return res.status(200).json({ reply, promptsLeft: MAX_PROMPTS - count });
}
