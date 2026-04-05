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

- Alimenta a tela de dashboard com preços e variação.
- Permite preencher automaticamente o catálogo de criptomoedas disponíveis para compra/venda.
- Ajuda a validar transações do sandbox com base no preço real no momento da simulação.

---

## 📦 Tecnologias e Dependências

### Frontend
- **Bootstrap 5.3.3** - Framework CSS responsivo com componentes prontos
- **Chart.js 4.4.1** - Biblioteca para gráficos (linha e pizza)
- **Font Awesome 6.5.1** - Ícones SVG escaláveis

### APIs e Serviços
- **CoinGecko API v3** - Dados reais de criptomoedas em tempo real
- **Fetch API (nativa)** - Requisições assíncronas

### Desenvolvimento e Qualidade
- **Node.js 20.x LTS** - Runtime JavaScript
- **npm 10.x** - Gerenciador de pacotes e dependências
- **ESLint 8.56.0** - Linter para qualidade de código
- **Prettier 3.1.1** - Formatador de código automático

### Persistência
- **localStorage (nativo)** - Armazenamento local no navegador
- **JSON Server 0.17.4 (dev)** - API fake para desenvolvimento e testes

---

## ✅ Checklist de Funcionalidades

### 📱 RA1 - Interface e Responsividade
- [ ] ID 01 - Protótipo no Figma (mobile + desktop)
- [ ] ID 02 - Layout responsivo com framework CSS
- [ ] ID 03 - Layout com CSS puro (Flexbox/Grid)
- [ ] ID 04 - Uso de componentes do framework
- [ ] ID 05 - Uso de unidades relativas (%, rem, vw)
- [ ] ID 06 - Aplicação de Design System
- [ ] ID 07 - Uso de SCSS
- [ ] ID 08 - Tipografia responsiva
- [ ] ID 09 - Responsividade de imagens
- [ ] ID 10 - Otimização de imagens

---

### 📝 RA2 - Formulários e Validações
- [ ] ID 11 - Validação HTML nativa
- [ ] ID 12 - Validação com REGEX
- [ ] ID 13 - Uso de checkbox/radio/select
- [ ] ID 14 - Persistência com localStorage

---

### ⚙️ RA3 - Desenvolvimento
- [ ] ID 15 - Configuração com Node/NPM
- [ ] ID 16 - Versionamento com Git/GitHub
- [ ] ID 17 - README padronizado
- [ ] ID 18 - Organização modular do projeto
- [ ] ID 19 - Uso de ESLint/Prettier

---

### 🧠 RA4 - JavaScript e Interatividade
- [ ] ID 20 - Uso de jQuery
- [ ] ID 21 - Plugin jQuery (ex: máscara de input)

---

### 🌐 RA5 - APIs e Requisições
- [ ] ID 22 - Requisições para API fake (JSON Server)
- [ ] ID 23 - Exibição de dados da API fake
- [ ] ID 24 - Integração com API pública (criptomoedas)

---

## 📦 Escopo do Projeto

O sistema contará com pelo menos:

- 🏠 Página inicial (dashboard com preços)
- 💰 Página de compra/venda
- 📊 Página de carteira (portfólio do usuário)

---

## 📱 Páginas da Aplicação

1. **Dashboard** - Visão geral do mercado com gráfico de preços
2. **Mercado** - Lista de criptomoedas com opções de compra e venda
3. **Portfólio** - Carteira do usuário com distribuição de ativos (gráfico pizza)
4. **Transações** - Histórico de compras e vendas
5. **Configurações** - Preferências, segurança e perfil do usuário

---

## 🎨 Componentes Visuais

- 📈 Gráficos de linha (evolução de preços no mercado)
- 🥧 Gráficos de pizza (distribuição de ativos no portfólio)
- 🔐 Painel de Segurança (2FA, senha, autenticação biométrica)
- ⚙️ Preferências (idioma, moeda base, precision view)

---

## 🚀 Instruções de Execução

1. Clone o repositório:
```bash
git clone https://github.com/Vinicius-L-Franca/crypto-sandbox
```