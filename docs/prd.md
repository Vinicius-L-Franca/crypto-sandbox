# 📄 Product Requirements Document (PRD)

## 👤 Identificação

- **Autor:** Vinicius Liepienski de França
- **Projeto:** Crypto Sandbox
- **Tema:** Simulador de compra e venda de criptomoedas

---

## 📖 Descrição

O **Crypto Sandbox** é uma aplicação web que simula o mercado de criptomoedas, permitindo que usuários realizem operações de compra e venda utilizando valores reais de mercado, porém sem envolver dinheiro de verdade.

O sistema tem como propósito oferecer um ambiente seguro para aprendizado e experimentação no mercado financeiro, permitindo que usuários entendam como funcionam investimentos em criptomoedas, acompanhem variações de preço e gerenciem um portfólio fictício.

O problema que o sistema busca resolver é a dificuldade de iniciantes entrarem no mercado de criptomoedas sem conhecimento prévio, evitando riscos financeiros reais.

---

## 👥 Atores do Sistema

- **Visitante**
  - Usuário que acessa a aplicação sem autenticação
  - Pode visualizar preços e informações básicas

- **Usuário (Simulado)**
  - Usuário que utiliza o sistema para simular operações
  - Pode comprar, vender e gerenciar sua carteira

---

## 📚 Histórias de Usuário (User Stories)

### 📊 Visualização de Mercado

- Como visitante, eu quero visualizar os preços atualizados das criptomoedas para acompanhar o mercado.
- Como visitante, eu quero ver a variação de preço (alta/baixa) para entender tendências.
- Como visitante, eu quero ver gráficos com dados históricos reais do CoinGecko para analisar tendências.

---

### 💸 Compra de Criptomoedas

- Como usuário, eu quero comprar criptomoedas informando o valor desejado para simular um investimento.
- Como usuário, eu quero validar os dados do formulário para evitar erros na operação.
- Como usuário, eu quero ver meu saldo atualizado após a compra para acompanhar meus investimentos.
- Como usuário, eu quero que tentativas com saldo insuficiente sejam registradas no histórico como "Negada".

---

### 💰 Venda de Criptomoedas

- Como usuário, eu quero vender criptomoedas da minha carteira para simular lucro ou prejuízo.
- Como usuário, eu quero escolher qual ativo vender para ter controle sobre minha carteira.
- Como usuário, eu quero visualizar o valor recebido na venda para acompanhar resultados.
- Como usuário, eu quero que o valor máximo de venda seja calculado com base na quantidade de moedas que possuo.

---

### 📈 Carteira (Portfólio)

- Como usuário, eu quero visualizar minha carteira de criptomoedas para acompanhar meus ativos.
- Como usuário, eu quero ver o valor total investido para entender meu desempenho.
- Como usuário, eu quero ver o valor atual da carteira com base no mercado para acompanhar lucros/prejuízos.
- Como usuário, eu quero que o portfólio seja calculado a partir do histórico real de trades (localStorage), não de dados fixos.
- Como usuário, eu quero clicar no "Patrimônio Total" para ir direto ao portfólio.
- Como usuário, eu quero ver uma mensagem informando que os valores são fictícios e editáveis.

---

### 🧾 Histórico de Transações

- Como usuário, eu quero visualizar meu histórico de compras e vendas para acompanhar minhas operações.
- Como usuário, eu quero identificar data, tipo e valor das transações para análise.
- Como usuário, eu quero paginação (10 por página) e filtros por período/tipo.
- Como usuário, eu quero ver transações negadas (saldo insuficiente) destacadas em vermelho.

---

### 🔄 Integração com API

- Como sistema, eu quero consumir a CoinGecko API para obter dados reais de preços e histórico de gráficos.
- Como sistema, eu quero consumir a ExchangeRate-API para converter valores entre USD, BRL e EUR.
- Como sistema, eu quero atualizar os dados automaticamente a cada 30 segundos.

---

### 💾 Persistência de Dados

- Como usuário, eu quero que meus dados sejam salvos no navegador para não perder minhas informações.
- Como sistema, eu quero armazenar dados no localStorage (cs_balance, cs_trades, cs_profile, cs_preferences, etc.).

---

### 📱 Responsividade

- Como usuário, eu quero acessar o sistema pelo celular ou computador para ter flexibilidade de uso.
- Como usuário, eu quero que a interface se adapte ao tamanho da tela para melhor usabilidade.

---

### ⚙️ Configurações e Segurança

- Como usuário, eu quero alterar meu perfil e preferências para personalizar a experiência.
- Como usuário, eu quero ativar autenticação 2FA para proteger minha conta.
- Como usuário, eu quero escolher entre autenticação biométrica ou por OTP.
- Como usuário, eu quero selecionar o idioma e a moeda base da aplicação.
- Como usuário, eu quero uma "Zona de Perigo" com botão para limpar todos os dados (accordion colapsável).

---

## 📌 Observações

Este sistema não realiza transações reais e tem finalidade exclusivamente educacional, simulando operações com criptomoedas para aprendizado do usuário.
