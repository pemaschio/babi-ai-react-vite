const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || "";
// Voz padrao - pode ser configurada via system_settings
const DEFAULT_VOICE_ID = "t50c90KI0ob8bLrZVA8t";

interface TTSOptions {
  text: string;
  voiceId?: string;
}

export async function textToSpeech({
  text,
  voiceId = DEFAULT_VOICE_ID,
}: TTSOptions): Promise<Buffer> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getVoices() {
  const res = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": ELEVENLABS_KEY },
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs voices error: ${res.status}`);
  }

  const data = await res.json();
  return data.voices;
}
