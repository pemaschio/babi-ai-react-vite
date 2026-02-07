import { Router } from "express";
import { authMiddleware, type AuthRequest } from "./auth.js";
import { storage } from "./storage.js";
import { processMentoria, processRolePlay, generateFeedback, type Methodology } from "./services/mentoria.js";
import { parseWebhookMessage, sendTextMessage } from "./services/whatsapp.js";
import { textToSpeech } from "./services/elevenlabs.js";
import type { LLMMessage } from "./services/llm.js";

export const router = Router();

// ============================================
// PROFILE
// ============================================

router.get("/api/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const profile = await storage.getProfile(req.userId!);
    if (!profile) {
      return res.json({
        id: req.userId,
        email: req.userEmail,
        onboardingCompleted: false,
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

router.put("/api/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const profile = await storage.upsertProfile({
      id: req.userId!,
      email: req.userEmail!,
      ...req.body,
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// ============================================
// CONVERSATIONS
// ============================================

router.get(
  "/api/conversations",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const convos = await storage.getConversations(req.userId!);
      res.json(convos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar conversas" });
    }
  }
);

router.get(
  "/api/conversations/:id/messages",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const msgs = await storage.getMessages(req.params.id);
      res.json(msgs);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  }
);

// ============================================
// MENTORIA (Chat com IA)
// ============================================

router.post(
  "/api/mentoria/chat",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { message, methodology, conversationId } = req.body;

      // Busca historico se existe conversa
      let history: LLMMessage[] = [];
      if (conversationId) {
        const msgs = await storage.getMessages(conversationId);
        history = msgs.map((m) => ({
          role: (m.direction === "inbound" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        }));
      }

      // Busca perfil para contexto
      const profile = await storage.getProfile(req.userId!);

      // Processa com IA
      const response = await processMentoria({
        userMessage: message,
        methodology,
        conversationHistory: history,
        userRole: profile?.role || "vendedor",
      });

      // Salva mensagens se tem conversa
      if (conversationId) {
        await storage.createMessage({
          conversationId,
          direction: "inbound",
          content: message,
          messageType: "text",
        });
        await storage.createMessage({
          conversationId,
          direction: "outbound",
          content: response.content,
          messageType: "text",
          processedBy: response.provider,
          metadata: { tokensUsed: response.tokensUsed },
        });
      }

      res.json({
        response: response.content,
        provider: response.provider,
        tokensUsed: response.tokensUsed,
      });
    } catch (error) {
      console.error("Erro mentoria:", error);
      res.status(500).json({ error: "Erro ao processar mentoria" });
    }
  }
);

// ============================================
// ROLE PLAY
// ============================================

router.get("/api/roleplay", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sessions = await storage.getRoleplays(req.userId!);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar role plays" });
  }
});

router.post(
  "/api/roleplay/start",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const session = await storage.createRoleplay({
        userId: req.userId!,
        scenario: req.body.scenario,
        methodology: req.body.methodology,
        status: "active",
      });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Erro ao iniciar role play" });
    }
  }
);

router.post(
  "/api/roleplay/:id/message",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const session = await storage.getRoleplay(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Sessao nao encontrada" });
      }

      // Reconstroi historico do role play a partir do feedback (armazenado como dialogo)
      const dialogueHistory: LLMMessage[] = Array.isArray(
        (session.feedback as Record<string, unknown>)?.dialogue
      )
        ? ((session.feedback as Record<string, unknown>).dialogue as LLMMessage[])
        : [];

      // Processa resposta do "cliente" (IA)
      const response = await processRolePlay({
        scenario: session.scenario,
        methodology: session.methodology as Methodology,
        userMessage: req.body.message,
        dialogueHistory,
      });

      // Atualiza historico
      const updatedDialogue = [
        ...dialogueHistory,
        { role: "user" as const, content: req.body.message },
        { role: "assistant" as const, content: response.content },
      ];

      await storage.updateRoleplay(req.params.id, {
        feedback: { dialogue: updatedDialogue },
      });

      res.json({
        response: response.content,
        provider: response.provider,
      });
    } catch (error) {
      console.error("Erro role play:", error);
      res.status(500).json({ error: "Erro ao processar role play" });
    }
  }
);

router.post(
  "/api/roleplay/:id/complete",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const session = await storage.getRoleplay(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Sessao nao encontrada" });
      }

      const dialogueHistory: LLMMessage[] = Array.isArray(
        (session.feedback as Record<string, unknown>)?.dialogue
      )
        ? ((session.feedback as Record<string, unknown>).dialogue as LLMMessage[])
        : [];

      // Gera feedback da IA
      const feedback = await generateFeedback({
        dialogueHistory,
        methodology: session.methodology as Methodology,
      });

      // Extrai nota do feedback (tenta encontrar numero de 0-100)
      const scoreMatch = feedback.content.match(/\b(\d{1,3})\s*(?:\/\s*100|pontos|pts)/i);
      const score = scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : null;

      const updated = await storage.updateRoleplay(req.params.id, {
        status: "completed",
        score,
        feedback: {
          dialogue: dialogueHistory,
          feedbackText: feedback.content,
          provider: feedback.provider,
        },
        completedAt: new Date(),
      });

      res.json({
        session: updated,
        feedback: feedback.content,
        score,
      });
    } catch (error) {
      console.error("Erro ao finalizar role play:", error);
      res.status(500).json({ error: "Erro ao finalizar role play" });
    }
  }
);

// ============================================
// TEXT-TO-SPEECH (ElevenLabs)
// ============================================

router.post("/api/tts", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Texto obrigatorio" });
    }

    const audioBuffer = await textToSpeech({ text, voiceId });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length.toString());
    res.send(audioBuffer);
  } catch (error) {
    console.error("Erro TTS:", error);
    res.status(500).json({ error: "Erro ao gerar audio" });
  }
});

// ============================================
// KNOWLEDGE BASE
// ============================================

router.get("/api/knowledge", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const items = await storage.getKnowledge(req.userId!);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar base de conhecimento" });
  }
});

router.post("/api/knowledge", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const item = await storage.createKnowledge({
      userId: req.userId!,
      ...req.body,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item de conhecimento" });
  }
});

// ============================================
// ANALYTICS
// ============================================

router.get("/api/analytics", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = await storage.getAnalytics(req.userId!);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar analytics" });
  }
});

// ============================================
// SETTINGS
// ============================================

router.get("/api/settings", authMiddleware, async (_req, res) => {
  try {
    const settings = await storage.getAllSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configuracoes" });
  }
});

router.put(
  "/api/settings/:key",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const setting = await storage.upsertSetting({
        key: req.params.key,
        value: req.body.value,
        description: req.body.description,
      });
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar configuracao" });
    }
  }
);

// ============================================
// WHATSAPP WEBHOOK
// ============================================

router.post("/api/webhook/whatsapp", async (req, res) => {
  try {
    const parsed = parseWebhookMessage(req.body);

    if (!parsed || !parsed.body) {
      return res.json({ status: "ignored" });
    }

    console.log(`WhatsApp de ${parsed.from}: ${parsed.body}`);

    // Busca ou cria conversa para este numero
    const convos = await storage.getConversationsByPhone(parsed.from);
    let conversation = convos[0];

    if (!conversation) {
      conversation = await storage.createConversation({
        whatsappNumber: parsed.from,
        status: "active",
      });
    }

    // Salva mensagem recebida
    await storage.createMessage({
      conversationId: conversation.id,
      direction: "inbound",
      content: parsed.body,
      messageType: parsed.type,
    });

    // Processa com mentoria IA
    const history = await storage.getMessages(conversation.id);
    const llmHistory: LLMMessage[] = history.slice(-20).map((m) => ({
      role: (m.direction === "inbound" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    }));

    const response = await processMentoria({
      userMessage: parsed.body,
      conversationHistory: llmHistory,
    });

    // Salva resposta
    await storage.createMessage({
      conversationId: conversation.id,
      direction: "outbound",
      content: response.content,
      messageType: "text",
      processedBy: response.provider,
      metadata: { tokensUsed: response.tokensUsed },
    });

    // Envia resposta via WhatsApp
    await sendTextMessage({
      to: parsed.from,
      text: response.content,
    });

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Erro webhook WhatsApp:", error);
    res.status(500).json({ error: "Erro no webhook" });
  }
});
