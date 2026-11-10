(function () {
  const ICONS = { football: "⚽", hockey: "🏒", basketball: "🏀", tennis: "🎾", mma: "🥊" };
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || id;
  const fmtDate = (iso) =>
    new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel) => document.querySelector(sel);

  function cover(n, cls) {
    return `<div class="cover cover--${n.category} ${cls || ""}"><span>${ICONS[n.category] || "🏆"}</span></div>`;
  }

  function card(n) {
    return `<article class="card">
      <a href="#news-${n.id}">${cover(n)}</a>
      <div class="card__body">
        <span class="tag">${esc(catName(n.category))}</span>
        <h3><a href="#news-${n.id}">${esc(n.title)}</a></h3>
        <p>${esc(n.excerpt)}</p>
        <time>${fmtDate(n.date)}</time>
      </div>
    </article>`;
  }

  function renderNav(active) {
    const nav = $("#nav");
    if (!nav) return;
    nav.innerHTML = CATEGORIES.map(
      (c) => `<a href="#${c.id}" class="${c.id === active ? "active" : ""}">${esc(c.name)}</a>`
    ).join("");
  }

  function renderSidebar() {
    const scores = $("#scores");
    if (scores) {
      scores.innerHTML = SCORES.map(
        (s) => `<li><small>${esc(s.sport)} · ${esc(s.status)}</small>
          <div class="score"><span>${esc(s.home)}</span><b>${esc(s.score)}</b><span>${esc(s.away)}</span></div></li>`
      ).join("");
    }
    const popular = $("#popular");
    if (popular) {
      popular.innerHTML = [...NEWS]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((n) => `<li><a href="#news-${n.id}">${esc(n.title)}</a></li>`)
        .join("");
    }
  }

  function renderHome(cat) {
    renderNav(cat);

    const list = NEWS.filter((n) => cat === "all" || n.category === cat).sort((a, b) => b.date.localeCompare(a.date));
    const top = (cat === "all" && list.find((n) => n.featured)) || list[0];

    $("#hero").innerHTML = top
      ? `<a class="hero" href="#news-${top.id}">
          ${cover(top, "cover--big")}
          <div class="hero__text"><span class="tag">${esc(catName(top.category))}</span>
          <h1>${esc(top.title)}</h1><p>${esc(top.excerpt)}</p><time>${fmtDate(top.date)}</time></div>
        </a>`
      : "";

    const rest = list.filter((n) => n !== top);
    $("#feed-title").textContent = cat === "all" ? "Последние новости" : catName(cat);
    $("#feed").innerHTML = rest.length ? rest.map(card).join("") : `<p class="empty">Пока здесь пусто.</p>`;
  }

  function renderArticle(id) {
    const n = NEWS.find((x) => x.id === id);
    renderNav(n ? n.category : "all");
    const root = $("#article");
    if (!n) {
      root.innerHTML = `<h1>Новость не найдена</h1><p><a href="#all">← На главную</a></p>`;
      return;
    }
    root.innerHTML = `<span class="tag">${esc(catName(n.category))}</span>
      <h1>${esc(n.title)}</h1>
      <div class="meta">${esc(n.author)} · <time>${fmtDate(n.date)}</time> · 👁 ${n.views.toLocaleString("ru-RU")}</div>
      ${cover(n, "cover--big")}
      <p class="lead">${esc(n.excerpt)}</p>
      ${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      <p><a href="#all">← Все новости</a></p>`;
    const related = NEWS.filter((x) => x.category === n.category && x.id !== n.id).slice(0, 3);
    $("#related").innerHTML = related.length ? `<h2>Читайте также</h2><div class="grid">${related.map(card).join("")}</div>` : "";
  }

  function initMenu() {
    const btn = $("#menu-btn");
    if (btn) btn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // Маршрутизация по hash: #all, #football, #news-3
  function route() {
    const h = location.hash.slice(1) || "all";
    const m = h.match(/^news-(\d+)$/);
    $("#home-view").hidden = !!m;
    $("#article-view").hidden = !m;
    if (m) renderArticle(Number(m[1]));
    else renderHome(CATEGORIES.some((c) => c.id === h) ? h : "all");
    document.body.classList.remove("nav-open");
    window.scrollTo(0, 0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    renderSidebar();
    const form = $("#subscribe-form");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.innerHTML = "<p>Спасибо за подписку!</p>";
    });
    route();
    window.addEventListener("hashchange", route);
  });
})();
