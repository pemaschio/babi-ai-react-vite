import { chat, type LLMMessage, type LLMProvider } from "./llm.js";

type Methodology = "bant" | "spin" | "storytelling" | "slow_pressure";

const SYSTEM_PROMPT_BASE = `Voce e a Babi, uma mentora de vendas especialista nas metodologias da Barbara D'Elia.
Voce ajuda profissionais de vendas (SDRs, Closers, Account Executives) a melhorar suas habilidades.
Responda sempre em portugues brasileiro, de forma pratica e objetiva.
Use exemplos reais quando possivel.
Seja encorajadora mas honesta no feedback.`;

const METHODOLOGY_PROMPTS: Record<Methodology, string> = {
  bant: `Aplique a metodologia BANT (Budget, Authority, Need, Timeline):
- Budget: Ajude a qualificar o orcamento do prospect
- Authority: Identifique o decisor correto
- Need: Descubra a real necessidade do cliente
- Timeline: Entenda o prazo e urgencia da decisao
Guie o vendedor com perguntas e tecnicas especificas para cada etapa do BANT.`,

  spin: `Aplique a metodologia SPIN Selling:
- Situation: Perguntas para entender a situacao atual
- Problem: Perguntas para identificar problemas
- Implication: Perguntas sobre as implicacoes dos problemas
- Need-payoff: Perguntas que levam o cliente a ver o valor da solucao
Ensine o vendedor a fazer as perguntas certas na ordem certa.`,

  storytelling: `Aplique tecnicas de Storytelling para vendas:
- Estrutura narrativa: Heroi (cliente) + Vilao (problema) + Guia (vendedor) + Solucao
- Gatilhos emocionais: Conecte com as dores e desejos do prospect
- Casos de sucesso: Use historias de clientes similares
- Visual e sensorial: Faca o prospect se imaginar usando a solucao
Ajude o vendedor a construir narrativas persuasivas.`,

  slow_pressure: `Aplique a metodologia Slow Pressure Selling:
- Construcao de rapport: Crie conexao genuina antes de vender
- Educacao progressiva: Ensine valor antes de pedir a venda
- Micro-compromissos: Obtenha pequenos "sins" ao longo da conversa
- Urgencia natural: Crie urgencia sem pressao artificial
- Follow-up estrategico: Mantenha contato sem ser invasivo
Guie o vendedor com tecnicas de persuasao etica e gradual.`,
};

interface MentoriaInput {
  userMessage: string;
  methodology?: Methodology;
  conversationHistory?: LLMMessage[];
  userRole?: string;
  preferredProvider?: LLMProvider;
}

export async function processMentoria({
  userMessage,
  methodology,
  conversationHistory = [],
  userRole = "vendedor",
  preferredProvider,
}: MentoriaInput) {
  const systemPrompt = [
    SYSTEM_PROMPT_BASE,
    `O usuario e um ${userRole}.`,
    methodology ? METHODOLOGY_PROMPTS[methodology] : "",
    "Se o usuario pedir ajuda generica, identifique a melhor metodologia e aplique.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  return chat(messages, preferredProvider);
}

// ============================================
// ROLE PLAY
// ============================================

interface RolePlayInput {
  scenario: string;
  methodology: Methodology;
  userMessage: string;
  dialogueHistory?: LLMMessage[];
  preferredProvider?: LLMProvider;
}

const ROLEPLAY_SYSTEM = `Voce e a Babi atuando como persona de CLIENTE em um role play de vendas.
Voce NAO e a mentora agora - voce e o cliente que o vendedor esta tentando converter.

Regras:
1. Responda como o cliente faria na vida real
2. Faca objecoes realistas baseadas no cenario
3. Reaja de forma natural as tecnicas do vendedor
4. Se o vendedor aplicar bem a tecnica, mostre-se mais receptivo
5. Se o vendedor errar, seja mais resistente
6. No final, de um feedback como mentora sobre a performance`;

export async function processRolePlay({
  scenario,
  methodology,
  userMessage,
  dialogueHistory = [],
  preferredProvider,
}: RolePlayInput) {
  const systemPrompt = [
    ROLEPLAY_SYSTEM,
    `Cenario: ${scenario}`,
    `Metodologia sendo praticada: ${METHODOLOGY_PROMPTS[methodology]}`,
    "Responda APENAS como o cliente. Seja realista e desafiador.",
  ].join("\n\n");

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...dialogueHistory,
    { role: "user", content: userMessage },
  ];

  return chat(messages, preferredProvider);
}

interface FeedbackInput {
  dialogueHistory: LLMMessage[];
  methodology: Methodology;
  preferredProvider?: LLMProvider;
}

export async function generateFeedback({
  dialogueHistory,
  methodology,
  preferredProvider,
}: FeedbackInput) {
  const systemPrompt = `Voce e a Babi, mentora de vendas. Analise o role play abaixo e de feedback detalhado.

Avalie:
1. Pontos fortes do vendedor
2. Pontos de melhoria
3. Aplicacao da metodologia ${methodology.toUpperCase()}
4. Nota de 0 a 100
5. Proximos passos recomendados

Responda em formato estruturado e pratico.`;

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...dialogueHistory,
    {
      role: "user",
      content:
        "O role play terminou. Por favor, de o feedback completo da minha performance.",
    },
  ];

  return chat(messages, preferredProvider);
}

export type { Methodology, MentoriaInput, RolePlayInput };
