# Estrutura do Repositório — Crypto Sandbox

## Visão Geral

Todos os arquivos HTML residem diretamente na raiz do repositório (estrutura flat), sem subpastas de domínio. Isso facilita o deploy no GitHub Pages, que por padrão serve `index.html` na raiz como página inicial.

## Páginas (raiz)

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página inicial — Conectar Carteira (entrada da aplicação) |
| `mercado.html` | Mercado — gráfico com dados CoinGecko, seletor de ativos, compra/venda |
| `portfolio.html` | Portfólio — visão dos ativos calculada a partir de `cs_trades` |
| `transacoes.html` | Histórico de transações com paginação e filtros |
| `conf_perfil.html` | Configurações de perfil |
| `conf_seguranca.html` | Configurações de segurança (2FA, senha, sessões, zona de perigo) |
| `conf_preferencias.html` | Preferências do usuário (idioma, moeda base, tema) |

## Assets

- `assets/css/custom-bootstrap.css` — tema escuro customizado do Bootstrap 5 (nav-pills, cards, notif-panel, etc.)
- `assets/css/tema.css` — tema claro (overrides `.light`)
- `assets/images/` — imagens do projeto (favicon, etc.)

## Scripts JavaScript

| Arquivo | Descrição |
|---|---|
| `scripts/api.js` | Núcleo da aplicação: 1282+ linhas |
| `scripts/validacao.js` | Validação de formulários com REGEX |
| `scripts/jquery-init.js` | Máscaras de input (telefone, valor) |

### Scripts inline em `conf_seguranca.html`

Páginas de configuração possuem scripts inline próprios:

- **API Keys** — Geração de chaves `sk_live_...` com prefixo aleatório, armazenadas em `cs_api_keys`
- **Sessões Ativas** — Simulação de sessões com device, browser, cidade, IP e tempo aleatórios em `cs_sessions`
- **Dispositivos Confiáveis** — Lista de dispositivos em `cs_devices`
- **2FA** — Toggle visual de autenticação de dois fatores (cosmético)
- **Formatar Dados** — Limpa todas as chaves localStorage e redireciona para `index.html`

### Scripts inline em `conf_preferencias.html`

- Sincronização de moeda via `syncTradeFormCurrency` + `CURRENCY_RATES` da ExchangeRate-API
- Tema claro/escuro salvo em `cs_preferences.tema`, restaurado via inline script no `<head>` de todas as 7 páginas
- Currency selector com `onchange` que persiste em `cs_preferences.moeda`

## Dados

| Fonte | Uso |
|---|---|
| `db.json` | JSON Server — dados iniciais de 5 assets (BTC, ETH, SOL, ADA, DOT) |
| `localStorage` (cs_trades, cs_balance, etc.) | Dados persistentes do usuário |
| CoinGecko API | Preços em tempo real + dados históricos do gráfico |
| ExchangeRate-API | Taxas de câmbio USD/BRL/EUR |

## Configuração

- `package.json` — dependências e scripts npm
- `.eslintrc.json` — configuração do ESLint
- `.prettierrc` — configuração do Prettier

## Scripts de Manutenção

- `scripts/convert.py` — baixa páginas externas, converte classes Tailwind para Bootstrap e salva os arquivos diretamente na raiz
- `scripts/format_html.py` — formata com indentação todos os HTMLs encontrados na raiz (ignora `node_modules`)

## Como Validar Localmente

1. Instale as dependências Node:

```bash
npm install
```

2. Inicie o JSON Server:

```bash
npm run api
```

3. Sirva o projeto localmente:

```bash
python3 -m http.server --directory . 8000
```

4. Acesse: `http://localhost:8000/index.html`

### Dados importantes

- O JSON Server precisa estar rodando na porta 3001 para o carregamento inicial dos assets
- CoinGecko + ExchangeRate-API funcionam sem backend (chamadas diretas do frontend)
- localStorage persiste os dados entre sessões; limpe com "Formatar Dados" na Zona de Perigo

## Deploy — GitHub Pages

O projeto é publicado automaticamente pelo GitHub Pages a partir da branch `main`. Como todos os HTMLs estão na raiz, o `index.html` é servido corretamente como entrada. Nenhum arquivo `CNAME` ou configuração adicional é necessário.

---

Consulte também:
- [docs/prd.md](prd.md) — requisitos e histórias de usuário
- [docs/spec.md](spec.md) — especificação técnica e modelo de dados
- [docs/design-system.md](design-system.md) — sistema de design e paleta de cores
