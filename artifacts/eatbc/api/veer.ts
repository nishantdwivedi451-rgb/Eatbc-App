import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql, ensureDb } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";
import { allow } from "./_lib/ratelimit.js";

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


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") return res.status(200).json({ ok: true });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await ensureDb();
  const userId = await verifyToken(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // Rate limit: 10 messages per minute per user.
  const okUser = await allow(`veer:user:${userId}`, 10, 60);
  if (!okUser) return res.status(429).json({ error: "Slow down a moment — you've sent a lot of messages. Try again shortly." });

  const { messages, isFirst, userContext, image } = req.body as {
    messages?: { role: "user" | "assistant"; content: string }[];
    isFirst?: boolean;
    userContext?: string;
    image?: string;
  };

  // Build system prompt — append user's personal data if available
  const systemContent = userContext?.trim()
    ? `${SYSTEM_PROMPT}\n\n---\nCURRENT USER PROFILE & JOURNEY\n${userContext}\n---\nUse this data to personalise answers. When asked "how am I doing", "what should I eat today", "am I on track" etc., refer specifically to their numbers.`
    : SYSTEM_PROMPT;

  // Build OpenAI messages array. Content may be a plain string or, when an
  // image is attached, an array of content blocks (text + image_url).
  type ContentBlock =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail?: string } };
  type ChatMsg = { role: "system" | "user" | "assistant"; content: string | ContentBlock[] };

  const chatMessages: ChatMsg[] = [{ role: "system", content: systemContent }];

  if (isFirst) {
    chatMessages.push({ role: "user", content: "Hello" });
  } else {
    (messages || []).slice(-6).forEach(m => chatMessages.push(m));
  }

  // If a valid image data URL is attached, fold it into the latest user turn
  // so the vision-capable model can actually see it.
  const hasImage = typeof image === "string" && image.startsWith("data:image/");
  if (hasImage) {
    let lastUser: ChatMsg | undefined;
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].role === "user") { lastUser = chatMessages[i]; break; }
    }
    if (!lastUser) {
      lastUser = { role: "user", content: "" };
      chatMessages.push(lastUser);
    }
    const text = typeof lastUser.content === "string" ? lastUser.content : "";
    lastUser.content = [
      ...(text ? [{ type: "text" as const, text }] : []),
      { type: "image_url" as const, image_url: { url: image as string, detail: "auto" } },
    ];
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
      // gpt-4o supports vision; use it whenever an image is attached.
      model: hasImage ? "gpt-4o" : "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.72,
    }),
  });

  if (!oaiRes.ok) {
    const err = await oaiRes.text();
    return res.status(502).json({ error: "AI unavailable right now. Try again in a moment.", detail: err });
  }

  const oaiData = await oaiRes.json() as { choices: { message: { content: string } }[] };
  let reply = oaiData.choices?.[0]?.message?.content?.trim()
    || "I'm here to help with your diet and fitness goals!";

  // If the user's latest message hints they want to log a food/meal, nudge
  // them toward the in-app logger instead of just talking about it.
  const lastUserText = (messages || []).slice().reverse().find(m => m.role === "user")?.content?.toLowerCase() ?? "";
  const LOG_INTENT = /\b(log|add|ate|had|eaten|eating)\b/;
  if (!isFirst && LOG_INTENT.test(lastUserText)) {
    reply += "\n\nTip: You can tap the + button to log this directly.";
  }

  // Record usage (best-effort — never block the reply on a counter write).
  try {
    await sql`
      INSERT INTO veer_usage (user_id, count, updated_at)
      VALUES (${userId}, 1, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET count = veer_usage.count + 1, updated_at = NOW()
    `;
  } catch {}

  return res.status(200).json({ reply });
}
