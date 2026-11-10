(function () {
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (iso) => new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const EMBLEM = "images/emblem.svg";
  const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
  const player = (id) => PLAYERS.find((p) => p.id === id);

  const NAV = [
    { id: "news", name: "Новости" },
    { id: "team", name: "Состав" },
    { id: "matches", name: "Матчи" },
    { id: "club", name: "О клубе" },
  ];

  // ---------- Элементы ----------
  function cover(n) {
    return n.image
      ? `<div class="cover"><img class="photo" src="${esc(n.image)}" alt="${esc(n.title)}" loading="lazy"></div>`
      : `<div class="cover cover--brand"><img src="${EMBLEM}" alt=""></div>`;
  }

  // Заглушка игрока: футболка в полоску с номером
  function jersey(num) {
    return `<div class="jersey"><svg viewBox="0 0 100 90" aria-hidden="true">
      <defs><clipPath id="j${num}"><path d="M30 4 L14 10 L2 30 L16 38 L22 30 L22 88 L78 88 L78 30 L84 38 L98 30 L86 10 L70 4 C66 12 58 16 50 16 C42 16 34 12 30 4 Z"/></clipPath></defs>
      <g clip-path="url(#j${num})"><rect width="100" height="90" fill="#141111"/>
        <rect x="28" width="11" height="90" fill="#d7262f"/><rect x="44.5" width="11" height="90" fill="#d7262f"/><rect x="61" width="11" height="90" fill="#d7262f"/></g>
      <text x="50" y="66" text-anchor="middle" font-family="Unbounded, Arial Black, sans-serif" font-weight="800" font-size="26" fill="#fff" stroke="#141111" stroke-width="1.5" paint-order="stroke">${esc(num)}</text>
    </svg></div>`;
  }
  function playerPic(p) {
    return `<div class="player__pic">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">` : jersey(p.number)}
      </div>`;
  }

  function newsCard(n) {
    return `<article class="card"><a href="#news-${n.id}">${cover(n)}</a>
      <div class="card__body"><time>${fmtDate(n.date)}</time>
        <h3><a href="#news-${n.id}">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p></div></article>`;
  }
  function playerCard(p) {
    return `<a class="player" href="#player-${p.id}">${playerPic(p)}
      <div class="player__info"><b>${esc(p.name)}</b><span>${esc(p.position)}</span></div></a>`;
  }

  function matchRow(m) {
    let cls = "upcoming", res = "—";
    if (m.status === "played" && m.score) {
      const [a, b] = m.score.split(":").map(Number);
      const us = m.home ? a : b, them = m.home ? b : a;
      cls = us > them ? "win" : us < them ? "loss" : "draw";
      res = esc(m.score);
    }
    const home = m.home ? CLUB.name : m.opponent, away = m.home ? m.opponent : CLUB.name;
    return `<div class="match match--${cls}"><time class="when">${fmtDate(m.date)}</time>
      <span class="team">${esc(home)}</span><span class="res">${res}</span><span class="team">${esc(away)}</span></div>`;
  }

  // ---------- Страницы ----------
  const views = {
    news() {
      const list = [...NEWS].sort(byDate);
      const [top, ...rest] = list;
      if (!top) return `<div class="empty">Новостей пока нет.</div>`;
      return `<a class="hero" href="#news-${top.id}">${cover(top)}
          <div class="hero__text"><span class="label">Главное</span><h1>${esc(top.title)}</h1><p>${esc(top.excerpt)}</p><time>${fmtDate(top.date)}</time></div></a>
        <h2 class="section-title">Все новости</h2>
        ${rest.length ? `<div class="grid">${rest.map(newsCard).join("")}</div>` : `<div class="empty">Скоро здесь появятся новые материалы о команде.</div>`}`;
    },
    team() {
      return `<h1 class="page-title">Состав</h1><p class="page-sub">${PLAYERS.length} игроков в заявке ${esc(CLUB.name)}</p>
        <div class="squad">${[...PLAYERS].sort((a, b) => a.number - b.number).map(playerCard).join("")}</div>`;
    },
    matches() {
      const up = MATCHES.filter((m) => m.status !== "played").sort((a, b) => a.date.localeCompare(b.date));
      const played = MATCHES.filter((m) => m.status === "played").sort(byDate);
      return `<h1 class="page-title">Матчи</h1><p class="page-sub">Расписание и результаты ${esc(CLUB.name)}</p>
        <h2 class="section-title">Ближайшие</h2>${up.length ? `<div class="matches">${up.map(matchRow).join("")}</div>` : `<div class="empty">Ближайшие матчи пока не объявлены.</div>`}
        <h2 class="section-title">Результаты</h2>${played.length ? `<div class="matches">${played.map(matchRow).join("")}</div>` : `<div class="empty">Сыгранных матчей пока нет.</div>`}`;
    },
    club() {
      return `<h1 class="page-title">О клубе</h1><p class="page-sub">${esc(CLUB.tagline)}</p>
        <div class="club"><img src="${EMBLEM}" alt="Эмблема ${esc(CLUB.name)}">
          <div>${CLUB.about.map((p) => `<p>${esc(p)}</p>`).join("")}
            <dl class="facts"><div><dt>Игроков</dt><dd>${PLAYERS.length}</dd></div><div><dt>Форма</dt><dd>${esc(CLUB.colors)}</dd></div><div><dt>Статус</dt><dd>Любители</dd></div></dl>
          </div></div>`;
    },
  };

  function articleView(id) {
    const n = NEWS.find((x) => x.id === id);
    if (!n) return `<div class="empty">Новость не найдена. <a class="back" href="#news">← Все новости</a></div>`;
    const tagged = (n.players || []).map(player).filter(Boolean);
    const more = [...NEWS].sort(byDate).filter((x) => x.id !== n.id).slice(0, 3);
    return `<article class="article"><div class="article__head"><span class="label">Новости клуба</span>
        <h1>${esc(n.title)}</h1><time>${fmtDate(n.date)}</time></div>${cover(n)}
        <div class="article__body"><p class="lead">${esc(n.excerpt)}</p>${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}
        ${tagged.length ? `<div class="chips">${tagged.map((p) => `<a class="chip" href="#player-${p.id}">#${esc(p.number)} ${esc(p.name)}</a>`).join("")}</div>` : ""}
        <a class="back" href="#news">← Все новости</a></div></article>
      ${more.length ? `<h2 class="section-title">Читайте также</h2><div class="grid">${more.map(newsCard).join("")}</div>` : ""}`;
  }

  function playerView(id) {
    const p = player(id);
    if (!p) return `<div class="empty">Игрок не найден. <a class="back" href="#team">← Состав</a></div>`;
    const news = NEWS.filter((n) => (n.players || []).includes(p.id)).sort(byDate);
    return `<div class="profile">${playerPic(p)}<div class="profile__body"><span class="label">${esc(p.position)}</span>
        <h1>${esc(p.name)}</h1><dl class="facts"><div><dt>Номер</dt><dd>${esc(p.number)}</dd></div><div><dt>Позиция</dt><dd>${esc(p.position)}</dd></div></dl>
        ${p.bio ? `<p>${esc(p.bio)}</p>` : ""}<a class="back" href="#team">← Весь состав</a></div></div>
      ${news.length ? `<h2 class="section-title">Новости об игроке</h2><div class="grid">${news.map(newsCard).join("")}</div>` : ""}`;
  }

  // ---------- Боковая колонка ----------
  function renderSidebar() {
    $("#sidebar").innerHTML = `
      <section class="widget club-card"><img src="${EMBLEM}" alt=""><b>${esc(CLUB.name)}</b><small>${esc(CLUB.tagline)}</small>
        <span class="kit"><i></i> Форма: ${esc(CLUB.colors.toLowerCase())}</span></section>
      <section class="widget"><h2>Состав</h2><ul class="mini-squad">${[...PLAYERS].sort((a, b) => a.number - b.number)
        .map((p) => `<li><a href="#player-${p.id}"><span class="n">${esc(p.number)}</span><span>${esc(p.name)}</span><small>${esc(p.short || p.position)}</small></a></li>`).join("")}</ul></section>
      <section class="widget"><h2>Следующий матч</h2>${(() => {
        const m = MATCHES.filter((x) => x.status !== "played").sort((a, b) => a.date.localeCompare(b.date))[0];
        return m ? `<b>${esc(CLUB.name)} — ${esc(m.opponent)}</b><br><time>${fmtDate(m.date)}</time>` : `<span class="meta">Пока не назначен</span>`;
      })()}</section>`;
  }

  // ---------- Маршрутизация: #news, #team, #matches, #club, #news-3, #player-2 ----------
  function route() {
    const h = location.hash.slice(1) || "news";
    let section = h, html;
    const m = h.match(/^(news|player)-(\d+)$/);
    if (m) { section = m[1] === "news" ? "news" : "team"; html = m[1] === "news" ? articleView(+m[2]) : playerView(+m[2]); }
    else { if (!views[h]) section = "news"; html = views[section](); }
    $("#view").innerHTML = html;
    $("#nav").innerHTML = NAV.map((n) => `<a href="#${n.id}" class="${n.id === section ? "active" : ""}">${n.name}</a>`).join("");
    document.body.classList.remove("nav-open");
    window.scrollTo(0, 0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
    $("#year").textContent = new Date().getFullYear();
    renderSidebar();
    route();
    window.addEventListener("hashchange", route);
  });
})();
