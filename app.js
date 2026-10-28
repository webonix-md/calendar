(function () {
  "use strict";

  var DATA = window.FAMILY || [];
  var GREET = window.GREETINGS || {};
  var SITE = window.SITE || {};
  var MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
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
    var todays = events
      .filter(function (e) { return daysBetween(today, occurrence(e, today.getFullYear())) === 0; })
      .sort(function (a, b) { return ORDER[a.type] - ORDER[b.type]; });

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

  function sortedUpcoming() {
    return events
      .map(function (e) {
        var occ = nextOccurrence(e, today);
        return { e: e, occ: occ, days: daysBetween(today, occ) };
      })
      .filter(function (u) { return u.days > 0; })
      .sort(function (a, b) { return a.days - b.days || ORDER[a.e.type] - ORDER[b.e.type]; });
  }

  // ——— «Скоро» ———
  function renderSoon(shown) {
    var skip = shown.map(function (e) { return e.id; });
    var list = sortedUpcoming().filter(function (u) { return skip.indexOf(u.e.id) < 0; }).slice(0, 8);
    document.getElementById("soon").innerHTML = list.map(function (u) {
      return (
        '<li class="soon__item soon__item--' + u.e.type + '">' +
          '<a href="?date=' + iso(u.occ) + '">' +
            avatar(u.e, "ava--md") +
            '<span class="soon__info"><b>' + esc(u.e.name) + "</b><small>" + esc(what(u.e, u.occ, false)) + "</small></span>" +
            '<span class="soon__when"><b>' + esc(fmt(u.occ)) + "</b><small>" + esc(inDays(u.days)) + "</small></span>" +
          "</a>" +
        "</li>"
      );
    }).join("");
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
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = document.getElementById("confetti"), ctx = c.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    var colors = ["#E86A4E", "#F2B33D", "#7FB685", "#5B8DEF", "#E37BB0", "#FFFFFF"];
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
