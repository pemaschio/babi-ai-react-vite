# PROMPT TÉCNICO - babi.ai

## INSTRUÇÕES CRÍTICAS PARA O AGENTE DE IA

> **IMPORTANTE:** Leia COMPLETAMENTE este documento e toda a pasta `/docs` antes de iniciar qualquer desenvolvimento.
> Este projeto foi planejado detalhadamente no ForgeAI e todas as especificações devem ser seguidas.

---

## 1. FLUXO DE TRABALHO OBRIGATÓRIO

### Etapa 1: Planejamento (OBRIGATÓRIO)
1. Leia todos os arquivos da pasta `/docs`
2. Analise o escopo, roadmap e documentação técnica
3. Crie um **plano de execução detalhado** em português brasileiro
4. **APRESENTE O PLANO AO USUÁRIO PARA APROVAÇÃO**
5. Só inicie o desenvolvimento após aprovação explícita

### Etapa 2: Configuração do Banco de Dados
1. Pergunte ao usuário: **"Deseja usar Supabase (banco externo) ou PostgreSQL local (Replit)?"**
2. Se **Supabase**:
   - Solicite a variável `SUPABASE_DATABASE_URL` se não estiver configurada
   - Use o schema em `/infra/database/schema.sql`
   - Execute as migrações conforme `/infra/database/README.md`
3. Se **PostgreSQL local (Replit)**:
   - Crie o banco usando as ferramentas do Replit
   - A variável `DATABASE_URL` será configurada automaticamente
   - Execute o schema inicial

### Etapa 3: Configuração de Variáveis de Ambiente
Verifique se as seguintes variáveis estão configuradas:
- `ELEVEN_LABS` - https://api.elevenlabs.io/v1/text-to-speech/t50c90KI0ob8bLrZVA8t
- `UAZAPI` - https://automatikfabcombr.uazapi.com
- `N8N` - api_key
- `SUPABASE_BABI` - api_key
- `OPENAI` - api_key

Se alguma variável estiver faltando, **solicite ao usuário**.

### Etapa 4: Desenvolvimento
- Siga as fases do roadmap na ordem especificada
- Implemente cada funcionalidade conforme documentação
- Teste cada feature antes de prosseguir
- Use os estilos definidos em `/styles`

---

## 2. STACK TECNOLÓGICA (PRIORIDADE MÁXIMA)

**Stack Principal:** React + Vite + TypeScript

**Detalhes do Briefing:**
Frontend: React/Lovable com Supabase Auth, Backend: n8n (orquestrador), Supabase (PostgreSQL + pgvector), UAZAPI (WhatsApp Gateway), OpenAI GPT-4-mini/Google Gemini/Anthropic Claude (LLMs), ElevenLabs (áudio), Redis (cache)

**Restrições Técnicas:**
Nenhuma restrição técnica específica identificada - equipe pequena de 2 pessoas sem limitações de sistemas legados

### Arquitetura Obrigatória: React + Vite + TypeScript

#### Dependências Principais
- React 18+ com TypeScript
- Vite como bundler e dev server
- TailwindCSS para estilos
- Shadcn/ui para componentes de interface
- TanStack React Query para gerenciamento de estado do servidor
- React Router DOM (v6) ou Wouter para roteamento
- Express.js para backend API
- Drizzle ORM para banco de dados
- PostgreSQL como banco de dados
- Zod para validação

#### Estrutura de Pastas OBRIGATÓRIA

```
/
├── client/                         # Frontend React
│   ├── src/
│   │   ├── App.tsx                 # Componente raiz (providers, rotas)
│   │   ├── main.tsx                # Entry point
│   │   ├── index.css               # Estilos globais + variáveis CSS
│   │   ├── components/
│   │   │   ├── ui/                 # Componentes Shadcn/ui
│   │   │   └── [feature]/          # Componentes por funcionalidade
│   │   ├── pages/                  # Páginas/rotas
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/
│   │   │   ├── queryClient.ts      # Configuração do React Query
│   │   │   └── utils.ts            # Funções utilitárias
│   │   └── types/                  # Tipos TypeScript
│   └── index.html
├── server/                         # Backend Express
│   ├── index.ts                    # Entry point do servidor
│   ├── routes.ts                   # Definição de rotas da API
│   ├── storage.ts                  # Camada de acesso a dados
│   ├── auth.ts                     # Autenticação
│   └── db.ts                       # Conexão com banco de dados
├── shared/                         # Código compartilhado
│   └── schema.ts                   # Schema Drizzle + tipos
├── vite.config.ts                  # Configuração do Vite
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
└── package.json
```

#### Padrões de Código Obrigatórios

1. **SPA (Single Page Application)** - Todo o roteamento acontece no frontend
2. **API REST** - Backend Express serve API JSON em `/api/*`
3. **React Query** - Use para TODAS as chamadas de API (queryKey, mutations, cache invalidation)
4. **Tipos compartilhados** - Defina schemas no `shared/schema.ts` e importe em ambos os lados
5. **Drizzle ORM** - Use para todas as operações de banco de dados no backend
6. **Zod** - Valide request bodies no backend usando schemas derivados do Drizzle

#### Comandos de Setup

```bash
npm create vite@latest client -- --template react-ts
npm install express drizzle-orm pg @tanstack/react-query
npm install -D drizzle-kit @types/express
npx drizzle-kit push
```

---

## 3. RESUMO DO PROJETO

**Nome:** babi.ai
**Objetivo:** Desenvolver uma mentora de vendas IA via WhatsApp que utiliza metodologias da Barbara D'Elia (BANT, SPIN Selling, Storytelling, Slow Pressure Selling) para capacitação e suporte contínuo de profissionais de vendas
**Público-alvo:** Vendedores (SDR, Closer, Account Executive) e empresários/gestores de vendas que buscam capacitação e suporte em metodologias de vendas
**Prazo:** 3 dias (desenvolvimento do zero utilizando Windsurf com templates n8n existentes e tabelas Supabase já criadas)

### Entregáveis Principais
1. Aplicação web frontend desenvolvida em React/Lovable com autenticação Supabase
2. Sistema de mentoria IA via WhatsApp integrado com UAZAPI gateway
3. Dashboard administrativo para configuração de perfis, metodologias e parâmetros da IA
4. Sistema de role play com geração e reprodução de áudio usando ElevenLabs
5. Integração completa com n8n para orquestração de workflows de mentoria
6. Base de dados PostgreSQL no Supabase com pgvector para embeddings e busca semântica
7. Sistema de cache Redis para otimização de performance
8. Integração multi-LLM (OpenAI GPT-4-mini, Google Gemini, Anthropic Claude)
9. Documentação técnica completa da arquitetura e funcionalidades
10. Manual de configuração e deployment da solução
11. Templates de workflows n8n configurados e documentados
12. Sistema de análise e relatórios de progresso dos usuários

### Fases do Roadmap
1. **Configuração da Infraestrutura e Base de Dados** - 1 dia
2. **Desenvolvimento do Frontend e Dashboard** - 1 dia
3. **Sistema de Mentoria IA e Integração WhatsApp** - 1 dia
4. **Testes, Documentação e Deployment** - 0.5 dias

### Marcos (Milestones)
- Infraestrutura Operacional
- Dashboard e Frontend Funcionais
- Mentoria IA Completa
- Projeto Finalizado

---

## 4. ESTRUTURA DE PASTAS DO EXPORT

```
/
├── PROJECT_CHECKLIST.md       # Checklist de progresso (acompanhe o desenvolvimento!)
├── PROMPT_TECNICO.md          # Este arquivo (leia primeiro!)
├── README.md                  # Visão geral do projeto
├── manifest.json              # Metadados do export
├── /docs/                     # Documentação completa
│   ├── 01-briefing.md
│   ├── 02-escopo.md
│   ├── 03-roadmap.md
│   ├── 04-wbs.md             # Work Breakdown Structure
│   └── ...                    # Documentos adicionais
├── /styles/                   # Sistema de estilos
│   ├── design-tokens.json     # Cores, tipografia, espaçamentos
│   ├── theme-light.css
│   └── theme-dark.css
├── /infra/                    # Infraestrutura
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── README.md
│   └── environment/
│       └── .env.example
└── /src/                      # Código fonte (se gerado)
```

---

## 5. OBSERVAÇÕES IMPORTANTES

### Valores Monetários
- **TODOS os valores são armazenados em CENTAVOS** no banco de dados
- Para exibir: divida por 100 (ex: 15000 centavos = R$ 150,00)
- Para salvar: multiplique por 100

### Idioma
- Todo o código, comentários e interface devem usar **português brasileiro**
- Use acentuação correta (ç, ã, é, ô, etc.)

### Timer de Projeto
- O tempo decorrido só é contabilizado quando `isStarted = true`
- Calculado a partir do campo `startedAt`

### Formatação de Textos
- Campos de texto longo usam `\n\n` entre parágrafos
- No frontend, use `whitespace-pre-wrap` para preservar formatação

---

## 6. CHECKLIST DE INÍCIO

- [ ] Li todo o PROMPT_TECNICO.md
- [ ] Li todos os documentos em /docs
- [ ] Revisei os estilos em /styles
- [ ] Criei plano de execução
- [ ] Apresentei plano ao usuário
- [ ] Recebi aprovação do usuário
- [ ] Configurei banco de dados
- [ ] Configurei variáveis de ambiente
- [ ] Iniciei desenvolvimento da Fase 1

---

*Gerado pelo ForgeAI - Plataforma de Gestão de Projetos com IA*
*Data de geração: 07/02/2026 às 16:18:20*
