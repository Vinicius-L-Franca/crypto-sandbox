# Estrutura do Repositório — Crypto Sandbox

Este arquivo descreve a organização atual do projeto após a migração dos HTMLs para a raiz.

## Visão Geral

Todos os arquivos HTML residem diretamente na raiz do repositório (estrutura flat), sem subpastas de domínio. Isso facilita o deploy no GitHub Pages, que por padrão serve `index.html` na raiz como página inicial.

## Páginas (raiz)

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página inicial — Conectar Carteira (entrada da aplicação) |
| `negociacao.html` | Mercado — gráfico, seletor de ativos, compra/venda |
| `portfolio.html` | Portfólio — visão dos ativos e saldo do usuário |
| `transacoes.html` | Histórico de transações |
| `conf_perfil.html` | Configurações de perfil |
| `conf_seguranca.html` | Configurações de segurança (2FA, senha) |
| `conf_preferencias.html` | Preferências do usuário (idioma, moeda base, tema) |

## Assets

- `assets/css/custom-bootstrap.css` — tema escuro customizado do Bootstrap 5.
- `assets/css/main.css` — estilos globais compilados a partir do SCSS.
- `assets/css/main.css.map` — source map do CSS compilado.
- `assets/css/tema.css` — tema claro (overrides .light).

## SCSS

- `scss/` — arquivos-fonte SCSS. Compile com:

```bash
npm run build:css
# ou em modo watch:
npm run dev:css
```

## Scripts JavaScript (lógica da aplicação)

- `scripts/api.js` — lógica principal: mercado interativo, trades, portfólio, conexão de carteira, balance, requisições API (JSON Server + CoinGecko).
- `scripts/validacao.js` — validação de formulários com REGEX (nome, email, telefone, valor).
- `scripts/jquery-init.js` — máscaras de input (telefone, valor) e comportamentos jQuery.

## Scripts de Manutenção

- `scripts/convert.py` — baixa páginas externas, converte classes Tailwind para Bootstrap e salva os arquivos **diretamente na raiz**. Injeta links CDN do Bootstrap e normaliza todos os caminhos relativos.
- `scripts/format_html.py` — formata com indentação todos os HTMLs encontrados na raiz (ignora `node_modules`).

## Dados

- `db.json` — base de dados da API fake (JSON Server), contendo assets, portfolio, market, transactions e summary.

## Configuração

- `package.json` — dependências e scripts npm.
- `.eslintrc.json` — configuração do ESLint.
- `.prettierrc` — configuração do Prettier.

## Como Validar Localmente

1. Instale as dependências Node (para SCSS e ferramentas dev):

```bash
npm install
```

2. Sirva o projeto localmente:

```bash
python3 -m http.server --directory . 8000
```

3. Acesse no navegador:

```
http://localhost:8000/index.html
```

## Deploy — GitHub Pages

O projeto é publicado automaticamente pelo GitHub Pages a partir da branch `main`. Como todos os HTMLs estão na raiz, o `index.html` é servido corretamente como entrada. Nenhum arquivo `CNAME` ou configuração adicional é necessário.

---

Consulte também:
- [docs/prd.md](prd.md) — requisitos e histórias de usuário
- [docs/spec.md](spec.md) — especificação técnica e modelo de dados
- [docs/design-system.md](design-system.md) — sistema de design e paleta de cores