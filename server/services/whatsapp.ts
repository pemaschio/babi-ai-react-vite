const UAZAPI_BASE = process.env.UAZAPI_BASE_URL || "https://automatikfabcombr.uazapi.com";
const UAZAPI_TOKEN = process.env.UAZAPI_TOKEN || "";

interface SendMessageOptions {
  to: string;
  text: string;
}

interface SendAudioOptions {
  to: string;
  audioUrl: string;
}

interface WhatsAppWebhookMessage {
  from: string;
  body: string;
  type: "text" | "audio" | "image" | "document";
  timestamp: number;
  messageId: string;
}

export async function sendTextMessage({ to, text }: SendMessageOptions) {
  const res = await fetch(`${UAZAPI_BASE}/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${UAZAPI_TOKEN}`,
    },
    body: JSON.stringify({
      phone: to,
      message: text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`UAZAPI sendText error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function sendAudioMessage({ to, audioUrl }: SendAudioOptions) {
  const res = await fetch(`${UAZAPI_BASE}/sendAudio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${UAZAPI_TOKEN}`,
    },
    body: JSON.stringify({
      phone: to,
      audio: audioUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`UAZAPI sendAudio error ${res.status}: ${err}`);
  }

  return res.json();
}

export function parseWebhookMessage(body: Record<string, unknown>): WhatsAppWebhookMessage | null {
  try {
    // Formato UAZAPI webhook - adaptar conforme documentacao real
    const data = body as Record<string, unknown>;

    if (!data.message && !data.body) return null;

    const msg = (data.message || data) as Record<string, unknown>;

    return {
      from: String(data.from || msg.from || ""),
      body: String(msg.body || msg.text || msg.message || ""),
      type: (String(msg.type || "text")) as WhatsAppWebhookMessage["type"],
      timestamp: Number(msg.timestamp || Date.now()),
      messageId: String(msg.id || msg.messageId || ""),
    };
  } catch {
    return null;
  }
}

export type { WhatsAppWebhookMessage };
