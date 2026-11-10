// Живые комментарии: Firebase Auth (вход через Google) + Firestore.
// Коллекция "comments": { key, text, uid, name, photo, createdAt }.
(function () {
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  const MAX = 1000;
  let ready = null, auth = null, db = null, unsub = null, currentKey = null;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (d) => d ? d.toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "только что";
  const color = (name) => { let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 42%)`; };

  function load(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }

  function init() {
    if (ready) return ready;
    ready = load(SDK + "firebase-app-compat.js")
      .then(() => Promise.all([load(SDK + "firebase-auth-compat.js"), load(SDK + "firebase-firestore-compat.js")]))
      .then(() => {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        auth = firebase.auth();
        db = firebase.firestore();
        auth.getRedirectResult().catch(() => {});
        auth.onAuthStateChanged(() => currentKey && renderForm(currentKey));
      });
    return ready;
  }

  function el(id) { return document.getElementById(id); }

  function renderForm(key) {
    const box = el("lc-form");
    if (!box) return;
    const u = auth && auth.currentUser;
    if (!u) {
      box.innerHTML = `<div class="lc-login"><p>Войдите, чтобы оставить комментарий.</p>
        <button type="button" class="btn-google" id="lc-signin">
          <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Войти через Google</button><p class="lc-err" id="lc-err" hidden></p></div>`;
      el("lc-signin").onclick = signIn;
      return;
    }
    box.innerHTML = `<form class="lc-write" id="lc-write">
        <div class="lc-me">${u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : ""}<b>${esc(u.displayName || "Болельщик")}</b>
          <button type="button" class="lc-link" id="lc-out">Выйти</button></div>
        <label class="visually-hidden" for="lc-text">Ваш комментарий</label>
        <textarea id="lc-text" maxlength="${MAX}" rows="3" placeholder="Напишите, что думаете…" required></textarea>
        <div class="lc-row"><span class="meta" id="lc-count">0 / ${MAX}</span><button class="btn lc-send" type="submit" id="lc-send">Отправить</button></div>
        <p class="lc-err" id="lc-err" hidden></p></form>`;
    el("lc-out").onclick = () => auth.signOut();
    const ta = el("lc-text");
    ta.oninput = () => (el("lc-count").textContent = `${ta.value.length} / ${MAX}`);
    el("lc-write").onsubmit = (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text) return;
      el("lc-send").disabled = true;
      db.collection("comments").add({
        key, text: text.slice(0, MAX), uid: u.uid,
        name: (u.displayName || "Болельщик").slice(0, 80), photo: u.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => { ta.value = ""; el("lc-count").textContent = `0 / ${MAX}`; })
        .catch(() => showErr("Не удалось отправить комментарий. Проверьте интернет и попробуйте ещё раз."))
        .finally(() => { const b = el("lc-send"); if (b) b.disabled = false; });
    };
  }

  function showErr(msg) { const e = el("lc-err"); if (e) { e.textContent = msg; e.hidden = false; } }

  function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((err) => {
      if (err && (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment")) return auth.signInWithRedirect(provider);
      if (err && err.code === "auth/popup-closed-by-user") return;
      showErr("Не получилось войти. Попробуйте ещё раз или откройте сайт в другом браузере.");
    });
  }

  function renderList(docs) {
    const list = el("lc-list");
    if (!list) return;
    const me = auth.currentUser && auth.currentUser.uid;
    const items = docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.createdAt ? a.createdAt.toMillis() : Infinity) - (b.createdAt ? b.createdAt.toMillis() : Infinity));
    list.innerHTML = items.map((c) => `<article class="comment comment--live">
        ${c.photo ? `<img class="comment__ava" src="${esc(c.photo)}" alt="" referrerpolicy="no-referrer">`
          : `<span class="comment__ava" style="background:${color(c.name || "?")}">${esc((c.name || "?").charAt(0).toUpperCase())}</span>`}
        <div class="comment__main"><div class="comment__head"><b>${esc(c.name)}</b><time>${fmt(c.createdAt && c.createdAt.toDate())}</time>
          ${c.uid === me ? `<button type="button" class="lc-link lc-del" data-id="${esc(c.id)}">Удалить</button>` : ""}</div>
          <p>${esc(c.text)}</p></div></article>`).join("");
    list.querySelectorAll(".lc-del").forEach((b) => (b.onclick = () => {
      if (b.dataset.confirm) db.collection("comments").doc(b.dataset.id).delete().catch(() => showErr("Не удалось удалить комментарий."));
      else { b.dataset.confirm = "1"; b.textContent = "Точно удалить?"; }
    }));
    const head = el("lc-total");
    if (head) head.textContent = Number(head.dataset.static || 0) + items.length;
  }

  window.LiveComments = {
    mount(key) {
      if (unsub) { unsub(); unsub = null; }
      currentKey = key;
      if (!window.FIREBASE_CONFIG || !el("lc-root")) return;
      el("lc-root").hidden = false;
      init().then(() => {
        if (currentKey !== key) return;
        renderForm(key);
        unsub = db.collection("comments").where("key", "==", key)
          .onSnapshot((snap) => renderList(snap.docs), () => showErr("Комментарии временно недоступны."));
      }).catch(() => { const r = el("lc-root"); if (r) r.hidden = true; });
    },
    unmount() { if (unsub) { unsub(); unsub = null; } currentKey = null; },
  };
})();
