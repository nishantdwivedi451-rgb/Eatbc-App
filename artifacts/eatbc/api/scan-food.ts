import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You are Veer, the food-detection AI for EatBC — India's calorie tracker.
Analyze the food image and identify every visible dish or ingredient.
Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{"foods":[{"n":"Food name","q":"Serving size","c":250,"p":8}]}
Rules:
- n: English name; prefer Indian names (Dal, Paneer Tikka, Aloo Paratha, Idli, etc.)
- q: realistic Indian serving description with grams, e.g. "1 bowl (200g)", "2 pieces (120g)", "1 katori (150g)"
- c: estimated calories as a whole integer
- p: estimated protein grams as a whole integer
- Return 1-4 items. Be specific — "Butter Chicken" not "curry".
- If no food is clearly visible, return {"foods":[]}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") return res.status(200).json({ ok: true });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body as { image?: string };
  if (!image || !image.startsWith("data:image/")) {
    return res.status(400).json({ error: "Valid image data URL required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "AI not configured" });

  const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            { type: "image_url", image_url: { url: image, detail: "low" } },
          ],
        },
      ],
      max_tokens: 400,
      temperature: 0.2,
    }),
  });

  if (!oaiRes.ok) {
    const err = await oaiRes.text();
    return res.status(502).json({ error: "AI unavailable. Try again in a moment.", detail: err });
  }

  const data = await oaiRes.json() as { choices: { message: { content: string } }[] };
  const content = data.choices?.[0]?.message?.content?.trim() ?? "";

  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON");
    const parsed = JSON.parse(match[0]) as { foods: { n: string; q: string; c: number; p?: number }[] };
    if (!Array.isArray(parsed.foods)) throw new Error("Bad shape");
    return res.status(200).json(parsed);
  } catch {
    return res.status(200).json({ foods: [] });
  }
}
