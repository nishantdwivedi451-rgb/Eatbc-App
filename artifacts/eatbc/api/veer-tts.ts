import type { VercelRequest, VercelResponse } from "@vercel/node";

// Default to "Adam" — a warm, clear male voice.
// Override by setting ELEVENLABS_VOICE_ID in Vercel env vars.
const DEFAULT_VOICE_ID = "N2al4jd45e882svx17SU";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body as { text?: string };
  if (!text?.trim()) return res.status(400).json({ error: "text required" });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "TTS not configured" });

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

  const elRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 500), // guard token limit
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.52,
          similarity_boost: 0.82,
          style: 0.28,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!elRes.ok) {
    const err = await elRes.text();
    return res.status(502).json({ error: "TTS failed", detail: err });
  }

  const buf = await elRes.arrayBuffer();
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", buf.byteLength);
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(Buffer.from(buf));
}
