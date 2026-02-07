# babi.ai

## INSTRUÇÕES OBRIGATÓRIAS PARA AGENTES DE IA

> **ATENÇÃO:** Este projeto foi gerado pelo ForgeAI e contém TODA a documentação necessária.
> **VOCÊ DEVE LER E SEGUIR TODAS AS DOCUMENTAÇÕES ANTES DE ESCREVER QUALQUER CÓDIGO.**
> 
> Estas instruções são compatíveis com: Replit Agent, Cursor, Windsurf, GitHub Copilot, e outros assistentes de IA.

---

## REGRAS FUNDAMENTAIS (NÃO VIOLAR)

1. **NÃO ESCREVA CÓDIGO** antes de ler toda a documentação
2. **NÃO INVENTE** cores, fontes ou estilos - use EXATAMENTE os definidos em `/styles`
3. **NÃO PROSSIGA** sem aprovação explícita do usuário
4. **SIGA** a arquitetura e padrões documentados em `PROMPT_TECNICO.md`

---

## FLUXO DE TRABALHO OBRIGATÓRIO

### FASE 1: Leitura Obrigatória (NÃO PULE ESTA ETAPA)

Você DEVE ler estes arquivos NA ORDEM antes de qualquer ação:

1. `PROMPT_TECNICO.md` - Especificações técnicas completas
2. `docs/01-briefing.md` - Contexto e requisitos do projeto
3. `docs/02-escopo.md` - Funcionalidades detalhadas
4. `docs/03-roadmap.md` - Fases e cronograma
5. `docs/04-wbs.md` - Estrutura analítica (tarefas)
6. `styles/design-tokens.json` - **CORES, FONTES E ESPAÇAMENTOS OBRIGATÓRIOS**
7. `styles/theme-light.css` - Tema claro
8. `styles/theme-dark.css` - Tema escuro

### FASE 2: Planejamento (APRESENTE E AGUARDE APROVAÇÃO)

Após ler toda documentação, você DEVE:

1. **Criar um plano de execução** contendo:
   - Resumo do que será implementado
   - Funcionalidades principais (baseadas em `docs/02-escopo.md`)
   - Estrutura de pastas proposta
   - Tecnologias e dependências
   - Ordem de implementação por etapas
   - Design system que será usado (cores e fontes de `styles/design-tokens.json`)

2. **APRESENTAR o plano ao usuário**

3. **AGUARDAR aprovação explícita** - Pergunte:
   > "O plano está aprovado? Posso iniciar a implementação?"

4. **NÃO PROSSIGA** sem resposta afirmativa ("sim", "aprovado", "pode iniciar")

### FASE 3: Configuração (após aprovação)

1. Pergunte sobre o banco de dados:
   > "Deseja usar banco externo (Supabase) ou banco local da plataforma?"

2. Configure variáveis de ambiente conforme `infra/environment/.env.example`

### FASE 4: Implementação (somente após aprovações)

1. Implemente seguindo a ordem do plano aprovado
2. **USE OBRIGATORIAMENTE** os estilos de `styles/design-tokens.json`
3. Teste cada funcionalidade antes de prosseguir
4. Comunique o progresso ao usuário

---

## DESIGN SYSTEM - USO OBRIGATÓRIO

### CORES
Você DEVE usar APENAS as cores definidas em `styles/design-tokens.json`.
**NÃO INVENTE CORES.** Copie os valores exatos do arquivo.

Estrutura típica:
- `colors.primary` - Cor principal da marca
- `colors.secondary` - Cor secundária
- `colors.accent` - Cor de destaque
- `colors.background` - Cor de fundo
- `colors.foreground` - Cor do texto
- `colors.muted` - Cores neutras/suaves
- `colors.destructive` - Cor para erros/alertas

### TIPOGRAFIA
Use APENAS as fontes definidas em `styles/design-tokens.json`:
- `typography.fontFamily` - Família de fontes
- `typography.fontSize` - Tamanhos de texto
- `typography.fontWeight` - Pesos de fonte
- `typography.lineHeight` - Altura de linha

### ESPAÇAMENTOS
Use os valores de spacing definidos no design-tokens:
- `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`, `spacing.xl`
- `borderRadius` - Arredondamento de bordas

---

## Stack do Projeto

**Stack Principal:** React + Vite + TypeScript

> **ATENÇÃO:** A arquitetura, estrutura de pastas e padrões de código para esta stack estão detalhados em `PROMPT_TECNICO.md` na seção "STACK TECNOLÓGICA".
> **SIGA EXATAMENTE** a estrutura de pastas e padrões especificados lá. NÃO invente sua própria estrutura.

### Comandos de Inicialização do Projeto

```bash
# 1. Criar projeto Vite + React
npm create vite@latest client -- --template react-ts

# 2. Instalar dependências do frontend
cd client && npm install @tanstack/react-query wouter react-hook-form @hookform/resolvers/zod

# 3. Instalar dependências do backend
cd .. && npm install express drizzle-orm pg zod bcrypt express-session
npm install -D drizzle-kit @types/express @types/pg tsx typescript

# 4. Configurar Shadcn/ui no frontend
cd client && npx shadcn@latest init

# 5. Após configurar DATABASE_URL:
npx drizzle-kit push
```

> **IMPORTANTE:** Frontend (Vite) e Backend (Express) podem rodar no mesmo processo ou separados.
> Se separados, configure o proxy adequadamente para redirecionar /api/* para o backend.

---

## Estrutura de Arquivos do Export

```
/
├── PROMPT_TECNICO.md      # Especificações técnicas (LEIA PRIMEIRO!)
├── PROJECT_CHECKLIST.md   # Checklist de progresso
├── README.md              # Visão geral do projeto
├── replit.md              # Este arquivo de instruções
├── manifest.json          # Metadados do projeto
│
├── docs/                  # Documentação completa
│   ├── 01-briefing.md     # Contexto e requisitos
│   ├── 02-escopo.md       # Funcionalidades detalhadas
│   ├── 03-roadmap.md      # Fases e cronograma
│   └── 04-wbs.md          # Estrutura analítica
│
├── styles/                # DESIGN SYSTEM (USO OBRIGATÓRIO!)
│   ├── design-tokens.json # Cores, fontes, espaçamentos
│   ├── theme-light.css    # Tema claro
│   └── theme-dark.css     # Tema escuro
│
├── infra/                 # Infraestrutura
│   ├── database/          # Schema e seeds SQL
│   └── environment/       # Variáveis de ambiente
│
└── src/                   # Código fonte (criar conforme PROMPT_TECNICO.md)
```

---

## Perguntas Obrigatórias ao Usuário

Antes de iniciar a implementação, você DEVE perguntar:

1. "Li toda a documentação. O plano de implementação está aprovado?"
2. "Qual banco de dados prefere: externo (Supabase) ou local da plataforma?"
3. Se externo: "Por favor, forneça a URL de conexão do banco"
4. "Há alguma funcionalidade prioritária que devo implementar primeiro?"

---

## Comunicação

- Use **português brasileiro** em toda comunicação
- Seja claro e objetivo nas perguntas
- Informe o progresso a cada etapa concluída
- Em caso de dúvida, **PERGUNTE** antes de decidir

---

*Projeto gerado pelo ForgeAI - Estas instruções são obrigatórias*
