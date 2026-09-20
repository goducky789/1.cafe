(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- モバイルナビ ---------- */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  const setNav = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.dataset.open = String(open);
  };
  menuBtn.addEventListener('click', () => setNav(nav.dataset.open !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.dataset.open === 'true') { setNav(false); menuBtn.focus(); }
  });

  /* ---------- 焙煎ダイヤル ---------- */
  const ROASTS = [
    { name: '浅煎り',   bean: '#B98A45', crease: '#6E4A1C', origin: 'エチオピア イルガチェフェ',
      note: '花のような香りと、紅茶に近い軽やかな酸味。', sour: 4, bitter: 1, body: 2, pair: '季節のタルト' },
    { name: '中煎り',   bean: '#8C5A2B', crease: '#4A2C12', origin: 'コロンビア ウイラ',
      note: 'キャラメルとナッツの甘さ。毎日飲みたくなる、丸い味わい。', sour: 3, bitter: 2, body: 3, pair: 'バスクチーズケーキ' },
    { name: '中深煎り', bean: '#5C3419', crease: '#2C170B', origin: 'ブラジル セラード',
      note: 'ミルクチョコレートの甘さと、ほどよい苦み。ラテにも向きます。', sour: 2, bitter: 3, body: 4, pair: '厚焼きたまごサンド' },
    { name: '深煎り',   bean: '#2E1A0F', crease: '#120804', origin: 'インドネシア マンデリン',
      note: 'ビターチョコとスパイスの香り。苦みが長く続きます。', sour: 1, bitter: 5, body: 5, pair: 'かためプリン' }
  ];
  const hero = $('.hero');
  const ripple = $('.ripple');
  const chips = $('#chips');

  chips.innerHTML = ROASTS.map((r, i) => `
    <label class="chip">
      <input type="radio" name="roast" value="${i}"${i === 1 ? ' checked' : ''}>
      <span class="chip-face">
        <svg class="chip-bean" viewBox="0 0 40 28" aria-hidden="true" style="--b:${r.bean};--c:${r.crease}">
          <g transform="rotate(-25 20 14)"><ellipse cx="20" cy="14" rx="15" ry="10"/><path d="M6 15C13 9 25 19 34 12"/></g>
        </svg>
        <span>${r.name}</span>
      </span>
    </label>`).join('');

  function setRoast(i, animate = true) {
    const r = ROASTS[i];
    hero.dataset.roast = i;
    $('#bean-name').textContent = r.origin;
    $('#bean-note').textContent = r.note;
    $('#pair').textContent = r.pair;
    ['sour', 'bitter', 'body'].forEach(k => {
      const meter = $(`[data-meter="${k}"] .segs`);
      $$('i', meter).forEach((el, idx) => el.classList.toggle('on', idx < r[k]));
      meter.setAttribute('aria-label', `5段階中${r[k]}`);
    });
    if (animate && !reduceMotion && ripple.animate) {
      ripple.animate(
        [{ transform: 'scale(.15)', opacity: .8 }, { transform: 'scale(1.05)', opacity: 0 }],
        { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
  }
  chips.addEventListener('change', e => {
    if (e.target.name === 'roast') setRoast(+e.target.value);
  });
  setRoast(1, false);

  /* ---------- メニュー ---------- */
  const MENU = {
    coffee: { label: 'コーヒー', items: [
      ['本日のドリップ', '¥550', '浅煎りと深煎りから選べます。'],
      ['産地限定ハンドドリップ', '¥700', '一種類の豆を、一杯ずつ淹れます。今月はエチオピア イルガチェフェ。', true],
      ['エスプレッソ', '¥450', '中深煎りの豆を使います。'],
      ['カフェラテ', '¥620', 'エスプレッソに、あたためたミルクを合わせます。'],
      ['水出しコーヒー', '¥620', '8時間かけて抽出します。9月30日までの限定です。'],
      ['豆の量り売り（100g）', '¥1,100〜', '挽き方は、注文のときに相談できます。']
    ]},
    other: { label: 'コーヒー以外', items: [
      ['ほうじ茶ラテ', '¥600', '茶葉を店で焙煎してお出しします。'],
      ['自家製ジンジャーエール', '¥620', '生姜を煮出したシロップを、炭酸で割ります。', true],
      ['季節のジュース', '¥650', '今月は梨です。'],
      ['紅茶（ポット）', '¥700', 'ダージリンとアッサムから選べます。']
    ]},
    food: { label: 'フード', items: [
      ['厚焼きたまごサンド', '¥900', '厚く焼いた玉子を、トーストで挟みます。', true],
      ['ナポリタン', '¥1,000', '太めの麺を、ケチャップでしっかり炒めます。'],
      ['厚切りトースト', '¥480', 'バターか、あんこを選べます。'],
      ['本日のスープ', '¥500', '黒板に書いてあります。']
    ]},
    sweets: { label: 'スイーツ', items: [
      ['かためプリン', '¥520', '卵の味が濃いプリンに、苦めのカラメル。深煎りに合います。', true],
      ['バスクチーズケーキ', '¥620', '表面を焦がして焼き上げます。'],
      ['季節のタルト', '¥700', '今月は栗のタルトです。'],
      ['焼き菓子（日替わり）', '¥280〜', 'クッキー、マドレーヌなど。']
    ]}
  };
  const tabs = $('#tabs');
  const panel = $('#panel');
  const keys = Object.keys(MENU);

  tabs.innerHTML = keys.map((k, i) =>
    `<button class="tab" role="tab" id="tab-${k}" data-key="${k}" aria-controls="panel"
      aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${MENU[k].label}</button>`).join('');

  function renderPanel(key, animate) {
    panel.setAttribute('aria-labelledby', `tab-${key}`);
    panel.innerHTML = `<ul class="items">${MENU[key].items.map(([name, price, note, pick]) => `
      <li class="item">
        <div class="item-head">
          <span class="item-name">${name}</span>${pick ? '<span class="mark">おすすめ</span>' : ''}
          <span class="dots" aria-hidden="true"></span>
          <span class="price">${price}</span>
        </div>
        <p class="item-note">${note}</p>
      </li>`).join('')}</ul>`;
    if (animate) {
      panel.classList.remove('swap');
      void panel.offsetWidth;
      panel.classList.add('swap');
    }
  }
  function selectTab(key) {
    $$('.tab', tabs).forEach(t => {
      const on = t.dataset.key === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    renderPanel(key, true);
  }
  tabs.addEventListener('click', e => {
    const t = e.target.closest('.tab');
    if (t) selectTab(t.dataset.key);
  });
  tabs.addEventListener('keydown', e => {
    const list = $$('.tab', tabs);
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % list.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = list.length - 1;
    if (n !== null) { e.preventDefault(); list[n].focus(); selectTab(list[n].dataset.key); }
  });
  renderPanel(keys[0], false);

  /* ---------- 営業時間と営業状況（日本時間） ---------- */
  // 添字は 日(0)〜土(6)。[開店, 閉店, ラストオーダー] を「分」で持つ。null は定休日。
  const HOURS = [
    [480, 1140, 1110], // 日
    null,              // 月
    [480, 1080, 1050], // 火
    [480, 1080, 1050], // 水
    [480, 1080, 1050], // 木
    [480, 1080, 1050], // 金
    [480, 1140, 1110]  // 土
  ];
  const DAY = ['日', '月', '火', '水', '木', '金', '土'];
  const fmt = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  $('#hours tbody').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const h = HOURS[d];
    return `<tr data-day="${d}"><th scope="row">${DAY[d]}曜日</th><td>${
      h ? `${fmt(h[0])}〜${fmt(h[1])}<small>L.O. ${fmt(h[2])}</small>` : '定休日'
    }</td></tr>`;
  }).join('');

  function nowInJapan() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      const get = t => parts.find(p => p.type === t).value;
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
        min: +get('hour') * 60 + +get('minute')
      };
    } catch (_) {
      const d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function statusFor({ day, min }) {
    const h = HOURS[day];
    if (h && min >= h[0] && min < h[1]) {
      return { state: 'open', text: min >= h[2] ? `営業中（まもなく閉店・${fmt(h[1])}まで）` : `営業中（${fmt(h[1])}まで）` };
    }
    if (h && min < h[0]) return { state: 'closed', text: `本日は${fmt(h[0])}から営業します` };
    const head = h ? '本日の営業は終了しました' : '本日は定休日です';
    for (let n = 1; n <= 7; n++) {
      const d = (day + n) % 7;
      if (HOURS[d]) return { state: 'closed', text: `${head}（次回は${n === 1 ? '明日' : DAY[d] + '曜日'} ${fmt(HOURS[d][0])}から）` };
    }
  }
  function refreshStatus() {
    const now = nowInJapan();
    const s = statusFor(now);
    $$('[data-status]').forEach(el => { el.textContent = s.text; el.dataset.state = s.state; });
    $$('#hours tr').forEach(tr => {
      const today = +tr.dataset.day === now.day;
      tr.classList.toggle('today', today);
      if (today) tr.setAttribute('aria-current', 'date'); else tr.removeAttribute('aria-current');
    });
  }
  refreshStatus();
  setInterval(refreshStatus, 60000);
})();
