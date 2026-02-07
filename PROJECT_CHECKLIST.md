# babi.ai - Checklist de Execução

## Objetivo do Projeto
Desenvolver uma mentora de vendas IA via WhatsApp que utiliza metodologias da Barbara D'Elia (BANT, SPIN Selling, Storytelling, Slow Pressure Selling) para capacitação e suporte contínuo de profissionais de vendas

## Stack Tecnológica
Frontend: React/Lovable com Supabase Auth, Backend: n8n (orquestrador), Supabase (PostgreSQL + pgvector), UAZAPI (WhatsApp Gateway), OpenAI GPT-4-mini/Google Gemini/Anthropic Claude (LLMs), ElevenLabs (áudio), Redis (cache)

## Público-Alvo
Vendedores (SDR, Closer, Account Executive) e empresários/gestores de vendas que buscam capacitação e suporte em metodologias de vendas

---

## COMO USAR ESTE CHECKLIST

Este documento foi gerado automaticamente pelo ForgeAI para acompanhar o progresso do desenvolvimento.

**Para o Desenvolvedor:**
1. Marque `[x]` nos itens conforme forem sendo implementados
2. Atualize o status de cada fase manualmente
3. Use este documento como referência de progresso

**Para Agentes de IA:**
1. Leia este checklist para entender o que já foi feito
2. Continue a partir dos itens pendentes (`[ ]`)
3. Atualize o checklist conforme progredir

---

## FASES DO PROJETO

### Fase 1: Configuração da Infraestrutura e Base de Dados

**Duração Estimada:** 1 dia
**Status:** [ Pendente ]

*Estabelecimento da infraestrutura base do projeto, configuração do Supabase com tabelas e relacionamentos, setup do n8n e configuração inicial dos serviços externos necessários para a mentora IA.*

- [ ] Base de dados PostgreSQL configurada no Supabase com pgvector
- [ ] Instância n8n operacional com templates básicos
- [ ] Configuração inicial dos provedores LLM
- [ ] Sistema de autenticação Supabase configurado

### Fase 2: Desenvolvimento do Frontend e Dashboard

**Duração Estimada:** 1 dia
**Status:** [ Pendente ]

*Criação da aplicação React/Lovable com dashboard administrativo, sistema de autenticação, interface de configuração de perfis e metodologias, e components base para a mentoria IA.*

- [ ] Aplicação React/Lovable com autenticação
- [ ] Dashboard administrativo funcional
- [ ] Interface de configuração de perfis e metodologias
- [ ] Sistema de relatórios e análises básico

### Fase 3: Sistema de Mentoria IA e Integração WhatsApp

**Duração Estimada:** 1 dia
**Status:** [ Pendente ]

*Desenvolvimento do core da mentoria IA com implementação das metodologias Barbara D'Elia, sistema de role play com áudio, integração completa via WhatsApp e workflows n8n para orquestração da mentoria.*

- [ ] Sistema de mentoria IA via WhatsApp operacional
- [ ] Sistema de role play com geração de áudio ElevenLabs
- [ ] Workflows n8n configurados para mentoria
- [ ] Integração multi-LLM funcional
- [ ] Sistema de cache Redis implementado

### Fase 4: Testes, Documentação e Deployment

**Duração Estimada:** 0.5 dias
**Status:** [ Pendente ]

*Fase final com testes integrados da solução completa, criação da documentação técnica e manual de usuário, configuração de deployment e validação de todos os entregáveis do projeto.*

- [ ] Documentação técnica completa
- [ ] Manual de configuração e deployment
- [ ] Templates n8n documentados
- [ ] Sistema testado e validado
- [ ] Solução em produção

---

## ETAPAS DO PROJETO (WBS)

| # | Etapa | Peso | Status |
|---|-------|------|--------|
| 1 | Planejamento | 15% | Pendente |
| 2 | Design | 20% | Pendente |
| 3 | Desenvolvimento | 35% | Pendente |
| 4 | Testes | 20% | Pendente |
| 5 | Deploy | 10% | Pendente |

---

## ENTREGÁVEIS PRINCIPAIS

- [ ] Aplicação web frontend desenvolvida em React/Lovable com autenticação Supabase
- [ ] Sistema de mentoria IA via WhatsApp integrado com UAZAPI gateway
- [ ] Dashboard administrativo para configuração de perfis, metodologias e parâmetros da IA
- [ ] Sistema de role play com geração e reprodução de áudio usando ElevenLabs
- [ ] Integração completa com n8n para orquestração de workflows de mentoria
- [ ] Base de dados PostgreSQL no Supabase com pgvector para embeddings e busca semântica
- [ ] Sistema de cache Redis para otimização de performance
- [ ] Integração multi-LLM (OpenAI GPT-4-mini, Google Gemini, Anthropic Claude)
- [ ] Documentação técnica completa da arquitetura e funcionalidades
- [ ] Manual de configuração e deployment da solução
- [ ] Templates de workflows n8n configurados e documentados
- [ ] Sistema de análise e relatórios de progresso dos usuários

---

## RESUMO DE PROGRESSO

| Fase | Concluído | Pendente | % |
|------|-----------|----------|---|
| Configuração da Infraestrutura e Base de Dados | 0 | 4 | 0% |
| Desenvolvimento do Frontend e Dashboard | 0 | 4 | 0% |
| Sistema de Mentoria IA e Integração WhatsApp | 0 | 5 | 0% |
| Testes, Documentação e Deployment | 0 | 5 | 0% |
| **TOTAL** | **0** | **18** | **0%** |

---

## PRÓXIMOS PASSOS RECOMENDADOS

1. Leia toda a documentação em `/docs`
2. Configure o banco de dados conforme `infra/database/README.md`
3. Configure as variáveis de ambiente (`.env.example`)
4. Inicie o desenvolvimento pela Fase 1
5. Atualize este checklist conforme progredir

---

## ARQUIVOS IMPORTANTES

- `PROMPT_TECNICO.md` - Instruções técnicas para agentes de IA
- `docs/01-briefing.md` - Contexto e requisitos do projeto
- `docs/02-escopo.md` - Funcionalidades e entregáveis
- `docs/03-roadmap.md` - Fases e cronograma
- `docs/04-wbs.md` - Estrutura analítica do trabalho
- `styles/design-tokens.json` - Cores, fontes e espaçamentos

---

*Gerado automaticamente por ForgeAI em 07/02/2026 às 16:18:20*
*Atualize este documento manualmente conforme o progresso do projeto*
