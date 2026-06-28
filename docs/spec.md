# 🛠️ Especificação Técnica (spec.md)

## 📖 Visão Geral

Este documento descreve como o sistema **Crypto Sandbox** é estruturado tecnicamente, incluindo o modelo de dados, as APIs consumidas e a organização do código.

---

## 🗂️ Modelo de Dados (localStorage)

O sistema não possui backend — todos os dados são persistidos no `localStorage` do navegador.

### Chaves localStorage

| Chave | Tipo | Descrição |
|---|---|---|
| `cs_balance` | number | Saldo em USD do usuário |
| `cs_trades` | `Trade[]` | Histórico de transações (compra/venda) |
| `cs_profile` | object | Dados de perfil (nome, email, bio, etc.) |
| `cs_preferences` | object | Preferências (tema, moeda, idioma) |
| `cs_avatar` | string | Avatar em base64 |
| `cs_api_keys` | `string[]` | Chaves de API geradas |
| `cs_sessions` | `Session[]` | Sessões ativas simuladas |
| `cs_devices` | `string[]` | Dispositivos confiáveis |
| `cs_wallet` | string | Endereço da carteira conectada |
| `cs_selected_asset` | string | ID do ativo selecionado no mercado |

### Estrutura `Trade`

```typescript
interface Trade {
  type: 'buy' | 'sell';
  symbol: string;       // BTC, ETH, SOL, etc.
  quantity: number;
  price: number;        // preço unitário em USD
  total: number;        // valor total em USD
  date: string;         // ISO 8601
  status?: 'Concluido' | 'Negada';  // opcional, default 'Concluido'
}
```

---

## 🔧 Tecnologias e Dependências

**Frontend:**
- Bootstrap 5.3.3 — Framework CSS responsivo
- jQuery 4.0.0 — Biblioteca JavaScript para manipulação do DOM

**APIs e Serviços:**
- CoinGecko API v3 — Preços em tempo real (`/simple/price`) e dados históricos (`/coins/{id}/market_chart`)
- ExchangeRate-API v4 — Taxas de câmbio USD/BRL e USD/EUR
- Fetch API — Requisições assíncronas nativas

**Persistência de Dados:**
- Web Storage (localStorage) — Armazenamento local no navegador
- JSON Server 0.17.4 (dev) — API fake REST para dados de assets

---

## 📡 APIs

### CoinGecko

- `GET /simple/price?ids=...&vs_currencies=usd&include_24hr_change=true` — Preços atuais + variação 24h
- `GET /coins/{id}/market_chart?vs_currency=usd&days={n}` — Dados históricos para o gráfico (1, 7 ou 30 dias)

Chamada a cada 30s via `loadRealAPI()` + `startPriceRefresh()`. Cache em `CHART_CACHE` para o gráfico.

### ExchangeRate-API

- `GET https://api.exchangerate-api.com/v4/latest/USD` — Taxas de câmbio atuais

Usada por `toUSD()` (converte valor na moeda do usuário pra USD) e `fmtCurrency()` (formata valores na moeda escolhida).

### JSON Server

- `GET http://localhost:3001/assets` — Lista de ativos com nome, símbolo, imagem e preço

Usado como fallback para dados iniciais; CoinGecko sobrescreve `current_price` e `price_change_percentage_24h`.

---

## 🧠 Lógica do Sistema

### Gráfico do Mercado (`renderChart` / `loadChart`)

1. `fetchChartData(assetId, tf)` — busca dados reais do CoinGecko com cache
2. `samplePrices(prices, targetPoints)` — reduz amostras para ~24 pontos
3. `loadChart(asset, tf)` — função async que renderiza com loading state
4. Fallback para `generateChartData()` se a API falhar (dados aleatórios)
5. SVG inline com gradiente, grade, linha de média e círculo no último ponto
6. Timeframes: 1H/4H/1D → 1 dia, 1S → 7 dias, TUDO → 30 dias

### Trade (`addTrade`)

- Compra: lê campo `valor` → converte pra USD → verifica saldo → debita saldo → registra trade
- Venda: lê campo `quantidade` → verifica saldo do ativo → credita saldo → registra trade
- Saldo insuficiente: registra trade com `status: 'Negada'` (exibido em vermelho)
- Máximo na venda: calculado como `getAssetBalance(symbol) * current_price`

### Portfólio (`renderPortfolioFromTrades`)

- Lê `cs_trades`, computa `balance` e `total_invested` por ativo
- Ignora trades com `status === 'Negada'`
- Calcula P/L, valor atual, alocação (donut chart)
- Re-renderiza a cada 30s com preços atualizados

### Transações (`loadTxFromTrades` / `renderTransactions`)

- Lê `cs_trades`, exibe com paginação (10 por página)
- Filtros por período (30D, 90D, YTD, TUDO) e tipo (Compra/Venda)
- Status "Negada" exibido com bolinha vermelha e texto vermelho
- Filtros resetam pra página 1

### Conexão de Carteira

- Botão "Conectar Carteira" gera endereço `0x...` aleatório
- Usa localStorage + storage event para sync cross-tab
- Puramente cosmético (não envolve blockchain real)

---

## 🧩 Arquivos JavaScript

| Arquivo | Descrição |
|---|---|
| `scripts/api.js` | Lógica principal: mercado, trades, portfólio, wallet, balance, APIs |
| `scripts/validacao.js` | Validação de formulários com REGEX |
| `scripts/jquery-init.js` | Máscaras de input (telefone, valor) |

Funções principais em `api.js`:

| Função | Descrição |
|---|---|
| `loadRealAPI()` | Busca preços CoinGecko + taxas ExchangeRate-API |
| `startPriceRefresh()` | Inicia intervalo de 30s para refresh de preços |
| `loadChart(asset, tf)` | Busca dados históricos e renderiza gráfico |
| `fetchChartData(assetId, tf)` | CoinGecko `/market_chart` com cache |
| `renderPortfolioFromTrades(assets)` | Calcula portfólio a partir de `cs_trades` |
| `loadTxFromTrades(assets)` | Prepara transações paginadas |
| `renderTransactions(txs, summary)` | Renderiza tabela com paginação |
| `addTrade(trade)` | Salva trade em `cs_trades` |
| `getAssetBalance(symbol)` | Calcula saldo de um ativo a partir dos trades |
| `toUSD(val)` | Converte valor na moeda do usuário para USD |
| `fmtCurrency(val)` | Formata valor na moeda do usuário |
