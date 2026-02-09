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
    // Formato UAZAPI webhook:
    // { instance, event, data: { id, from, body, type, timestamp, wasSentByApi, isGroup } }
    const payload = body as Record<string, unknown>;

    // Filtra mensagens enviadas pela propria API (evita loop infinito)
    if (payload.wasSentByApi || (payload.data as Record<string, unknown>)?.wasSentByApi) {
      console.log("[webhook] Ignorando mensagem enviada pela API (wasSentByApi)");
      return null;
    }

    // Filtra mensagens de grupo
    const dataObj = (payload.data || payload) as Record<string, unknown>;
    if (dataObj.isGroup || dataObj.isGroupMsg) {
      console.log("[webhook] Ignorando mensagem de grupo");
      return null;
    }

    // UAZAPI envia dados dentro de "data" ou direto na raiz
    const msg = (payload.data || payload.message || payload) as Record<string, unknown>;

    const from = String(msg.from || payload.from || "");
    const msgBody = String(msg.body || msg.text || msg.message || msg.conversation || "");

    if (!from || !msgBody) return null;

    return {
      from,
      body: msgBody,
      type: (String(msg.type || msg.messageType || "text")) as WhatsAppWebhookMessage["type"],
      timestamp: Number(msg.timestamp || msg.messageTimestamp || Date.now()),
      messageId: String(msg.id || msg.messageId || msg.key?.toString() || ""),
    };
  } catch (err) {
    console.error("[webhook] Erro ao parsear mensagem:", err);
    return null;
  }
}

export type { WhatsAppWebhookMessage };
