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

  /* ---- Balance management (localStorage, shared across all pages) ---- */
  var BALANCE_KEY = 'cs_balance';

  var CURRENCY_SYMBOLS = {
    USD: '$',
    BRL: 'R$',
    EUR: '€',
  };

  var CURRENCY_RATES = {
    USD: 1,
    BRL: 5.85,
    EUR: 0.92,
  };

  function getCurrency() {
    try {
      var prefs = JSON.parse(localStorage.getItem('cs_preferences') || '{}');
      return prefs.moeda || 'USD';
    } catch (e) { return 'USD'; }
  }

  function fmtCurrency(n) {
    var cur = getCurrency();
    var sym = CURRENCY_SYMBOLS[cur] || '$';
    var rate = CURRENCY_RATES[cur] || 1;
    var val = Number(n) * rate;
    return sym + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function toUSD(n) {
    var cur = getCurrency();
    var rate = CURRENCY_RATES[cur] || 1;
    return Number(n) / rate;
  }

  function syncTradeFormCurrency() {
    var cur = getCurrency();
    var labelEl = document.getElementById('valor-label');
    var suffixEl = document.getElementById('valor-suffix');
    if (labelEl) labelEl.textContent = 'Valor (' + cur + ')';
    if (suffixEl) suffixEl.textContent = cur;
    var sym = currentAsset ? currentAsset.symbol : 'BTC';
    var qtyLabel = document.getElementById('qty-label');
    var qtySuffix = document.getElementById('qty-suffix');
    if (qtyLabel) qtyLabel.textContent = 'Quantidade (' + sym + ')';
    if (qtySuffix) qtySuffix.textContent = sym;
  }

  function getBalance() {
    var saved = localStorage.getItem(BALANCE_KEY);
    if (saved === null) return 0;
    var n = parseFloat(saved);
    return isNaN(n) ? 0 : n;
  }

  function setBalance(val) {
    var n = parseFloat(val);
    if (isNaN(n) || n < 0) n = 0;
    localStorage.setItem(BALANCE_KEY, n);
    syncBalanceUI(n);
    return n;
  }

  function syncBalanceUI(n) {
    var formatted = fmtCurrency(n);
    var els = document.querySelectorAll('.patrimony-value, .balance-big');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = formatted;
    }
  }

  function loadBalance() {
    syncBalanceUI(getBalance());
  }

  /* ---- Wallet connection state ---- */
  var WALLET_KEY = 'cs_wallet';

  function getWallet() {
    try {
      var saved = JSON.parse(localStorage.getItem(WALLET_KEY));
      if (saved && saved.address) return saved;
    } catch (e) {}
    return null;
  }

  function setWallet(obj) {
    localStorage.setItem(WALLET_KEY, JSON.stringify(obj));
    syncWalletUI();
  }

  function disconnectWallet() {
    localStorage.removeItem(WALLET_KEY);
    syncWalletUI();
  }

  function connectWallet(walletName) {
    var chars = '0123456789abcdef';
    var addr = '0x';
    for (var i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * 16)];
    setWallet({ name: walletName, address: addr });
    return addr;
  }

  function syncWalletUI() {
    var btn = document.getElementById('wallet-btn');
    if (!btn) return;
    var wallet = getWallet();
    if (wallet) {
      var short = wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4);
      btn.textContent = short;
      btn.classList.add('connected');
    } else {
      btn.textContent = 'Conectar Carteira';
      btn.classList.remove('connected');
    }
  }

  window.updateBalance = setBalance;
  window.fmtUSD = fmtUSD;
  window.fmtCurrency = fmtCurrency;
  window.getCurrency = getCurrency;
  window.CURRENCY_RATES = CURRENCY_RATES;
  window.connectWallet = connectWallet;
  window.disconnectWallet = disconnectWallet;
  window.getWallet = getWallet;
  window.syncWalletUI = syncWalletUI;

  /* ---- Transaction filter state ---- */
  var allTx = [];
  var allAssets = [];
  var allSummary = null;
  var currentFilter = { period: '30D', type: 'all' };
  var _currentPage = 1;
  var _perPage = 10;

  var FALLBACK_ASSETS = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: '', current_price: 64231.50 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: '', current_price: 3452.80 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', image: '', current_price: 140.05 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', image: '', current_price: 0.62 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', image: '', current_price: 7.85 }
  ];

  var MONTHS = {
    'Jan':0,'Fev':1,'Mar':2,'Abr':3,'Mai':4,'Jun':5,
    'Jul':6,'Ago':7,'Set':8,'Out':9,'Nov':10,'Dez':11
  };

  function parsePTDate(dateStr) {
    var parts = dateStr.replace(',','').split(' ');
    if (parts.length < 3) return new Date(0);
    var m = MONTHS[parts[0]];
    if (m === undefined) return new Date(0);
    return new Date(parseInt(parts[2], 10), m, parseInt(parts[1], 10));
  }

  function inPeriod(date, period) {
    if (period === 'TUDO') return true;
    var now = new Date();
    var diff = (now - date) / (1000 * 60 * 60 * 24);
    if (period === '30D') return diff <= 30;
    if (period === '90D') return diff <= 90;
    if (period === 'YTD') return date.getFullYear() === now.getFullYear();
    return true;
  }

  function applyFilters() {
    _currentPage = 1;
    var filtered = [];
    for (var f = 0; f < allTx.length; f++) {
      var tx = allTx[f];
      if (!inPeriod(parsePTDate(tx.date), currentFilter.period)) continue;
      if (currentFilter.type !== 'all' && tx.type !== currentFilter.type) continue;
      filtered.push(tx);
    }
    renderTransactions(filtered, allSummary);
  }

  /* ---- ID 23: load from JSON Server ---- */
  function loadFakeAPI() {
    var page = document.body.dataset.page;

    if (page === 'portfolio') {
      fetchJSON(FAKE + '/assets').then(function (assets) {
        allAssets = assets;
        renderPortfolioFromTrades(assets);
      }).catch(function () {
        allAssets = FALLBACK_ASSETS;
        renderPortfolioFromTrades(FALLBACK_ASSETS);
      });
    }

    if (page === 'mercado') {
      fetchJSON(FAKE + '/assets').then(function (assets) {
        allAssets = assets;
        if (window.initMercado) window.initMercado(assets);
      }).catch(function () {});
    }

    if (page === 'transacoes') {
      fetchJSON(FAKE + '/assets').then(function (assets) {
        allAssets = assets;
        loadTxFromTrades(assets);
      }).catch(function () {
        allAssets = FALLBACK_ASSETS;
        loadTxFromTrades(FALLBACK_ASSETS);
      });
    }
  }

  /* ---- ID 24: CoinGecko + real exchange rates ---- */
  function loadRealAPI() {
    var ids = 'bitcoin,ethereum,solana,cardano,polkadot';
    var pricePromise = fetchJSON(CG + '/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true');
    var ratePromise = fetchJSON('https://api.exchangerate-api.com/v4/latest/USD').then(function (data) {
      if (data && data.rates) {
        if (data.rates.BRL) CURRENCY_RATES.BRL = data.rates.BRL;
        if (data.rates.EUR) CURRENCY_RATES.EUR = data.rates.EUR;
      }
    }).catch(function () {});

    Promise.all([pricePromise, ratePromise]).then(function (results) {
      var data = results[0];
      if (!data) return;
      var els = document.querySelectorAll('[data-cg]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var id = el.dataset.cg;
        var coin = data[id];
        if (!coin) continue;
        var field = el.dataset.cgField;
        if (field === 'price') el.textContent = fmtCurrency(coin.usd);
        if (field === 'change') {
          var v = coin.usd_24h_change;
          if (v !== undefined) {
            el.textContent = (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
            el.className = v >= 0 ? 'green' : 'red';
          }
        }
      }

      var page = document.body.dataset.page;
      var coinIds = Object.keys(data);
      for (var ci = 0; ci < coinIds.length; ci++) {
        var coinId = coinIds[ci];
        var coin = data[coinId];
        for (var aj = 0; aj < allAssets.length; aj++) {
          if (allAssets[aj].id === coinId) {
            allAssets[aj].current_price = coin.usd;
            if (coin.usd_24h_change !== undefined) {
              allAssets[aj].price_change_percentage_24h = coin.usd_24h_change;
            }
          }
        }
      }

      if (page === 'mercado' && currentAsset) {
        renderAssetUI(currentAsset);
        loadChart(currentAsset, currentTF);
        renderRecentTrades(currentAsset);
        renderPortfolioSummary(currentAsset);
        updateTradeForm(currentAsset);
      }

      if (page === 'portfolio') {
        renderPortfolioFromTrades(allAssets);
      }
    }).catch(function () {});
  }

  var _refreshInterval = null;

  function startPriceRefresh() {
    if (_refreshInterval) return;
    _refreshInterval = setInterval(function () {
      loadRealAPI();
    }, 30000);
  }

  /* ---- Render: Portfolio ---- */
  function renderPortfolio(portfolio, assets) {
    var hasAssets = false;

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
      if (asset.balance > 0) hasAssets = true;
      var tds = row.querySelectorAll('td');
      if (tds.length >= 5) {
        tds[1].textContent = asset.balance > 0 ? asset.balance + ' ' + asset.symbol : '—';
        tds[2].innerHTML = asset.balance > 0 ? '<strong>' + fmtCurrency(asset.current_price * asset.balance) + '</strong>' : '—';
        tds[3].textContent = asset.avg_cost > 0 ? fmtCurrency(asset.avg_cost) : '—';
        var pl = asset.profit_loss;
        var pct = asset.profit_loss_percent;
        if (pl !== 0 || pct !== 0) {
          tds[4].innerHTML = '<div class="' + (pl >= 0 ? 'pnl-up' : 'pnl-down') + '">' + (pl >= 0 ? '+' : '') + fmtCurrency(pl) + '</div><div class="tiny-sub ' + (pl >= 0 ? 'pnl-up' : 'pnl-down') + '">' + (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%</div>';
        } else {
          tds[4].innerHTML = '—';
        }
      }
    }

    if (!hasAssets) {
      var tbody = document.querySelector('.cs-table tbody');
      if (tbody) {
        var rows = tbody.querySelectorAll('tr');
        for (var ri = 0; ri < rows.length; ri++) {
          var tds2 = rows[ri].querySelectorAll('td');
          if (tds2.length >= 5) {
            tds2[1].textContent = '—';
            tds2[2].innerHTML = '—';
            tds2[3].textContent = '—';
            tds2[4].innerHTML = '—';
          }
        }
      }
    }

    /* Gains */
    var gainVal = document.getElementById('gainVal');
    if (gainVal) gainVal.textContent = (portfolio.profit_loss === 0 ? '' : (portfolio.profit_loss >= 0 ? '+' : '')) + fmtCurrency(portfolio.profit_loss);

    var gainPct = document.getElementById('gainPct');
    if (gainPct) gainPct.textContent = portfolio.profit_loss_percent === 0 ? '0.0%' : (portfolio.profit_loss_percent >= 0 ? '+' : '') + portfolio.profit_loss_percent.toFixed(1) + '%';

    var gainIcon = document.getElementById('gainIcon');
    if (gainIcon) {
      gainIcon.textContent = portfolio.profit_loss_percent > 0 ? 'trending_up' : (portfolio.profit_loss_percent < 0 ? 'trending_down' : 'trending_flat');
    }

    var gainBadge = document.getElementById('gainBadge');
    if (gainBadge) {
      if (portfolio.profit_loss_percent > 0) {
        gainBadge.style.background = 'rgba(15, 255, 163, .14)';
        gainBadge.style.color = '#53e7b5';
      } else if (portfolio.profit_loss_percent < 0) {
        gainBadge.style.background = 'rgba(255, 77, 106, .14)';
        gainBadge.style.color = '#ff4d6a';
      } else {
        gainBadge.style.background = 'rgba(255, 255, 255, .06)';
        gainBadge.style.color = 'rgba(255, 255, 255, .42)';
      }
    }

    /* Allocation */
    var allocWrap = document.querySelector('.alloc-wrap');
    if (allocWrap) {
      allocWrap.innerHTML = '';
      var donut = document.createElement('div');
      donut.className = 'alloc-donut';
      allocWrap.appendChild(donut);
      var list = document.createElement('div');
      list.className = 'alloc-list';
      if (portfolio.allocation && portfolio.allocation.length > 0) {
        var gradParts = [];
        var cumPct = 0;
        for (var ga = 0; ga < portfolio.allocation.length; ga++) {
          var pct = parseFloat(portfolio.allocation[ga].percentage);
          gradParts.push(portfolio.allocation[ga].color + ' ' + cumPct.toFixed(1) + '% ' + (cumPct + pct).toFixed(1) + '%');
          cumPct += pct;
        }
        donut.style.background = 'conic-gradient(' + gradParts.join(', ') + ')';
        for (var al = 0; al < portfolio.allocation.length; al++) {
          var item = portfolio.allocation[al];
          var allocRow = document.createElement('div');
          allocRow.className = 'alloc-row' + (al === portfolio.allocation.length - 1 ? ' mb-0' : '');
          allocRow.innerHTML = '<span><span class="alloc-dot" style="background:' + item.color + ';"></span>' + item.name + '</span><strong>' + item.percentage + '%</strong>';
          list.appendChild(allocRow);
        }
      } else {
        donut.style.background = 'rgba(255,255,255,.06)';
        var emptyRow = document.createElement('div');
        emptyRow.className = 'alloc-row';
        emptyRow.innerHTML = '<span><span class="alloc-dot" style="background:rgba(255,255,255,.15);"></span>Nenhum ativo</span><strong>0%</strong>';
        list.appendChild(emptyRow);
      }
      allocWrap.appendChild(list);
    }

    /* Performance Summary */
    var perfInvested = document.getElementById('perfInvested');
    if (perfInvested) perfInvested.textContent = fmtCurrency(portfolio.total_cost);

    var perfCount = document.getElementById('perfCount');
    if (perfCount) {
      var count = 0;
      for (var pc = 0; pc < assets.length; pc++) {
        if (assets[pc].balance > 0) count++;
      }
      perfCount.textContent = count;
    }

    var perfPL = document.getElementById('perfPL');
    if (perfPL) {
      perfPL.textContent = (portfolio.profit_loss === 0 ? '' : (portfolio.profit_loss >= 0 ? '+' : '')) + fmtCurrency(portfolio.profit_loss);
      perfPL.style.color = portfolio.profit_loss > 0 ? '#50e1ad' : (portfolio.profit_loss < 0 ? '#ff4d6a' : 'inherit');
    }

    var perfReturn = document.getElementById('perfReturn');
    if (perfReturn) {
      perfReturn.textContent = (portfolio.profit_loss_percent >= 0 ? '+' : '') + portfolio.profit_loss_percent.toFixed(1) + '%';
      perfReturn.style.color = portfolio.profit_loss_percent > 0 ? '#50e1ad' : (portfolio.profit_loss_percent < 0 ? '#ff4d6a' : 'inherit');
    }
  }

  /* ---- Compute portfolio from trades (localStorage) ---- */
  function renderPortfolioFromTrades(assets) {
    var trades = getTrades();
    var assetMap = {};
    for (var i = 0; i < assets.length; i++) {
      var a = assets[i];
      assetMap[a.symbol] = { name: a.name, symbol: a.symbol, image: a.image, current_price: a.current_price, balance: 0, total_invested: 0 };
    }

    for (var t = 0; t < trades.length; t++) {
      var tr = trades[t];
      if (!assetMap[tr.symbol] || tr.status === 'Negada') continue;
      if (tr.type === 'buy') {
        assetMap[tr.symbol].balance += tr.quantity;
        assetMap[tr.symbol].total_invested += tr.total;
      } else {
        assetMap[tr.symbol].balance -= tr.quantity;
        assetMap[tr.symbol].total_invested -= tr.total;
      }
    }

    var totalValue = 0;
    var totalCost = 0;
    var computedAssets = [];
    var allocation = [];
    var colors = ['#17c6f8','#47d9b3','#f0c7cf','#ffb84d','#a78bfa'];
    var ci = 0;

    for (var sym in assetMap) {
      var ad = assetMap[sym];
      if (ad.balance < 0) ad.balance = 0;
      var currentVal = ad.balance * ad.current_price;
      totalValue += currentVal;
      totalCost += ad.total_invested;

      computedAssets.push({
        name: ad.name, symbol: ad.symbol, image: ad.image,
        balance: ad.balance,
        avg_cost: ad.total_invested > 0 && ad.balance > 0 ? ad.total_invested / ad.balance : 0,
        current_price: ad.current_price,
        profit_loss: currentVal - ad.total_invested,
        profit_loss_percent: ad.total_invested > 0 ? ((currentVal - ad.total_invested) / ad.total_invested) * 100 : 0
      });
    }

    for (var sym in assetMap) {
      var ad2 = assetMap[sym];
      if (ad2.balance > 0 && totalValue > 0) {
        allocation.push({
          name: ad2.name, symbol: ad2.symbol,
          percentage: ((ad2.balance * ad2.current_price / totalValue) * 100).toFixed(1),
          color: colors[ci % colors.length]
        });
        ci++;
      }
    }

    var pl = totalValue - totalCost;
    var plPct = totalCost > 0 ? (pl / totalCost) * 100 : 0;

    renderPortfolio({
      total_value: totalValue,
      total_cost: totalCost,
      profit_loss: pl,
      profit_loss_percent: plPct,
      allocation: allocation
    }, computedAssets);
  }

  /* ---- Render: Market ---- */
  function renderMarket(market) {
    var priceEl = document.querySelector('[data-market-price]');
    if (priceEl) priceEl.textContent = fmtCurrency(market.price);

    var changeEl = document.querySelector('[data-market-change]');
    if (changeEl) {
      changeEl.textContent = (market.change_percent >= 0 ? '+' : '') + market.change_percent + '%';
    }

    var maxEl = document.querySelector('[data-market-max]');
    if (maxEl) maxEl.textContent = 'Máx: ' + fmtCurrency(market.max_amount);

    var estEl = document.getElementById('estimateVal');
    if (estEl) estEl.textContent = (market.price > 0 ? (1 / market.price) : 0).toFixed(8) + ' BTC';

    var feeEl = document.getElementById('feeVal');
    if (feeEl) feeEl.textContent = fmtCurrency(market.price * 0.001);
  }

  /* ---- Mercado page ---- */
  var currentAsset = null;
  var currentTF = '1D';
  var TRADES_KEY = 'cs_trades';
  var SELECTED_KEY = 'cs_selected_asset';
  var TF_LABELS = { '1H': 6, '4H': 8, '1D': 24, '1S': 7, 'TUDO': 30 };

  function getTrades() {
    try { return JSON.parse(localStorage.getItem(TRADES_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function addTrade(trade) {
    var trades = getTrades();
    trade.date = new Date().toISOString();
    trades.push(trade);
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  }

  function getAssetBalance(symbol) {
    var trades = getTrades();
    var bal = 0;
    for (var i = 0; i < trades.length; i++) {
      if (trades[i].symbol === symbol && trades[i].status !== 'Negada') {
        bal += trades[i].type === 'buy' ? trades[i].quantity : -trades[i].quantity;
      }
    }
    return bal;
  }

  var _dropdownAssets = null;

  function buildAssetDropdown(assets) {
    _dropdownAssets = assets;
    var dd = document.getElementById('asset-dropdown');
    if (!dd) return;
    dd.innerHTML = '';
    for (var i = 0; i < assets.length; i++) {
      var a = assets[i];
      var opt = document.createElement('div');
      opt.className = 'asset-option';
      opt.dataset.assetId = a.id;
      opt.innerHTML = '<img src="' + (a.image || '') + '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
        '<span>' + a.name + '</span>' +
        '<span class="opt-symbol">' + a.symbol + '</span>';
      dd.appendChild(opt);
    }
  }

  function selectAsset(asset) {
    currentAsset = asset;
    localStorage.setItem(SELECTED_KEY, asset.id);
    renderAssetUI(asset);
    loadChart(asset, currentTF);
    renderRecentTrades(asset);
    renderPortfolioSummary(asset);
    updateTradeForm(asset);
    updateCGAttributes(asset.id);

    var qtyLabel = document.getElementById('qty-label');
    var qtySuffix = document.getElementById('qty-suffix');
    if (qtyLabel) qtyLabel.textContent = 'Quantidade (' + asset.symbol + ')';
    if (qtySuffix) qtySuffix.textContent = asset.symbol;

    var isBuy = document.getElementById('btnBuy').classList.contains('active-buy');
    var availEl = document.getElementById('qty-available');
    if (availEl) {
      if (isBuy) {
        availEl.textContent = '';
      } else {
        var bal = getAssetBalance(asset.symbol);
        availEl.textContent = 'Disponível: ' + bal.toFixed(8) + ' ' + asset.symbol;
      }
    }
  }

  function renderAssetUI(asset) {
    var nameEl = document.getElementById('asset-name');
    var symEl = document.getElementById('asset-symbol');
    var iconImg = document.getElementById('asset-icon-img');
    var iconDef = document.getElementById('asset-icon-default');
    var priceEl = document.querySelector('[data-market-price]');
    var changeEl = document.querySelector('[data-market-change]');
    var changeIcon = changeEl ? changeEl.querySelector('.material-symbols-outlined') : null;
    if (nameEl) nameEl.textContent = asset.name;
    if (symEl) symEl.textContent = asset.symbol;
    if (iconImg && asset.image) {
      iconImg.src = asset.image;
      iconImg.style.display = '';
      if (iconDef) iconDef.style.display = 'none';
    }
    if (priceEl) priceEl.textContent = fmtCurrency(asset.current_price);
    if (changeEl) {
      var pct = asset.price_change_percentage_24h || 0;
      changeEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
      if (changeIcon) changeIcon.textContent = pct >= 0 ? 'trending_up' : 'trending_down';
    }
  }

  function updateCGAttributes(assetId) {
    var els = document.querySelectorAll('[data-cg]');
    for (var i = 0; i < els.length; i++) {
      els[i].dataset.cg = assetId;
    }
  }

  function updateTradeForm(asset, source) {
    if (window._syncingTradeForm) return;
    window._syncingTradeForm = true;

    var isBuy = document.getElementById('btnBuy').classList.contains('active-buy');

    var maxEl = document.querySelector('[data-market-max]');
    if (maxEl) {
      if (isBuy) {
        maxEl.textContent = 'Máx: ' + fmtCurrency(getBalance());
      } else {
        var sellBal = getAssetBalance(asset.symbol);
        maxEl.textContent = 'Máx: ' + fmtCurrency(sellBal * asset.current_price);
      }
    }
    var valorEl = document.getElementById('valor');
    var qtyEl = document.getElementById('quantidade');

    if (source === 'quantidade' && qtyEl && valorEl && asset && asset.current_price > 0) {
      var rawQty = qtyEl.value || '0';
      var qty = parseFloat(rawQty) || 0;
      var valUSD = qty * asset.current_price;
      var cur = getCurrency();
      var rate = CURRENCY_RATES[cur] || 1;
      valorEl.value = (valUSD * rate).toFixed(2);
    } else if (source === 'valor' && qtyEl && valorEl && asset && asset.current_price > 0) {
      var rawVal = valorEl.value || '0';
      var val = parseFloat(rawVal) || 0;
      var valUSD = toUSD(val);
      qtyEl.value = (valUSD / asset.current_price).toFixed(8);
    }

    var rawVal = (valorEl || {}).value || '0';
    var val = parseFloat(rawVal) || 0;
    var valUSD = toUSD(val);
    var estEl = document.getElementById('estimateVal');
    if (estEl && asset) {
      if (isBuy) {
        estEl.textContent = (asset.current_price > 0 ? (valUSD / asset.current_price) : 0).toFixed(8) + ' ' + asset.symbol;
      } else {
        estEl.textContent = fmtCurrency(valUSD);
      }
    }

    var feeEl = document.getElementById('feeVal');
    if (feeEl && asset) feeEl.textContent = fmtCurrency(asset.current_price * 0.001);

    var availEl = document.getElementById('qty-available');
    if (availEl && asset) {
      if (isBuy) {
        availEl.textContent = '';
      } else {
        var bal = getAssetBalance(asset.symbol);
        availEl.textContent = 'Disponível: ' + bal.toFixed(8) + ' ' + asset.symbol;
      }
    }

    window._syncingTradeForm = false;
  }

  /* ---- Chart: CoinGecko real data ---- */
  var CHART_CACHE = {};
  var DAYS_MAP = { '1H': 1, '4H': 1, '1D': 1, '1S': 7, 'TUDO': 30 };

  function fetchChartData(assetId, tf) {
    var days = DAYS_MAP[tf] || 1;
    var cacheKey = assetId + '_' + days;
    if (CHART_CACHE[cacheKey]) return Promise.resolve(CHART_CACHE[cacheKey]);
    return fetchJSON(CG + '/coins/' + assetId + '/market_chart?vs_currency=usd&days=' + days)
      .then(function (data) {
        CHART_CACHE[cacheKey] = data.prices;
        return data.prices;
      });
  }

  function samplePrices(prices, targetPoints) {
    if (prices.length <= targetPoints) return prices;
    var step = prices.length / targetPoints;
    var result = [];
    for (var i = 0; i < targetPoints; i++) {
      var idx = Math.min(Math.floor(i * step), prices.length - 1);
      result.push(prices[idx]);
    }
    result[result.length - 1] = prices[prices.length - 1];
    return result;
  }

  function loadChart(asset, tf) {
    var wrap = document.getElementById('chart-wrap');
    if (!wrap || !asset) return;
    wrap.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--muted);">Carregando gráfico…</div>';
    fetchChartData(asset.id, tf).then(function (rawPrices) {
      var target = TF_LABELS[tf] || 24;
      var sampled = samplePrices(rawPrices, target);
      renderChart(asset, tf, sampled);
    }).catch(function () {
      var points = TF_LABELS[tf] || 24;
      renderChart(asset, tf, null);
    });
  }

  function renderChart(asset, tf, prices) {
    var wrap = document.getElementById('chart-wrap');
    if (!wrap || !asset) return;
    var points;
    var timestamps = null;
    if (prices) {
      points = prices.length;
      timestamps = prices.map(function (p) { return p[0]; });
      prices = prices.map(function (p) { return p[1]; });
    } else {
      points = TF_LABELS[tf] || 24;
      prices = (function (price, pts) {
        var data = [];
        var vol = price * 0.02;
        var val = price * (1 + (Math.random() - 0.5) * 0.04);
        for (var i = 0; i < pts; i++) {
          val += (Math.random() - 0.48) * vol;
          if (val < price * 0.9) val = price * 0.9;
          if (val > price * 1.1) val = price * 1.1;
          data.push(val);
        }
        data[data.length - 1] = price;
        return data;
      })(asset.current_price, points);
    }
    var h = 280, w = 1000;
    var min = Math.min.apply(null, prices);
    var max = Math.max.apply(null, prices);
    var range = max - min || 1;
    var pad = 20;

    function y(p) { return h - pad - ((p - min) / range) * (h - 2 * pad); }
    function x(i) { return (i / (points - 1)) * w; }

    var pricePath = '';
    var areaPath = '';
    for (var i = 0; i < points; i++) {
      var px = x(i), py = y(prices[i]);
      var cmd = i === 0 ? 'M' : 'L';
      pricePath += cmd + px + ',' + py + ' ';
      areaPath += cmd + px + ',' + py + ' ';
    }
    areaPath += 'L' + w + ',' + h + ' L0,' + h + ' Z';

    var avg = prices.reduce(function (s, v) { return s + v; }, 0) / prices.length;
    var avgY = y(avg);
    var avgPath = 'M0,' + avgY + ' L' + w + ',' + avgY;

    var gridLines = '';
    for (var g = 0; g < 5; g++) {
      var gy = pad + (g / 4) * (h - 2 * pad);
      gridLines += '<line x1="0" y1="' + gy + '" x2="' + w + '" y2="' + gy + '" stroke="rgba(255,255,255,.05)" stroke-width="1" />';
    }

    var lastX = x(points - 1);
    var lastY = y(prices[points - 1]);

    var isUp = prices[points - 1] >= prices[0];
    var lineColor = isUp ? '#00d4ff' : '#ff4d6a';

    wrap.innerHTML =
      '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + lineColor + '" stop-opacity=".28" />' +
      '<stop offset="100%" stop-color="' + lineColor + '" stop-opacity="0" />' +
      '</linearGradient>' +
      '</defs>' +
      gridLines +
      '<path d="' + areaPath + '" fill="url(#grd)" />' +
      '<path d="' + avgPath + '" fill="none" stroke="#0fffa3" stroke-width="1.5" stroke-dasharray="6 4" opacity=".7" />' +
      '<path d="' + pricePath + '" fill="none" stroke="' + lineColor + '" stroke-width="2.2" />' +
      '<circle cx="' + lastX + '" cy="' + lastY + '" r="5" fill="' + lineColor + '" />' +
      '<circle cx="' + lastX + '" cy="' + lastY + '" r="10" fill="' + lineColor + '" opacity=".18" />' +
      '<line x1="' + lastX + '" y1="' + lastY + '" x2="' + lastX + '" y2="' + h + '" stroke="' + lineColor + '" stroke-width="1" stroke-dasharray="4 3" opacity=".25" />' +
      '</svg>';
  }

  function renderRecentTrades(asset) {
    var list = document.getElementById('recent-tx-list');
    var headerSym = document.getElementById('recent-tx-symbol');
    if (headerSym) headerSym.textContent = asset.symbol;
    if (!list) return;
    var trades = getTrades();
    var filtered = [];
    for (var i = trades.length - 1; i >= 0 && filtered.length < 5; i--) {
      if (trades[i].symbol === asset.symbol && trades[i].status !== 'Negada') filtered.push(trades[i]);
    }
    if (filtered.length === 0) {
      list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.82rem;">Nenhuma transação recente de ' + asset.symbol + '.</div>';
      return;
    }
    var html = '';
    for (var j = 0; j < filtered.length; j++) {
      var t = filtered[j];
      var isBuy = t.type === 'buy';
      var d = new Date(t.date);
      var dateStr = d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      html += '<div class="tx-row">' +
        '<div class="d-flex align-items-center gap-3">' +
        '<div class="tx-icon ' + (isBuy ? 'buy' : 'sell') + '">' +
        '<span class="material-symbols-outlined">' + (isBuy ? 'call_received' : 'call_made') + '</span></div>' +
        '<div>' +
        '<div style="font-weight:600;font-size:.88rem;">' + (isBuy ? 'Comprado' : 'Vendido') + ' ' + asset.name + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted);">' + dateStr + '</div></div></div>' +
        '<div class="text-end">' +
        '<div style="font-weight:700;font-size:.88rem;color:' + (isBuy ? 'var(--green)' : 'var(--red)') + ';">' +
        (isBuy ? '+' : '-') + t.quantity.toFixed(4) + ' ' + t.symbol + '</div>' +
        '<div style="font-size:.7rem;color:var(--muted);">' + fmtCurrency(t.total) + '</div></div></div>';
    }
    list.innerHTML = html;
  }

  function renderPortfolioSummary(asset) {
    var symEl = document.getElementById('pf-symbol');
    var balEl = document.getElementById('pf-balance');
    var valEl = document.getElementById('pf-value');
    var plEl = document.getElementById('pf-pl');
    var progEl = document.getElementById('pf-progress');
    if (symEl) symEl.textContent = asset.symbol;
    var balance = getAssetBalance(asset.symbol);
    var value = balance * asset.current_price;
    if (balEl) balEl.textContent = balance.toFixed(4) + ' ' + asset.symbol;
    if (valEl) valEl.textContent = fmtCurrency(value);
    var avgCost = asset.avg_cost || 0;
    var pl = avgCost > 0 ? (asset.current_price - avgCost) * balance : 0;
    if (plEl) {
      plEl.textContent = (pl >= 0 ? '+' : '') + fmtCurrency(pl);
      plEl.style.color = pl >= 0 ? 'var(--green)' : 'var(--red)';
    }
    if (progEl) {
      var pct = avgCost > 0 ? Math.min(Math.abs((asset.current_price - avgCost) / avgCost) * 100, 100) : 0;
      progEl.style.width = pct + '%';
    }
  }

  function setupTimeframes() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.tf-group .tf-btn');
      if (!btn) return;
      var tf = btn.textContent.trim();
      var btns = document.querySelectorAll('.tf-group .tf-btn');
      for (var j = 0; j < btns.length; j++) btns[j].classList.remove('active');
      btn.classList.add('active');
      currentTF = tf;
      if (currentAsset) loadChart(currentAsset, tf);
    });
  }

  function setupTradeToggle() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#btnBuy');
      if (btn) {
        btn.className = 'tab-btn active-buy';
        var sell = document.getElementById('btnSell');
        if (sell) sell.className = 'tab-btn';
        if (currentAsset) updateTradeForm(currentAsset);
        return;
      }
      btn = e.target.closest('#btnSell');
      if (btn) {
        btn.className = 'tab-btn active-sell';
        var buy = document.getElementById('btnBuy');
        if (buy) buy.className = 'tab-btn';
        if (currentAsset) updateTradeForm(currentAsset);
      }
    });
  }

  function setupTradeForm() {
    syncTradeFormCurrency();

    var valorInput = document.getElementById('valor');
    if (valorInput) {
      valorInput.addEventListener('input', function () {
        if (currentAsset) updateTradeForm(currentAsset, 'valor');
      });
    }

    var qtyInput = document.getElementById('quantidade');
    if (qtyInput) {
      qtyInput.addEventListener('input', function () {
        if (currentAsset) updateTradeForm(currentAsset, 'quantidade');
      });
    }

    document.addEventListener('submit', function (e) {
      var confirmBtn = e.target.querySelector('.btn-confirm');
      if (!confirmBtn) return;
      e.preventDefault();
      if (!currentAsset) return;
      var isBuy = document.getElementById('btnBuy').classList.contains('active-buy');
      var balance = getBalance();
      var assetBalance = getAssetBalance(currentAsset.symbol);
      var errorEl = document.getElementById('errorAlert');

      if (isBuy) {
        var rawVal = (document.getElementById('valor') || {}).value || '0';
        var val = parseFloat(rawVal) || 0;
        var valUSD = toUSD(val);
        if (!val || val <= 0) return;
        var qty = valUSD / currentAsset.current_price;
        if (valUSD > balance) {
          if (errorEl) errorEl.style.display = 'flex';
          addTrade({ type: 'buy', symbol: currentAsset.symbol, quantity: qty, price: currentAsset.current_price, total: valUSD, status: 'Negada' });
          return;
        }
        setBalance(balance - valUSD);
        addTrade({ type: 'buy', symbol: currentAsset.symbol, quantity: qty, price: currentAsset.current_price, total: valUSD });
      } else {
        var rawQty = (document.getElementById('quantidade') || {}).value || '0';
        var qty = parseFloat(rawQty) || 0;
        if (!qty || qty <= 0) return;
        if (qty > assetBalance) {
          if (errorEl) errorEl.style.display = 'flex';
          addTrade({ type: 'sell', symbol: currentAsset.symbol, quantity: qty, price: currentAsset.current_price, total: qty * currentAsset.current_price, status: 'Negada' });
          return;
        }
        var valUSD = qty * currentAsset.current_price;
        setBalance(balance + valUSD);
        addTrade({ type: 'sell', symbol: currentAsset.symbol, quantity: qty, price: currentAsset.current_price, total: valUSD });
      }
      if (errorEl) errorEl.style.display = 'none';
      if (document.getElementById('valor')) document.getElementById('valor').value = '';
      if (document.getElementById('quantidade')) document.getElementById('quantidade').value = '';
      updateTradeForm(currentAsset);
      renderRecentTrades(currentAsset);
      renderPortfolioSummary(currentAsset);
    });
  }

  function setupAssetDropdown() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#asset-btn');
      if (btn) {
        e.stopPropagation();
        var dd = document.getElementById('asset-dropdown');
        if (dd) dd.classList.toggle('d-none');
        return;
      }
      var opt = e.target.closest('.asset-option');
      if (opt) {
        var id = opt.dataset.assetId;
        var dd = document.getElementById('asset-dropdown');
        if (dd) dd.classList.add('d-none');
        if (!_dropdownAssets) return;
        for (var j = 0; j < _dropdownAssets.length; j++) {
          if (_dropdownAssets[j].id === id) { selectAsset(_dropdownAssets[j]); break; }
        }
        return;
      }
      var dd = document.getElementById('asset-dropdown');
      if (dd && !e.target.closest('#asset-dropdown')) {
        dd.classList.add('d-none');
      }
    });
  }

  window.initMercado = function (assets) {
    if (!assets || assets.length === 0) return;
    buildAssetDropdown(assets);
    var saved = localStorage.getItem(SELECTED_KEY);
    var idx = 0;
    if (saved) {
      for (var i = 0; i < assets.length; i++) {
        if (assets[i].id === saved) { idx = i; break; }
      }
    }
    selectAsset(assets[idx]);
  };

  /* ---- Load transactions from cs_trades (localStorage) ---- */
  function loadTxFromTrades(assets) {
    var trades = getTrades();
    var assetNames = {};
    var assetImages = {};
    for (var i = 0; i < assets.length; i++) {
      assetNames[assets[i].symbol] = assets[i].name;
      assetImages[assets[i].symbol] = assets[i].image || '';
    }

    var txs = [];
    var now = new Date();
    var thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    var totalBought = 0, totalSold = 0;
    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

    for (var t = 0; t < trades.length; t++) {
      var tr = trades[t];
      var d = new Date(tr.date);
      var dateStr = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      var timeStr = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');

      txs.push({
        date: dateStr,
        time: timeStr,
        asset: assetNames[tr.symbol] || tr.symbol,
        symbol: tr.symbol,
        type: tr.type === 'buy' ? 'Compra' : 'Venda',
        quantity: Number(tr.quantity).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
        value_usd: tr.total,
        status: tr.status || 'Concluido',
        image: assetImages[tr.symbol] || ''
      });

      if (d >= thirtyAgo && tr.status !== 'Negada') {
        if (tr.type === 'buy') totalBought += tr.total;
        else totalSold += tr.total;
      }
    }

    txs.reverse();
    allTx = txs;
    allSummary = {
      total_bought_30d: totalBought,
      total_sold_30d: totalSold,
      total_fees_30d: 0,
      total_transactions: trades.length
    };
    applyFilters();
  }

  /* ---- Render: Transactions ---- */
  function renderTransactions(txs, summary) {
    var tbody = document.querySelector('.tx-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (txs.length === 0) {
      var emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="6" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:.9rem;">Nenhuma transação encontrada.</td>';
      tbody.appendChild(emptyRow);
    } else {
      for (var i = 0; i < txs.length; i++) {
        var tx = txs[i];
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td><div class="date-block"><div class="date-main">' + tx.date + '</div><div class="date-sub">' + tx.time + '</div></div></td>' +
          '<td><div class="asset-cell"><div class="asset-chip">' + (tx.image ? '<img src="' + tx.image + '" alt="" style="width:20px;height:20px;border-radius:50%;" loading="lazy" onerror="this.style.display=\'none\'" />' : '<span class="asset-letter" style="background:rgba(0,212,255,.15);color:var(--cyan);width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;">' + tx.symbol.charAt(0) + '</span>') + '</div><div><div class="asset-name">' + tx.asset + '</div><div class="asset-symbol">' + tx.symbol + '</div></div></div></td>' +
          '<td><span class="type-badge type-' + (tx.type === 'Compra' ? 'buy' : 'sell') + '">' + tx.type + '</span></td>' +
          '<td>' + tx.quantity + ' ' + tx.symbol + '</td>' +
          '<td class="val-cell">' + fmtCurrency(tx.value_usd) + '</td>' +
          '<td style="text-align:center;"><span class="status-wrap status-ok"><span class="status-dot" style="background:' + (tx.status === 'Concluido' ? '#4be0ad' : '#f0c74a') + ';"></span> ' + tx.status + '</span></td>';
        tbody.appendChild(tr);
      }
    }

    if (summary) {
      var totalFiltered = txs.length;
      var totalAll = summary.total_transactions;
      var totalPages = Math.ceil(totalFiltered / _perPage) || 1;
      if (_currentPage > totalPages) _currentPage = totalPages;
      var startIdx = (_currentPage - 1) * _perPage;
      var pageTxs = txs.slice(startIdx, startIdx + _perPage);

      var tbody = document.querySelector('.tx-table tbody');
      if (tbody) {
        tbody.innerHTML = '';
        if (pageTxs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--muted);font-size:.9rem;">Nenhuma transação encontrada.</td></tr>';
        } else {
          for (var pi = 0; pi < pageTxs.length; pi++) {
            var tx = pageTxs[pi];
            var tr = document.createElement('tr');
            tr.innerHTML =
              '<td><div class="date-block"><div class="date-main">' + tx.date + '</div><div class="date-sub">' + tx.time + '</div></div></td>' +
              '<td><div class="asset-cell"><div class="asset-chip">' + (tx.image ? '<img src="' + tx.image + '" alt="" style="width:20px;height:20px;border-radius:50%;" loading="lazy" onerror="this.style.display=\'none\'" />' : '<span style="background:rgba(0,212,255,.15);color:var(--cyan);width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;">' + tx.symbol.charAt(0) + '</span>') + '</div><div><div class="asset-name">' + tx.asset + '</div><div class="asset-symbol">' + tx.symbol + '</div></div></div></td>' +
              '<td><span class="type-badge type-' + (tx.type === 'Compra' ? 'buy' : 'sell') + '">' + tx.type + '</span></td>' +
              '<td>' + tx.quantity + ' ' + tx.symbol + '</td>' +
              '<td class="val-cell">' + fmtCurrency(tx.value_usd) + '</td>' +
'<td style="text-align:center;"><span class="status-wrap status-ok" style="' + (tx.status === 'Negada' ? 'color:#ff4d6a;' : '') + '"><span class="status-dot" style="background:' + (tx.status === 'Concluido' ? '#4be0ad' : tx.status === 'Negada' ? '#ff4d6a' : '#f0c74a') + ';"></span> ' + tx.status + '</span></td>';
            tbody.appendChild(tr);
          }
        }
      }

      var pageInfo = document.querySelector('.page-info');
      if (pageInfo) {
        if (totalAll === 0) {
          pageInfo.textContent = 'mostrando 0 de 0 transações';
        } else {
          var endShow = Math.min(startIdx + _perPage, totalFiltered);
          pageInfo.textContent = 'Mostrando ' + (startIdx + 1) + '–' + endShow + ' de ' + totalFiltered + ' transações';
        }
      }

      var pagination = document.querySelector('.pagination-cs');
      if (pagination) {
        pagination.innerHTML = '';

        if (totalPages > 1) {
          var prevBtn = document.createElement('button');
          prevBtn.className = 'page-btn' + (_currentPage <= 1 ? ' disabled' : '');
          prevBtn.ariaLabel = 'Anterior';
          prevBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:1rem;">chevron_left</span>';
          prevBtn.addEventListener('click', function () {
            if (_currentPage > 1) { _currentPage--; renderTransactions(txs, summary); }
          });
          pagination.appendChild(prevBtn);

          var maxVisible = 5;
          var half = Math.floor(maxVisible / 2);
          var start = Math.max(1, _currentPage - half);
          var end = Math.min(totalPages, start + maxVisible - 1);
          if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

          for (var p = start; p <= end; p++) {
            (function (pageNum) {
              var btn = document.createElement('button');
              btn.className = 'page-btn' + (pageNum === _currentPage ? ' active' : '');
              btn.textContent = pageNum;
              btn.addEventListener('click', function () {
                _currentPage = pageNum;
                renderTransactions(txs, summary);
              });
              pagination.appendChild(btn);
            })(p);
          }

          if (end < totalPages) {
            if (end < totalPages - 1) {
              var dots = document.createElement('span');
              dots.style.cssText = 'color:#6f809d; padding:0 .25rem;';
              dots.textContent = '...';
              pagination.appendChild(dots);
            }
            (function (last) {
              var lastBtn = document.createElement('button');
              lastBtn.className = 'page-btn';
              lastBtn.style.cssText = 'width:auto; padding:0 .45rem;';
              lastBtn.textContent = totalPages;
              lastBtn.addEventListener('click', function () {
                _currentPage = last;
                renderTransactions(txs, summary);
              });
              pagination.appendChild(lastBtn);
            })(totalPages);
          }

          var nextBtn = document.createElement('button');
          nextBtn.className = 'page-btn' + (_currentPage >= totalPages ? ' disabled' : '');
          nextBtn.ariaLabel = 'Próxima';
          nextBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:1rem;">chevron_right</span>';
          nextBtn.addEventListener('click', function () {
            if (_currentPage < totalPages) { _currentPage++; renderTransactions(txs, summary); }
          });
          pagination.appendChild(nextBtn);
        }
      }

      var cards = document.querySelectorAll('.summary-value');
      if (cards.length >= 3) {
        cards[0].textContent = fmtCurrency(summary.total_bought_30d);
        cards[1].textContent = fmtCurrency(summary.total_sold_30d);
        cards[2].textContent = fmtCurrency(summary.total_fees_30d);
      }
    }
  }

  /* ---- Transaction filters ---- */
  function setupTxFilters() {
    var periodBtns = document.querySelectorAll('.period-btn');
    for (var pb = 0; pb < periodBtns.length; pb++) {
      periodBtns[pb].addEventListener('click', function () {
        var parent = this.parentElement;
        var children = parent.children;
        for (var c = 0; c < children.length; c++) {
          children[c].classList.remove('active');
        }
        this.classList.add('active');
        currentFilter.period = this.textContent.trim();
        applyFilters();
      });
    }

    var trigger = document.getElementById('typeTrigger');
    var dropdown = document.getElementById('typeDropdown');
    var label = document.getElementById('typeLabel');

    if (trigger && dropdown) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      var items = dropdown.querySelectorAll('.dropdown-item');
      for (var di = 0; di < items.length; di++) {
        items[di].addEventListener('click', function (e) {
          e.stopPropagation();
          var type = this.dataset.type;
          currentFilter.type = type;
          label.textContent = this.textContent;
          for (var d = 0; d < items.length; d++) items[d].classList.remove('active');
          this.classList.add('active');
          dropdown.classList.remove('open');
          applyFilters();
        });
      }

      document.addEventListener('click', function () {
        dropdown.classList.remove('open');
      });
    }

    /* Export CSV */
    var exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        if (allTx.length === 0) return;
        var lines = ['Data,Hora,Ativo,Símbolo,Tipo,Quantidade,Valor (USD),Status'];
        for (var ex = 0; ex < allTx.length; ex++) {
          var t = allTx[ex];
          lines.push([t.date, t.time, t.asset, t.symbol, t.type, t.quantity, t.value_usd, t.status].join(','));
        }
        var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'transacoes.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  function setupNotifToggle() {
    var panel = document.getElementById('notif-panel');
    if (!panel) return;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#notif-btn');
      if (btn) {
        e.stopPropagation();
        panel.classList.toggle('d-none');
        return;
      }
      if (!e.target.closest('#notif-panel')) {
        panel.classList.add('d-none');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadBalance();
    syncWalletUI();
    loadFakeAPI();
    loadRealAPI();
    startPriceRefresh();

    /* Delegate-based UI setup (works even if fetch fails) */
    setupAssetDropdown();
    setupTimeframes();
    setupTradeToggle();
    setupTradeForm();
    setupTxFilters();
    setupNotifToggle();

    /* Listen for changes from other tabs */
    window.addEventListener('storage', function (e) {
      if (e.key === BALANCE_KEY) loadBalance();
      if (e.key === WALLET_KEY) syncWalletUI();
      if (e.key === TRADES_KEY) {
        if (document.body.dataset.page === 'transacoes') {
          fetchJSON(FAKE + '/assets').then(function (assets) {
            loadTxFromTrades(assets);
          }).catch(function () {
            loadTxFromTrades(FALLBACK_ASSETS);
          });
        }
        if (document.body.dataset.page === 'portfolio') {
          fetchJSON(FAKE + '/assets').then(function (assets) {
            renderPortfolioFromTrades(assets);
          }).catch(function () {
            renderPortfolioFromTrades(FALLBACK_ASSETS);
          });
        }
      }
    });
  });

})();
