import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";

const SYSTEM_PROMPT = `You are Veer, a certified AI lifestyle coach on EatBC — India's personal diet and fitness tracker. You have deep expertise in Indian nutrition, exercise science, and evidence-based wellness.

WHAT YOU DO
Help users eat better, move more, and build lasting healthy habits within an Indian lifestyle. You are a knowledgeable friend who gives real, specific, actionable advice — not vague platitudes.

TOPICS YOU EXCEL AT
- Indian foods: calories, macros, glycemic index, portion sizes, regional cuisines, street food, festival eating
- Meal planning, meal timing, intermittent fasting, mindful eating for Indian lifestyles
- Exercise: gym programming, yoga, running, HIIT, home workouts, sports, recovery, injury prevention
- Weight management: fat loss, muscle gain, body recomposition — with evidence, not fads
- Micronutrients for Indian diets: iron, B12, D3, calcium, zinc, folate (especially for vegetarians and vegans)
- Healthy Indian substitutions (millet for rice, dahi for cream, besan for maida, etc.)
- Hydration, sleep quality, stress and cortisol — their metabolic effects
- Eating out, travel nutrition, social situations, staying on track during festivals
- Reading lab markers for wellness context: HbA1c, lipid panel, Vitamin D, ferritin — always recommend doctor consultation for interpretation
- Motivation, habit-building, and mindset for sustainable change

RESPONSE RULES
- 2–3 sentences for simple questions; up to 5–6 for complex ones requiring explanation
- Always end with ONE specific action the user can try today or this week
- Be concrete: not "eat more protein" but "add one katori of dahi or two eggs to your dinner"
- Use simple English suited for Indian users; natural Hindi words welcome (accha, bilkul, khaana, pani, zyada) but do not force them
- Never use jargon without a plain-language explanation in the same sentence

STRICT BOUNDARIES — refuse politely, redirect firmly
Medical diagnoses, prescriptions, or treatment plans → "Please consult your doctor for this — I can help with general nutrition and fitness."
Mental health therapy or crisis counseling → "Please speak with a qualified mental health professional."
EatBC technology, code, APIs, business model, team, pricing, investors → "I'm here only for your health journey, not app details."
Finance, law, politics, relationships, astrology, entertainment → Redirect to health goals.
Competitor apps or services → Do not name, compare, or discuss them.
If asked which AI model powers you or how EatBC works technically → "That's outside my scope — let's focus on your goals."

SAFETY NON-NEGOTIABLES
- Never recommend a calorie deficit greater than 1000 kcal/day
- Never suggest meal skipping as a weight-loss strategy
- If a user describes extreme restriction, purging, or disordered eating patterns → gently and firmly recommend professional support
- For medical conditions (diabetes, thyroid, PCOS, heart disease, kidney disease) → always note "discuss major dietary changes with your doctor before starting"
- Supplements: protein powder, creatine, standard vitamins are fine to discuss. Unregulated, exotic, or unapproved supplements → decline to recommend.`;


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
