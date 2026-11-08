(function () {
  "use strict";

  var DATA = window.FAMILY || [];
  var GREET = window.GREETINGS || {};
  var SITE = window.SITE || {};
  var MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  var MONTHS_IN = ["январе", "феврале", "марте", "апреле", "мае", "июне", "июле", "августе", "сентябре", "октябре", "ноябре", "декабре"];
  var WEDDINGS = {
    1: "ситцевая", 2: "бумажная", 3: "кожаная", 4: "льняная", 5: "деревянная", 6: "чугунная",
    7: "медная", 8: "жестяная", 9: "фаянсовая", 10: "оловянная", 11: "стальная", 12: "никелевая",
    13: "кружевная", 14: "агатовая", 15: "хрустальная", 18: "бирюзовая", 20: "фарфоровая",
    25: "серебряная", 30: "жемчужная", 35: "коралловая", 40: "рубиновая", 45: "сапфировая",
    50: "золотая", 55: "изумрудная", 60: "бриллиантовая", 65: "железная", 70: "благодатная",
  };
  var ORDER = { birthday: 0, anniversary: 1, memory: 2 };

  // ——— Дата «сегодня» (или ?date=ГГГГ-ММ-ДД для просмотра другого дня) ———
  var params = new URLSearchParams(location.search);
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var preview = /^(\d{4})-(\d{2})-(\d{2})$/.exec(params.get("date") || "");
  if (preview) {
    today = new Date(+preview[1], +preview[2] - 1, +preview[3]);
    document.getElementById("preview-bar").hidden = false;
    document.getElementById("preview-date").textContent = fmt(today, true);
  }

  // ?demo=baby — посмотреть, как будет выглядеть «Встречайте!», пока малыш не родился
  if (params.get("demo") === "baby" && !DATA.some(function (e) { return e.newborn; })) {
    DATA = DATA.concat([{ type: "birthday", name: "Тимофей", date: iso(today), relation: "наш новый малыш",
      newborn: { weight: "3 450 г", height: "52 см" } }]);
  }

  // ——— Разбор записей ———
  var events = DATA.map(function (e, i) {
    var m = /^(?:(\d{4})|-)-(\d{2})-(\d{2})$/.exec(String(e.date || "").trim());
    if (!m) { console.warn("Неверная дата у записи:", e); return null; }
    return Object.assign({}, e, {
      id: i,
      year: m[1] ? +m[1] : null,
      month: +m[2] - 1,
      day: +m[3],
      type: ORDER.hasOwnProperty(e.type) ? e.type : "birthday",
    });
  }).filter(Boolean);

  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function occurrence(e, y) {
    // 29 февраля в невисокосный год отмечаем 28-го
    var d = e.month === 1 && e.day === 29 && !isLeap(y) ? 28 : e.day;
    return new Date(y, e.month, d);
  }
  function nextOccurrence(e, from) {
    var o = occurrence(e, from.getFullYear());
    if (o < from) o = occurrence(e, from.getFullYear() + 1);
    return o;
  }
  function daysBetween(a, b) {
    return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
  }
  function countFor(e, occ) {
    if (!e.year || e.hideAge) return null;
    var n = occ.getFullYear() - e.year;
    return n > 0 ? n : null;
  }

  // ——— Тексты ———
  function plural(n, forms) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }
  function years(n) { return n + " " + plural(n, ["год", "года", "лет"]); }
  function fmt(d, withYear) {
    return d.toLocaleDateString("ru-RU", withYear ? { day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "long" });
  }
  function inDays(n) {
    if (n === 0) return "сегодня";
    if (n === 1) return "завтра";
    if (n === 2) return "послезавтра";
    return "через " + n + " " + plural(n, ["день", "дня", "дней"]);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function greeting(e, occ) {
    if (e.greeting) return e.greeting;
    var pool = GREET[e.type] || [];
    if (!pool.length) return "";
    return pool[hash(e.name + occ.getFullYear()) % pool.length];
  }

  // Короткая подпись: что за повод и сколько лет
  function what(e, occ, isToday) {
    var n = countFor(e, occ);
    if (e.type === "birthday") {
      if (!n) return "день рождения";
      return (isToday ? "исполняется " : "исполнится ") + years(n);
    }
    if (e.type === "anniversary") {
      if (!n) return "годовщина свадьбы";
      return years(n) + " вместе" + (WEDDINGS[n] ? " · " + WEDDINGS[n] + " свадьба" : "");
    }
    if (e.kind === "birth") return n ? years(n) + " со дня рождения" : "день рождения · память";
    return n ? "день памяти · " + years(n) : "день памяти";
  }

  // ——— Аватар: фото или инициалы ———
  function initials(e) {
    if (e.type === "anniversary") {
      var parts = e.name.split(/\s+и\s+/);
      if (parts.length === 2) return lastWord(parts[0])[0] + "&" + lastWord(parts[1])[0];
    }
    return lastWord(e.name)[0] || "?";
  }
  function lastWord(s) { var w = s.trim().split(/\s+/); return w[w.length - 1].split("-")[0]; }
  // photo может быть строкой или списком ["photos/a.jpg", "photos/b.jpg"]
  function photosOf(e) {
    var p = Array.isArray(e.photo) ? e.photo : [e.photo];
    return p.filter(function (s) { return s && String(s).trim(); });
  }
  function avatar(e, cls) {
    var hue = [12, 28, 42, 150, 190, 215, 265, 330][hash(e.name) % 8];
    var style = e.type === "memory" ? "" : ' style="--h:' + hue + '"';
    var ini = '<span class="ava__ini">' + esc(initials(e)) + "</span>";
    var first = photosOf(e)[0];
    var img = first
      ? '<img src="' + esc(first) + '" alt="" loading="lazy" onerror="this.remove()">'
      : "";
    return '<span class="ava ava--' + e.type + " " + (cls || "") + '"' + style + ' data-id="' + e.id + '">' + ini + img + "</span>";
  }

  // ——— Смена фото в большой карточке ———
  // Берём фото из списка в data.js; если фото одно — ищем рядом файлы с номером:
  // inna.jpg → inna-2.jpg, inna-3.jpg… (или inna2.jpg, inna3.jpg). Поиск идёт до первого пропуска.
  function loads(src) {
    return new Promise(function (ok) {
      var i = new Image();
      i.onload = function () { ok(src); };
      i.onerror = function () { ok(null); };
      i.src = src;
    });
  }
  function findNumbered(src) {
    var m = /^(.*?)(\.[a-z0-9]+)$/i.exec(src);
    if (!m) return Promise.resolve([]);
    var found = [];
    function step(n) {
      if (n > 8) return Promise.resolve(found);
      return loads(m[1] + "-" + n + m[2]).then(function (a) {
        return a || loads(m[1] + n + m[2]);
      }).then(function (got) {
        if (!got) return found;
        found.push(got);
        return step(n + 1);
      });
    }
    return step(2);
  }
  function startSlides(shown) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    shown.forEach(function (e) {
      var box = document.querySelector('#hero .ava--xl[data-id="' + e.id + '"]');
      var list = photosOf(e);
      if (!box || !list.length) return;
      var more = list.length > 1
        ? Promise.all(list.slice(1).map(loads)).then(function (r) { return r.filter(Boolean); })
        : findNumbered(list[0]);
      more.then(function (extra) {
        if (!extra.length) return;
        extra.forEach(function (src) {
          var img = document.createElement("img");
          img.src = src; img.alt = ""; img.className = "is-off";
          box.appendChild(img);
        });
        var imgs = box.querySelectorAll("img"), cur = 0;
        setInterval(function () {
          imgs[cur].classList.add("is-off");
          cur = (cur + 1) % imgs.length;
          imgs[cur].classList.remove("is-off");
        }, e.type === "memory" ? 6000 : 6000);
      });
    });
  }

  var CANDLE = '<svg class="candle" viewBox="0 0 40 72" aria-hidden="true"><path class="candle__flame" d="M20 4c5 8 8 12 8 17a8 8 0 0 1-16 0c0-5 3-9 8-17z"/><rect x="11" y="32" width="18" height="38" rx="3"/><path d="M20 29v4" stroke-width="2" stroke-linecap="round"/></svg>';

  // ——— Главный блок ———
  function card(e, occ, isToday) {
    var n = countFor(e, occ);
    var eyebrow, big = "", sub = e.relation || "";

    if (e.type === "birthday") {
      eyebrow = isToday ? "Сегодня день рождения" : "День рождения";
      if (n) big = isToday ? years(n) + "!" : "исполнится " + years(n);
    } else if (e.type === "anniversary") {
      eyebrow = isToday ? "Сегодня годовщина свадьбы" : "Годовщина свадьбы";
      if (n) big = years(n) + " вместе";
      if (n && WEDDINGS[n]) sub = (sub ? sub + " · " : "") + WEDDINGS[n] + " свадьба";
    } else {
      eyebrow = e.kind === "birth" ? "Сегодня день рождения · помним" : "День памяти";
      if (!isToday) eyebrow = e.kind === "birth" ? "День рождения · помним" : "День памяти";
      sub = e.years || sub;
      if (n) big = e.kind === "birth" ? years(n) + " со дня рождения" : years(n) + " со дня ухода";
    }

    return (
      '<article class="card card--' + e.type + '">' +
        '<div class="card__photo">' + avatar(e, "ava--xl") + (e.type === "memory" ? CANDLE : "") + "</div>" +
        '<div class="card__body">' +
          '<div class="eyebrow">' + esc(eyebrow) + "</div>" +
          '<h1 class="card__name">' + esc(e.name) + "</h1>" +
          (sub ? '<div class="card__sub">' + esc(sub) + "</div>" : "") +
          (big ? '<div class="card__big">' + esc(big) + "</div>" : "") +
          '<p class="card__text">' + esc(greeting(e, occ)) + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  function renderHero() {
    var hero = document.getElementById("hero");
    var babies = events.filter(function (e) { return newbornAge(e) >= 0; });
    var todays = events
      .filter(function (e) { return daysBetween(today, occurrence(e, today.getFullYear())) === 0 && babies.indexOf(e) < 0; })
      .sort(function (a, b) { return ORDER[a.type] - ORDER[b.type]; });

    // Первые дни после рождения малыша — «Встречайте!» с разрывающейся обёрткой
    if (babies.length) {
      hero.className = "hero wrap hero--festive hero--newborn";
      hero.innerHTML = babies.map(newbornCard).join("") + todays.map(function (e) { return card(e, today, true); }).join("");
      startVideo("salut");
      [].forEach.call(hero.querySelectorAll(".card--newborn"), setupReveal);
      return babies.concat(todays);
    }

    if (todays.length) {
      var festive = todays.some(function (e) { return e.type !== "memory"; });
      hero.className = "hero wrap" + (festive ? " hero--festive" : " hero--quiet") + (todays.length > 1 ? " hero--many" : "");
      hero.innerHTML = todays.map(function (e) { return card(e, today, true); }).join("");
      // День рождения — салют; день памяти без других поводов — без видео; остальное — аквариум
      if (todays.some(function (e) { return e.type === "birthday"; })) startVideo("salut");
      else if (festive) startVideo("aqua");
      if (festive) setTimeout(confetti, 350);
      return todays;
    }

    var upcoming = sortedUpcoming();
    if (!upcoming.length) { hero.innerHTML = '<p class="empty">Добавьте людей в файл data.js</p>'; return []; }
    var first = upcoming[0];
    var sameDay = upcoming.filter(function (u) { return u.days === first.days; });
    hero.className = "hero wrap hero--next" + (sameDay.length > 1 ? " hero--many" : "");
    startVideo("aqua");
    hero.innerHTML =
      '<div class="next">' +
        '<div class="next__label">Сегодня праздников нет. Ближайший —</div>' +
        '<div class="next__when"><span>' + esc(inDays(first.days)) + "</span> " + esc(fmt(first.occ)) + "</div>" +
      "</div>" +
      sameDay.map(function (u) { return card(u.e, u.occ, false); }).join("");
    return sameDay.map(function (u) { return u.e; });
  }

  // ——— Новорождённый: «Встречайте!» первые NEWBORN_DAYS дней ———
  var NEWBORN_DAYS = 10;
  function newbornAge(e) {
    if (!e.newborn || !e.year) return -1;
    var d = daysBetween(new Date(e.year, e.month, e.day), today);
    return d >= 0 && d < NEWBORN_DAYS ? d : -1;
  }

  var BABY =
    '<svg class="baby" viewBox="0 0 240 240" aria-hidden="true">' +
      '<defs><radialGradient id="babySkin" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFE3CF"/><stop offset="1" stop-color="#F6C3A2"/></radialGradient></defs>' +
      '<circle cx="40" cy="138" r="19" fill="#F6C3A2"/><circle cx="40" cy="138" r="9" fill="#E9A88A"/>' +
      '<circle cx="200" cy="138" r="19" fill="#F6C3A2"/><circle cx="200" cy="138" r="9" fill="#E9A88A"/>' +
      '<circle cx="120" cy="136" r="82" fill="url(#babySkin)"/>' +
      '<path d="M37 122C33 38 207 38 203 122C170 104 70 104 37 122Z" fill="#5B8DEF"/>' +
      '<path d="M35 121C70 101 170 101 205 121L203 135C170 116 70 116 37 135Z" fill="#3E6FD8"/>' +
      '<path d="M78 72c8-14 22-22 36-24M150 58c10 4 18 11 23 20" stroke="#8FB4FF" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '<circle cx="120" cy="40" r="17" fill="#A9C6FF"/><circle cx="114" cy="35" r="5" fill="#D6E4FF"/>' +
      '<path d="M114 128c-2-9 9-12 12-5" stroke="#C98A5A" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<g class="baby__eye"><ellipse cx="90" cy="150" rx="9.5" ry="11.5" fill="#2E2230"/><circle cx="93.5" cy="145.5" r="3.6" fill="#fff"/><circle cx="87" cy="154" r="1.6" fill="#fff"/></g>' +
      '<g class="baby__eye"><ellipse cx="150" cy="150" rx="9.5" ry="11.5" fill="#2E2230"/><circle cx="153.5" cy="145.5" r="3.6" fill="#fff"/><circle cx="147" cy="154" r="1.6" fill="#fff"/></g>' +
      '<ellipse cx="72" cy="172" rx="14" ry="9" fill="#FF8F8F" opacity=".5"/><ellipse cx="168" cy="172" rx="14" ry="9" fill="#FF8F8F" opacity=".5"/>' +
      '<ellipse cx="120" cy="164" rx="5.5" ry="3.8" fill="#E9A285"/>' +
      '<path d="M98 176q22 30 44 0z" fill="#B23F4B"/>' +
      '<path d="M108 187q12-9 24 0q-12 9-24 0z" fill="#FF8A8A"/>' +
      '<path d="M98 176q22 4 44 0" stroke="#B23F4B" stroke-width="3" stroke-linecap="round" fill="none"/>' +
    "</svg>";

  window.BABY_SVG = BABY; // запасная нарисованная мордашка, если картинки img/baby.png нет

  function newbornCard(e) {
    var age = newbornAge(e);
    var born = new Date(e.year, e.month, e.day);
    var nb = e.newborn || {};
    var chips = [nb.weight, nb.height, e.relation].filter(Boolean);
    return (
      '<article class="card card--newborn">' +
        '<div class="nb">' +
          '<div class="nb__face nb__face--img"><img class="baby baby--img" src="img/baby.png?v=1" alt="" onerror="this.parentNode.className=\'nb__face\';this.outerHTML=window.BABY_SVG"></div>' +
          '<div class="nb__eyebrow">Встречайте!</div>' +
          '<h1 class="card__name">' + esc(e.name || "Наш малыш") + "</h1>" +
          '<div class="nb__date">' + (age === 0 ? "Родился сегодня, " + esc(fmt(born)) :
            "Родился " + esc(fmt(born)) + " · ему уже " + age + " " + plural(age, ["день", "дня", "дней"])) + "</div>" +
          (chips.length ? '<ul class="nb__chips">' + chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" : "") +
          '<p class="card__text">' + esc(e.greeting || "Добро пожаловать в нашу большую семью! Расти здоровым, крепким и весёлым — мы все тебя уже очень любим.") + "</p>" +
          '<button class="nb__replay" type="button">Открыть ещё раз</button>' +
        "</div>" +
      "</article>"
    );
  }

  // Обёртка поверх карточки: малыш толкается изнутри, середина натягивается, трещины, разрыв
  function setupReveal(cardEl) {
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var replay = cardEl.querySelector(".nb__replay");
    replay.onclick = function () { setupReveal(cardEl); };
    if (still) { cardEl.classList.add("is-revealed"); return; }

    cardEl.classList.remove("is-revealed");
    cardEl.classList.add("is-covered");
    var W = cardEl.offsetWidth, H = cardEl.offsetHeight;

    // Две рваные диагонали крест-накрест: из центра к каждому углу идёт зигзаг
    var C = [50, 50], corners = { tl: [0, 0], tr: [100, 0], br: [100, 100], bl: [0, 100] }, rays = {};
    Object.keys(corners).forEach(function (k) {
      var end = corners[k], K = 8, ray = [C];
      for (var i = 1; i < K; i++) {
        var t = i / K, j = (i % 2 ? 1 : -1) * (1.2 + Math.random() * 2.6);
        // сдвиг поперёк диагонали
        var nx = -(end[1] - C[1]), ny = end[0] - C[0], nl = Math.hypot(nx, ny);
        ray.push([C[0] + (end[0] - C[0]) * t + nx / nl * j, C[1] + (end[1] - C[1]) * t + ny / nl * j]);
      }
      ray.push(end);
      rays[k] = ray;
    });
    function pc(p) { return p[0].toFixed(2) + "% " + p[1].toFixed(2) + "%"; }
    function piece(a, b) { return "polygon(" + rays[a].concat(rays[b].slice().reverse()).map(pc).join(", ") + ")"; }
    var clips = { t: piece("tl", "tr"), r: piece("tr", "br"), b: piece("br", "bl"), l: piece("bl", "tl") };

    function px(p) { return (p[0] * W / 100).toFixed(1) + " " + (p[1] * H / 100).toFixed(1); }
    var cracks = Object.keys(rays).map(function (k) {
      return '<path class="crack" d="M' + rays[k].map(px).join(" L") + '"/>';
    }).join("");
    var branches = Object.keys(rays).map(function (k, n) {
      return [2, 5].map(function (idx, j) {
        var p = rays[k][idx], dir = j % 2 ? 1 : -1;
        var a = [p[0] + dir * (2 + Math.random() * 4), p[1] - dir * (2 + Math.random() * 4)];
        var b2 = [a[0] + dir * (2 + Math.random() * 4), a[1] + (Math.random() - 0.5) * 6];
        return '<path class="crack crack--b" style="--d:' + ((n * 2 + j) * 0.04).toFixed(2) + 's" d="M' + px(p) + " L" + px(a) + " L" + px(b2) + '"/>';
      }).join("");
    }).join("");

    var paper =
      '<div class="tear__paper">' +
        '<span class="tear__kicker">Новость дня</span>' +
        '<span class="tear__title">В нашей семье пополнение!</span>' +
        '<span class="tear__btn">Нажмите, чтобы открыть</span>' +
      "</div>";
    var bits = "";
    for (var b = 0; b < 26; b++) {
      var y = 30 + Math.random() * 40, x = 35 + Math.random() * 30, ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
      bits += '<i class="tear__bit" style="left:' + x.toFixed(1) + "%;top:" + y.toFixed(1) + "%;--dx:" + (Math.cos(ang) * dist).toFixed(0) + "px;--dy:" +
        (Math.sin(ang) * dist - 80).toFixed(0) + "px;--r:" + (Math.random() * 720 - 360).toFixed(0) + "deg;--s:" + (0.6 + Math.random()).toFixed(2) + '"></i>';
    }

    var old = cardEl.querySelector(".tear");
    if (old) old.remove();
    var tear = document.createElement("button");
    tear.type = "button";
    tear.className = "tear";
    tear.setAttribute("aria-label", "Открыть новость");
    tear.innerHTML =
      // целый лист под кусками закрывает швы, пока обёртка не порвалась
      '<div class="tear__whole">' + paper + "</div>" +
      ["t", "r", "b", "l"].map(function (k) {
        return '<div class="tear__piece tear__piece--' + k + '"><div class="tear__clip" style="clip-path:' + clips[k] + '">' + paper + "</div></div>";
      }).join("") +
      '<span class="tear__glow"></span>' +
      '<svg class="tear__cracks" viewBox="0 0 ' + W + " " + H + '">' + cracks + branches + "</svg>" +
      bits;
    cardEl.appendChild(tear);
    [].forEach.call(tear.querySelectorAll(".crack"), function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    // Пока ждём — малыш «толкается» изнутри
    var kick = setInterval(function () {
      tear.classList.remove("is-kick");
      void tear.offsetWidth;
      tear.classList.add("is-kick");
    }, 2200);
    var started = false;
    function go() {
      if (started) return;
      started = true;
      clearInterval(kick); clearTimeout(auto);
      tear.classList.remove("is-kick");
      tear.classList.add("is-pushing");
      setTimeout(function () { tear.classList.add("is-cracking"); }, 550);
      setTimeout(function () {
        tear.classList.add("is-torn");
        cardEl.classList.remove("is-covered");
        cardEl.classList.add("is-revealed");
      }, 1450);
      setTimeout(function () { confetti(["#5B8DEF", "#8FB4FF", "#BFD4FF", "#FFFFFF", "#F2B33D"]); }, 1650);
      setTimeout(function () { tear.remove(); }, 2700);
    }
    tear.addEventListener("click", go);
    var auto = setTimeout(go, 4500);
  }

  // День рождения ушедшего не анонсируем заранее (ни «ближайшим», ни в «Скоро») — только в сам день; в календаре он есть
  function onlyOnTheDay(e) { return e.type === "memory" && e.kind === "birth"; }

  function sortedUpcoming() {
    return events
      .filter(function (e) { return !onlyOnTheDay(e); })
      .map(function (e) {
        var occ = nextOccurrence(e, today);
        return { e: e, occ: occ, days: daysBetween(today, occ) };
      })
      .filter(function (u) { return u.days > 0; })
      .sort(function (a, b) { return a.days - b.days || ORDER[a.e.type] - ORDER[b.e.type]; });
  }

  // ——— «Скоро» (до конца месяца) и «В следующем месяце» ———
  function renderSoon(shown) {
    // Сегодняшние сюда не попадают (days > 0), а «ближайший» из главного блока остаётся в списке своего месяца
    var all = sortedUpcoming();
    var nextStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    var nextEnd = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    var thisMonth = all.filter(function (u) { return u.occ < nextStart; });
    var nextMonth = all.filter(function (u) { return u.occ >= nextStart && u.occ < nextEnd; });

    var later = all.filter(function (u) { return u.occ >= nextEnd; }).slice(0, 1);
    var curGen = fmt(today).split(" ")[1];

    var html = '<h2 class="h2">Скоро</h2>' +
      (thisMonth.length ? soonList(thisMonth) : '<p class="soon__empty">До конца ' + curGen + " праздников больше нет</p>");
    html += '<h2 class="h2 soon__title-next">В следующем месяце <span>' + MONTHS[nextStart.getMonth()] + "</span></h2>";
    if (nextMonth.length) {
      html += soonList(nextMonth);
    } else {
      html += '<p class="soon__empty">В ' + MONTHS_IN[nextStart.getMonth()] + " праздников нет" + (later.length ? ". Следующий:" : "") + "</p>" + (later.length ? soonList(later) : "");
    }
    document.getElementById("soon-section").innerHTML = html;
  }

  function soonList(list) {
    return '<ol class="soon__list">' + list.map(function (u) {
      return (
        '<li class="soon__item soon__item--' + u.e.type + '">' +
          '<a href="?date=' + iso(u.occ) + '">' +
            avatar(u.e, "ava--md") +
            '<span class="soon__info"><b>' + esc(u.e.name) + "</b><small>" + esc(what(u.e, u.occ, false)) + "</small></span>" +
            '<span class="soon__when"><b>' + esc(fmt(u.occ)) + "</b><small>" + esc(inDays(u.days)) + "</small></span>" +
          "</a>" +
        "</li>"
      );
    }).join("") + "</ol>";
  }

  // ——— Календарь на год ———
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function renderYear() {
    var y = today.getFullYear();
    var html = "";
    for (var m = 0; m < 12; m++) {
      var items = events
        .map(function (e) { return { e: e, occ: occurrence(e, y) }; })
        .filter(function (u) { return u.occ.getMonth() === m; })
        .sort(function (a, b) { return a.occ - b.occ || ORDER[a.e.type] - ORDER[b.e.type]; });
      var cur = m === today.getMonth();
      html +=
        '<section class="month' + (cur ? " month--current" : "") + '"' + (cur ? ' id="current-month"' : "") + ">" +
          '<h3 class="month__name">' + MONTHS[m] + (cur ? " <em>сейчас</em>" : "") + "</h3>" +
          (items.length
            ? '<ul class="month__list">' + items.map(function (u) {
                var d = daysBetween(today, u.occ);
                var state = d === 0 ? " is-today" : d < 0 ? " is-past" : "";
                return (
                  '<li class="mday mday--' + u.e.type + state + '">' +
                    '<a href="?date=' + iso(u.occ) + '" title="' + esc(what(u.e, u.occ, false)) + '">' +
                      '<span class="mday__num">' + u.occ.getDate() + "</span>" +
                      avatar(u.e, "ava--sm") +
                      '<span class="mday__name">' + esc(u.e.name) + "</span>" +
                    "</a>" +
                  "</li>"
                );
              }).join("") + "</ul>"
            : '<p class="month__empty">нет дат</p>') +
        "</section>";
    }
    document.getElementById("months").innerHTML = html;
  }

  // ——— Видео на фоне: грузим только нужный ролик ———
  function startVideo(name) {
    document.documentElement.classList.add("has-video", name);
    var v = document.querySelector(".bg__video");
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.src = "video/" + name + ".mp4?v=2"; // меняйте число, если заменили ролик, — иначе браузер покажет старый
    
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  // ——— Конфетти ———
  function confetti(palette) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = document.getElementById("confetti"), ctx = c.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var colors = palette || ["#E86A4E", "#F2B33D", "#7FB685", "#5B8DEF", "#E37BB0", "#FFFFFF"];
    var parts = [];
    for (var i = 0; i < 170; i++) {
      parts.push({
        x: W * (0.15 + Math.random() * 0.7), y: H * 0.35 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 13, vy: -8 - Math.random() * 10,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        c: colors[i % colors.length],
      });
    }
    var start = performance.now();
    (function frame(t) {
      var life = (t - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, life - 3.5) / 1.5);
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 1.7)));
        ctx.restore();
      });
      if (life < 5) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(start);
  }

  // ——— Запуск ———
  if (SITE.title) {
    document.getElementById("site-title").textContent = SITE.title;
    document.title = SITE.title;
  }
  var tl = today.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("today-label").textContent = tl.charAt(0).toUpperCase() + tl.slice(1);

  var shown = renderHero();
  renderSoon(shown);
  renderYear();
  startSlides(shown);
})();
