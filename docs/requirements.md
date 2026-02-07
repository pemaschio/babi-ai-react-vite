# Especificação de Requisitos

# Especificação de Requisitos - babi.ai
## Mentora de Vendas IA via WhatsApp

---

## 1. Visão Geral do Projeto

### 1.1 Descrição
O babi.ai é uma plataforma Micro-SaaS que oferece mentoria de vendas personalizada através de inteligência artificial, acessível via WhatsApp. A solução utiliza as metodologias comprovadas da Barbara D'Elia (BANT, SPIN Selling, Storytelling, Slow Pressure Selling) para capacitar profissionais de vendas de forma contínua e interativa.

### 1.2 Objetivos de Negócio
- Democratizar o acesso à mentoria de vendas de alta qualidade
- Proporcionar aprendizado contínuo e prático para profissionais de vendas
- Reduzir custos de treinamento empresarial através de IA especializada
- Melhorar performance de vendas através de metodologias estruturadas

### 1.3 Público-Alvo
- **Vendedores**: SDR, Closers, Account Executives
- **Gestores de Vendas**: Empresários e líderes de equipes comerciais
- **Empresas**: Organizações que buscam capacitação de equipes de vendas

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica
- **Frontend**: React/Lovable com Supabase Auth
- **Orquestrador**: n8n (self-hosted)
- **Backend**: Supabase (PostgreSQL + pgvector)
- **Gateway WhatsApp**: UAZAPI
- **LLMs**: OpenAI GPT-4-mini, Google Gemini, Anthropic Claude
- **Geração de Áudio**: ElevenLabs
- **Cache**: Redis

### 2.2 Componentes Principais
1. Dashboard Web (Interface administrativa)
2. Motor de IA Conversacional (WhatsApp)
3. Sistema de Role Play com Áudio
4. Base de Conhecimento Personalizada
5. Analytics e Relatórios

---

## 3. Requisitos Funcionais

### RF01 - Autenticação e Gestão de Usuários
**Descrição**: Sistema completo de autenticação e gestão de perfis de usuário
**Prioridade**: Alta

#### Funcionalidades:
- RF01.1 - Login/cadastro via Supabase Auth
- RF01.2 - Gestão de perfis (vendedor/gestor)
- RF01.3 - Configuração de preferências pessoais
- RF01.4 - Histórico de atividades

#### Critérios de Aceitação:
- ✅ Usuário consegue criar conta com e-mail e senha
- ✅ Sistema valida dados de entrada
- ✅ Perfil pode ser editado a qualquer momento
- ✅ Histórico de sessões é mantido

### RF02 - Integração WhatsApp
**Descrição**: Interface conversacional via WhatsApp para mentoria
**Prioridade**: Crítica

#### Funcionalidades:
- RF02.1 - Recebimento e envio de mensagens via UAZAPI
- RF02.2 - Processamento de mensagens em tempo real
- RF02.3 - Suporte a mídia (áudio, imagem, documento)
- RF02.4 - Controle de sessões de conversa

#### Critérios de Aceitação:
- ✅ Mensagens são processadas em até 3 segundos
- ✅ Sistema mantém contexto da conversa
- ✅ Suporte a anexos de até 16MB
- ✅ Controle de rate limiting implementado

### RF03 - Motor de IA Conversacional
**Descrição**: Sistema inteligente de processamento e resposta
**Prioridade**: Crítica

#### Funcionalidades:
- RF03.1 - Processamento de linguagem natural
- RF03.2 - Seleção dinâmica de LLM (GPT-4-mini/Gemini/Claude)
- RF03.3 - Aplicação das metodologias Barbara D'Elia
- RF03.4 - Personalização baseada no perfil do usuário

#### Critérios de Aceitação:
- ✅ Resposta contextualizada em até 5 segundos
- ✅ Aplicação correta das metodologias de vendas
- ✅ Personalização baseada no histórico do usuário
- ✅ Fallback entre LLMs em caso de indisponibilidade

### RF04 - Sistema de Role Play
**Descrição**: Simulações interativas com feedback em áudio
**Prioridade**: Alta

#### Funcionalidades:
- RF04.1 - Criação de cenários de vendas
- RF04.2 - Geração de áudio via ElevenLabs
- RF04.3 - Simulação de objeções e situações reais
- RF04.4 - Análise e feedback da performance

#### Critérios de Aceitação:
- ✅ Cenários personalizados por metodologia
- ✅ Áudio gerado em português brasileiro com qualidade
- ✅ Feedback detalhado pós role play
- ✅ Histórico de simulações salvo

### RF05 - Dashboard Administrativo
**Descrição**: Interface web para configurações e análises
**Prioridade**: Alta

#### Funcionalidades:
- RF05.1 - Visualização de métricas de uso
- RF05.2 - Configuração de parâmetros da IA
- RF05.3 - Gestão da base de conhecimento
- RF05.4 - Relatórios de performance

#### Critérios de Aceitação:
- ✅ Interface responsiva e intuitiva
- ✅ Métricas atualizadas em tempo real
- ✅ Configurações aplicadas imediatamente
- ✅ Exportação de relatórios em PDF/CSV

### RF06 - Base de Conhecimento
**Descrição**: Repositório de metodologias e conteúdos personalizados
**Prioridade**: Média

#### Funcionalidades:
- RF06.1 - Armazenamento de metodologias estruturadas
- RF06.2 - Upload de documentos personalizados
- RF06.3 - Busca semântica com pgvector
- RF06.4 - Versionamento de conteúdos

#### Critérios de Aceitação:
- ✅ Busca retorna resultados relevantes em até 2 segundos
- ✅ Suporte a formatos PDF, DOC, TXT
- ✅ Versionamento automático de alterações
- ✅ Controle de acesso por usuário/empresa

### RF07 - Analytics e Relatórios
**Descrição**: Sistema de métricas e análise de performance
**Prioridade**: Média

#### Funcionalidades:
- RF07.1 - Tracking de interações e sessões
- RF07.2 - Métricas de engajamento
- RF07.3 - ROI de treinamento
- RF07.4 - Comparativos de performance

#### Critérios de Aceitação:
- ✅ Dados coletados em tempo real
- ✅ Dashboards com visualizações interativas
- ✅ Relatórios automatizados por período
- ✅ Segmentação por usuário/equipe

---

## 4. Requisitos Não-Funcionais

### RNF01 - Performance
- **Tempo de resposta**: Mensagens processadas em até 3 segundos
- **Throughput**: Suporte a 100 usuários simultâneos
- **Latência**: APIs internas com latência < 200ms

### RNF02 - Escalabilidade
- **Horizontal**: Arquitetura preparada para crescimento
- **Vertical**: Otimização de recursos computacionais
- **Cache**: Redis implementado para otimização

### RNF03 - Disponibilidade
- **Uptime**: 99.5% de disponibilidade
- **Recuperação**: RTO < 15 minutos, RPO < 5 minutos
- **Monitoramento**: Alerts automáticos de indisponibilidade

### RNF04 - Segurança
- **Autenticação**: JWT tokens com expiração
- **Criptografia**: Dados sensíveis criptografados em repouso
- **API**: Rate limiting e validação de entrada

### RNF05 - Usabilidade
- **Interface**: Design responsivo e intuitivo
- **Acessibilidade**: Conformidade com WCAG 2.1 AA
- **Mobile**: Interface otimizada para dispositivos móveis

### RNF06 - Confiabilidade
- **Fallback**: Sistema de backup entre LLMs
- **Logs**: Auditoria completa de operações
- **Backup**: Backup automático diário dos dados

---

## 5. Critérios de Aceitação Gerais

### 5.1 Funcionalidade
- ✅ Todos os requisitos funcionais críticos implementados
- ✅ Integração WhatsApp operacional com taxa de sucesso > 95%
- ✅ Role plays com áudio funcionando adequadamente
- ✅ Dashboard responsivo e funcional

### 5.2 Qualidade
- ✅ Cobertura de testes > 80%
- ✅ Sem bugs críticos ou de alta severidade
- ✅ Performance dentro dos limites especificados
- ✅ Segurança validada

### 5.3 Documentação
- ✅ Documentação técnica completa
- ✅ Manual do usuário disponível
- ✅ APIs documentadas
- ✅ Guias de deployment

---

## 6. Priorização de Requisitos

### 6.1 Crítica (Sprint 1 - Dias 1-2)
1. **RF02** - Integração WhatsApp
2. **RF03** - Motor de IA Conversacional
3. **RF01** - Autenticação básica

### 6.2 Alta (Sprint 2 - Dia 3)
4. **RF04** - Sistema de Role Play
5. **RF05** - Dashboard Administrativo

### 6.3 Média (Pós-entrega inicial)
6. **RF06** - Base de Conhecimento
7. **RF07** - Analytics detalhados

---

## 7. Riscos e Mitigações

### 7.1 Riscos Técnicos
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Limitação de créditos IA | Alta | Alto | Monitoramento de uso e fallback |
| Instabilidade APIs | Média | Alto | Implementar retry e circuit breaker |
| Performance inadequada | Média | Médio | Cache Redis e otimizações |

### 7.2 Riscos de Projeto
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Prazo insuficiente | Alta | Alto | Priorização clara e MVP |
| Integração complexa | Média | Alto | Testes contínuos |
| Qualidade áudio | Média | Médio | Testes com ElevenLabs |

---

## 8. Entregáveis

### 8.1 Código
- [ ] Frontend React/Lovable
- [ ] Workflows n8n configurados
- [ ] Schema Supabase atualizado
- [ ] Configurações Redis

### 8.2 Documentação
- [ ] README técnico
- [ ] Guia de deployment
- [ ] Documentação de APIs
- [ ] Manual do usuário

### 8.3 Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Validação E2E WhatsApp
- [ ] Testes de performance

---

## 9. Marcos de Entrega

| Marco | Prazo | Critério |
|-------|-------|----------|
| **M1** - Integração WhatsApp | Dia 1 | Mensagens bi-direcionais funcionais |
| **M2** - IA Conversacional | Dia 2 | Respostas contextualizadas |
| **M3** - Role Play + Dashboard | Dia 3 | Sistema completo funcional |

---

## 10. Aprovação

| Stakeholder | Função | Status |
|-------------|---------|---------|
| Desenvolvedor | Implementação | ⏳ Pendente |
| Product Owner | Validação | ⏳ Pendente |

---

**Documento gerado em**: 07 de fevereiro de 2026  
**Versão**: 1.0  
**Status**: Aprovado para desenvolvimento

---
*Tipo: requirements*
*Gerado pelo ForgeAI em 07/02/2026*
