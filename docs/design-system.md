# 🎨 Design System - Crypto Sandbox

---

Este projeto foi inspirado em plataformas reais de trading como Binance, priorizando um visual moderno, escuro e orientado a dados.

## 1. Framework Base

- **Framework escolhido:** Bootstrap 5.3.3  
- **Tema complementar:** [custom-bootstrap.css](../assets/css/custom-bootstrap.css)
- **Motivação:**  
Permite construção rápida de interfaces modernas com componentes reutilizáveis, sistema de grid responsivo e suporte nativo a JavaScript interativo — ideal para dashboards financeiros e aplicações data-driven.

---

## 2. Paleta de Cores

O sistema utiliza **Dark Mode como padrão**, contrastando dados financeiros sobre fundo escuro.

### Variáveis CSS (fonte primária)

Estas são as variáveis definidas no `<style>` de cada página HTML e no SCSS:

| Variável | Cor | Uso |
|---|---|---|
| `--bg` | `#080c14` | fundo geral da aplicação |
| `--surface` | `#0e1420` | cards, tabelas, dropdowns |
| `--surface2` | `#131b2b` | superfície secundária (inputs, tabs) |
| `--surface3` | `#172030` | superfície terciária (destaque interno) |
| `--border` | `rgba(255,255,255,0.07)` | bordas de containers |
| `--cyan` | `#00d4ff` | primária — ação, links, gráfico |
| `--green` | `#0fffa3` | alta/lucro (valores positivos) |
| `--red` | `#ff4d6a` | baixa/prejuízo (valores negativos) |
| `--text` | `#dce8f8` | texto principal |
| `--muted` | `rgba(255,255,255,0.42)` | texto secundário, labels |

### Tema Claro

A classe `.light` no `<html>` sobrescreve as variáveis via [tema.css](../assets/css/tema.css):

| Variável (light) | Cor |
|---|---|
| `--bg` | `#f0f2f5` |
| `--surface` | `#ffffff` |
| `--text` | `#1a1d24` |
| `--muted` | `rgba(0,0,0,0.45)` |

---

## 3. Tipografia

- **Fonte principal:** `Inter, sans-serif` (fallback `Roboto`)
- **Fonte de dados:** `Space Grotesk, sans-serif` (números bold)

### 🔠 Hierarquia

- **Títulos (H1, saldo):** Peso 700 — ex: `$42,500.24`
- **Subtítulos:** Peso 500
- **Texto comum:** Peso 400
- **Dados financeiros:** `Space Grotesk` bold (para destaque)

---

## 4. Layout e Estrutura

### 📌 Topbar (Navbar superior)

Presente em todas as páginas:
- Logo / nome "Crypto Sandbox"
- Menu de navegação (Mercado, Portfólio, Transações, Configurações)
- Botão "Conectar Carteira" (toggle wallet)
- Saldo em USD

### 📌 Bottom Nav (mobile)

Em viewports menores (`< 768px`) a topbar é substituída por uma barra de navegação inferior fixa com 4 itens:
- Mercado (`show_chart`)
- Portfólio (`pie_chart`)
- Transações (`receipt_long`)
- Configurações (`settings`)

### 📌 Balance Responsivo

Em **sm (576px–767px)**: o valor do patrimônio é exibido de forma compacta (sem label/borda) ao lado da brand, usando `d-none d-sm-flex d-md-none`.
Em **md (768px–991px)**: os nav pills têm padding reduzido (`0.3rem 0.4rem`) para acomodar o balance + navegação sem overflow.

---

## 5. Componentes

### 🧱 Cards (`.cs-card`)

Usados em:
- Saldo total
- Gráficos
- Trade panel
- Lista de transações

**Regras:**
- Fundo: `var(--surface)` → `#0e1420`
- Borda: `1px solid var(--border)`
- Sombra: `0 4px 24px rgba(0,0,0,0.3)`
- Padding: `1rem–1.5rem`
- Border-radius: `12px`

---

### 🔘 Botões

#### Primário (ação principal):
- Cor: `var(--cyan)` → `#00d4ff`
- Uso: Comprar, Confirmar Transação

#### Perigo (venda):
- Cor: `var(--red)` → `#ff4d6a`
- Uso: Vender ativo

#### Botão Conectar Carteira:
- Gradiente `var(--cyan)` com glow
- Texto branco
- Quando conectado: fundo verde e endereço abreviado

---

### 📊 Gráfico de Linha

Gerado dinamicamente via SVG (sem biblioteca externa):
- Linha principal: cor dinâmica (`--cyan` se alta, `--red` se baixa)
- Área: gradiente com opacidade decrescente
- Média 24h: linha tracejada verde
- Grid: linhas horizontais sutis
- Tooltip: `.chart-pin` com data/hora + preço

---

### 📋 Tabelas

Usadas em:
- Portfólio
- Histórico de transações

**Regras:**
- Linhas com hover (`rgba(255,255,255,0.02)`)
- Valores positivos → verde, negativos → vermelho
- Colunas bem espaçadas, sem bordas pesadas

---

### 📝 Formulários

- Inputs escuros (`var(--surface3)`)
- Borda `var(--border)`
- Validação:
  - REGEX com feedback visual (classe `.invalid` + mensagem de erro)
  - jQuery Mask para telefone e valores

---

### 🔄 Trade Panel (Painel de Compra/Venda)

Presente em `negociacao.html`:
- Abas "Comprar" / "Vender" com toggle visual
- Input de valor com estimativa em tempo real (quantidade + taxa)
- Label e suffix do input dinâmicos conforme moeda escolhida pelo usuário (USD/BRL/EUR)
- Botão "Confirmar Transação"
- Alerta de erro (saldo insuficiente)
- Resumo do portfólio do ativo selecionado

---

## 6. Responsividade

- Mobile-first com grid Bootstrap (`col-12 col-lg-8`, etc.)
- Topbar → Bottom Nav em mobile
- Cards empilhados verticalmente em telas pequenas
- Gráfico SVG com `preserveAspectRatio="none"` e `viewBox` fixo
- Tabelas com scroll horizontal em mobile

---

## 7. UX (Experiência do Usuário)

- Feedback imediato nas ações (trade, conexão wallet)
- Destaque claro para ganhos (verde) e perdas (vermelho)
- Interface semelhante a plataformas reais de trading
- Foco em leitura rápida de dados financeiros
- Tema claro/escuro configurável em Preferências

---

## 8. Padrões Visuais Importantes

- Verde = lucro / alta
- Vermelho = prejuízo / baixa
- Ciano = ação primária (comprar, navegar, confirmar)
- Contraste alto entre fundo escuro e texto claro
- Interface limpa, sem excesso de elementos
