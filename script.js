'use strict';
/* ============================================================
   AQUA SELENA · script.js
   1) НАЛАШТУВАННЯ  2) ФОТО  3) ДАНІ МЕНЮ  4) ЛОГІКА
   ============================================================ */

/* 1) НАЛАШТУВАННЯ — телефон змінюється тут (усі tel:-посилання на сторінці оновляться) */
const CONFIG = { phone: '+380639567469', phoneText: '+380 63 956 74 69', mapQuery: 'вул. Східна, 2, Баштанка' };

/* 2) ФОТО — покладіть файли в assets/photos/ (WebP) під цими іменами.
      Якщо файлу немає, автоматично показується водяний плейсхолдер із підписом.
      shape: arch | round | tall | wide | leaf */
const PHOTOS = [
  { src: 'assets/photos/pool.webp',     cap: 'Басейн',            shape: 'arch'  },
  { src: 'assets/photos/loungers.webp', cap: 'Лежаки',            shape: 'wide'  },
  { src: 'assets/photos/poufs.webp',    cap: 'Пуфи біля води',    shape: 'round' },
  { src: 'assets/photos/gazebo.webp',   cap: 'Альтанки',          shape: 'tall'  },
  { src: 'assets/photos/kitchen.webp',  cap: 'Кухня та гриль',    shape: 'leaf'  },
  { src: 'assets/photos/dishes.webp',   cap: 'Наші страви',       shape: 'wide'  },
  { src: 'assets/photos/bar.webp',      cap: 'Бар',               shape: 'arch'  },
  { src: 'assets/photos/house.webp',    cap: 'Будинок комплексу', shape: 'tall'  }
];
const PH_BG = ['linear-gradient(150deg,#0F5560,#14B8C4)', 'linear-gradient(150deg,#14808C,#35D6E0)', 'linear-gradient(150deg,#0B3B45,#14808C)', 'linear-gradient(150deg,#12808b,#CFF1F7)'];

/* 3) ДАНІ МЕНЮ — усі ціни в грн. Щоб додати позицію, скопіюйте рядок I(...) і змініть.
      I(назва, примітка(обʼєм/тара), ціна або [ціни], опис, вага, [підписи до цін])
      Для категорії: cols — заголовки колонок цін (напр. ['50 мл','пляшка']), sub — підзаголовок. */
const I = (n, note, p, d, w, l) => ({ n, note: note || '', p: [].concat(p), d: d || '', w: w || '', l: l || null });
const PORT = ['3 шт', '6 шт', '9 шт'];
const MENU = [
{ tab: 'Кухня', cats: [
  { id: 'burgers', t: 'Бургери', items: [
    I('Бургер з яловичою котлетою', '', 280, 'Яловича котлета, свіжі овочі, чеддер і класичний соус у м\'якій булці', '300 г'),
    I('Бургер курячий', '', 280, 'Куряча котлета, свіжі овочі, сир та фірмовий соус у м\'якій булці', '300 г') ] },
  { id: 'snacks', t: 'Снеки', items: [
    I('Нагетси', '', [50, 100, 150], 'Хрусткі курячі нагетси у золотистій паніровці', '', PORT),
    I('Стріпси моцарелі', '', [70, 140, 210], 'Ніжна моцарела в хрусткій скоринці з тягучою текстурою', '', PORT),
    I('Кільця цибулі', '', [30, 60, 90], 'Ароматна цибуля в легкій хрусткій паніровці', '', PORT),
    I('Камамбер у паніровці', '', [140, 280]) /* інші снеки додасть власник — копіюйте рядок вище */ ] },
  { id: 'sides', t: 'Гарніри', items: [
    I('Картопля фрі', '', 100, 'Хрустка картопля фрі до ідеальної золотистої скоринки', '200 г') ] },
  { id: 'hot', t: 'Гарячі страви', items: [
    I('Чевапчичі з сиром', '', [150, 300], 'Соковиті м\'ясні ковбаски з ніжною сирною начинкою', '', ['3 шт', '6 шт']),
    I('Ковбаски курячі', '', 100, 'Ніжні курячі ковбаски з ароматними спеціями', '1 шт'),
    I('Ковбаски свинні', '', 120, 'Соковиті свинні ковбаски з насиченим м\'ясним смаком', '1 шт'),
    I('Шашлик зі свинини', '', 400, 'Мариноване соковите м\'ясо свинини, приготоване на грилі', '200 г'),
    I('Паста карбонара', '', 260, 'Класична паста з беконом, вершковим соусом та пармезаном', '200 г') ] },
  { id: 'salads', t: 'Салати', items: [
    I('Цезар з куркою', '', 260, 'Курка гриль, хрусткі сухарики, пармезан та соус Цезар', '310 г'),
    I('Грецький', '', 260, 'Свіжі овочі з сиром фета, маслинами та оливковою олією', '357 г'),
    I('Овочі гриль', '', 270, 'Ароматні овочі гриль із пікантним гірчично-соєвим соусом', '150 г'),
    I('Салат з тунцем', '', 330, 'Легкий салат із тунцем, яйцем та свіжими овочами', '337 г'),
    I('Капрезе', '', 250, 'Італійська класика з томатами, моцарелою та базиліком', '286 г'),
    I('Салат з лососем', '', 350, 'Слабосолений лосось, авокадо та цитрусовий соус', '307 г') ] },
  { id: 'pizza', t: 'Піца', sub: 'Усі Ø 38 см', items: [
    I('Пепероні', '', 380, 'Класична піца з салямі пепероні, сиром та томатним соусом'),
    I('4 сири', '', 430, 'Насичена піца з поєднанням чотирьох сирів'),
    I('4 м\'яса', '', 400, 'Ситна піца з асорті м\'ясних інгредієнтів та моцарелою'),
    I('Карбонара', '', 400, 'Бекон, вершковий соус та ніжний жовток'),
    I('Гавайська', '', 400, 'Соковита піца з шинкою, ананасами, сиром та томатним соусом'),
    I('Цезар піца', '', 400, 'Курка гриль, соус Цезар та свіжий салат'),
    I('Цезар піца з креветкою', '', 430, 'Соковиті креветки, соус Цезар та свіжий салат') ] },
  { id: 'khach', t: 'Хачапурі', items: [
    I('Хачапурі', '', 220, 'Традиційний грузинський хліб із сулугуні та вершковим маслом', '~450 г') ] },
  { id: 'plates', t: 'Тарілки', items: [
    I('М\'ясна тарілка', '', 390, 'Ковбаса президентська, нострано, рулет м\'ясний мармуровий, балик посольський, шинка', '300 г'),
    I('Сирна тарілка', '', 400, 'Дор блю, моцарела, брі, пармезан, горіховий сир, мед'),
    I('Рибна тарілка', '', [420, 320, 100], 'Асорті рибних делікатесів — ідеально до пива'),
    I('Фруктова тарілка', '', 450, 'Асорті зі свіжих сезонних фруктів у красивій подачі. Склад залежить від сезонної наявності', '500 г'),
    I('Овочева тарілка', '', 350, 'Свіжі сезонні овочі з зеленню та легким оформленням. Склад залежить від сезонної наявності', '500 г') ] }
] },
{ tab: 'Безалкогольні напої', cats: [
  { id: 'juice', t: 'Соки та нектари', items: [
    I('Sandora «Апельсиновий сік»', '0.2 л', 40), I('Sandora «Мультивітамін», нектар', '0.2 л', 30),
    I('Sandora «Яблучний сік»', '0.95 л', 120), I('Sandora «Гранатовий», нектар', '0.95 л', 120),
    I('Sandora «Персиковий з м\'якоттю», нектар', '0.95 л', 120), I('Sandora «Ананасовий», нектар', '0.95 л', 120),
    I('Сік на розлив', '300 мл', 35) ] },
  { id: 'lemon', t: 'Лимонади та квас', items: [
    I('Уманський лимонад «Кола»', '0.5 л, скло', 50), I('Уманський лимонад «Апельсин»', '0.5 л, скло', 50),
    I('Уманський лимонад «Яблуко»', '0.5 л, скло', 50),
    I('Лимонад Borjomi Limonati (мандарин / груша / лимон)', '0.33 л, ж/б', 70),
    I('Лимонад Borjomi Limonati (мандарин / груша / лимон)', '0.5 л, скло', 100),
    I('Квас живого бродіння «Опілля Білий»', '0.5 л, ж/б', 50) ] },
  { id: 'soda', t: 'Газовані напої', items: [
    I('Pepsi', '0.33 л, ж/б', 40), I('Pepsi Zero', '0.33 л, ж/б', 40), I('Pepsi «Крем-сода»', '0.33 л, ж/б', 40),
    I('Pepsi', '1.75 л', 70), I('Mirinda Zero', '0.33 л, ж/б', 40), I('7UP Zero', '0.33 л', 40) ] },
  { id: 'tea', t: 'Холодний чай', sub: 'Lipton, 0.5 л', items: [
    I('Lipton «Зелений»', '0.5 л', 40), I('Lipton «Чорний з лимоном»', '0.5 л', 40), I('Lipton «Чорний з малиною»', '0.5 л', 40) ] },
  { id: 'water', t: 'Вода', items: [
    I('Карпатська Джерельна, негазована', '0.5 л', 25), I('Карпатська Джерельна, сильногазована', '1.5 л', 35),
    I('Боржомі', '0.33 л, ж/б', 55), I('Боржомі', '0.5 л, ПЕТ', 70), I('Боржомі', '0.75 л, ПЕТ', 100), I('Боржомі', '0.5 л, скло', 100) ] },
  { id: 'coffee', t: 'Гарячі напої', items: [
    I('Еспресо', '', 40), I('Американо', '', 40), I('Американо з молоком', '', 50), I('Капучино', '', 50),
    I('Латте', '', 55), I('Ice Латте', '', 55), I('Айс-лате', '', 60),
    I('Чай чорний / зелений / фруктовий / з мелісою', '', 60) ] },
  { id: 'zero', t: 'Безалкогольне пиво та сидр', items: [
    I('Opillia Export Zero, б/а', '0.5 л, ж/б', 50), I('Opillia Export Zero, б/а', '0.5 л, скло', 50),
    I('Waissburg 0%', '0.5 л, скло', 50), I('Cidre Royal «Zero»', '0.33 л, скло', 50), I('Мохіто', '0.5 л', 50) ] },
  { id: 'mock', t: 'Безалкогольні коктейлі', items: [
    I('Мілкшейк класичний', '', 100), I('Мілкшейк шоколадний', '', 120), I('Мілкшейк екзотичний', '', 120),
    I('Мохіто', '', 100), I('Мохіто полуничне', '', 120), I('Тропічний мікс', 'мікс з двох соків', 80),
    I('Aperol безалкогольний', '', 120), I('Піна Колада безалкогольна', '', 140) ] }
] },
{ tab: 'Бар і коктейлі', cats: [
  { id: 'cock', t: 'Коктейльна карта', items: [
    I('Aperol Spritz', '', 220), I('ASTI Long Island', '', 280), I('Blue Lagoon', '', 200), I('Cuba Libre', '', 200),
    I('Daiquiri', '', 200), I('French 75', '', 180), I('Gin Tonic', '', 180), I('Highball', '', 180),
    I('Hugo Spritz', '', 200), I('Margarita', '', 220), I('Martini Bianco Tonic', '', 180),
    I('Martini Fiero Tonic', '', 180), I('Mojito', '', 170), I('Negroni', '', 200), I('Strawberry Daiquiri', '', 210) ] },
  { id: 'draft', t: 'Пиво розливне', items: [
    I('Waissburg Blanche', '0.5 л', 60), I('Waissburg Lager', '0.5 л', 60), I('Опілля «Корифей», світле 11%', '0.5 л', 60),
    I('Медуза', '0.3 л', 40), I('«Лящ», світле пастеризоване', '0.5 л', 60), I('Сидр «Фрагола»', '0.3 л', 40),
    I('Мохіто на розлив', '0.4 л', 40), I('Квас Уманський', '0.5 л', 50) ] },
  { id: 'bottle', t: 'Пиво пляшкове та в банці', items: [
    I('Opillia «Export 1851», світле', '0.5 л, скло', 55),
    I('Opillia «Export Koryfei», світле', '0.5 л', [50, 60], '', '', ['ж/б', 'скло']),
    I('Opillia «Export Lager», світле', '0.5 л', [50, 55], '', '', ['ж/б', 'скло']),
    I('Опілля «Біле»', '0.5 л, ж/б', 55), I('Опілля «Білий келих», нефільтроване', '0.5 л, скло', 55),
    I('Waissburg Blanche', '0.5 л, скло', 55), I('Waissburg Lager', '0.5 л, скло', 55), I('Waissburg Dunkel, темне', '0.5 л, скло', 60),
    I('«Лящ», світле пастеризоване', '0.5 л', [40, 50], '', '', ['ж/б', 'скло']),
    I('«Віденське», світле фільтроване', '0.5 л, ж/б', 40), I('«Мюнхенське», нефільтроване світле', '0.5 л, ж/б', 40),
    I('«Житнє Уманське»', '0.5 л, скло', 60), I('«Медове 2002», традиційне', '0.5 л, скло', 50),
    I('Уманське «Солодово-пшеничне», світле', '0.5 л, скло', 55),
    I('«Молочний стаут»', '0.33 л, скло', 50), I('«IPA»', '0.33 л, скло', 50), I('«Софіївське»', '0.33 л, скло', 45),
    I('Уманьпиво «Спайсі Манго»', '0.33 л, скло', 50), I('Уманьпиво «Томато»', '0.33 л, скло', 50) ] },
  { id: 'wine', t: 'Вино', sub: '0.75 л, пляшка', items: [
    I('MonteGaroa Bianco, біле сухе', '', 250), I('MonteGaroa Bianco, біле напівсолодке', '', 250),
    I('MonteGaroa Tinto, червоне сухе', '', 250), I('MonteGaroa Tinto, червоне напівсолодке', '', 250) ] },
  { id: 'vermouth', t: 'Вермут', items: [ I('Martini Bianco', '1 л', 550), I('Martini Fiero', '0.75 л', 550) ] },
  { id: 'cognac', t: 'Коньяк', cols: ['50 мл', 'пляшка'], items: [
    I('SHABO V.S.O.P', '0.5 л', [40, 350]), I('Old Kakheti 3*', '0.5 л', [50, 480]) ] },
  /* Список міцних напоїв не повний — додайте решту позицій рядками I(...) */
  { id: 'spirits', t: 'Міцні напої', cols: ['50 мл', 'пляшка'], items: [
    I('Bacardi Carta Blanca', '1 л', [50, 800]), I('Bacardi Carta Negra', '1 л', [50, 800]), I('Bacardi Spiced', '1 л', [50, 800]),
    I('Becherovka', '1 л', [45, 850]), I('Beefeater Blood Orange', '0.7 л', [60, 850]),
    I('Beefeater Pink', '0.7 л', [60]) /* ціну пляшки додасть власник: [60, ціна] */,
    I('Finsbury London Dry', '0.7 л', [50, 600]) ] }
] }
];

/* 4) ЛОГІКА ------------------------------------------------- */
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const hasG = () => !!(window.gsap && window.ScrollTrigger);

/* Телефони */
$$('[data-tel]').forEach(a => { a.href = 'tel:' + CONFIG.phone; if (a.hasAttribute('data-tt')) a.textContent = CONFIG.phoneText; });
$('#yr').textContent = new Date().getFullYear();

/* Прелоадер */
const pre = $('#pre');
setTimeout(() => pre && pre.classList.add('gone'), 1350);

/* Шапка: фон, ховання при скролі вниз, бургер */
const hdr = $('#hdr'), nav = $('#nav'), burger = $('#burger'), totop = $('#totop');
let lastY = scrollY, tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const y = scrollY, down = y > lastY + 4, up = y < lastY - 4;
    hdr.classList.toggle('solid', y > 40);
    if (!nav.classList.contains('open')) {
      if (down && y > 160) { hdr.classList.add('hide'); document.body.classList.add('nav-off'); }
      else if (up) { hdr.classList.remove('hide'); document.body.classList.remove('nav-off'); }
    }
    totop.hidden = false; totop.classList.toggle('show', y > 700);
    lastY = y; tick = false;
  });
}, { passive: true });
const closeNav = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
$$('a', nav).forEach(a => a.addEventListener('click', closeNav));
totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* Підсвітка пунктів навігації */
const secs = ['home', 'pool', 'menu', 'contacts'].map(id => document.getElementById(id));
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('a', nav).forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => s && navIO.observe(s));

/* Бульбашки */
const bub = $('#bubbles');
if (bub && !reduce) for (let i = 0; i < 14; i++) {
  const s = document.createElement('span'), z = 6 + Math.random() * 18;
  s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;--dx:${(Math.random() - .5) * 60}px;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 14}s`;
  bub.appendChild(s);
}

/* Карта (завантажується по кліку — швидше сторінка) */
$('#mapBtn').addEventListener('click', e => {
  const f = document.createElement('iframe');
  f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(CONFIG.mapQuery) + '&output=embed';
  f.loading = 'lazy'; f.title = 'Карта: ' + CONFIG.mapQuery; f.referrerPolicy = 'no-referrer-when-downgrade';
  e.currentTarget.replaceWith(f);
});

/* Галерея + лайтбокс */
const strip = $('#strip'), lb = $('#lb'), lbFig = $('#lbFig');
let cur = 0;
PHOTOS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'g ' + p.shape + ' ph'; b.type = 'button'; b.setAttribute('aria-label', 'Відкрити фото: ' + p.cap);
  b.style.setProperty('--bg', PH_BG[i % PH_BG.length]);
  b.innerHTML = `<span>${p.cap}</span>`;
  if (p.src) {
    const im = new Image(); im.loading = 'lazy'; im.alt = p.cap; im.decoding = 'async';
    im.onload = () => { b.classList.remove('ph'); b.innerHTML = ''; b.append(im); b.dataset.ok = 1; };
    im.src = p.src;
  }
  b.addEventListener('click', () => openLb(i));
  strip.appendChild(b);
});
function showLb() {
  const p = PHOTOS[cur], ok = strip.children[cur].dataset.ok;
  lbFig.innerHTML = ok ? `<img src="${p.src}" alt="${p.cap}"><figcaption>${p.cap}</figcaption>` : `<div class="big">${p.cap}</div><figcaption>Тут буде фото: ${p.cap}</figcaption>`;
}
function openLb(i) { cur = i; showLb(); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-x').focus(); }
function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
const step = d => { cur = (cur + d + PHOTOS.length) % PHOTOS.length; showLb(); };
$('.lb-x').onclick = closeLb; $('.lb-n.next').onclick = () => step(1); $('.lb-n.prev').onclick = () => step(-1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
let sx = 0; // свайп
lb.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); }, { passive: true });
/* Фото в блоці «Що вас чекає» */
const poolPh = $('[data-ph=pool]');
if (poolPh) { const im = new Image(); im.alt = 'Басейн AQUA SELENA'; im.loading = 'lazy'; im.onload = () => { poolPh.prepend(im); poolPh.querySelector('span').remove(); }; im.src = PHOTOS[0].src; }

/* ===== МЕНЮ ===== */
const body = $('#menuBody'), tabsEl = $('#tabs'), ind = $('#ind'), chipsEl = $('#chips'), q = $('#q'), mbar = $('#mbar'), emptyEl = $('#empty');
const money = (it, cat) => {
  const labels = it.l || cat.cols || [];
  return '<span class="pr">' + it.p.map((v, i) => `<span class="pp">${v}${labels[i] ? `<i>${labels[i]}</i>` : ''}</span>`).join('') + '<em>грн</em></span>';
};
body.innerHTML = MENU.map((g, gi) => `<div class="panel" id="panel${gi}" role="tabpanel" aria-labelledby="tab${gi}"${gi ? ' hidden' : ''}>` +
  g.cats.map(c => `<section class="cat" id="c-${c.id}" data-id="${c.id}">
    <button class="cat-h" type="button" aria-expanded="true" aria-controls="b-${c.id}"><h3>${c.t}</h3>${c.sub ? `<small>${c.sub}</small>` : ''}<svg class="ic" aria-hidden="true"><use href="#i-chev"/></svg></button>
    <div class="cat-b" id="b-${c.id}"><div class="cat-in">
      ${c.cols ? `<div class="colhead" aria-hidden="true">${c.cols.map(x => `<span style="min-width:3.2rem;text-align:right">${x}</span>`).join('')}</div>` : ''}
      ${c.items.map(it => `<div class="it" data-s="${(it.n + ' ' + it.note).toLowerCase()}">
        <div class="it-r"><div class="nm">${it.n}${it.note ? `<small>${it.note}</small>` : ''}</div><span class="lead"></span>${money(it, c)}</div>
        ${it.d || it.w ? `<p class="ds">${it.d}${it.d && it.w ? ' · ' : ''}${it.w ? `<b>${it.w}</b>` : ''}</p>` : ''}</div>`).join('')}
    </div></div></section>`).join('') + '</div>').join('');

let tab = 0, spy = null;
MENU.forEach((g, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.role = 'tab'; b.id = 'tab' + i; b.textContent = g.tab; b.setAttribute('aria-controls', 'panel' + i);
  b.addEventListener('click', () => { q.value = ''; setTab(i, true); });
  tabsEl.appendChild(b);
});
function moveInd() {
  const b = $$('button', tabsEl)[tab]; if (!b) return;
  ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 4}px)`;
}
function setTab(i, jump) {
  tab = i;
  $$('.panel').forEach((p, k) => p.hidden = k !== i);
  $$('button', tabsEl).forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
  moveInd(); buildChips(); filter();
  if (jump) { const top = $('#menuBody').getBoundingClientRect().top + scrollY - mbar.offsetHeight - 10; if (scrollY > top) scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' }); }
}
function buildChips() {
  chipsEl.innerHTML = '';
  MENU[tab].cats.forEach(c => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = c.t; b.dataset.id = c.id;
    b.addEventListener('click', () => {
      const el = document.getElementById('c-' + c.id); el.classList.remove('shut'); $('.cat-h', el).setAttribute('aria-expanded', 'true');
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
    chipsEl.appendChild(b);
  });
  if (spy) spy.disconnect();
  const setBar = () => document.documentElement.style.setProperty('--bar', mbar.offsetHeight + 'px'); setBar();
  spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$('button', chipsEl).forEach(b => {
      const on = b.dataset.id === e.target.dataset.id; b.classList.toggle('on', on);
      if (on) chipsEl.scrollTo({ left: b.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
    });
  }), { rootMargin: `-${mbar.offsetHeight + 70}px 0px -65% 0px` });
  $$('.panel:not([hidden]) .cat').forEach(c => spy.observe(c));
}
/* Розкриття / згортання категорій */
body.addEventListener('click', e => {
  const h = e.target.closest('.cat-h'); if (!h) return;
  const c = h.parentElement, shut = c.classList.toggle('shut'); h.setAttribute('aria-expanded', !shut);
});
/* Пошук */
function filter() {
  const v = q.value.trim().toLowerCase(), searching = !!v; let any = false;
  $$('.panel').forEach((p, k) => p.hidden = searching ? false : k !== tab);
  chipsEl.hidden = searching;
  $$('.cat').forEach(c => {
    let n = 0;
    $$('.it', c).forEach(it => { const m = !v || it.dataset.s.includes(v); it.hidden = !m; if (m) n++; });
    c.hidden = !n; if (n) { any = true; if (searching) c.classList.remove('shut'); }
  });
  emptyEl.hidden = any;
}
q.addEventListener('input', filter);
addEventListener('resize', () => { moveInd(); document.documentElement.style.setProperty('--bar', mbar.offsetHeight + 'px'); });
setTab(0);
document.fonts && document.fonts.ready.then(moveInd);

/* Курсор-крапля + «рябь» */
if (fine) {
  const cur = $('.cur'), dot = $('.dot'), ring = $('.ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
  (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  const rip = () => { const r = document.createElement('i'); r.className = 'rip'; r.style.left = mx + 'px'; r.style.top = my + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 850); };
  document.addEventListener('pointerover', e => { const t = e.target.closest('a,button,input,.g'); cur.classList.toggle('hov', !!t); if (t && t.matches('.btn,.totop,.tabs button') && !reduce) rip(); });
  document.addEventListener('pointerdown', () => !reduce && rip());
}

/* Магнітні кнопки */
if (fine && !reduce) $$('.mag').forEach(b => {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
  b.addEventListener('pointerleave', () => { b.style.transform = ''; });
});

/* ===== GSAP: інтро, скрол-анімації ===== */
function motion() {
  if (reduce || !hasG()) return;
  gsap.registerPlugin(ScrollTrigger);
  const root = document.documentElement; root.classList.add('anim');
  /* Hero: рядки з маскою, потім кнопки */
  const tl = gsap.timeline({ delay: 1.0, defaults: { ease: 'power4.out' } });
  tl.to('.hero .ln>span', { y: 0, duration: 1.1, stagger: .14 })
    .to('.hero .a-in', { opacity: 1, y: 0, duration: .8, stagger: .12 }, '-=.6');
  gsap.fromTo('#tFill', { scaleY: 0 }, { scaleY: .72, duration: 1.8, delay: 1.6, ease: 'power3.out' });
  const hn = $('.thermo .count'); const o = { v: 0 };
  gsap.to(o, { v: 29, duration: 1.8, delay: 1.6, ease: 'power3.out', onUpdate: () => hn.textContent = Math.round(o.v) });
  /* Заголовки по буквах */
  $$('.split').forEach(h => {
    const t = h.textContent; h.setAttribute('aria-label', t); h.textContent = '';
    t.split(' ').forEach(word => {
      const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      [...word].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; w.appendChild(c); });
      h.append(w, ' ');
    });
    gsap.from($$('.c', h), { yPercent: 110, rotate: 6, duration: .9, stagger: .03, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  $$('.rev').forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  /* Цінники виїжджають з овершутом, числа «досчитываются» */
  $$('.pop').forEach((el, i) => gsap.from(el, { y: 90, scale: .92, opacity: 0, duration: 1.1, delay: (i % 2) * .08, ease: 'back.out(1.6)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  $$('.tariffs .count').forEach(c => {
    const n = +c.dataset.n, ob = { v: 0 };
    ScrollTrigger.create({ trigger: c, start: 'top 92%', once: true, onEnter: () => gsap.to(ob, { v: n, duration: 1.4, ease: 'power2.out', onUpdate: () => c.textContent = Math.round(ob.v) }) });
  });
  /* Фото розкриваються маскою */
  $$('.mask').forEach(el => gsap.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  gsap.from($$('.g'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: strip, start: 'top 85%', once: true } });
  /* Параллакс (м'який) */
  $$('[data-p]').forEach(el => gsap.to(el, { yPercent: +el.dataset.p, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: .6 } }));
  $$('.photo img').forEach(im => gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: im.parentElement, scrub: true } }));
  /* Хвиля «заливає» наступну секцію */
  $$('.flood').forEach(w => gsap.fromTo(w, { yPercent: 70 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: w.parentElement, start: 'bottom 110%', end: 'bottom 55%', scrub: .5 } }));
}
addEventListener('load', motion);
