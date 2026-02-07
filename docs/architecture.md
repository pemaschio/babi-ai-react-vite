# Arquitetura do Sistema

# Documentação de Arquitetura - babi.ai v3

## 1. Visão Geral da Arquitetura

A babi.ai é uma plataforma de mentoria em vendas via IA, desenvolvida com arquitetura modular e orientada a microsserviços, integrando WhatsApp como interface principal de interação e um dashboard web para configurações administrativas.

### 1.1 Princípios Arquiteturais

- **Arquitetura Event-Driven**: Comunicação assíncrona entre componentes
- **Microserviços Especializados**: Cada componente tem responsabilidade específica
- **API-First Design**: Todas as integrações via APIs REST/GraphQL
- **Escalabilidade Horizontal**: Preparado para crescimento de usuários
- **Resiliência**: Tratamento de falhas e retry policies

## 2. Diagrama de Arquitetura de Alto Nível

```mermaid
graph TB
    subgraph "Usuário"
        U1[👤 Vendedores]
        U2[👤 Gestores]
        U3[📱 WhatsApp]
    end

    subgraph "Frontend Layer"
        WEB[🌐 Dashboard Web<br/>React + Lovable]
        AUTH[🔐 Supabase Auth]
    end

    subgraph "Integration Layer"
        API_GW[🌉 API Gateway<br/>UAZAPI]
        N8N[🔄 n8n Orchestrator<br/>Workflow Engine]
    end

    subgraph "AI Services"
        LLM1[🤖 OpenAI GPT-4-mini]
        LLM2[🤖 Google Gemini]
        LLM3[🤖 Anthropic Claude]
        TTS[🎵 ElevenLabs<br/>Text-to-Speech]
    end

    subgraph "Data Layer"
        DB[(📊 Supabase PostgreSQL<br/>+ pgvector)]
        CACHE[(🚀 Redis Cache)]
    end

    subgraph "Core Logic"
        MENTOR[🧠 Mentoria Engine]
        ROLEPLAY[🎭 Role Play Engine]
        ANALYTICS[📈 Analytics Engine]
    end

    U3 <--> API_GW
    U1 & U2 --> WEB
    WEB --> AUTH
    WEB <--> DB
    
    API_GW <--> N8N
    N8N <--> MENTOR
    N8N <--> ROLEPLAY
    N8N <--> ANALYTICS
    
    MENTOR --> LLM1 & LLM2 & LLM3
    ROLEPLAY --> LLM1 & TTS
    
    N8N <--> DB
    N8N <--> CACHE
    
    ANALYTICS --> DB
```

## 3. Arquitetura Detalhada por Camada

### 3.1 Frontend Layer

```mermaid
graph LR
    subgraph "Dashboard Web"
        DASH[📊 Dashboard Principal]
        CONFIG[⚙️ Configurações]
        REPORTS[📈 Relatórios]
        USERS[👥 Usuários]
    end

    subgraph "Componentes React"
        AUTH_COMP[🔐 Autenticação]
        CHAT_COMP[💬 Chat Interface]
        AUDIO_COMP[🎵 Audio Player]
        ANALYTICS_COMP[📊 Analytics]
    end

    DASH --> AUTH_COMP
    CONFIG --> AUTH_COMP
    REPORTS --> ANALYTICS_COMP
    USERS --> AUTH_COMP

    CONFIG --> CHAT_COMP
    REPORTS --> AUDIO_COMP
```

**Responsabilidades:**
- Interface administrativa para configuração de usuários
- Dashboard de métricas e analytics
- Configuração de metodologias de vendas
- Gestão de sessões de role play
- Visualização de histórico de conversas

### 3.2 Integration Layer

```mermaid
graph TB
    subgraph "n8n Workflows"
        WF1[📨 Message Handler]
        WF2[🧠 AI Orchestrator]
        WF3[🎭 Role Play Manager]
        WF4[📊 Analytics Collector]
        WF5[⚙️ Config Manager]
    end

    subgraph "External APIs"
        UAZAPI[📱 UAZAPI<br/>WhatsApp Gateway]
        AI_APIS[🤖 AI Services APIs]
        TTS_API[🎵 ElevenLabs API]
    end

    WF1 <--> UAZAPI
    WF2 <--> AI_APIS
    WF3 <--> AI_APIS
    WF3 <--> TTS_API
    WF4 --> WF1
```

**Responsabilidades:**
- Orquestração de workflows de mentoria
- Roteamento inteligente de mensagens
- Gestão de estado das conversas
- Integração com serviços de IA
- Processamento de comandos especializados

### 3.3 Data Layer

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email
        string phone
        string role
        json preferences
        timestamp created_at
        timestamp updated_at
    }

    CONVERSATIONS {
        uuid id PK
        uuid user_id FK
        string session_type
        json messages
        string status
        timestamp started_at
        timestamp ended_at
    }

    METHODOLOGIES {
        uuid id PK
        string name
        text description
        json framework
        json prompts
        boolean active
    }

    ROLE_PLAYS {
        uuid id PK
        uuid user_id FK
        uuid conversation_id FK
        string scenario_type
        json scenario_data
        string audio_url
        json performance_metrics
        timestamp created_at
    }

    ANALYTICS {
        uuid id PK
        uuid user_id FK
        string metric_type
        json data
        timestamp recorded_at
    }

    USERS ||--o{ CONVERSATIONS : has
    USERS ||--o{ ROLE_PLAYS : performs
    USERS ||--o{ ANALYTICS : generates
    CONVERSATIONS ||--o{ ROLE_PLAYS : contains
```

## 4. Fluxo de Dados Principal

```mermaid
sequenceDiagram
    participant U as Usuário WhatsApp
    participant WA as UAZAPI Gateway
    participant N8N as n8n Orchestrator
    participant AI as Serviços IA
    participant DB as Supabase DB
    participant CACHE as Redis Cache

    U->>WA: Mensagem via WhatsApp
    WA->>N8N: Webhook com mensagem
    
    N8N->>CACHE: Verifica debounce
    alt Mensagem válida
        N8N->>DB: Busca contexto usuário
        N8N->>AI: Processa mensagem
        AI-->>N8N: Resposta gerada
        N8N->>DB: Salva interação
        N8N->>WA: Envia resposta
        WA->>U: Entrega mensagem
    else Debounce ativo
        N8N->>N8N: Ignora mensagem
    end
```

## 5. Componentes e Responsabilidades

### 5.1 Agente Orquestrador (n8n)

**Workflows Principais:**

```mermaid
graph TD
    MSG[📨 Message Received] --> PARSE[🔍 Parse Intent]
    PARSE --> ROUTE{🔀 Route Message}
    
    ROUTE -->|Dúvida| DOUBT[❓ Doubt Handler]
    ROUTE -->|Role Play| ROLEPLAY[🎭 Role Play Handler]
    ROUTE -->|Framework| FRAMEWORK[📋 Framework Handler]
    ROUTE -->|Config| CONFIG[⚙️ Config Handler]
    
    DOUBT --> AI_DOUBT[🤖 AI Doubt Resolution]
    ROLEPLAY --> AI_ROLE[🤖 AI Role Play]
    FRAMEWORK --> SEND_FRAMEWORK[📤 Send Framework]
    CONFIG --> UPDATE_CONFIG[💾 Update Config]
    
    AI_DOUBT --> SAVE[💾 Save to DB]
    AI_ROLE --> TTS[🎵 Generate Audio]
    TTS --> SAVE
    SEND_FRAMEWORK --> SAVE
    UPDATE_CONFIG --> SAVE
    
    SAVE --> SEND[📤 Send Response]
```

**Funcionalidades:**
- Processamento de mensagens recebidas
- Classificação de intenções do usuário
- Delegação para subagentes especializados
- Controle de contexto conversacional
- Gerenciamento de estados de sessão

### 5.2 Mentoria Engine

```mermaid
graph LR
    INPUT[📥 Entrada Usuário] --> CONTEXT[🔍 Análise Contexto]
    CONTEXT --> METHOD[📚 Seleção Metodologia]
    METHOD --> AI[🤖 Processamento IA]
    AI --> PERSONALIZE[🎯 Personalização]
    PERSONALIZE --> OUTPUT[📤 Resposta Mentoria]

    subgraph "Metodologias"
        BANT[🎯 BANT]
        SPIN[🌀 SPIN Selling]
        STORY[📖 Storytelling]
        SLOW[⏱️ Slow Pressure]
    end

    METHOD --> BANT & SPIN & STORY & SLOW
```

### 5.3 Role Play Engine

```mermaid
graph TB
    START[🎬 Iniciar Role Play] --> SCENARIO[🎭 Definir Cenário]
    SCENARIO --> PERSONA[👤 Criar Persona]
    PERSONA --> DIALOGUE[💬 Iniciar Diálogo]
    
    DIALOGUE --> USER_INPUT[📥 Input Usuário]
    USER_INPUT --> AI_RESPONSE[🤖 Resposta IA]
    AI_RESPONSE --> TTS[🎵 Gerar Áudio]
    TTS --> EVALUATE[📊 Avaliar Performance]
    
    EVALUATE --> CONTINUE{🔄 Continuar?}
    CONTINUE -->|Sim| USER_INPUT
    CONTINUE -->|Não| REPORT[📋 Gerar Relatório]
    
    REPORT --> SAVE[💾 Salvar Sessão]
```

### 5.4 Sistema de Analytics

```mermaid
graph LR
    subgraph "Coleta de Dados"
        CONV[💬 Conversas]
        ROLE[🎭 Role Plays]
        USER_ACT[👤 Ações Usuário]
        AI_USAGE[🤖 Uso IA]
    end

    subgraph "Processamento"
        AGG[📊 Agregação]
        METRICS[📈 Cálculo Métricas]
    end

    subgraph "Visualização"
        DASH_ANALYTICS[📊 Dashboard Analytics]
        REPORTS[📋 Relatórios]
        EXPORT[📤 Exportação]
    end

    CONV & ROLE & USER_ACT & AI_USAGE --> AGG
    AGG --> METRICS
    METRICS --> DASH_ANALYTICS & REPORTS & EXPORT
```

## 6. Especificação de APIs

### 6.1 API de Usuários

**Endpoints principais:**

```
GET /api/users/{userId}
POST /api/users
PUT /api/users/{userId}
DELETE /api/users/{userId}

POST /api/users/{userId}/preferences
GET /api/users/{userId}/analytics
```

### 6.2 API de Conversas

```
GET /api/conversations?userId={userId}
POST /api/conversations
PUT /api/conversations/{conversationId}
GET /api/conversations/{conversationId}/messages
```

### 6.3 API de Role Plays

```
POST /api/roleplays/start
PUT /api/roleplays/{rolePlayId}/message
GET /api/roleplays/{rolePlayId}/audio
POST /api/roleplays/{rolePlayId}/complete
```

## 7. Fluxos de Trabalho Principais

### 7.1 Fluxo de Mentoria Básica

```mermaid
flowchart TD
    START([👋 Usuário envia dúvida]) --> RECEIVE[📨 n8n recebe via UAZAPI]
    RECEIVE --> PARSE[🔍 Análise da mensagem]
    PARSE --> CONTEXT[📚 Busca contexto usuário]
    CONTEXT --> METHOD[📋 Identifica metodologia aplicável]
    
    METHOD --> AI_PROCESS{🤖 Processamento IA}
    AI_PROCESS --> BANT_AI[🎯 IA com framework BANT]
    AI_PROCESS --> SPIN_AI[🌀 IA com SPIN Selling]
    AI_PROCESS --> STORY_AI[📖 IA com Storytelling]
    AI_PROCESS --> SLOW_AI[⏱️ IA com Slow Pressure]
    
    BANT_AI & SPIN_AI & STORY_AI & SLOW_AI --> GENERATE[✨ Gerar resposta personalizada]
    GENERATE --> SAVE[💾 Salvar interação]
    SAVE --> SEND[📤 Enviar via WhatsApp]
    SEND --> END([✅ Fim])
```

### 7.2 Fluxo de Role Play com Áudio

```mermaid
flowchart TD
    INIT([🎬 Iniciar Role Play]) --> SELECT[🎭 Selecionar cenário]
    SELECT --> PERSONA[👤 Definir persona cliente]
    PERSONA --> BRIEF[📋 Briefing inicial]
    
    BRIEF --> DIALOGUE_START[💬 Iniciar diálogo]
    DIALOGUE_START --> USER_SAYS[🗣️ Usuário fala/escreve]
    USER_SAYS --> AI_THINKS[🧠 IA processa resposta]
    AI_THINKS --> AI_RESPONDS[💭 IA gera resposta da persona]
    AI_RESPONDS --> TTS[🎵 Converter para áudio]
    
    TTS --> PLAY[▶️ Reproduzir áudio]
    PLAY --> EVALUATE[📊 Avaliar resposta usuário]
    EVALUATE --> CONTINUE{🔄 Continuar role play?}
    
    CONTINUE -->|Sim| USER_SAYS
    CONTINUE -->|Não| FEEDBACK[📝 Feedback detalhado]
    FEEDBACK --> SCORE[⭐ Pontuação final]
    SCORE --> SAVE_SESSION[💾 Salvar sessão]
    SAVE_SESSION --> END([✅ Fim])
```

## 8. Estrutura de Banco de Dados

### 8.1 Schema Principal

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email
        string phone_number
        string role
        json sales_profile
        json ai_preferences
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    conversations {
        uuid id PK
        uuid user_id FK
        string conversation_type
        json messages_history
        string current_methodology
        string status
        json context_data
        timestamp started_at
        timestamp last_activity
    }

    methodologies {
        uuid id PK
        string name
        text description
        json framework_structure
        json ai_prompts
        json parameters
        boolean is_active
        timestamp created_at
    }

    role_play_sessions {
        uuid id PK
        uuid user_id FK
        uuid conversation_id FK
        string scenario_type
        json persona_data
        json dialogue_history
        string audio_file_url
        json performance_metrics
        integer score
        text feedback
        timestamp started_at

---
*Tipo: architecture*
*Gerado pelo ForgeAI em 07/02/2026*
