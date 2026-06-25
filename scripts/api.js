(function () {
  'use strict';

  var FAKE = 'http://localhost:3001';
  var CG = 'https://api.coingecko.com/api/v3';

  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function fmtUSD(n) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---- ID 23: load from JSON Server ---- */
  function loadFakeAPI() {
    var page = document.body.dataset.page;

    if (page === 'portfolio') {
      Promise.all([
        fetchJSON(FAKE + '/portfolio'),
        fetchJSON(FAKE + '/assets'),
      ]).then(function (d) { renderPortfolio(d[0], d[1]); })
        .catch(function () { /* use static data */ });
    }

    if (page === 'negociacao') {
      fetchJSON(FAKE + '/market').then(renderMarket)
        .catch(function () {});
    }

    if (page === 'transacoes') {
      Promise.all([
        fetchJSON(FAKE + '/transactions'),
        fetchJSON(FAKE + '/summary'),
      ]).then(function (d) { renderTransactions(d[0], d[1]); })
        .catch(function () {});
    }
  }

  /* ---- ID 24: CoinGecko ---- */
  function loadRealAPI() {
    var ids = 'bitcoin,ethereum,solana,cardano,polkadot';
    fetchJSON(CG + '/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true')
      .then(function (data) {
        var els = document.querySelectorAll('[data-cg]');
        for (var i = 0; i < els.length; i++) {
          var el = els[i];
          var id = el.dataset.cg;
          var coin = data[id];
          if (!coin) continue;
          var field = el.dataset.cgField;
          if (field === 'price') el.textContent = fmtUSD(coin.usd);
          if (field === 'change') {
            var v = coin.usd_24h_change;
            if (v !== undefined) {
              el.textContent = (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
              el.className = v >= 0 ? 'green' : 'red';
            }
          }
        }
      })
      .catch(function () {});
  }

  /* ---- Render: Portfolio ---- */
  function renderPortfolio(portfolio, assets) {
    var valueEl = document.querySelector('.balance-big');
    if (valueEl) valueEl.textContent = fmtUSD(portfolio.total_value);

    var plEl = document.querySelector('.gain-note b');
    if (plEl) plEl.textContent = (portfolio.profit_loss >= 0 ? '+' : '') + fmtUSD(portfolio.profit_loss);

    var gainEl = document.querySelector('.gain-badge');
    if (gainEl) {
      var pctNode = gainEl.childNodes[2];
      if (pctNode) pctNode.textContent = (portfolio.profit_loss_percent >= 0 ? '+' : '') + portfolio.profit_loss_percent.toFixed(1) + '%';
    }

    var rows = document.querySelectorAll('.cs-table tbody tr');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var nameEl = row.querySelector('.coin-main');
      if (!nameEl) continue;
      var name = nameEl.textContent.trim();
      var asset = null;
      for (var a = 0; a < assets.length; a++) {
        if (assets[a].name === name) { asset = assets[a]; break; }
      }
      if (!asset) continue;
      var tds = row.querySelectorAll('td');
      if (tds.length >= 5) {
        tds[1].textContent = asset.balance + ' ' + asset.symbol;
        tds[2].innerHTML = '<strong>' + fmtUSD(asset.current_price * asset.balance) + '</strong>';
        tds[3].textContent = fmtUSD(asset.avg_cost);
        var pl = asset.profit_loss;
        var pct = asset.profit_loss_percent;
        tds[4].innerHTML = '<div class="' + (pl >= 0 ? 'pnl-up' : 'pnl-down') + '">' + (pl >= 0 ? '+' : '') + fmtUSD(pl) + '</div><div class="tiny-sub ' + (pl >= 0 ? 'pnl-up' : 'pnl-down') + '">' + (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%</div>';
      }
    }
  }

  /* ---- Render: Market ---- */
  function renderMarket(market) {
    var priceEl = document.querySelector('[data-market-price]');
    if (priceEl) priceEl.textContent = fmtUSD(market.price);

    var changeEl = document.querySelector('[data-market-change]');
    if (changeEl) {
      changeEl.textContent = (market.change_percent >= 0 ? '+' : '') + market.change_percent + '%';
    }

    var maxEl = document.querySelector('[data-market-max]');
    if (maxEl) maxEl.textContent = 'Máx: ' + fmtUSD(market.max_amount);

    var estEl = document.getElementById('estimateVal');
    if (estEl) estEl.textContent = (market.price > 0 ? (1 / market.price) : 0).toFixed(8) + ' BTC';

    var feeEl = document.getElementById('feeVal');
    if (feeEl) feeEl.textContent = fmtUSD(market.price * 0.001);
  }

  /* ---- Render: Transactions ---- */
  function renderTransactions(txs, summary) {
    var tbody = document.querySelector('.tx-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    for (var i = 0; i < txs.length; i++) {
      var tx = txs[i];
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><div class="date-block"><div class="date-main">' + tx.date + '</div><div class="date-sub">' + tx.time + '</div></div></td>' +
        '<td><div class="asset-cell"><div class="asset-chip"><span class="material-symbols-outlined" style="font-size:1rem;">currency_bitcoin</span></div><div><div class="asset-name">' + tx.asset + '</div><div class="asset-symbol">' + tx.symbol + '</div></div></div></td>' +
        '<td><span class="type-badge type-' + (tx.type === 'Compra' ? 'buy' : 'sell') + '">' + tx.type + '</span></td>' +
        '<td>' + tx.quantity + ' ' + tx.symbol + '</td>' +
        '<td class="val-cell">' + fmtUSD(tx.value_usd) + '</td>' +
        '<td style="text-align:center;"><span class="status-wrap status-ok"><span class="status-dot" style="background:' + (tx.status === 'Concluido' ? '#4be0ad' : '#f0c74a') + ';"></span> ' + tx.status + '</span></td>';
      tbody.appendChild(tr);
    }

    if (summary) {
      var pageInfo = document.querySelector('.page-info');
      if (pageInfo) pageInfo.textContent = 'Mostrando ' + txs.length + ' de ' + summary.total_transactions + ' transações';

      var cards = document.querySelectorAll('.summary-value');
      if (cards.length >= 3) {
        cards[0].textContent = fmtUSD(summary.total_bought_30d);
        cards[1].textContent = fmtUSD(summary.total_sold_30d);
        cards[2].textContent = fmtUSD(summary.total_fees_30d);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadFakeAPI();
    loadRealAPI();
  });

})();
