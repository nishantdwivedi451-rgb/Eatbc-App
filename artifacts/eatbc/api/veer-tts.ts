import type { VercelRequest, VercelResponse } from "@vercel/node";

// Meera — Indian English female voice on ElevenLabs (handles Hindi words naturally)
const DEFAULT_VOICE_ID = "nPczCjzI2devNBz1zQrb";

function cleanForTTS(raw: string): string {
  return raw
    // strip all emoji / pictograph / symbol unicode ranges
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    // strip leftover variation selectors / zero-width chars
    .replace(/[︀-️​-‍﻿]/g, "")
    // collapse multiple spaces / leading-trailing whitespace
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body as { text?: string };
  if (!text?.trim()) return res.status(400).json({ error: "text required" });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "TTS not configured" });

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const clean = cleanForTTS(text).slice(0, 500);

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
        text: clean,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.80,
          style: 0.30,
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
