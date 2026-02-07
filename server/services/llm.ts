type LLMProvider = "openai" | "gemini" | "claude";

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMResponse {
  content: string;
  provider: LLMProvider;
  tokensUsed: number;
}

async function callOpenAI(
  messages: LLMMessage[],
  model = "gpt-4o-mini"
): Promise<LLMResponse> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: "openai",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

async function callClaude(messages: LLMMessage[]): Promise<LLMResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY nao configurada");
  }

  const systemMsg = messages.find((m) => m.role === "system");
  const chatMsgs = messages.filter((m) => m.role !== "system");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemMsg?.content,
      messages: chatMsgs.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.content[0].text,
    provider: "claude",
    tokensUsed: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
  };
}

async function callGemini(messages: LLMMessage[]): Promise<LLMResponse> {
  if (!process.env.GOOGLE_AI_KEY) {
    throw new Error("GOOGLE_AI_KEY nao configurada");
  }

  const systemMsg = messages.find((m) => m.role === "system");
  const chatMsgs = messages.filter((m) => m.role !== "system");

  const contents = chatMsgs.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: systemMsg
          ? { parts: [{ text: systemMsg.content }] }
          : undefined,
        contents,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    provider: "gemini",
    tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
  };
}

// Ordem de fallback dos providers
const providerOrder: LLMProvider[] = ["openai", "claude", "gemini"];

const providerFns: Record<
  LLMProvider,
  (messages: LLMMessage[]) => Promise<LLMResponse>
> = {
  openai: callOpenAI,
  claude: callClaude,
  gemini: callGemini,
};

export async function chat(
  messages: LLMMessage[],
  preferredProvider?: LLMProvider
): Promise<LLMResponse> {
  const order = preferredProvider
    ? [preferredProvider, ...providerOrder.filter((p) => p !== preferredProvider)]
    : providerOrder;

  let lastError: Error | null = null;

  for (const provider of order) {
    try {
      const result = await providerFns[provider](messages);
      return result;
    } catch (err) {
      lastError = err as Error;
      console.error(`LLM fallback: ${provider} falhou - ${lastError.message}`);
    }
  }

  throw new Error(
    `Todos os providers falharam. Ultimo erro: ${lastError?.message}`
  );
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Embedding error: ${res.status}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

export type { LLMMessage, LLMResponse, LLMProvider };
