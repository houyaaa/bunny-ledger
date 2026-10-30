(function () {
  'use strict';

  // ---------- 기본 데이터 ----------
  var ICONS = {
    food: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M8 7c0-1.5 1-1.5 1-3M12 7c0-1.5 1-1.5 1-3M16 7c0-1.5 1-1.5 1-3"/>',
    cafe: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 3c0 1.5-1 1.5-1 3M12.5 3c0 1.5-1 1.5-1 3"/>',
    trans: '<rect x="5" y="4" width="14" height="13" rx="3"/><path d="M5 11h14"/><circle cx="8.5" cy="14" r=".8"/><circle cx="15.5" cy="14" r=".8"/><path d="M8 17v2M16 17v2"/>',
    shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    life: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
    util: '<path d="M13.5 3 6 13.2h5.2L10.4 21l7.6-10.4h-5.3z"/>',
    med: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
    beauty: '<circle cx="7" cy="17" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M8.8 15.2 17 4M15.2 15.2 7 4"/>',
    edu: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 13h16M12 9v11"/><path d="M12 9c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1"/>',
    etc: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
    tag: '<path d="M4 12.5V5h7.5l8.5 8.5-7.5 7.5z"/><circle cx="8.3" cy="9.2" r="1.2"/>',
    plus: '<path d="M12 5.2v13.6M5.3 12.1h13.4"/>',
    x: '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>'
  };
  var BASE_CATS = [
    { id: 'food', name: '식비', color: '#FFD6BA' },
    { id: 'cafe', name: '카페', color: '#FFEFA6' },
    { id: 'trans', name: '교통', color: '#CFE6F7' },
    { id: 'shop', name: '쇼핑', color: '#F9CDE0' },
    { id: 'life', name: '생활', color: '#CFEFD9' },
    { id: 'util', name: '공과금', color: '#C7ECEA' },
    { id: 'med', name: '의료', color: '#FBD3D0' },
    { id: 'beauty', name: '미용', color: '#F6D5F0' },
    { id: 'edu', name: '교육', color: '#E4F2B8' },
    { id: 'gift', name: '선물', color: '#DDD4F6' },
    { id: 'etc', name: '기타', color: '#ECE6DA' }
  ];
  var PALETTE = [
    ['#FFD6BA', '복숭아'], ['#FFEFA6', '버터'], ['#CFE6F7', '하늘'], ['#F9CDE0', '분홍'],
    ['#CFEFD9', '민트'], ['#C7ECEA', '청록'], ['#DDD4F6', '라벤더'], ['#E4F2B8', '연두']
  ];
  var UP_BG = '#FBD3D0', DOWN_BG = '#CFE6F7', SAME_BG = '#ECE6DA';
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];

  // ---------- 저장 ----------
  var KEY_ENTRIES = 'nakseo.entries.v1';
  var KEY_CATS = 'nakseo.customCats.v1';
  var KEY_LASTCAT = 'nakseo.lastCat.v1';

  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function store(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { toast('저장하지 못했어요. 저장 공간을 확인해 주세요.'); return false; }
  }

  var entries = load(KEY_ENTRIES, []);
  var customCats = load(KEY_CATS, []);
  if (!Array.isArray(entries)) entries = [];
  if (!Array.isArray(customCats)) customCats = [];

  function saveAll() { store(KEY_ENTRIES, entries); store(KEY_CATS, customCats); }

  // ---------- 도우미 ----------
  var $ = function (id) { return document.getElementById(id); };
  function fmt(n) { return Number(n || 0).toLocaleString('ko-KR'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function todayStr() { var t = new Date(); return ymd(t.getFullYear(), t.getMonth(), t.getDate()); }
  function parseYmd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function svgIcon(key, size) {
    size = size || 22;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[key] || ICONS.tag) + '</svg>';
  }
  function allCats() { return BASE_CATS.concat(customCats); }
  function catOf(id) {
    var list = allCats();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return { id: id, name: '기타', color: '#ECE6DA' };
  }
  function iconKey(cat) { return ICONS[cat.id] ? cat.id : 'tag'; }
  function monthEntries(y, m) {
    var prefix = y + '-' + pad(m + 1) + '-';
    return entries.filter(function (e) { return e.date.indexOf(prefix) === 0; });
  }
  function sumBy(list, keyFn) {
    var out = {};
    list.forEach(function (e) { var k = keyFn(e); out[k] = (out[k] || 0) + e.amount; });
    return out;
  }
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  // ---------- 상태 ----------
  var now = new Date();
  var view = { y: now.getFullYear(), m: now.getMonth() };
  var sheetDate = null;
  var selCat = load(KEY_LASTCAT, 'food');
  var newColor = '#C7ECEA';
  var compareOpen = false;

  // ---------- 홈 ----------
  function renderHome() {
    var y = view.y, m = view.m;
    $('monthLabel').textContent = y + '년 ' + (m + 1) + '월';

    var list = monthEntries(y, m);
    var total = list.reduce(function (s, e) { return s + e.amount; }, 0);
    var byDay = sumBy(list, function (e) { return e.date; });
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var t = new Date();
    var isCurrent = t.getFullYear() === y && t.getMonth() === m;
    var isFuture = new Date(y, m, 1) > t;
    var elapsed = isCurrent ? t.getDate() : (isFuture ? 0 : daysInMonth);
    var recDays = Object.keys(byDay).length;

    $('monthTotal').textContent = fmt(total);
    $('monthSub').textContent = recDays
      ? '하루 평균 ' + fmt(elapsed ? Math.round(total / elapsed) : 0) + '원 · ' + recDays + '일 기록했어요'
      : '아직 기록이 없어요. 날짜를 눌러 적어봐요';

    // 날짜별 가장 많이 쓴 카테고리
    var topCat = {};
    var byDayCat = {};
    list.forEach(function (e) {
      byDayCat[e.date] = byDayCat[e.date] || {};
      byDayCat[e.date][e.cat] = (byDayCat[e.date][e.cat] || 0) + e.amount;
    });
    Object.keys(byDayCat).forEach(function (d) {
      var best = null, bestV = -1;
      Object.keys(byDayCat[d]).forEach(function (c) { if (byDayCat[d][c] > bestV) { bestV = byDayCat[d][c]; best = c; } });
      topCat[d] = best;
    });

    var first = new Date(y, m, 1).getDay();
    var today = todayStr();
    var html = '';
    for (var b = 0; b < first; b++) html += '<div class="cell-blank" aria-hidden="true"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var key = ymd(y, m, d);
      var dow = (first + d - 1) % 7;
      var amt = byDay[key] || 0;
      var dotColor = amt ? catOf(topCat[key]).color : 'transparent';
      var numColor = dow === 0 ? 'var(--sun)' : (dow === 6 ? 'var(--sat)' : 'var(--ink)');
      var cls = 'cell' + (key === today ? ' today' : '') + (key === sheetDate ? ' selected' : '');
      html += '<button type="button" class="' + cls + '" data-date="' + key + '" aria-label="' + (m + 1) + '월 ' + d + '일' + (amt ? ', ' + fmt(amt) + '원' : '') + ' 기록하기">' +
        '<span class="num" style="color:' + numColor + '">' + d + '</span>' +
        '<span class="dot' + (amt ? ' on' : '') + '" style="background:' + dotColor + '"></span>' +
        '<span class="amt">' + (amt ? fmt(amt) : '') + '</span></button>';
    }
    $('calGrid').innerHTML = html;

    // 오늘 기록
    var td = parseYmd(today);
    $('todayTitle').textContent = '오늘 · ' + (td.getMonth() + 1) + '월 ' + td.getDate() + '일';
    var todays = entries.filter(function (e) { return e.date === today; });
    var tTotal = todays.reduce(function (s, e) { return s + e.amount; }, 0);
    $('todayTotal').textContent = tTotal ? fmt(tTotal) + '원' : '';
    $('todayList').innerHTML = todays.length
      ? todays.map(function (e) { return entryRow(e, false); }).join('')
      : '<li class="empty"><img src="img/bunny-lying.png" alt="">오늘은 아직 쓴 돈이 없어요</li>';
  }

  function entryRow(e, withDelete) {
    var c = catOf(e.cat);
    return '<li class="entry">' +
      '<span class="ico" style="background:' + c.color + '">' + svgIcon(iconKey(c), 20) + '</span>' +
      '<span class="name">' + esc(c.name) + '</span>' +
      '<span class="val">' + fmt(e.amount) + '원</span>' +
      (withDelete ? '<button type="button" class="del" data-del="' + e.id + '" aria-label="' + esc(c.name) + ' ' + fmt(e.amount) + '원 지우기">' + svgIcon('x', 18) + '</button>' : '') +
      '</li>';
  }

  // ---------- 기록 시트 ----------
  function openSheet(date) {
    sheetDate = date;
    var d = parseYmd(date);
    $('sheetTitle').textContent = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + DOW[d.getDay()] + '요일';
    $('amountInput').value = '';
    closeAddForm();
    if (!allCats().some(function (c) { return c.id === selCat; })) selCat = 'food';
    renderSheet();
    $('sheetWrap').hidden = false;
    document.body.style.overflow = 'hidden';
    renderHome();
  }
  function closeSheet() {
    $('sheetWrap').hidden = true;
    document.body.style.overflow = '';
    sheetDate = null;
    renderHome();
  }
  function renderSheet() {
    var list = entries.filter(function (e) { return e.date === sheetDate; });
    $('sheetList').innerHTML = list.map(function (e) { return entryRow(e, true); }).join('');
    $('sheetList').hidden = !list.length;
    var c = catOf(selCat);
    $('selChip').textContent = c.name;
    $('selChip').style.background = c.color;
    renderCats();
  }
  function renderCats() {
    var html = allCats().map(function (c) {
      var on = c.id === selCat;
      var custom = !ICONS[c.id];
      return '<button type="button" class="cat" data-cat="' + c.id + '"' + (custom ? ' data-custom="1"' : '') +
        ' aria-pressed="' + on + '" style="background:' + (on ? c.color : 'var(--card)') + '">' +
        svgIcon(iconKey(c)) + '<span class="label">' + esc(c.name) + '</span></button>';
    }).join('');
    html += '<button type="button" class="cat add" id="addCatBtn" aria-expanded="' + !$('addForm').hidden + '">' + svgIcon('plus') + '<span class="label">추가</span></button>';
    $('catGrid').innerHTML = html;
  }
  function renderSwatches() {
    $('swatchRow').innerHTML = PALETTE.map(function (p) {
      return '<button type="button" class="swatch" data-color="' + p[0] + '" aria-label="' + p[1] + ' 색" aria-pressed="' + (p[0] === newColor) + '" style="background:' + p[0] + '"></button>';
    }).join('');
  }
  function openAddForm() {
    $('addForm').hidden = false;
    renderSwatches();
    renderCats();
    $('newCatName').value = '';
    setTimeout(function () { $('newCatName').focus(); $('addForm').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 30);
  }
  function closeAddForm() { $('addForm').hidden = true; }

  function saveEntry() {
    var amount = parseInt(($('amountInput').value || '').replace(/[^0-9]/g, ''), 10);
    if (!amount) { toast('금액을 적어주세요'); $('amountInput').focus(); return; }
    entries.push({ id: 'e' + Date.now() + Math.random().toString(36).slice(2, 6), date: sheetDate, cat: selCat, amount: amount });
    store(KEY_LASTCAT, selCat);
    if (store(KEY_ENTRIES, entries)) toast(catOf(selCat).name + ' ' + fmt(amount) + '원 기록했어요');
    closeSheet();
  }

  // ---------- 통계 ----------
  function renderStats() {
    var y = view.y, m = view.m;
    $('statsTitle').textContent = (m + 1) + '월 통계';
    var cur = sumBy(monthEntries(y, m), function (e) { return e.cat; });
    var py = m === 0 ? y - 1 : y, pm = m === 0 ? 11 : m - 1;
    var prev = sumBy(monthEntries(py, pm), function (e) { return e.cat; });
    var total = Object.keys(cur).reduce(function (s, k) { return s + cur[k]; }, 0);
    var prevTotal = Object.keys(prev).reduce(function (s, k) { return s + prev[k]; }, 0);
    $('statsTotal').textContent = fmt(total);

    // 원그래프
    var slices = Object.keys(cur).map(function (k) { var c = catOf(k); return { name: c.name, color: c.color, amt: cur[k] }; })
      .sort(function (a, b) { return b.amt - a.amt; });
    if (slices.length > 8) {
      var rest = slices.slice(7).reduce(function (s, x) { return s + x.amt; }, 0);
      slices = slices.slice(0, 7).concat([{ name: '그 외', color: '#ECE6DA', amt: rest }]);
    }
    if (!total) {
      $('pieWrap').innerHTML = '<div class="chart-empty"><img src="img/bunny-paper.png" alt="">이 달에는 아직 기록이 없어요</div>';
      $('topText').innerHTML = '';
    } else {
      $('pieWrap').innerHTML = pieSvg(slices, total);
      $('topText').innerHTML = esc(slices[0].name) + '에 제일 많이 썼어요';
    }

    // 지난달 대비
    var diff = total - prevTotal;
    var diffPct = prevTotal ? Math.abs(diff / prevTotal * 100).toFixed(1) : null;
    var chip = $('diffChip');
    if (!prevTotal && !total) { chip.textContent = '기록이 없어요'; chip.style.background = SAME_BG; }
    else if (!prevTotal) { chip.textContent = (pm + 1) + '월 기록이 없어요'; chip.style.background = SAME_BG; }
    else if (diff < 0) { chip.textContent = '▼ ' + fmt(-diff) + '원 덜 씀 (−' + diffPct + '%)'; chip.style.background = DOWN_BG; }
    else if (diff > 0) { chip.textContent = '▲ ' + fmt(diff) + '원 더 씀 (+' + diffPct + '%)'; chip.style.background = UP_BG; }
    else { chip.textContent = (pm + 1) + '월과 같아요'; chip.style.background = SAME_BG; }

    var mx = Math.max(total, prevTotal) || 1;
    var keys = Object.keys(cur);
    Object.keys(prev).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
    keys.sort(function (a, b) { return (cur[b] || 0) - (cur[a] || 0) || (prev[b] || 0) - (prev[a] || 0); });
    var rows = keys.map(function (k) {
      var c = catOf(k), a = cur[k] || 0, p = prev[k] || 0, d = a - p;
      var pctText = p ? ((d > 0 ? '+' : '') + (d / p * 100).toFixed(1) + '%') : '새로';
      var bg = d > 0 ? UP_BG : (d < 0 ? DOWN_BG : SAME_BG);
      return '<div class="cmp-row"><span class="sw" style="background:' + c.color + '"></span>' +
        '<span class="cmp-name">' + esc(c.name) + '</span>' +
        '<span class="cmp-flow">' + fmt(p) + ' → ' + fmt(a) + '</span>' +
        '<span class="delta" style="background:' + bg + '"><span class="d">' + (d > 0 ? '▲ ' : (d < 0 ? '▼ ' : '')) + fmt(Math.abs(d)) + '원</span><span class="p">' + pctText + '</span></span></div>';
    }).join('');
    $('comparePanel').innerHTML =
      '<div class="bars">' +
      '<span class="muted">' + (pm + 1) + '월</span><span class="bar"><span style="width:' + (prevTotal / mx * 100).toFixed(1) + '%;background:#ECE6DA"></span></span><span class="right muted">' + fmt(prevTotal) + '원</span>' +
      '<span class="strong">' + (m + 1) + '월</span><span class="bar"><span style="width:' + (total / mx * 100).toFixed(1) + '%;background:var(--butter)"></span></span><span class="right strong">' + fmt(total) + '원</span>' +
      '</div><div>' + rows + '</div>';
    $('comparePanel').hidden = !compareOpen;
    $('compareBtn').setAttribute('aria-expanded', String(compareOpen));
  }

  function pieSvg(slices, total) {
    var W = 340, H = 300, cx = 170, cy = 150, r = 76;
    var a0 = -Math.PI / 2;
    var items = slices.map(function (s) {
      var frac = s.amt / total;
      var a1 = a0 + frac * Math.PI * 2;
      var mid = (a0 + a1) / 2;
      var it = { s: s, frac: frac, a0: a0, a1: a1, c: Math.cos(mid), sn: Math.sin(mid) };
      it.side = it.c >= 0 ? 1 : -1;
      it.y = cy + (r + 24) * it.sn;
      a0 = a1;
      return it;
    });
    [1, -1].forEach(function (side) {
      var g = items.filter(function (it) { return it.side === side; }).sort(function (a, b) { return a.y - b.y; });
      var gap = Math.min(48, (H - 48) / Math.max(g.length - 1, 1));
      var top = 24, bottom = H - 24;
      for (var i = 0; i < g.length; i++) {
        if (g[i].y < top) g[i].y = top;
        if (i > 0 && g[i].y < g[i - 1].y + gap) g[i].y = g[i - 1].y + gap;
      }
      for (var j = g.length - 1; j >= 0; j--) {
        if (g[j].y > bottom) g[j].y = bottom;
        if (j < g.length - 1 && g[j].y > g[j + 1].y - gap) g[j].y = g[j + 1].y - gap;
      }
    });
    var paths = '', leads = '', texts = '', aria = [];
    items.forEach(function (it) {
      if (it.frac >= 0.9999) {
        paths += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + it.s.color + '"/>';
      } else {
        var x1 = cx + r * Math.cos(it.a0), y1 = cy + r * Math.sin(it.a0);
        var x2 = cx + r * Math.cos(it.a1), y2 = cy + r * Math.sin(it.a1);
        paths += '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + r + ' ' + r + ' 0 ' + (it.frac > 0.5 ? 1 : 0) + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + it.s.color + '"/>';
      }
      var ex = cx + (r + 3) * it.c, ey = cy + (r + 3) * it.sn;
      var bx = cx + (r + 14) * it.c, by = cy + (r + 14) * it.sn;
      var lx = it.side > 0 ? cx + r + 30 : cx - r - 30;
      var endX = lx - it.side * 5;
      leads += '<path d="M' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' L' + endX.toFixed(1) + ' ' + it.y.toFixed(1) + '"/>';
      var anc = it.side > 0 ? 'start' : 'end';
      var pct = (it.frac * 100).toFixed(1) + '%';
      texts +=
        '<text x="' + lx.toFixed(1) + '" y="' + (it.y - 16).toFixed(1) + '" text-anchor="' + anc + '" dominant-baseline="central" font-family="Pretendard Variable, Pretendard, sans-serif" font-weight="700" font-size="12.5" fill="#2A2724">' + esc(it.s.name) + '</text>' +
        '<text x="' + lx.toFixed(1) + '" y="' + (it.y + 1).toFixed(1) + '" text-anchor="' + anc + '" dominant-baseline="central" font-family="Poor Story, cursive" font-size="19" fill="#2A2724">' + pct + '</text>' +
        '<text x="' + lx.toFixed(1) + '" y="' + (it.y + 17).toFixed(1) + '" text-anchor="' + anc + '" dominant-baseline="central" font-family="Pretendard Variable, Pretendard, sans-serif" font-size="11.5" fill="#4E4841">' + fmt(it.s.amt) + '원</text>';
      aria.push(it.s.name + ' ' + pct + ' ' + fmt(it.s.amt) + '원');
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc('카테고리별 지출 비중: ' + aria.join(', ')) + '">' +
      '<circle cx="' + (cx + 1) + '" cy="' + (cy - 1) + '" r="' + (r + 5) + '" fill="none" stroke="#2A2724" stroke-width="1.3" opacity=".4"/>' +
      '<g stroke="#2A2724" stroke-width="2.4" stroke-linejoin="round">' + paths + '</g>' +
      '<g fill="none" stroke="#2A2724" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 3">' + leads + '</g>' +
      texts + '</svg>';
  }

  function showStats() {
    renderStats();
    $('home').hidden = true;
    $('stats').hidden = false;
    window.scrollTo(0, 0);
    history.pushState({ v: 'stats' }, '');
  }
  function showHome(fromPop) {
    $('stats').hidden = true;
    $('home').hidden = false;
    renderHome();
    if (!fromPop && history.state && history.state.v === 'stats') history.back();
  }

  // ---------- 백업 ----------
  function exportData() {
    var blob = new Blob([JSON.stringify({ app: 'nakseo-gagyebu', version: 1, exportedAt: new Date().toISOString(), entries: entries, customCats: customCats }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '낙서가계부-백업-' + todayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.entries)) throw new Error('bad');
        var clean = data.entries.filter(function (e) {
          return e && typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && typeof e.amount === 'number' && e.amount > 0 && typeof e.cat === 'string';
        }).map(function (e, i) { return { id: String(e.id || ('i' + Date.now() + i)), date: e.date, cat: e.cat, amount: Math.round(e.amount) }; });
        var cats = Array.isArray(data.customCats) ? data.customCats.filter(function (c) {
          return c && typeof c.id === 'string' && typeof c.name === 'string' && /^#[0-9A-Fa-f]{6}$/.test(c.color);
        }).map(function (c) { return { id: c.id, name: c.name.slice(0, 5), color: c.color }; }) : [];
        if (!confirm('지금 기록을 백업 파일(' + clean.length + '건)로 바꿀까요?')) return;
        entries = clean; customCats = cats; saveAll();
        renderStats(); renderHome();
        toast('백업을 불러왔어요');
      } catch (e) { toast('백업 파일을 읽지 못했어요'); }
    };
    reader.readAsText(file);
  }

  // ---------- 이벤트 ----------
  $('calGrid').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-date]');
    if (b) openSheet(b.getAttribute('data-date'));
  });
  $('todayList').addEventListener('click', function () { openSheet(todayStr()); });
  $('prevMonth').addEventListener('click', function () { view.m--; if (view.m < 0) { view.m = 11; view.y--; } renderHome(); });
  $('nextMonth').addEventListener('click', function () { view.m++; if (view.m > 11) { view.m = 0; view.y++; } renderHome(); });
  $('monthLabel').addEventListener('click', function () { var t = new Date(); view = { y: t.getFullYear(), m: t.getMonth() }; renderHome(); });
  $('openStats').addEventListener('click', showStats);
  $('closeStats').addEventListener('click', function () { showHome(false); });
  window.addEventListener('popstate', function () { if (!$('stats').hidden) showHome(true); });
  $('compareBtn').addEventListener('click', function () {
    compareOpen = !compareOpen;
    $('comparePanel').hidden = !compareOpen;
    $('compareBtn').setAttribute('aria-expanded', String(compareOpen));
  });
  $('exportBtn').addEventListener('click', exportData);
  $('importInput').addEventListener('change', function () { if (this.files[0]) importData(this.files[0]); this.value = ''; });

  $('sheetWrap').addEventListener('click', function (ev) {
    if (ev.target.closest('[data-close]')) closeSheet();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !$('sheetWrap').hidden) closeSheet();
  });
  $('amountInput').addEventListener('input', function () {
    var digits = this.value.replace(/[^0-9]/g, '').replace(/^0+/, '').slice(0, 10);
    this.value = digits ? Number(digits).toLocaleString('ko-KR') : '';
  });
  $('amountInput').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') saveEntry(); });
  $('saveBtn').addEventListener('click', saveEntry);
  $('sheetList').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-del]');
    if (!b) return;
    var id = b.getAttribute('data-del');
    var e = entries.find(function (x) { return x.id === id; });
    if (!e || !confirm(catOf(e.cat).name + ' ' + fmt(e.amount) + '원 기록을 지울까요?')) return;
    entries = entries.filter(function (x) { return x.id !== id; });
    store(KEY_ENTRIES, entries);
    renderSheet(); renderHome();
  });

  // 카테고리 선택 / 추가 / 길게 눌러 삭제
  var pressTimer = null, longPressed = false;
  $('catGrid').addEventListener('pointerdown', function (ev) {
    var b = ev.target.closest('[data-custom]');
    longPressed = false;
    if (!b) return;
    pressTimer = setTimeout(function () {
      longPressed = true;
      deleteCustomCat(b.getAttribute('data-cat'));
    }, 600);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (t) {
    $('catGrid').addEventListener(t, function () { clearTimeout(pressTimer); });
  });
  $('catGrid').addEventListener('contextmenu', function (ev) { if (ev.target.closest('[data-custom]')) ev.preventDefault(); });
  $('catGrid').addEventListener('click', function (ev) {
    if (longPressed) { longPressed = false; return; }
    if (ev.target.closest('#addCatBtn')) {
      if ($('addForm').hidden) openAddForm(); else { closeAddForm(); renderCats(); }
      return;
    }
    var b = ev.target.closest('[data-cat]');
    if (!b) return;
    selCat = b.getAttribute('data-cat');
    renderSheet();
  });
  function deleteCustomCat(id) {
    var c = catOf(id);
    var n = entries.filter(function (e) { return e.cat === id; }).length;
    if (!confirm("'" + c.name + "' 카테고리를 지울까요?" + (n ? '\n이 카테고리 기록 ' + n + '건은 기타로 옮겨져요.' : ''))) return;
    customCats = customCats.filter(function (x) { return x.id !== id; });
    entries.forEach(function (e) { if (e.cat === id) e.cat = 'etc'; });
    if (selCat === id) selCat = 'food';
    saveAll();
    renderSheet(); renderHome();
  }
  $('swatchRow').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-color]');
    if (!b) return;
    newColor = b.getAttribute('data-color');
    renderSwatches();
  });
  $('cancelAdd').addEventListener('click', function () { closeAddForm(); renderCats(); });
  $('confirmAdd').addEventListener('click', addCustomCat);
  $('newCatName').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') addCustomCat(); });
  function addCustomCat() {
    var name = $('newCatName').value.trim().slice(0, 5);
    if (!name) { toast('이름을 적어주세요'); return; }
    if (allCats().some(function (c) { return c.name === name; })) { toast('이미 있는 카테고리예요'); return; }
    var id = 'c' + Date.now();
    customCats.push({ id: id, name: name, color: newColor });
    store(KEY_CATS, customCats);
    selCat = id;
    closeAddForm();
    renderSheet();
    toast("'" + name + "' 카테고리를 만들었어요");
  }

  // ---------- 시작 ----------
  renderHome();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
