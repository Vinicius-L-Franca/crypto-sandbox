# 💰 Crypto Sandbox

## 👤 Autor

Vinicius Liepienski de França

---

## 📖 Descrição do Projeto

O **Crypto Sandbox** é uma aplicação web responsiva que simula um ambiente de compra e venda de criptomoedas em tempo real.  
O sistema permite que o usuário visualize cotações atualizadas, simule investimentos e gerencie um portfólio fictício de ativos digitais.

O objetivo do projeto é proporcionar uma experiência prática de mercado financeiro, utilizando dados reais de criptomoedas, mas sem envolver dinheiro de verdade (modo sandbox).

---

## 🎯 Funcionalidades Principais

- 📈 Visualização de preços de criptomoedas em tempo real  
- 💸 Compra e venda de ativos digitais  
- 📊 Simulação de carteira de investimentos  
- 🧾 Histórico de transações  
- 🔄 Atualização dinâmica via API  
- 💾 Persistência de dados no navegador  

---

## 🎨 Prototipação no Stich

[Design System](https://stitch.withgoogle.com/projects/7598302925290636969) - Identidade Visual

---

## 🎨 Framework CSS

**Bootstrap 5 (v5.x)**

O site usa o bundle oficial do Bootstrap com um tema escuro personalizado em [custom-bootstrap.css](assets/css/custom-bootstrap.css) para padronizar navbars, cards, botões, formulários e tabelas em todas as telas.

**Por que Bootstrap?**

- **Responsividade (Grid):** o sistema de grid (breakpoints como `sm`, `md`, `lg`, `xl`) facilita adaptar o layout para *mobile / tablet / desktop* sem reescrever CSS do zero.
- **Componentes prontos:** possui exatamente o que um app como o *Crypto Sandbox* costuma precisar (Navbar, Cards para moedas, Tables para histórico, Modals para confirmar compra/venda, Forms, Buttons, Alerts etc.).
- **JS pronto para componentes interativos:** modais, dropdowns, offcanvas e tooltips já funcionam com o bundle oficial (sem jQuery), acelerando muito a entrega.
- **Saúde do projeto:** é um projeto extremamente ativo e popular no GitHub (repositório `twbs/bootstrap`), com commits recentes (pushed em **2026-03-31**) e grande comunidade.
- **Licença:** MIT, amigável para projetos open-source e acadêmicos.

---

## 🌐 API Pública

**CoinGecko API (Public API)**

**Por que CoinGecko?**

- **Aderência ao tema do projeto:** entrega dados reais do mercado cripto, como preço atual, variação 24h, volume, market cap e ranking.
- **Boa para dashboards:** permite listar múltiplas moedas e atualizar periodicamente (ex.: a cada 30s/60s) para simular “tempo real”.
- **Não exige chave para começar:** dá para prototipar e testar rapidamente usando endpoints públicos.

**Como ela agrega valor ao sistema:**

- Alimenta as telas de mercado com preços e variação.
- Permite preencher automaticamente o catálogo de criptomoedas disponíveis para compra/venda.
- Ajuda a validar transações do sandbox com base no preço real no momento da simulação.

---

## 📦 Tecnologias e Dependências

- **Bootstrap 5.3.3** - Framework CSS responsivo com componentes prontos
- **jQuery 4.0.0** - Biblioteca JavaScript para manipulação do DOM
- **json-server 0.17.4** *(dev)* - API fake para simulação de dados
- **CoinGecko API (v3)** - Dados reais de criptomoedas em tempo real
- **Fetch API (nativa)** - Requisições assíncronas
- **localStorage (nativo)** - Armazenamento local no navegador
- **Sass (Dart Sass)** - Pré-processador SCSS para estilos customizados

---

## ✅ Checklist de Funcionalidades

### 📱 RA1 - Interface e Responsividade
- [x] ID 01 - Protótipo no Stitch (mobile + desktop)
- [x] ID 02 - Layout responsivo com framework CSS
- [x] ID 03 - Layout com CSS puro (Flexbox/Grid)
- [x] ID 04 - Uso de componentes do framework
- [x] ID 05 - Uso de unidades relativas (%, rem, vw)
- [x] ID 06 - Aplicação de Design System
- [x] ID 07 - Uso de SCSS
- [x] ID 08 - Tipografia responsiva
- [x] ID 09 - Responsividade de imagens
- [x] ID 10 - Otimização de imagens

---

### 📝 RA2 - Formulários e Validações
- [x] ID 11 - Validação HTML nativa
- [x] ID 12 - Validação com REGEX
- [x] ID 13 - Uso de checkbox/radio/select
- [x] ID 14 - Persistência com localStorage

---

### ⚙️ RA3 - Desenvolvimento
- [x] ID 15 - Configuração com Node/NPM
- [x] ID 16 - Versionamento com Git/GitHub
- [x] ID 17 - README padronizado
- [x] ID 18 - Organização modular do projeto
- [x] ID 19 - Uso de ESLint/Prettier

---

### 🧠 RA4 - JavaScript e Interatividade
- [x] ID 20 - Uso de jQuery
- [x] ID 21 - Plugin jQuery (ex: máscara de input)

---

### 🌐 RA5 - APIs e Requisições
- [x] ID 22 - Requisições para API fake (JSON Server)
- [x] ID 23 - Exibição de dados da API fake
- [x] ID 24 - Integração com API pública (criptomoedas)

---

## 📦 Escopo do Projeto

O sistema contará com pelo menos:

- 💰 Página de compra/venda
- 📊 Página de carteira (portfólio do usuário)

---

## 📱 Páginas da Aplicação

1. **Conectar Carteira / Home** (`index.html`) - Página inicial e conexão de carteira digital
2. **Mercado/Negociação** (`negociacao.html`) - Lista de criptomoedas com opções de compra e venda
3. **Portfólio/Carteira** (`portfolio.html`) - Carteira do usuário com distribuição de ativos
4. **Transações** (`transacoes.html`) - Histórico de compras e vendas
5. **Configurações** - Perfil, segurança e preferências do usuário:
   - `conf_perfil.html`
   - `conf_seguranca.html`
   - `conf_preferencias.html`

---

## 🎨 Componentes Visuais

- 📈 Gráficos de linha (evolução de preços no mercado)
- 🔐 Painel de Segurança (2FA, senha, autenticação biométrica)
- ⚙️ Preferências (idioma, moeda base, tema claro/escuro)

---

## 🚀 Instruções de Execução

1. Clone o repositório:
```bash
git clone https://github.com/Vinicius-L-Franca/crypto-sandbox
```

## 🗂 Estrutura Atual do Projeto

Todos os arquivos HTML estão diretamente na raiz do repositório (estrutura flat):

### Páginas

- `index.html` — página inicial (Conectar Carteira)
- `negociacao.html` — página de mercado (compra/venda, gráfico)
- `portfolio.html` — página de portfólio
- `transacoes.html` — histórico de transações
- `conf_perfil.html` — configurações de perfil
- `conf_seguranca.html` — configurações de segurança
- `conf_preferencias.html` — preferências do usuário

### Assets

- `assets/css/custom-bootstrap.css` — tema escuro personalizado do Bootstrap
- `assets/css/main.css` — estilos globais compilados (SCSS)
- `assets/css/tema.css` — tema claro (`.light` overrides)

### Scripts

- `scripts/api.js` — lógica principal (mercado, trades, carteira, conexão)
- `scripts/validacao.js` — validação de formulários com REGEX
- `scripts/jquery-init.js` — máscaras de input e comportamentos jQuery
- `scripts/convert.py` — baixa e converte páginas externas para Bootstrap
- `scripts/format_html.py` — formata todos os HTMLs da raiz

### SCSS

- `scss/` — arquivos-fonte SCSS

### Config / Dados

- `db.json` — base de dados da API fake (JSON Server)
- `package.json` — dependências e scripts npm
- `.eslintrc.json` — configuração do ESLint
- `.prettierrc` — configuração do Prettier

Consulte também a documentação de estrutura: [docs/structure.md](docs/structure.md)

## ⚙️ Comandos Úteis

- Servir o projeto localmente (porta 8000):

```bash
python3 -m http.server --directory . 8000
# então abra: http://localhost:8000/index.html
```

- Executar o conversor (baixa páginas externas e salva na raiz):

```bash
python3 scripts/convert.py
```

Aviso: `scripts/convert.py` baixa conteúdo da internet — use com cuidado.

## 🔌 API Fake (JSON Server)

O projeto usa `json-server` para simular uma API REST com dados de criptomoedas, portfólio e transações.

### Iniciar o servidor fake:

```bash
npm run api
# Servidor disponível em http://localhost:3001
```

### Endpoints disponíveis:

| Endpoint | Descrição |
|---|---|
| `GET /assets` | Lista de criptomoedas com preços e saldos |
| `GET /portfolio` | Resumo do portfólio (valor total, lucro, alocação) |
| `GET /market` | Dados de mercado do ativo selecionado |
| `GET /transactions` | Histórico de transações |
| `GET /summary` | Resumo de compras, vendas e taxas (30d) |

### Servidor completo (API + frontend):

```bash
npm run dev
# API em http://localhost:3001
# Frontend em http://localhost:8000
```
As páginas com `data-page` (`portfolio.html`, `negociacao.html`, `transacoes.html`) consomem automaticamente os dados da API fake quando o servidor está rodando.

## 🌐 API Pública (CoinGecko + ExchangeRate-API)

Além da API fake, o projeto integra duas APIs públicas:

- **CoinGecko API v3** — preços reais de criptomoedas. Os elementos com atributos `data-cg` e `data-cg-field` são preenchidos automaticamente. Os preços reais também atualizam `currentAsset.current_price`, usados nas trades, gráfico e estimativas.
- **ExchangeRate-API** (`/v4/latest/USD`) — taxas de câmbio reais de USD para BRL e EUR, substituindo as taxas fixas anteriormente hardcoded.

Ambas são chamadas em paralelo via `Promise.all` no `DOMContentLoaded`.

## 📄 Histórico de Mudanças Relevantes

- Bootstrap migrado de dependência local (`node_modules/`) para CDN (jsDelivr).
- Todos os HTMLs movidos da pasta `pages/` para a raiz do projeto.
- `conectar_carteira.html` renomeado para `index.html` (página de entrada padrão do GitHub Pages).
- `scripts/convert.py` e `scripts/format_html.py` atualizados para trabalhar com a estrutura flat.
- Balance compacto adicionado para telas sm (576px–767px) via `d-none d-sm-flex d-md-none`.
- Nav pills com padding reduzido em tablets (768px–991px) via media query.
- Setinhas do input number removidas no formulário de trade.
- Formulário de compra/venda agora usa a moeda preferida do usuário (label/suffix dinâmicos + `toUSD()`).
- Preços da CoinGecko atualizam `currentAsset.current_price` (trades usam preço real).
- Taxas de câmbio BRL/EUR agora obtidas da ExchangeRate-API em tempo real.