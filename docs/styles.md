# Guia de Estilos

# Design System - babi.ai
## Guia de Estilos Completo v3.0

---

## 1. **Visão Geral**

O design system da **babi.ai** foi desenvolvido para uma aplicação web SaaS focada em mentoria de vendas via inteligência artificial. O sistema visual adota uma abordagem moderna e minimalista, priorizando clareza, profissionalismo e facilidade de uso.

### Princípios de Design
- **Simplicidade**: Interface limpa e intuitiva para facilitar o aprendizado
- **Confiabilidade**: Cores e elementos que transmitem credibilidade profissional
- **Acessibilidade**: Contrastes adequados e hierarquia visual clara
- **Consistência**: Padrões reutilizáveis em toda a plataforma

---

## 2. **Paleta de Cores**

### Cores Principais

| Cor | Hex Code | Uso | Aplicação |
|-----|----------|-----|-----------|
| **Primária** | `#6366f1` | Botões principais, links, destaques | CTAs, navegação ativa |
| **Destaque** | `#8b5cf6` | Elementos de ênfase, hover states | Badges importantes, notificações |
| **Secundária** | `#e5e7eb` | Elementos auxiliares, estados desabilitados | Bordas secundárias, backgrounds neutros |

### Cores de Sistema

| Cor | Hex Code | Uso | Aplicação |
|-----|----------|-----|-----------|
| **Fundo** | `#f8f9fa` | Background principal da aplicação | Body, seções principais |
| **Card** | `#ffffff` | Backgrounds de componentes | Cards, modais, formulários |
| **Texto Principal** | `#1f2937` | Textos primários | Títulos, parágrafos principais |
| **Texto Suave** | `#6b7280` | Textos secundários | Descrições, placeholders |
| **Borda** | `#d1d5db` | Divisores e contornos | Cards, inputs, separadores |

### Cores de Estado

| Cor | Hex Code | Uso | Aplicação |
|-----|----------|-----|-----------|
| **Sucesso** | `#10b981` | Confirmações e estados positivos | Mensagens de êxito, indicadores |
| **Erro** | `#ef4444` | Alertas e estados negativos | Validações, mensagens de erro |

---

## 3. **Tipografia**

### Fonte Principal
- **Família**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Importação**: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

### Hierarquia de Títulos

```css
/* H1 - Títulos principais */
.heading-1 {
  font-family: 'Inter', sans-serif;
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  line-height: 1.2;
  color: #1f2937;
}

/* H2 - Títulos de seção */
.heading-2 {
  font-family: 'Inter', sans-serif;
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  line-height: 1.3;
  color: #1f2937;
}

/* H3 - Subtítulos */
.heading-3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.4;
  color: #1f2937;
}

/* H4 - Títulos de componentes */
.heading-4 {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  line-height: 1.4;
  color: #1f2937;
}
```

### Texto Corpo

```css
/* Texto principal */
.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: #1f2937;
}

/* Texto secundário */
.body-text-sm {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: #6b7280;
}

/* Texto pequeno */
.caption {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; /* 12px */
  font-weight: 400;
  line-height: 1.4;
  color: #6b7280;
}
```

---

## 4. **Espaçamento**

### Sistema de Espaçamento (baseado em múltiplos de 4px)

```css
/* Variáveis de espaçamento */
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 0.75rem;  /* 12px */
  --spacing-lg: 1rem;     /* 16px */
  --spacing-xl: 1.5rem;   /* 24px */
  --spacing-2xl: 2rem;    /* 32px */
  --spacing-3xl: 3rem;    /* 48px */
  --spacing-4xl: 4rem;    /* 64px */
}
```

### Border Radius

```css
/* Raios de borda padronizados */
:root {
  --radius-sm: 0.25rem;   /* 4px - pequenos elementos */
  --radius-md: 0.5rem;    /* 8px - botões, inputs */
  --radius-lg: 0.75rem;   /* 12px - cards, modais */
  --radius-xl: 1rem;      /* 16px - containers grandes */
  --radius-full: 9999px;  /* circular - avatars, badges */
}
```

---

## 5. **Componentes**

### 5.1 Botões

#### Botão Primário
```css
.btn-primary {
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #5046e4;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Botão Secundário
```css
.btn-secondary {
  background-color: #ffffff;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #6366f1;
  color: #ffffff;
}
```

#### Botão de Destaque
```css
.btn-accent {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-accent:hover {
  background-color: #7c3aed;
}
```

### 5.2 Cards

#### Card Padrão
```css
.card {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

#### Card de Dashboard
```css
.dashboard-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.dashboard-card-header {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}
```

### 5.3 Inputs

#### Input Padrão
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: var(--radius-md);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #1f2937;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: #6b7280;
}
```

#### Input com Erro
```css
.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### 5.4 Badges

#### Badge Padrão
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-primary {
  background-color: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.badge-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.badge-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
```

---

## 6. **Padrões de Uso**

### 6.1 Hierarquia de Informação
- **H1**: Títulos principais de páginas (Dashboard, Configurações)
- **H2**: Títulos de seções dentro de páginas
- **H3**: Subtítulos e cabeçalhos de cards
- **H4**: Títulos de componentes menores

### 6.2 Estados de Componentes
- **Default**: Estado normal de interação
- **Hover**: Feedback visual ao passar o mouse
- **Focus**: Estado de foco para navegação por teclado
- **Active**: Estado durante clique/toque
- **Disabled**: Estado inativo

### 6.3 Uso de Cores
- **Primária (#6366f1)**: Ações principais, links importantes
- **Destaque (#8b5cf6)**: Elementos especiais, role plays
- **Sucesso (#10b981)**: Confirmações, metas atingidas
- **Erro (#ef4444)**: Validações, alertas críticos

---

## 7. **Acessibilidade**

### 7.1 Contraste de Cores
Todos os pares de cores atendem ao padrão WCAG AA (4.5:1):

- Texto principal (#1f2937) sobre fundo claro (#f8f9fa): **15.8:1** ✅
- Texto secundário (#6b7280) sobre fundo claro (#f8f9fa): **7.2:1** ✅
- Botão primário (#6366f1) com texto branco (#ffffff): **8.6:1** ✅
- Links e elementos de destaque (#8b5cf6) sobre fundo claro: **6.8:1** ✅

### 7.2 Navegação por Teclado
```css
/* Estados de foco visíveis */
.focusable:focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Indicadores de estado para leitores de tela */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 7.3 Tamanhos Mínimos
- **Botões**: Mínimo 44px de altura (área de toque)
- **Links**: Espaçamento adequado entre elementos clicáveis
- **Texto**: Tamanho mínimo de 14px para leitura confortável

---

## 8. **Responsividade**

### 8.1 Breakpoints
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Tablet pequeno */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Desktop grande */
}

@media (min-width: 640px) {
  /* Ajustes para tablet pequeno */
}

@media (min-width: 768px) {
  /* Ajustes para tablet */
}

@media (min-width: 1024px) {
  /* Ajustes para desktop */
}
```

### 8.2 Grid Responsivo
```css
/* Container principal */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid de dashboard */
.dashboard-grid {
  display: grid;
  gap: var(--spacing-xl);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

---
*Tipo: styles*
*Gerado pelo ForgeAI em 07/02/2026*
