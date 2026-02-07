# Documentação da API

# Documentação da API - Babi.ai v3

## Visão Geral

A API do Babi.ai é uma solução RESTful que possibilita a integração com uma mentora de vendas baseada em inteligência artificial. O sistema opera através do WhatsApp e oferece capacitação contínua utilizando as metodologias de vendas da Barbara D'Elia.

```yaml
openapi: 3.0.3
info:
  title: Babi.ai - API de Mentoria de Vendas
  description: |
    API para integração com a plataforma Babi.ai, uma mentora de vendas IA via WhatsApp.
    
    ## Funcionalidades Principais
    - Gerenciamento de usuários e perfis de vendedores
    - Configuração de metodologias de vendas (BANT, SPIN Selling, Storytelling, Slow Pressure Selling)
    - Sistema de role play com geração de áudio
    - Analytics e relatórios de performance
    - Integração com WhatsApp via UAZAPI
    
    ## Autenticação
    Todas as requisições requerem autenticação via Bearer Token fornecido pelo Supabase Auth.
    
  version: 3.0.0
  contact:
    name: Equipe Babi.ai
    email: contato@babi.ai
  license:
    name: Proprietário
servers:
  - url: https://api.babi.ai/v3
    description: Servidor de Produção
  - url: https://api-dev.babi.ai/v3
    description: Servidor de Desenvolvimento

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT fornecido pelo Supabase Auth
  
  schemas:
    Usuario:
      type: object
      required:
        - id
        - nome
        - email
        - telefone
        - tipo_usuario
      properties:
        id:
          type: string
          format: uuid
          description: Identificador único do usuário
          example: "550e8400-e29b-41d4-a716-446655440000"
        nome:
          type: string
          maxLength: 100
          description: Nome completo do usuário
          example: "João Silva Santos"
        email:
          type: string
          format: email
          description: Email do usuário
          example: "joao.silva@empresa.com"
        telefone:
          type: string
          pattern: '^[0-9]{10,15}$'
          description: Número do telefone/WhatsApp
          example: "11987654321"
        tipo_usuario:
          type: string
          enum: [vendedor, gestor, admin]
          description: Tipo de usuário no sistema
          example: "vendedor"
        cargo:
          type: string
          maxLength: 50
          description: Cargo do usuário
          example: "Account Executive"
        empresa:
          type: string
          maxLength: 100
          description: Nome da empresa
          example: "Tech Solutions LTDA"
        nivel_experiencia:
          type: string
          enum: [iniciante, intermediario, avancado]
          description: Nível de experiência em vendas
          example: "intermediario"
        metodologias_preferidas:
          type: array
          items:
            type: string
            enum: [BANT, SPIN, Storytelling, Slow_Pressure]
          description: Metodologias de vendas preferidas
          example: ["BANT", "SPIN"]
        configuracoes_ia:
          $ref: '#/components/schemas/ConfiguracoesIA'
        ativo:
          type: boolean
          description: Status do usuário
          example: true
        criado_em:
          type: string
          format: date-time
          description: Data de criação do registro
          example: "2024-02-07T10:30:00Z"
        atualizado_em:
          type: string
          format: date-time
          description: Data da última atualização
          example: "2024-02-07T15:45:00Z"

    ConfiguracoesIA:
      type: object
      properties:
        modelo_preferido:
          type: string
          enum: [gpt-4-mini, gemini-pro, claude-3-haiku]
          description: Modelo de IA preferido
          example: "gpt-4-mini"
        tom_conversacao:
          type: string
          enum: [formal, casual, amigavel, profissional]
          description: Tom de conversação da IA
          example: "profissional"
        nivel_detalhamento:
          type: string
          enum: [basico, intermediario, detalhado]
          description: Nível de detalhamento nas respostas
          example: "intermediario"
        idioma:
          type: string
          enum: [pt-br]
          description: Idioma das conversas
          example: "pt-br"
        gerar_audio:
          type: boolean
          description: Habilitar geração de áudio
          example: true
        voz_eleita:
          type: string
          description: ID da voz no ElevenLabs
          example: "21m00Tcm4TlvDq8ikWAM"

    Conversa:
      type: object
      required:
        - id
        - usuario_id
        - status
      properties:
        id:
          type: string
          format: uuid
          description: Identificador único da conversa
          example: "650e8400-e29b-41d4-a716-446655440001"
        usuario_id:
          type: string
          format: uuid
          description: ID do usuário proprietário
          example: "550e8400-e29b-41d4-a716-446655440000"
        titulo:
          type: string
          maxLength: 200
          description: Título da conversa
          example: "Dúvidas sobre técnica BANT"
        tipo_sessao:
          type: string
          enum: [mentoria, role_play, analise_proposta, framework, duvida_geral]
          description: Tipo de sessão de mentoria
          example: "role_play"
        metodologia_aplicada:
          type: string
          enum: [BANT, SPIN, Storytelling, Slow_Pressure]
          description: Metodologia aplicada na conversa
          example: "SPIN"
        status:
          type: string
          enum: [ativa, pausada, finalizada, cancelada]
          description: Status atual da conversa
          example: "ativa"
        resumo:
          type: string
          maxLength: 500
          description: Resumo da conversa
          example: "Sessão de role play focada em superação de objeções de preço"
        avaliacao_usuario:
          type: integer
          minimum: 1
          maximum: 5
          description: Avaliação do usuário (1-5 estrelas)
          example: 4
        mensagens:
          type: array
          items:
            $ref: '#/components/schemas/Mensagem'
        analytics:
          $ref: '#/components/schemas/AnalyticsConversa'
        iniciada_em:
          type: string
          format: date-time
          description: Data de início da conversa
          example: "2024-02-07T14:20:00Z"
        finalizada_em:
          type: string
          format: date-time
          description: Data de finalização da conversa
          example: "2024-02-07T14:45:00Z"

    Mensagem:
      type: object
      required:
        - id
        - conversa_id
        - remetente
        - conteudo
      properties:
        id:
          type: string
          format: uuid
          description: Identificador único da mensagem
          example: "750e8400-e29b-41d4-a716-446655440002"
        conversa_id:
          type: string
          format: uuid
          description: ID da conversa
          example: "650e8400-e29b-41d4-a716-446655440001"
        remetente:
          type: string
          enum: [usuario, babi, sistema]
          description: Quem enviou a mensagem
          example: "babi"
        conteudo:
          type: string
          maxLength: 2000
          description: Conteúdo da mensagem
          example: "Vou te ajudar com uma simulação de role play. Você será o vendedor e eu serei sua cliente em potencial."
        tipo_conteudo:
          type: string
          enum: [texto, audio, imagem, documento, link]
          description: Tipo de conteúdo da mensagem
          example: "texto"
        audio_url:
          type: string
          format: uri
          description: URL do áudio gerado (quando aplicável)
          example: "https://storage.babi.ai/audio/750e8400-e29b-41d4-a716-446655440002.mp3"
        tokens_utilizados:
          type: integer
          description: Número de tokens utilizados na geração
          example: 150
        modelo_utilizado:
          type: string
          description: Modelo de IA utilizado
          example: "gpt-4-mini"
        enviada_em:
          type: string
          format: date-time
          description: Data de envio da mensagem
          example: "2024-02-07T14:21:30Z"

    RolePlay:
      type: object
      required:
        - id
        - usuario_id
        - cenario
        - status
      properties:
        id:
          type: string
          format: uuid
          description: Identificador único do role play
          example: "850e8400-e29b-41d4-a716-446655440003"
        usuario_id:
          type: string
          format: uuid
          description: ID do usuário
          example: "550e8400-e29b-41d4-a716-446655440000"
        titulo:
          type: string
          maxLength: 100
          description: Título do role play
          example: "Simulação de Cold Call B2B"
        cenario:
          type: string
          maxLength: 1000
          description: Descrição do cenário
          example: "Você está ligando para um diretor comercial de uma empresa de tecnologia que nunca ouviu falar da sua solução"
        metodologia:
          type: string
          enum: [BANT, SPIN, Storytelling, Slow_Pressure]
          description: Metodologia a ser praticada
          example: "SPIN"
        dificuldade:
          type: string
          enum: [facil, medio, dificil]
          description: Nível de dificuldade
          example: "medio"
        persona_cliente:
          $ref: '#/components/schemas/PersonaCliente'
        status:
          type: string
          enum: [preparando, em_andamento, finalizado, cancelado]
          description: Status do role play
          example: "em_andamento"
        duracao_estimada:
          type: integer
          description: Duração estimada em minutos
          example: 15
        objetivos:
          type: array
          items:
            type: string
          description: Objetivos específicos do role play
          example: 
            - "Identificar necessidades do cliente"
            - "Superar objeção de preço"
            - "Agendar próxima reunião"
        feedback_ia:
          $ref: '#/components/schemas/FeedbackIA'
        pontuacao:
          type: integer
          minimum: 0
          maximum: 100
          description: Pontuação final (0-100)
          example: 85
        criado_em:
          type: string
          format: date-time
          description: Data de criação
          example: "2024-02-07T14:00:00Z"
        finalizado_em:
          type: string
          format: date-time
          description: Data de finalização
          example: "2024-02-07T14:18:00Z"

    PersonaCliente:
      type: object
      required:
        - nome
        - cargo
        - empresa
        - personalidade
      properties:
        nome:
          type: string
          maxLength: 100
          description: Nome da persona
          example: "Roberto Mendes"
        cargo:
          type: string
          maxLength: 50
          description: Cargo na empresa
          example: "Diretor Comercial"
        empresa:
          type: string
          maxLength: 100
          description: Nome da empresa
          example: "Inovação Tech LTDA"
        setor:
          type: string
          maxLength: 50
          description: Setor de atuação
          example: "Tecnologia"
        personalidade:
          type: string
          enum: [analitico, expressivo, amigavel, controlador, cetico]
          description: Tipo de personalidade
          example: "analitico"
        objecoes_comuns:
          type: array
          items:
            type: string
          description: Objeções típicas desta persona
          example:
            - "Preço muito alto"
            - "Já temos um fornecedor"
            - "Não é prioridade agora"
        pontos_dor:
          type: array
          items:
            type: string
          description: Principais dores do cliente
          example:
            - "Processo de vendas manual"
            - "Baixa conversão de leads"
            - "Falta de visibilidade do funil"

    FeedbackIA:
      type: object
      properties:
        pontos_fortes:
          type: array
          items:
            type: string
          description: Pontos positivos identificados
          example:
            - "Boa qualificação inicial usando BANT"
            - "Demonstrou conhecimento técnico"
            - "Manteve tom profissional"
        pontos_melhoria:
          type: array
          items:
            type: string
          description: Pontos a melhorar
          example:
            - "Poderia ter explorado mais a dor do cliente"
            - "Não utilizou storytelling para criar conexão"
        metodologia_aplicada:
          type: object
          properties:
            tecnica:
              type: string
              description: Técnica utilizada
              example: "SPIN Selling"
            aplicacao_correta:
              type: boolean
              description: Se foi aplicada corretamente
              example: true
            sugestoes:
              type: array
              items:
                type: string
              description: Sugestões de melhoria
              example:
                - "Use mais perguntas de situação antes das de necessidade"
        proximos_passos:
          type: array
          items:
            type: string
          description: Recomendações para próximas simulações
          example:
            - "Pratique mais cenários de objeção de orçamento"
            - "Estude casos de sucesso com storytelling"

    AnalyticsConversa:
      type: object
      properties:
        duracao_total:
          type: integer
          description: Duração total em minutos
          example: 18
        numero_mensagens:
          type: integer
          description: Total de mensagens trocadas
          example: 24
        tokens_consumidos:
          type: integer
          description: Total de tokens utilizados
          example: 850
        custo_ia:
          type: number
          format: float
          description: Custo total em reais
          example: 0.15
        sentimento_geral:
          type: string
          enum: [positivo, neutro, negativo]
          description: Análise de sentimento
          example: "positivo"
        palavras_chave:
          type: array
          items:
            type: string
          description: Palavras-chave identificadas
          example: ["qualificação", "orçamento", "timeline", "decisor"]
        metodologias_mencionadas:
          type: array
          items:
            type: string

---
*Tipo: api*
*Gerado pelo ForgeAI em 07/02/2026*
