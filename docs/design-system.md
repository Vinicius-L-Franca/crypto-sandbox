# 🎨 Design System - Crypto Sandbox

---

Este projeto foi inspirado em plataformas reais de trading como Binance, priorizando um visual moderno, escuro e orientado a dados

## 1. Framework Base

- **Framework escolhido:** Bootstrap 5.3.8  
- **Motivação:**  
Permite construção rápida de interfaces modernas com componentes reutilizáveis, sistema de grid responsivo e suporte nativo a JavaScript interativo — ideal para dashboards financeiros e aplicações data-driven.

---

## 2. Paleta de Cores (Baseada nas Telas)

O sistema utiliza **Dark Mode como padrão**, focando em contraste e leitura de dados financeiros.

---

### 🌌 Background Principal
- **#0B1426 (azul bem escuro)**
- Uso: fundo geral da aplicação

---

### 🧱 Containers / Cards
- **#111C33**
- Uso: cards, gráficos, tabelas, sidebar

---

### 🔵 Cor Primária (Ação)
- **#2EC4F1 (azul neon/ciano)**
- Uso: botões principais, links, seleção ativa (menu)
- Exemplo: botão *"Conectar Carteira"*, item ativo da sidebar

---

### 🟢 Cor de Alta (Lucro)
- **#00E676**
- Uso: valores positivos, lucro, crescimento
- Exemplo: +12.5%, +$1,940.21

---

### 🔴 Cor de Baixa (Prejuízo)
- **#FF5252**
- Uso: perdas, queda de mercado
- Exemplo: -4.12%, -$924.76

---

### ⚪ Texto Principal
- **#E0E6ED**
- Uso: títulos, valores importantes

---

### 🔘 Texto Secundário
- **#8A94A6**
- Uso: descrições, labels, infos secundárias

---

### 🟡 Destaque / Hover
- **#1E88E5**
- Uso: hover em botões e elementos interativos

---

## 3. Tipografia

- **Fonte principal:** `Inter, Roboto, sans-serif`

---

### 🔠 Hierarquia

- **Títulos (H1, saldo):**
  - Peso: 700
  - Ex: `$42,500.24`

- **Subtítulos:**
  - Peso: 500

- **Texto comum:**
  - Peso: 400

- **Dados financeiros:**
  - Monoespaçado opcional (para alinhamento)

---

## 4. Layout e Estrutura

---

### 📌 Sidebar (Menu lateral)

- Fundo: #0B1426  
- Item ativo:
  - Background: #111C33
  - Borda esquerda azul (#2EC4F1)
- Ícones minimalistas
- Menu:
  - Painel
  - Mercado
  - Portfólio
  - Transações
  - Configurações

---

### 📌 Navbar (Topo)

- Fundo: transparente ou #0B1426
- Elementos:
  - Barra de busca
  - Saldo total
  - Botão "Conectar Carteira"
  - Avatar do usuário

---

## 5. Componentes

---

### 🧱 Cards (`.card`)

Usados para:

- Saldo total
- Maior alta/baixa
- Gráficos
- Lista de observação

**Regras:**
- Fundo: #111C33  
- Borda: suave ou inexistente  
- Sombra leve  
- Padding: médio (16px–24px)  
- Borda arredondada (8px–12px)

---

### 🔘 Botões (`.btn`)

#### Primário:
- Cor: azul (#2EC4F1)
- Uso: ações principais (comprar, conectar carteira)

#### Sucesso:
- Cor: verde (#00E676)
- Uso: confirmar compra

#### Perigo:
- Cor: vermelho (#FF5252)
- Uso: vender ativo

#### Secundário:
- `.btn-flat`
- Uso: ações menos importantes

---

### 📊 Gráficos

- Linha: azul neon (#2EC4F1)
- Área: leve transparência
- Sem poluição visual
- Tooltip com fundo escuro

---

### 📋 Tabelas

Usadas em:

- Histórico de transações
- Portfólio

**Regras:**
- Linhas com hover
- Valores:
  - Verde → lucro
  - Vermelho → prejuízo
- Colunas bem espaçadas
- Sem bordas pesadas

---

### 📝 Formulários

- Inputs escuros (#0B1426)
- Borda leve (#1E2A47)
- Texto claro
- Validação:
  - Verde → válido
  - Vermelho → erro

---

### 🔄 Widget de Troca (Trade Box)

- Destaque visual (card lateral)
- Inputs grandes
- Botão principal chamativo
- Fluxo:
  - Vender → trocar → comprar

---

## 6. Responsividade

- Mobile-first
- Sidebar vira menu colapsável
- Cards empilhados
- Gráficos responsivos
- Tabelas com scroll horizontal

---

## 7. UX (Experiência do Usuário)

- Feedback imediato nas ações
- Atualização em tempo real (ou simulada)
- Destaque claro para ganhos e perdas
- Interface semelhante a plataformas reais
- Foco em leitura rápida de dados

---

## 8. Padrões Visuais Importantes

- Sempre usar:
  - Verde = lucro
  - Vermelho = prejuízo
- Evitar cores aleatórias
- Priorizar contraste alto
- Interface limpa (sem excesso de elementos)

---

## 📌 Observações

O design do Crypto Sandbox simula plataformas profissionais de trading, garantindo uma experiência realista para o usuário, ao mesmo tempo que mantém simplicidade suficiente para aprendizado.
