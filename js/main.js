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
      <a href="article.html?id=${n.id}">${cover(n)}</a>
      <div class="card__body">
        <span class="tag">${esc(catName(n.category))}</span>
        <h3><a href="article.html?id=${n.id}">${esc(n.title)}</a></h3>
        <p>${esc(n.excerpt)}</p>
        <time>${fmtDate(n.date)}</time>
      </div>
    </article>`;
  }

  function renderNav(active) {
    const nav = $("#nav");
    if (!nav) return;
    nav.innerHTML = CATEGORIES.map(
      (c) => `<a href="index.html${c.id === "all" ? "" : "?cat=" + c.id}" class="${c.id === active ? "active" : ""}">${esc(c.name)}</a>`
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
        .map((n) => `<li><a href="article.html?id=${n.id}">${esc(n.title)}</a></li>`)
        .join("");
    }
  }

  function renderHome() {
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat") || "all";
    renderNav(cat);

    const list = NEWS.filter((n) => cat === "all" || n.category === cat).sort((a, b) => b.date.localeCompare(a.date));
    const top = (cat === "all" && list.find((n) => n.featured)) || list[0];

    $("#hero").innerHTML = top
      ? `<a class="hero" href="article.html?id=${top.id}">
          ${cover(top, "cover--big")}
          <div class="hero__text"><span class="tag">${esc(catName(top.category))}</span>
          <h1>${esc(top.title)}</h1><p>${esc(top.excerpt)}</p><time>${fmtDate(top.date)}</time></div>
        </a>`
      : "";

    const rest = list.filter((n) => n !== top);
    $("#feed-title").textContent = cat === "all" ? "Последние новости" : catName(cat);
    $("#feed").innerHTML = rest.length ? rest.map(card).join("") : `<p class="empty">Пока здесь пусто.</p>`;
  }

  function renderArticle() {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const n = NEWS.find((x) => x.id === id);
    renderNav(n ? n.category : "all");
    const root = $("#article");
    if (!n) {
      root.innerHTML = `<h1>Новость не найдена</h1><p><a href="index.html">← На главную</a></p>`;
      return;
    }
    document.title = n.title + " — СпортПульс";
    root.innerHTML = `<span class="tag">${esc(catName(n.category))}</span>
      <h1>${esc(n.title)}</h1>
      <div class="meta">${esc(n.author)} · <time>${fmtDate(n.date)}</time> · 👁 ${n.views.toLocaleString("ru-RU")}</div>
      ${cover(n, "cover--big")}
      <p class="lead">${esc(n.excerpt)}</p>
      ${n.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      <p><a href="index.html">← Все новости</a></p>`;
    const related = NEWS.filter((x) => x.category === n.category && x.id !== n.id).slice(0, 3);
    $("#related").innerHTML = related.length ? `<h2>Читайте также</h2><div class="grid">${related.map(card).join("")}</div>` : "";
  }

  function initMenu() {
    const btn = $("#menu-btn");
    if (btn) btn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    renderSidebar();
    if (document.body.dataset.page === "article") renderArticle();
    else renderHome();
  });
})();
