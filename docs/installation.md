# Guia de Instalação

# Guia de Instalação Completo - babi.ai
**Mentora de Vendas IA para WhatsApp**

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Instalação dos Componentes](#instalação-dos-componentes)
5. [Configuração das Integrações](#configuração-das-integrações)
6. [Deploy e Testes](#deploy-e-testes)
7. [Troubleshooting](#troubleshooting)
8. [Manutenção](#manutenção)

---

## 🎯 Visão Geral do Sistema

A **babi.ai** é uma mentora de vendas baseada em IA que opera via WhatsApp, utilizando uma arquitetura modular moderna com os seguintes componentes principais:

- **Frontend**: React/Lovable com Supabase Auth
- **Orquestrador**: n8n (workflows de IA)
- **Backend**: Supabase (PostgreSQL + pgvector)
- **WhatsApp Gateway**: UAZAPI
- **IA/LLM**: OpenAI GPT-4-mini, Google Gemini, Anthropic Claude
- **Áudio**: ElevenLabs
- **Cache**: Redis

---

## ⚙️ Pré-requisitos

### Sistemas Operacionais Suportados
- **Linux**: Ubuntu 20.04+ (recomendado)
- **macOS**: 10.15+
- **Windows**: 10/11 com WSL2

### Ferramentas Necessárias

#### Obrigatórios
- **Node.js**: 18.0+ LTS
- **npm**: 8.0+ ou **yarn**: 1.22+
- **Git**: 2.30+
- **Docker**: 20.10+ e Docker Compose 2.0+

#### Verificação das Versões
```bash
node --version    # deve retornar v18.x.x ou superior
npm --version     # deve retornar 8.x.x ou superior
git --version     # deve retornar 2.30.x ou superior
docker --version  # deve retornar 20.10.x ou superior
```

### Contas e Credenciais Necessárias

#### Serviços Obrigatórios
1. **Supabase** - Banco de dados e autenticação
2. **UAZAPI** - Gateway WhatsApp Business
3. **OpenAI** - GPT-4-mini para processamento de linguagem
4. **ElevenLabs** - Geração de áudio
5. **Windsurf** - IDE com IA para desenvolvimento
6. **Lovable** - Framework React

#### Serviços Opcionais
- **Google AI Studio** - Google Gemini (backup LLM)
- **Anthropic** - Claude (backup LLM)
- **Redis Cloud** - Cache gerenciado (alternativa ao Redis local)

### Hardware Mínimo
- **RAM**: 8GB (16GB recomendado)
- **CPU**: Dual-core 2.4GHz (Quad-core recomendado)
- **Armazenamento**: 20GB livres
- **Conexão**: Internet banda larga estável

---

## 🔧 Configuração do Ambiente

### 1. Configuração do Ambiente Local

#### Clone do Repositório
```bash
# Clone do projeto
git clone https://github.com/seu-usuario/babi-ai.git
cd babi-ai

# Configuração inicial
cp .env.example .env
```

#### Estrutura do Projeto
```
babi-ai/
├── frontend/          # Aplicação React/Lovable
├── n8n-workflows/     # Templates dos workflows
├── database/          # Scripts SQL do Supabase
├── docker/            # Configurações Docker
├── docs/              # Documentação
└── scripts/           # Scripts de automação
```

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
# ===========================================
# CONFIGURAÇÕES GERAIS
# ===========================================
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# ===========================================
# SUPABASE (Banco de Dados e Auth)
# ===========================================
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_KEY=sua_service_key_aqui
DATABASE_URL=postgresql://postgres:[senha]@db.seu-projeto.supabase.co:5432/postgres

# ===========================================
# n8n (Orquestrador)
# ===========================================
N8N_HOST=localhost
N8N_PORT=5678
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_USER_EMAIL=admin@babi.ai
N8N_USER_PASSWORD=senha_segura_aqui

# ===========================================
# UAZAPI (WhatsApp Gateway)
# ===========================================
UAZAPI_BASE_URL=https://api.uazapi.com
UAZAPI_TOKEN=seu_token_uazapi_aqui
UAZAPI_INSTANCE_ID=sua_instancia_id_aqui

# ===========================================
# OpenAI (LLM Principal)
# ===========================================
OPENAI_API_KEY=sk-sua_chave_openai_aqui
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=4096

# ===========================================
# ElevenLabs (Geração de Áudio)
# ===========================================
ELEVENLABS_API_KEY=sua_chave_elevenlabs_aqui
ELEVENLABS_VOICE_ID=id_da_voz_barbara_delia
ELEVENLABS_MODEL_ID=eleven_turbo_v2

# ===========================================
# Redis (Cache)
# ===========================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=senha_redis_opcional

# ===========================================
# LLMs Alternativos (Opcional)
# ===========================================
GOOGLE_API_KEY=sua_chave_google_ai_aqui
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui

# ===========================================
# CONFIGURAÇÕES DE SEGURANÇA
# ===========================================
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
WEBHOOK_SECRET=webhook_secret_para_validacao
```

### 3. Docker Compose

Crie o arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # n8n - Orquestrador de Workflows
  n8n:
    image: n8nio/n8n:latest
    container_name: babi-n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_USER_EMAIL=${N8N_USER_EMAIL}
      - N8N_USER_PASSWORD=${N8N_USER_PASSWORD}
      - WEBHOOK_URL=${N8N_WEBHOOK_URL}
      - N8N_METRICS=true
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-workflows:/tmp/workflows
    depends_on:
      - redis
    restart: unless-stopped

  # Redis - Cache e Sessões
  redis:
    image: redis:7-alpine
    container_name: babi-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx - Proxy Reverso
  nginx:
    image: nginx:alpine
    container_name: babi-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - n8n
    restart: unless-stopped

volumes:
  n8n_data:
  redis_data:
```

---

## 🚀 Instalação dos Componentes

### 1. Supabase - Configuração do Banco de Dados

#### Criação das Tabelas Principais

Execute no SQL Editor do Supabase:

```sql
-- ===========================================
-- EXTENSÕES NECESSÁRIAS
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ===========================================
-- TABELA DE USUÁRIOS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'vendedor',
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABELA DE CONVERSAS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    whatsapp_chat_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    context_summary TEXT,
    methodology VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABELA DE MENSAGENS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    sender VARCHAR(20) NOT NULL, -- 'user' ou 'babi'
    audio_url VARCHAR(255),
    embeddings vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABELA DE METODOLOGIAS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.methodologies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    prompt_template TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABELA DE ROLE PLAYS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.role_plays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scenario VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'intermediate',
    audio_file_url VARCHAR(255),
    transcript TEXT,
    feedback TEXT,
    score INTEGER,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- TABELA DE ANALYTICS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_embeddings ON public.messages USING ivfflat (embeddings vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);

-- ===========================================
-- RLS (Row Level Security)
-- ===========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
```

#### Inserção das Metodologias Base

```sql
-- ===========================================
-- METODOLOGIAS BARBARA D'ELIA
-- ===========================================
INSERT INTO public.methodologies (name, description, prompt_template, active) VALUES
('BANT', 
 'Budget, Authority, Need, Timeline - Qualificação de prospects',
 'Você é uma mentora especialista em BANT. Ajude o usuário a qualificar o prospect analisando: Budget (orçamento), Authority (autoridade para decidir), Need (necessidade real) e Timeline (prazo). Faça perguntas estratégicas e oriente sobre como identificar cada elemento.',
 true),

('SPIN Selling',
 'Situation, Problem, Implication, Need-payoff - Metodologia de descoberta',
 'Você é uma mentora especialista em SPIN Selling. Oriente o usuário através das 4 etapas: Situation (situação atual), Problem (problemas identificados), Implication (implicações dos problemas) e Need-payoff (benefícios da solução). Ajude a formular as perguntas certas em cada etapa.',
 true),

('Storytelling',
 'Técnicas de narrativa persuasiva para vendas',
 'Você é uma mentora especialista em Storytelling para vendas. Ajude o usuário a construir histórias persuasivas que conectem emocionalmente com o prospect. Ensine sobre estrutura narrativa, casos de sucesso relevantes e como adaptar a história ao contexto do cliente.',
 true),

('Slow Pressure Selling',
 'Venda consultiva sem pressão excessiva',
 'Você é uma mentora especialista em Slow Pressure Selling. Oriente o usuário sobre como vender de forma consultiva, construindo relacionamento genuíno, entendendo profundamente as necessidades do cliente e apresentando soluções de forma natural, sem pressão agressiva.',
 true);
```

### 2. Frontend - React/Lovable

#### Instalação das Dependências

```bash
# Navegue para o diretório frontend
cd frontend

# Instale as dependências
npm install

# Dependências principais que devem estar no package.json
npm install --save \
  @supabase/supabase-js \
  @supabase/auth-helpers-react \
  react-router-dom \
  @tanstack/react-query \
  lucide-react \
  tailwindcss \
  @headlessui/react \
  react-hot-toast \
  zustand \
  date-fns \
  recharts
```

#### Configuração do Supabase Client

Crie `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !

---
*Tipo: installation*
*Gerado pelo ForgeAI em 07/02/2026*
