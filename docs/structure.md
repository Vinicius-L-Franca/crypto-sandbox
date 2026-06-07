# Estrutura do Repositório — Crypto Sandbox

Este arquivo descreve a organização atual do projeto após a reorganização das páginas e assets.

## Visão geral

- `pages/` — HTML públicos organizados por domínio de funcionalidade.
- `assets/` — folhas de estilo, scripts e imagens usados pelas páginas.
- `scripts/` — utilitários e scripts de manutenção (ex: `convert.py`).
- `docs/` — documentação do produto e arquivos de planejamento.

## Páginas

- `pages/market/`
  - `negociacao.html` — página principal de mercado (gráficos, book, ordens).
  - `conectar_carteira.html` — fluxo para conectar carteira.

- `pages/portfolio/`
  - `portfolio.html` — visão do portfólio do usuário.

- `pages/transactions/`
  - `transacoes.html` — histórico de transações.

- `pages/settings/`
  - `conf_perfil.html` — configurações de perfil.
  - `conf_seguranca.html` — configurações de segurança.
  - `conf_preferencias.html` — preferências do usuário.

## Assets

- `assets/css/custom-bootstrap.css` — tema e utilitários específicos do projeto.
- `assets/js/` — scripts JS do frontend (ainda a povoar).
- `assets/img/` — imagens e logos usados nas páginas.

## Scripts

- `scripts/convert.py` — download e conversão de páginas externas. Foi atualizado para:
  - injetar links relativos para `../../node_modules/...` e `../../assets/css/custom-bootstrap.css` quando gerar páginas dentro de `pages/`;
  - escrever os arquivos convertidos em `pages/market`, `pages/portfolio`, `pages/transactions`, `pages/settings` conforme mapeamento interno.

## Como validar localmente

1. Instale dependências Node (se necessário para assets):

```bash
npm install
```

2. Sirva o projeto localmente:

```bash
python3 -m http.server --directory . 8000
```

3. Acesse uma página exemplo no navegador:

```
http://localhost:8000/pages/market/negociacao.html
```

## Próximos passos sugeridos

- Atualizar `docs/prd.md` e `docs/spec.md` com referências aos novos caminhos de arquivos (posso fazer isso automaticamente se quiser).
- Consolidar assets JS em `assets/js/` e ajustar imports.
- Adicionar um pequeno `README` dentro de `pages/` com instruções específicas de deploy de páginas estáticas.

---

Se quiser que eu atualize também `docs/prd.md` e `docs/spec.md` com um resumo das mudanças, autorizo e executo agora.