(function () {
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = (iso) => new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const EMBLEM = "images/emblem.svg";
  const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
  const player = (id) => PLAYERS.find((p) => p.id === id);
  const squad = () => PLAYERS.filter((p) => !p.former && !p.academy).sort((a, b) => a.number - b.number);
  const academy = () => PLAYERS.filter((p) => p.academy);
  const formers = () => PLAYERS.filter((p) => p.former);

  const IG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>`;
  const igUrl = (h) => `https://www.instagram.com/${encodeURIComponent(h)}/`;
  const isCaptain = (p) => p.id === CLUB.captain;
  // Флаги рисуем SVG — эмодзи-флаги не отображаются в Windows
  const FLAGS = {
    de: '<rect width="3" height="1" fill="#000"/><rect y="1" width="3" height="1" fill="#DD0000"/><rect y="2" width="3" height="1" fill="#FFCE00"/>',
    es: '<rect width="3" height="3" fill="#AA151B"/><rect y=".75" width="3" height="1.5" fill="#F1BF00"/>',
    fr: '<rect width="1" height="3" fill="#0055A4"/><rect x="1" width="1" height="3" fill="#fff"/><rect x="2" width="1" height="3" fill="#EF4135"/>',
    it: '<rect width="1" height="3" fill="#009246"/><rect x="1" width="1" height="3" fill="#fff"/><rect x="2" width="1" height="3" fill="#CE2B37"/>',
    ru: '<rect width="3" height="1" fill="#fff"/><rect y="1" width="3" height="1" fill="#0039A6"/><rect y="2" width="3" height="1" fill="#D52B1E"/>',
    pt: '<rect width="3" height="3" fill="#FF0000"/><rect width="1.2" height="3" fill="#006600"/><circle cx="1.2" cy="1.5" r=".5" fill="#FFCC00"/>',
    br: '<rect width="3" height="3" fill="#009C3B"/><path d="M1.5 .35 2.8 1.5 1.5 2.65 .2 1.5z" fill="#FFDF00"/><circle cx="1.5" cy="1.5" r=".55" fill="#002776"/>',
    ar: '<rect width="3" height="3" fill="#74ACDF"/><rect y="1" width="3" height="1" fill="#fff"/><circle cx="1.5" cy="1.5" r=".25" fill="#F6B40E"/>',
    gb: '<rect width="3" height="3" fill="#012169"/><path d="M0 0 3 3M3 0 0 3" stroke="#fff" stroke-width=".6"/><path d="M0 0 3 3M3 0 0 3" stroke="#C8102E" stroke-width=".25"/><path d="M1.5 0v3M0 1.5h3" stroke="#fff" stroke-width=".8"/><path d="M1.5 0v3M0 1.5h3" stroke="#C8102E" stroke-width=".45"/>',
    kz: '<rect width="3" height="3" fill="#00AFCA"/><circle cx="1.5" cy="1.3" r=".45" fill="#FEC50C"/><path d="M1 2.05q.5-.3 1 0" stroke="#FEC50C" stroke-width=".12" fill="none"/>',
    tr: '<rect width="3" height="3" fill="#E30A17"/><circle cx="1.25" cy="1.5" r=".65" fill="#fff"/><circle cx="1.42" cy="1.5" r=".52" fill="#E30A17"/><circle cx="2.05" cy="1.5" r=".18" fill="#fff"/>',
    en: '<rect width="3" height="3" fill="#fff"/><rect x="1.2" width=".6" height="3" fill="#CE1124"/><rect y="1.2" width="3" height=".6" fill="#CE1124"/>',
    il: '<rect width="3" height="3" fill="#fff"/><rect y=".35" width="3" height=".35" fill="#0038B8"/><rect y="2.3" width="3" height=".35" fill="#0038B8"/><path d="M1.5 1 1.86 1.62H1.14zM1.5 2 1.14 1.38h.72z" fill="none" stroke="#0038B8" stroke-width=".09"/>',
    us: '<rect width="3" height="3" fill="#B22234"/><path d="M0 .35h3M0 .8h3M0 1.25h3M0 1.7h3M0 2.15h3M0 2.6h3" stroke="#fff" stroke-width=".22"/><rect width="1.3" height="1.5" fill="#3C3B6E"/>',
  };
  let flagSeq = 0;
  // flag: "fr" или ["ru", "il"] — второй вариант делит флаг по диагонали
  function flagSvg(p, cls = "flag") {
    const codes = [].concat(p.flag || []).filter((c) => FLAGS[c]);
    if (!codes.length) return "";
    const label = `<title>${esc(p.nationality || "")}</title>`;
    if (codes.length === 1) return `<svg class="${cls}" viewBox="0 0 3 3" preserveAspectRatio="none" role="img" aria-label="${esc(p.nationality || "")}">${label}${FLAGS[codes[0]]}</svg>`;
    const id = "fl" + ++flagSeq;
    return `<svg class="${cls}" viewBox="0 0 3 3" preserveAspectRatio="none" role="img" aria-label="${esc(p.nationality || "")}">${label}
      <defs><clipPath id="${id}a"><path d="M0 0H3L0 3z"/></clipPath><clipPath id="${id}b"><path d="M3 0V3H0z"/></clipPath></defs>
      <g clip-path="url(#${id}a)">${FLAGS[codes[0]]}</g><g clip-path="url(#${id}b)">${FLAGS[codes[1]]}</g>
      <path d="M3 0 0 3" stroke="rgba(0,0,0,.25)" stroke-width=".04"/></svg>`;
  }
  const isRival = (name) => name === CLUB.rival;

  const NAV = [
    { id: "news", name: "Новости" },
    { id: "team", name: "Состав" },
    { id: "feed", name: "Лента" },
    { id: "table", name: "Таблица" },
    { id: "ucl", name: "ЛЧ" },
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
  function jersey(num, uid = num) {
    return `<div class="jersey"><svg viewBox="0 0 100 90" aria-hidden="true">
      <defs><clipPath id="j${uid}"><path d="M30 4 L14 10 L2 30 L16 38 L22 30 L22 88 L78 88 L78 30 L84 38 L98 30 L86 10 L70 4 C66 12 58 16 50 16 C42 16 34 12 30 4 Z"/></clipPath></defs>
      <g clip-path="url(#j${uid})"><rect width="100" height="90" fill="#141111"/>
        <rect x="28" width="11" height="90" fill="#d7262f"/><rect x="44.5" width="11" height="90" fill="#d7262f"/><rect x="61" width="11" height="90" fill="#d7262f"/></g>
      <text x="50" y="66" text-anchor="middle" font-family="Unbounded, Arial Black, sans-serif" font-weight="800" font-size="26" fill="#fff" stroke="#141111" stroke-width="1.5" paint-order="stroke">${esc(num)}</text>
    </svg></div>`;
  }
  function playerPic(p) {
    return `<div class="player__pic">${flagSvg(p, "flag flag--corner")}${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">` : jersey(p.number != null ? p.number : p.name.charAt(0).toUpperCase(), p.id)}
      </div>`;
  }

  function newsCard(n) {
    return `<article class="card"><a href="#news-${n.id}">${cover(n)}</a>
      <div class="card__body"><time>${fmtDate(n.date)}</time>
        <h3><a href="#news-${n.id}">${esc(n.title)}</a></h3><p>${esc(n.excerpt)}</p>
        ${(COMMENTS["news-" + n.id] || []).length ? `<span class="meta">💬 ${COMMENTS["news-" + n.id].length}</span>` : ""}</div></article>`;
  }
  function playerCard(p) {
    const balls = awardsOf(p).filter((a) => a.kind === "ball").length, total = awardsOf(p).length;
    const badge = total ? `<span class="player__badge${balls ? " gold" : ""}" title="Индивидуальные награды">${balls ? BALL : CUP}${balls ? `${balls}× ЗМ` : total}</span>` : "";
    return `<a class="player" href="#player-${p.id}">${playerPic(p).replace(/<\/div>$/, `${badge}</div>`)}
      <div class="player__info"><b>${esc(p.name)}${isCaptain(p) ? ` <span class="cap" title="Капитан">C</span>` : ""}</b>${p.nickname ? `<em class="nick">«${esc(p.nickname)}»</em>` : ""}<span>${p.former ? `→ ${esc(p.transfer || "покинул клуб")}` : esc(p.position)}</span></div></a>`;
  }

  // Сыгранный матч из LEAGUE.results с точки зрения FC Durum
  function resultRow(r) {
    const [hg, ag] = r.score.split(":").map(Number);
    const homeUs = r.home === CLUB.name;
    const us = homeUs ? hg : ag, them = homeUs ? ag : hg;
    const cls = us > them ? "win" : us < them ? "loss" : "draw";
    const label = { win: "Победа", loss: "Поражение", draw: "Ничья" }[cls];
    const derby = isRival(r.home) || isRival(r.away);
    return `<div class="match match--${cls}"><span class="when">${r.round}-й тур · <b>${label}</b>${derby ? ` <span class="derby">Дерби</span>` : ""}</span>
      <span class="team">${esc(r.home)}</span><span class="res">${hg} : ${ag}</span><span class="team">${esc(r.away)}</span></div>`;
  }
  const TBD = "Соперник определяется";
  function upcomingRow(m) {
    const opp = m.opponent || TBD;
    const home = m.home ? CLUB.name : opp, away = m.home ? opp : CLUB.name;
    return `<div class="match match--upcoming"><time class="when">${m.tournament ? `${esc(m.tournament)} · ` : ""}${fmtDate(m.date)}</time>
      <span class="team">${esc(home)}</span><span class="res">—</span><span class="team">${esc(away)}</span></div>`;
  }
  const ourResults = () => LEAGUE.results.filter((r) => r.home === CLUB.name || r.away === CLUB.name).sort((a, b) => b.round - a.round);

  const CUP = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 8h28v14c0 9-6 16-14 16s-14-7-14-16V8z" fill="currentColor"/>
    <path d="M18 12H9v5c0 6 4 10 10 11M46 12h9v5c0 6-4 10-10 11" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="28" y="38" width="8" height="10" fill="currentColor"/><rect x="20" y="48" width="24" height="7" rx="2" fill="currentColor"/></svg>`;

  const BALL = `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="26" r="20" fill="currentColor"/>
    <path d="M32 14l7 5-3 8h-8l-3-8z" fill="rgba(0,0,0,.28)"/><path d="M20 52h24l-3-8H23z" fill="currentColor"/><rect x="16" y="52" width="32" height="6" rx="2" fill="currentColor"/></svg>`;
  const awardIcon = (a) => (a.kind === "ball" ? BALL : CUP);
  const awardsOf = (p) => p.awards || [];
  // «2× Золотой мяч» — группировка одинаковых наград
  function awardSummary(p) {
    const g = {};
    awardsOf(p).forEach((a) => (g[a.title] = g[a.title] || { ...a, n: 0, seasons: [] }, g[a.title].n++, g[a.title].seasons.push(a.season)));
    return Object.values(g);
  }

  function standings() {
    const t = {};
    LEAGUE.teams.forEach((name) => (t[name] = { name, p: 0, w: 0, d: 0, l: 0, zab: 0, prop: 0, form: [] }));
    for (const r of LEAGUE.results) {
      const [hg, ag] = r.score.split(":").map(Number);
      const h = t[r.home], a = t[r.away];
      if (!h || !a) continue;
      h.p++; a.p++; h.zab += hg; h.prop += ag; a.zab += ag; a.prop += hg;
      if (hg > ag) { h.w++; a.l++; h.form.push("w"); a.form.push("l"); }
      else if (hg < ag) { a.w++; h.l++; h.form.push("l"); a.form.push("w"); }
      else { h.d++; a.d++; h.form.push("d"); a.form.push("d"); }
    }
    return Object.values(t)
      .map((x) => ({ ...x, pts: x.w * 3 + x.d, gd: x.zab - x.prop }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.zab - a.zab || a.name.localeCompare(b.name));
  }

  const FORM = { w: "В", d: "Н", l: "П" };
  const formDots = (f) => `<span class="form">${f.slice(-5).map((x) => `<i class="f-${x}" title="${FORM[x]}">${FORM[x]}</i>`).join("")}</span>`;

  function trophiesBlock() {
    const finals = UCL.history.filter((h) => h.stage === "Финал");
    return `<div class="trophies">${TROPHIES.map((t) => `<div class="trophy"><span class="trophy__cup">${CUP}</span>
      <b>${esc(t.title)}</b><span>${esc(t.season)}</span></div>`).join("")}
      ${finals.map((h) => `<div class="trophy trophy--silver"><span class="trophy__cup">${CUP}</span>
      <b>Финалист ${esc(UCL.short)}</b><span>${h.season ? esc(h.season) : esc(UCL.name)}</span>${h.opponent ? `<small class="trophy__note">${esc(h.score)} · ${esc(h.opponent)}</small>` : ""}</div>`).join("")}</div>`;
  }

  function daysUntil(iso) {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : "")), now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((d - now) / 86400000);
  }
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };

  // ---------- Комментарии ----------
  const fmtTime = (iso) => new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  function avatarColor(name) { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 42%)`; }
  function commentsBlock(key) {
    const list = (window.COMMENTS && COMMENTS[key]) || [];
    const n = list.length;
    return `<section class="comments"><h2 class="section-title">Комментарии · <span id="lc-total" data-static="${n}">${n}</span></h2>
      ${[...list].sort((a, b) => a.date.localeCompare(b.date)).map((c) => `<article class="comment">
        <span class="comment__ava" style="background:${avatarColor(c.author)}">${esc(c.author.replace(/[^\p{L}\p{N}]/gu, "").charAt(0).toUpperCase())}</span>
        <div class="comment__main"><div class="comment__head"><b>${esc(c.author)}</b><time>${fmtTime(c.date)}</time></div>
          <p>${esc(c.text)}</p>
          <div class="comment__votes"><span title="Нравится">▲ ${c.likes || 0}</span><span title="Не нравится">▼ ${c.dislikes || 0}</span></div></div>
      </article>`).join("")}
      <div id="lc-root" hidden><div id="lc-list"></div><div id="lc-form" class="lc-form"></div></div></section>`;
  }

  // ---------- Лента ----------
  const VERIFIED = `<svg class="verified" viewBox="0 0 24 24" aria-label="Подтверждённый аккаунт"><path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z" fill="currentColor"/><path d="M8 12.3l2.6 2.6L16.2 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  function postAuthor(a) {
    if (a === "club") return { name: CLUB.name, handle: "fcdurum", ava: `<img class="post__ava post__ava--club" src="${EMBLEM}" alt="">`, href: "#club", club: true };
    const p = player(a);
    if (!p) return { name: "Игрок", handle: "player", ava: `<span class="post__ava"></span>`, href: "#team" };
    return { name: p.name, handle: p.instagram || ("player" + p.id), p,
      ava: p.photo ? `<img class="post__ava" src="${esc(p.photo)}" alt="">` : `<span class="post__ava post__ava--num">${esc(p.number)}</span>`,
      href: `#player-${p.id}` };
  }
  function ago(iso) {
    const d = new Date(iso), diff = (Date.now() - d) / 60000;
    if (diff < 1) return "сейчас";
    if (diff < 60) return `${Math.floor(diff)} мин`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ч`;
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  }
  const linkify = (t) => esc(t).replace(/(^|\s)([#@][\p{L}\p{N}_]+)/gu, '$1<span class="tag">$2</span>').replace(/\n/g, "<br>");
  function postCard(post, full) {
    const a = postAuthor(post.author);
    const replies = (COMMENTS["post-" + post.id] || []).length;
    return `<article class="post${full ? " post--full" : ""}">
      <a href="${a.href}">${a.ava}</a>
      <div class="post__main">
        <div class="post__head"><a href="${a.href}" class="post__name">${esc(a.name)}</a>${VERIFIED}${a.p ? flagSvg(a.p, "flag flag--mini") : ""}
          <span class="post__handle">@${esc(a.handle)}</span><span class="post__dot">·</span><time title="${fmtTime(post.date)}">${full ? fmtTime(post.date) : ago(post.date)}</time></div>
        <div class="post__text">${linkify(post.text)}</div>
        ${post.image ? `<img class="post__img" src="${esc(post.image)}" alt="" loading="lazy">` : ""}
        <div class="post__actions">
          <a href="#post-${post.id}" class="pa pa--reply" title="Ответить"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${replies || ""}</a>
          <span class="pa pa--rt" title="Репосты"><svg viewBox="0 0 24 24"><path d="M7 7h10v6M17 17H7v-6M14 4l3 3-3 3M10 20l-3-3 3-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${post.reposts || 0}</span>
          <button type="button" class="pa pa--like" data-post="${post.id}" title="Нравится"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span>${post.likes || 0}</span></button>
        </div>
      </div></article>`;
  }
  // Лайк — личная отметка посетителя (хранится в его браузере)
  function likedSet() { try { return new Set(JSON.parse(localStorage.getItem("durum-likes") || "[]")); } catch (e) { return new Set(); } }
  function bindLikes() {
    const liked = likedSet();
    document.querySelectorAll(".pa--like").forEach((b) => {
      const id = b.dataset.post, base = (POSTS.find((x) => String(x.id) === id) || {}).likes || 0;
      const paint = () => { const on = liked.has(id); b.classList.toggle("on", on); b.querySelector("span").textContent = base + (on ? 1 : 0); };
      paint();
      b.onclick = () => { liked.has(id) ? liked.delete(id) : liked.add(id); try { localStorage.setItem("durum-likes", JSON.stringify([...liked])); } catch (e) {} paint(); };
    });
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
    team(tab = "main") {
      const ex = formers(), ac = academy();
      const tabs = `<div class="tabs" role="tablist"><a href="#team" role="tab" class="${tab === "main" ? "on" : ""}">Основной состав <span>${squad().length}</span></a>
        <a href="#academy" role="tab" class="${tab === "academy" ? "on" : ""}">Академия <span>${ac.length}</span></a></div>`;
      if (tab === "academy") return `<h1 class="page-title">Академия</h1><p class="page-sub">Молодые игроки ${esc(CLUB.name)} — будущее клуба</p>${tabs}
        ${ac.length ? `<div class="squad squad--academy">${ac.map(playerCard).join("")}</div>` : `<div class="empty">В академии пока нет игроков.</div>`}`;
      return `<h1 class="page-title">Состав</h1><p class="page-sub">${squad().length} игроков в заявке ${esc(CLUB.name)}</p>${tabs}
        <div class="squad">${squad().map(playerCard).join("")}</div>
        ${ex.length ? `<h2 class="section-title">Бывшие игроки</h2><div class="squad squad--former">${ex.map(playerCard).join("")}</div>` : ""}`;
    },
    academy() { return views.team("academy"); },
    feed() {
      // Порядок — по времени публикации на сайте: последний добавленный пост (больший id) сверху
      const list = [...POSTS].sort((a, b) => b.id - a.id);
      return `<div class="feed"><div class="feed__top"><h1 class="page-title">Лента</h1><p class="page-sub">Игроки ${esc(CLUB.name)} — от первого лица</p></div>
        <div class="feed__who">${squad().map((p) => `<a href="#player-${p.id}" title="${esc(p.name)}">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}">` : ""}<span>${esc(p.name.split(" ")[0])}</span></a>`).join("")}</div>
        ${list.length ? list.map((p) => postCard(p)).join("") : `<div class="empty">Пока здесь тихо. Скоро игроки напишут первые посты.</div>`}</div>`;
    },
    table() {
      const rows = standings().map((t, i) => `<tr class="${t.name === CLUB.name ? "us" : ""}">
          <td class="pos">${i + 1}</td><td class="tname">${esc(t.name)}${isRival(t.name) ? ` <span class="derby" title="Главный соперник">Соперник</span>` : ""}</td><td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
          <td class="goals">${t.zab}–${t.prop}</td><td>${t.gd > 0 ? "+" : ""}${t.gd}</td><td class="pts">${t.pts}</td><td class="formcol">${formDots(t.form)}</td></tr>`).join("");
      return `<h1 class="page-title">Таблица ${esc(LEAGUE.name)}</h1><p class="page-sub">Сезон ${esc(LEAGUE.season)} · ${LEAGUE.teams.length} команд</p>
        <div class="table-wrap"><table class="standings">
          <thead><tr><th>#</th><th class="tname">Команда</th><th title="Игры">И</th><th title="Победы">В</th><th title="Ничьи">Н</th><th title="Поражения">П</th><th class="goals" title="Забито–пропущено">Мячи</th><th title="Разница мячей">±</th><th title="Очки">О</th><th class="formcol">Форма</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
        <p class="meta">При равенстве очков выше команда с лучшей разницей мячей, затем — с большим числом забитых.</p>`;
    },
    ucl() {
      const nx = UCL.next, left = daysUntil(nx.date);
      const finals = UCL.history.filter((h) => h.stage === "Финал").length;
      return `<h1 class="page-title">${esc(UCL.name)}</h1><p class="page-sub">${esc(CLUB.name)} в ${esc(UCL.short)} · ${finals} ${plural(finals, "финал", "финала", "финалов")} в истории</p>
        <div class="ucl-next">
          <div><span class="label">Следующий этап</span><h2>${esc(nx.title)}</h2>
            <p class="ucl-date">${new Date(nx.date + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p></div>
          ${left >= 0 ? `<div class="countdown"><b>${left}</b><span>${plural(left, "день", "дня", "дней")}<br>до старта</span></div>` : ""}
        </div>
        <h2 class="section-title">Матчи</h2>
        ${nx.matches.length ? `<div class="matches">${nx.matches.map(upcomingRow).join("")}</div>`
          : `<div class="matches"><div class="match match--upcoming"><span class="when">${esc(UCL.short)} · ${fmtDate(nx.date)}</span>
              <span class="team">${esc(CLUB.name)}</span><span class="res">—</span><span class="team tbd">${TBD}</span></div></div>
             <p class="meta">Пары и время матчей пока не определены. Как только станет известно — расписание появится здесь.</p>`}
        <h2 class="section-title">История в ЛЧ</h2>
        <div class="ucl-history">${UCL.history.map((h) => `<div class="ucl-row"><span class="trophy__cup silver">${CUP}</span>
            <div><b>${esc(h.stage)} ${h.season ? esc(h.season) : ""}</b><small>${h.opponent ? `${esc(CLUB.name)} — ${esc(h.opponent)} · <strong>${esc(h.score.replace(":", " : "))}</strong>` : "Соперник уточняется"}</small></div><span class="pill pill--loss">${esc(h.result)}</span></div>`).join("")}</div>`;
    },
    matches() {
      const up = [...MATCHES].sort((a, b) => a.date.localeCompare(b.date));
      const played = ourResults();
      const me = standings().find((t) => t.name === CLUB.name);
      return `<h1 class="page-title">Матчи</h1><p class="page-sub">${esc(LEAGUE.name)} ${esc(LEAGUE.season)} · ${me.w} В · ${me.d} Н · ${me.l} П · мячи ${me.zab}–${me.prop}</p>
        <h2 class="section-title">Ближайшие</h2>${up.length ? `<div class="matches">${up.map(upcomingRow).join("")}</div>` : `<div class="empty">Ближайшие матчи пока не объявлены.</div>`}
        <h2 class="section-title">Результаты</h2>${played.length ? `<div class="matches">${played.map(resultRow).join("")}</div>` : `<div class="empty">Сыгранных матчей пока нет.</div>`}
        <h2 class="section-title">Все матчи по турам</h2>${[...new Set(LEAGUE.results.map((r) => r.round))].sort((a, b) => b - a).map((rd) => `
          <details class="round"${rd === Math.max(...LEAGUE.results.map((r) => r.round)) ? " open" : ""}><summary>${rd}-й тур</summary>
          <div class="round__list">${LEAGUE.results.filter((r) => r.round === rd).map((r) => `<div class="rline${r.home === CLUB.name || r.away === CLUB.name ? " us" : ""}"><span>${esc(r.home)}</span><b>${esc(r.score.replace(":", " : "))}</b><span>${esc(r.away)}</span></div>`).join("")}</div></details>`).join("")}`;
    },
    club() {
      return `<h1 class="page-title">О клубе</h1><p class="page-sub">${esc(CLUB.tagline)}</p>
        <div class="club"><img src="${EMBLEM}" alt="Эмблема ${esc(CLUB.name)}">
          <div>${CLUB.about.map((p) => `<p>${esc(p)}</p>`).join("")}
            <dl class="facts"><div><dt>Основан</dt><dd>${CLUB.founded}</dd></div><div><dt>Стадион</dt><dd>${esc(CLUB.stadium)}</dd></div><div><dt>Капитан и тренер</dt><dd>${esc((player(CLUB.captain) || {}).name || "")}</dd></div><div><dt>Титулов АПЛ</dt><dd>${TROPHIES.length}</dd></div><div><dt>Игроков</dt><dd>${squad().length}</dd></div><div><dt>Главный соперник</dt><dd>${esc(CLUB.rival)}</dd></div></dl>
          </div></div>
        <h2 class="section-title">Легендарные матчи</h2>
        ${CLUB.legends.map((l) => `<div class="legend"><span class="label">${esc(l.title)}</span>
          <div class="legend__score"><span>${esc(l.home)}</span><b>${esc(l.score.replace(":", " : "))}</b><span>${esc(l.away)}</span></div><p>${esc(l.text)}</p></div>`).join("")}
        <h2 class="section-title">Трофеи</h2>${trophiesBlock()}
        <h2 class="section-title">Индивидуальные награды</h2>
        <div class="awards">${PLAYERS.filter((p) => awardsOf(p).length).sort((a, b) => awardsOf(b).length - awardsOf(a).length).map((p) => `<a class="award-card" href="#player-${p.id}">
            ${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : ""}
            <div><b>${esc(p.name)}</b><ul>${awardSummary(p).map((a) => `<li class="${a.kind === "ball" ? "is-ball" : ""}${a.medal ? " medal-" + a.medal : ""}"><span class="trophy__cup">${awardIcon(a)}</span><span>${a.n > 1 ? `${a.n}× ` : ""}${esc(a.title)}${a.team ? ` (${esc(a.team)})` : ""} <small>${a.seasons.map(esc).join(", ")}</small></span></li>`).join("")}</ul></div></a>`).join("")}</div>
        <h2 class="section-title">Игроки в Instagram</h2>
        <div class="ig-list">${PLAYERS.filter((p) => p.instagram).map((p) => `<a class="ig" href="${igUrl(p.instagram)}" target="_blank" rel="noopener">${IG}<span><b>${esc(p.name)}</b> @${esc(p.instagram)}</span></a>`).join("")}</div>`;
    },
  };

  function articleView(id) {
    const n = NEWS.find((x) => x.id === id);
    if (!n) return `<div class="empty">Новость не найдена. <a class="back" href="#news">← Все новости</a></div>`;
    const tagged = (n.players || []).map(player).filter(Boolean);
    const more = [...NEWS].sort(byDate).filter((x) => x.id !== n.id).slice(0, 3);
    return `<article class="article"><div class="article__head"><span class="label">Новости клуба</span>
        <h1>${esc(n.title)}</h1><time>${fmtDate(n.date)}</time></div>${n.image ? `<figure class="article__fig"><img src="${esc(n.image)}" alt="${esc(n.imageCaption || n.title)}">${n.imageCaption ? `<figcaption>${esc(n.imageCaption)}</figcaption>` : ""}</figure>` : cover(n)}
        <div class="article__body"><p class="lead">${esc(n.excerpt)}</p>${n.body.map((p) => (typeof p === "object" && p.q ? `<p class="q">${esc(p.q)}</p>` : `<p>${esc(p)}</p>`)).join("")}
        ${n.callups && n.callups.length ? `<h3 class="sub">Вызовы в сборные</h3><div class="callups">${n.callups.map((c) => { const p = player(c.player); if (!p) return "";
          return `<a class="callup" href="#player-${p.id}">${p.photo ? `<img class="callup__pic" src="${esc(p.photo)}" alt="">` : ""}
            ${flagSvg({ flag: c.flag, nationality: c.team }, "flag callup__flag")}<span class="callup__team">${esc(c.team)}</span><b>${esc(p.name)}</b><small>№${esc(p.number)} · ${esc(p.short || p.position)}</small></a>`; }).join("")}</div>` : ""}
        ${tagged.length ? `<div class="chips">${tagged.map((p) => `<a class="chip" href="#player-${p.id}">#${esc(p.number)} ${esc(p.name)}</a>`).join("")}</div>` : ""}
        <a class="back" href="#news">← Все новости</a></div></article>
      ${commentsBlock("news-" + n.id)}
      ${more.length ? `<h2 class="section-title">Читайте также</h2><div class="grid">${more.map(newsCard).join("")}</div>` : ""}`;
  }

  function postView(id) {
    const post = POSTS.find((x) => x.id === id);
    if (!post) return `<div class="empty">Пост не найден. <a class="back" href="#feed">← Лента</a></div>`;
    return `<div class="feed"><a class="back" href="#feed">← Лента</a>${postCard(post, true)}${commentsBlock("post-" + post.id)}</div>`;
  }

  function playerView(id) {
    const p = player(id);
    if (!p) return `<div class="empty">Игрок не найден. <a class="back" href="#team">← Состав</a></div>`;
    const news = NEWS.filter((n) => (n.players || []).includes(p.id)).sort(byDate);
    const facts = [
      p.number != null && ["Номер", p.number],
      isCaptain(p) && ["Роль", "Капитан и тренер"],
      p.position && ["Позиция", p.position],
      p.nickname && ["Прозвище", `«${p.nickname}»`],
      p.born && ["Год рождения", p.born],
      p.nationality && ["Национальность", p.nationality],
      p.foot && ["Рабочая нога", p.foot],
      p.trait && ["Фишка", p.trait],
      p.prevClub && ["Прошлый клуб", p.prevClub],
      p.favPlayer && [p.favPlayer.includes(",") ? "Любимые игроки" : "Любимый игрок", p.favPlayer],
      p.favClub && ["Любимый клуб", p.favClub],
      p.former && ["Статус", "Бывший игрок"],
      p.transfer && ["Новый клуб", p.transfer],
    ].filter(Boolean);
    return `<div class="profile">${playerPic(p)}<div class="profile__body"><span class="label">${p.former ? "Бывший игрок" : p.academy ? `Академия · ${esc(p.position)}` : esc(p.position)}</span>
        <h1 class="pname">${flagSvg(p, "flag flag--name")}${esc(p.name)}</h1><dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        ${p.bio ? `<p>${esc(p.bio)}</p>` : ""}
        ${p.stats ? `<h3 class="sub">Сезон ${esc(LEAGUE.season)} · все турниры</h3><div class="pstats"><div><b>${p.stats.goals || 0}</b><span>${plural(p.stats.goals || 0, "гол", "гола", "голов")}</span></div><div><b>${p.stats.assists || 0}</b><span>${plural(p.stats.assists || 0, "передача", "передачи", "передач")}</span></div>${p.stats.note ? `<small class="meta">${esc(p.stats.note)}</small>` : ""}</div>` : ""}
        ${p.instagram ? `<a class="ig" href="${igUrl(p.instagram)}" target="_blank" rel="noopener">${IG}<span>@${esc(p.instagram)}</span></a>` : ""}
        ${awardsOf(p).length ? `<h3 class="sub">Награды</h3><ul class="honors">${awardsOf(p).map((a) => `<li class="${a.kind === "ball" ? "is-ball" : ""}${a.medal ? " medal-" + a.medal : ""}"><span class="trophy__cup">${awardIcon(a)}</span><span>${esc(a.title)}${a.team ? ` ${flagSvg({ flag: a.flag, nationality: a.team }, "flag flag--mini")}${esc(a.team)}` : ""} <small>${esc(a.season)}</small></span></li>`).join("")}</ul>` : ""}
        ${p.honors && p.honors.length ? `<h3 class="sub">Достижения</h3><ul class="honors">${p.honors.map((h) => `<li><span class="trophy__cup">${CUP}</span>${esc(h)}</li>`).join("")}</ul>` : ""}
        <a class="back" href="${p.academy ? "#academy" : "#team"}">← ${p.academy ? "Академия" : "Весь состав"}</a></div></div>
      ${news.length ? `<h2 class="section-title">Новости об игроке</h2><div class="grid">${news.map(newsCard).join("")}</div>` : ""}
      ${POSTS.some((x) => x.author === p.id) ? `<h2 class="section-title">Посты в Ленте</h2><div class="feed">${POSTS.filter((x) => x.author === p.id).sort((a, b) => b.id - a.id).map((x) => postCard(x)).join("")}</div>` : ""}
      ${commentsBlock("player-" + p.id)}`;
  }

  // ---------- Боковая колонка ----------
  function renderSidebar() {
    $("#sidebar").innerHTML = `
      <section class="widget club-card"><img src="${EMBLEM}" alt=""><b>${esc(CLUB.name)}</b><small>${esc(CLUB.tagline)}</small>
        <span class="kit"><i></i> Форма: ${esc(CLUB.colors.toLowerCase())}</span></section>
      <section class="widget"><h2>Трофеи</h2><div class="trophy-line"><span class="trophy__cup">${CUP}</span>
        <div><b>${TROPHIES.length}× чемпион ${esc(LEAGUE.name)}</b><br><small>${TROPHIES.map((t) => esc(t.season)).join(" · ")}</small></div></div>
        <div class="trophy-line"><span class="trophy__cup silver">${CUP}</span>
        <div><b>${UCL.history.filter((h) => h.stage === "Финал").length}× финалист ${esc(UCL.short)}</b><br><small><a href="#ucl">${esc(UCL.short)}: следующий этап ${fmtDate(UCL.next.date)}</a></small></div></div></section>
      <section class="widget"><h2>${esc(LEAGUE.name)} ${esc(LEAGUE.season)}</h2><table class="mini-table"><tbody>${(() => {
        const st = standings(); const i = st.findIndex((t) => t.name === CLUB.name);
        const from = Math.max(0, Math.min(i - 2, st.length - 5));
        return st.slice(from, from + 5).map((t, k) => `<tr class="${t.name === CLUB.name ? "us" : ""}"><td>${from + k + 1}</td><td>${esc(t.name)}</td><td>${t.pts}</td></tr>`).join("");
      })()}</tbody></table><a class="back" href="#table">Вся таблица →</a></section>
      <section class="widget"><h2>Состав</h2><ul class="mini-squad">${squad()
        .map((p) => `<li><a href="#player-${p.id}"><span class="n">${esc(p.number)}</span><span>${flagSvg(p, "flag flag--mini")}${esc(p.name)}${isCaptain(p) ? ` <span class="cap" title="Капитан">C</span>` : ""}</span><small>${esc(p.short || p.position)}</small></a></li>`).join("")}</ul></section>
      <section class="widget"><h2>Последний матч</h2>${(() => {
        const r = ourResults()[0];
        return r ? `<div class="last"><span>${esc(r.home)}</span><b>${esc(r.score.replace(":", " : "))}</b><span>${esc(r.away)}</span></div><small class="meta">${r.round}-й тур</small>` : `<span class="meta">Пока не сыгран</span>`;
      })()}</section>
      <section class="widget"><h2>Следующий матч</h2>${(() => {
        const m = [...MATCHES].sort((a, b) => a.date.localeCompare(b.date))[0];
        return m ? `<b>${esc(CLUB.name)} — ${esc(m.opponent || TBD)}</b><br><time>${m.tournament ? `${esc(m.tournament)} · ` : ""}${fmtDate(m.date)}</time>` : `<span class="meta">Пока не назначен</span>`;
      })()}</section>`;
  }

  // ---------- Маршрутизация: #news, #team, #matches, #club, #news-3, #player-2 ----------
  function route() {
    const h = location.hash.slice(1) || "news";
    let section = h, html;
    const m = h.match(/^(news|player|post)-(\d+)$/);
    if (m) {
      section = { news: "news", player: "team", post: "feed" }[m[1]];
      html = { news: articleView, player: playerView, post: postView }[m[1]](+m[2]);
    }
    else { if (!views[h]) section = "news"; html = views[section](); if (section === "academy") section = "team"; }
    $("#view").innerHTML = html;
    if (window.LiveComments) { if (m) LiveComments.mount(h); else LiveComments.unmount(); }
    bindLikes();
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
