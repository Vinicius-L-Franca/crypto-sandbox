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

| Variável | Cor | Uso |
|---|---|---|
| `--bg` | `#080c14` | fundo geral da aplicação |
| `--surface` | `#0e1420` | cards, tabelas, dropdowns |
| `--surface2` | `#131b2b` | superfície secundária (inputs, tabs) |
| `--surface3` | `#172030` | superfície terciária (destaque interno) |
| `--border` | `rgba(255,255,255,0.07)` | bordas de containers |
| `--cyan` | `#00d4ff` | primária — ação, links, gráfico |
| `--green` | `#0fffa3` | alta/lucro (valores positivos) |
| `--red` | `#ff4d6a` | baixa/prejuízo (valores negativos), negada |
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

- **Fonte principal:** `Inter, sans-serif`
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
- Patrimônio Total (clicável → leva ao portfólio)
- Ícone de notificações

### 📌 Bottom Nav (mobile)

Em viewports menores (`< 768px`) a topbar é substituída por uma barra de navegação inferior fixa com 4 itens:
- Mercado (`show_chart`)
- Portfólio (`pie_chart`)
- Transações (`receipt_long`)
- Configurações (`settings`)

### 📌 Balance Responsivo

Em **sm (576px–767px)**: o valor do patrimônio é exibido de forma compacta (sem label/borda) ao lado da brand.
Em **md (768px–991px)**: os nav pills têm padding reduzido (`0.3rem 0.4rem`) para acomodar o balance + navegação sem overflow.

---

## 5. Componentes

### 🧱 Cards (`.panel` / `.card-soft`)

Usados em:
- Saldo total / Patrimônio Líquido
- Gráficos
- Trade panel
- Lista de transações
- Configurações e segurança

**Regras:**
- Fundo: `var(--surface)` → `#0e1420`
- Borda: `1px solid var(--border)`
- Sombra: `0 4px 24px rgba(0,0,0,0.3)`
- Padding: `0.9rem` (responsive `.75rem` no mobile)
- Border-radius: `8px`

#### Flash azul no Patrimônio Líquido

O card de Patrimônio Líquido no portfólio tem classe `flash-blue` que dispara animação `@keyframes flash-blue` ao entrar na página (0.6s, glow azul + background).

#### Danger Zone (accordion)

A Zona de Perigo é um card colapsável:
- Inicialmente compacto (só cabeçalho com ícone warning + título + seta expand_more)
- Ao clicar, expande via Bootstrap collapse
- Seta gira 180° com transição CSS

---

### 🔘 Botões

#### Primário (ação principal):
- Cor: `var(--cyan)` → `#00d4ff`
- Uso: Comprar, Confirmar Transação

#### Perigo (venda / formatação):
- Cor: `var(--red)` → `#ff4d6a`
- Uso: Vender ativo, Formatar Dados

#### Botão Conectar Carteira:
- Gradiente `var(--cyan)` com glow
- Quando conectado: fundo verde e endereço abreviado

#### Danger link:
- Cor: `#ff6b7d`
- Uso: Remover chave de API, encerrar sessão, remover dispositivo

---

### 📊 Gráfico de Linha

Gerado dinamicamente via SVG (sem biblioteca externa):
- Dados reais do CoinGecko (`/coins/{id}/market_chart`)
- Cache em `CHART_CACHE` para evitar requisições repetidas
- Amostragem para ~24 pontos via `samplePrices()`
- Fallback para dados aleatórios se API falhar
- Linha principal: cor dinâmica (`--cyan` se alta, `--red` se baixa)
- Área: gradiente com opacidade decrescente
- Média: linha tracejada verde
- Grid: linhas horizontais sutis
- Loading state: "Carregando gráfico…" enquanto busca dados
- **Sem tooltip, sem labels de horário** (removidos para visual limpo)

---

### 📋 Tabelas

Usadas em:
- Portfólio (tabela de ativos)
- Histórico de transações (paginada)

**Regras:**
- Linhas com hover (`rgba(255,255,255,0.02)`)
- Valores positivos → verde, negativos → vermelho
- Status "Negada" → bolinha vermelha + texto vermelho
- Colunas bem espaçadas, sem bordas pesadas
- Scroll horizontal em mobile

---

### 📝 Formulários

- Inputs escuros (`var(--surface3)`)
- Borda `var(--border)`
- Validação com REGEX + feedback visual (classe `.invalid` + mensagem de erro)
- Máscaras jQuery para telefone e valores

---

### 🔄 Trade Panel (Painel de Compra/Venda)

Presente em `mercado.html`:
- Abas "Comprar" / "Vender" com toggle visual
- Input de valor com estimativa em tempo real (quantidade + taxa)
- Label e suffix do input dinâmicos conforme moeda escolhida pelo usuário
- Input bidirecional: alterar valor ↔ altera quantidade e vice-versa
- Botão "Confirmar Transação"
- Alerta de erro (saldo insuficiente) com registro de trade negada
- Resumo do portfólio do ativo selecionado
- Máximo na compra: saldo em fiat; na venda: valor total das moedas

---

### 💬 Chip "Ambiente Simulado"

No card de Patrimônio Líquido do portfólio:
```
Ambiente simulado — os valores exibidos são fictícios e podem ser editados livremente
```
Exibido em `.68rem`, cor muted, 65% opacidade.

---

## 6. Responsividade

- Mobile-first com grid Bootstrap (`col-12 col-lg-8`, etc.)
- Topbar → Bottom Nav em mobile
- Cards empilhados verticalmente em telas pequenas
- Gráfico SVG com `preserveAspectRatio="none"` e `viewBox` fixo
- Tabelas com scroll horizontal em mobile
- Patrimônio compacto em sm (sem label/borda)

---

## 7. UX (Experiência do Usuário)

- Feedback imediato nas ações (trade, conexão wallet)
- Destaque claro para ganhos (verde) e perdas (vermelho)
- Interface semelhante a plataformas reais de trading
- Foco em leitura rápida de dados financeiros
- Tema claro/escuro configurável em Preferências
- Transações negadas em vermelho para fácil identificação
- Loading states no gráfico enquanto busca dados reais
- Clique no patrimônio → navega direto ao portfólio
- Painéis de configuração mais compactos e colapsáveis

---

## 8. Padrões Visuais Importantes

- Verde = lucro / alta
- Vermelho = prejuízo / baixa / erro / negada
- Ciano = ação primária (comprar, navegar, confirmar)
- Contraste alto entre fundo escuro e texto claro
- Interface limpa, sem excesso de elementos
