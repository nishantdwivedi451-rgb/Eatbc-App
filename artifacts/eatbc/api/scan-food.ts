import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You are an expert Indian food nutritionist and AI vision system for EatBC — India's calorie tracker.

TASK: Carefully examine the photo. Identify every distinct food item visible and estimate calories accurately.

INDIAN FOOD CALORIE REFERENCE (use these as your baseline):
Grains:       Roti/Chapati 70-80 kcal each | Plain Paratha 150 kcal | Stuffed Paratha 200-250 kcal | Steamed Rice 1 katori 200 kcal | Biryani 1 plate 450 kcal | Pulao 1 katori 280 kcal | Bread slice 80 kcal
Dal/Lentils:  Dal Tadka 1 katori 140 kcal / 8g protein | Dal Makhani 1 katori 250 kcal / 10g protein | Rajma 1 katori 210 kcal / 12g protein | Chole 1 katori 260 kcal / 10g protein | Sambar 1 katori 80 kcal / 4g protein
Vegetables:   Aloo Sabzi 1 katori 150 kcal | Palak Paneer 1 katori 280 kcal / 14g protein | Mutter Paneer 1 katori 250 kcal | Bhindi Masala 1 katori 90 kcal | Gobi Sabzi 1 katori 100 kcal | Mixed Veg 1 katori 120 kcal
Proteins:     Paneer Tikka 6 pcs 250 kcal / 18g protein | Butter Chicken 1 katori 280 kcal / 26g protein | Tandoori Chicken 2 pcs 220 kcal / 30g protein | Egg Bhurji 2 eggs 200 kcal / 14g protein | Fish Curry 1 katori 200 kcal / 22g protein | Chicken Biryani 1 plate 500 kcal / 28g protein
South Indian: Idli 1 piece 50 kcal / 2g protein | Masala Dosa 200 kcal / 4g protein | Plain Dosa 130 kcal | Uttapam 200 kcal | Medu Vada 1 piece 110 kcal / 3g protein | Upma 1 plate 200 kcal / 5g protein | Poha 1 plate 200 kcal / 4g protein
Snacks:       Samosa 1 piece 140 kcal / 3g protein | Pakora 1 piece 60 kcal | Pav Bhaji 1 plate 380 kcal | Vada Pav 280 kcal | Kachori 1 piece 180 kcal | Bhel Puri 1 plate 200 kcal
Dairy/Drinks: Dahi 1 katori 60 kcal / 4g protein | Lassi sweet 200 kcal | Masala Chai 60 kcal | Paneer 100g 260 kcal / 18g protein
Sweets:       Gulab Jamun 1 piece 150 kcal | Kheer 1 katori 220 kcal | Halwa 1 katori 300 kcal | Jalebi 1 piece 150 kcal
Fast Food:    Pizza slice 280 kcal | Burger 450 kcal | Sandwich 350 kcal | Noodles 1 plate 380 kcal

RULES:
- Be SPECIFIC: "Butter Chicken" not "curry", "Masala Dosa" not "pancake", "Aloo Paratha" not "flatbread"
- For thali/plates with multiple items: list EACH component separately (rice, dal, sabzi, roti as separate entries)
- Standard katori = 200ml; adjust estimate if portion looks larger/smaller
- Estimate conservatively — users prefer underestimates
- Return 1 to 5 food items maximum
- If the image is unclear, blurry, or contains no food, return {"foods":[]}

OUTPUT FORMAT — return ONLY this JSON, nothing else:
{"foods":[{"n":"Food Name","q":"1 katori (200g)","c":250,"p":8}]}
- n = food name in English (specific Indian name preferred)
- q = serving description with weight e.g. "1 katori (200g)", "2 pieces (120g)"
- c = calories as whole number integer
- p = protein grams as whole number integer`;

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
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            { type: "image_url", image_url: { url: image, detail: "auto" } },
          ],
        },
      ],
      max_tokens: 600,
      temperature: 0.1,
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
    // Sanitise: ensure c and p are integers
    parsed.foods = parsed.foods.map(f => ({
      ...f,
      c: Math.round(Number(f.c) || 0),
      p: Math.round(Number(f.p) || 0),
    }));
    return res.status(200).json(parsed);
  } catch {
    return res.status(200).json({ foods: [] });
  }
}
