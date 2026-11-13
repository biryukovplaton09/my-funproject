// Push-уведомления о новинках: плашка «Присылать / Нет», подписка через Web Push,
// подписка хранится в Firebase (Firestore, коллекция "push_subs"). Отправка — tools/notify.py.
(function () {
  const VAPID_PUBLIC = "BLJAvXfESz66K40hjLP0gX7wQSrti3sQJUVyaxQXMmOq4FAzSH_F2XrWHEI_jjJr4BnguaTPxj1Xurq1_EnwTuE";
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  const KEY = "fcd-push"; // "yes" | "no"
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (_) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (_) {} },
  };
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  function load(src) {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  async function db() {
    if (!window.firebase) await load(SDK + "firebase-app-compat.js");
    if (!firebase.firestore) await load(SDK + "firebase-firestore-compat.js");
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    return firebase.firestore();
  }
  function b64ToBytes(s) {
    const p = "=".repeat((4 - (s.length % 4)) % 4);
    const raw = atob((s + p).replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }
  async function sha(s) {
    const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  function registration() { return navigator.serviceWorker.register("sw.js"); }

  async function subscribe() {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("denied");
    const reg = await registration();
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC) });
    const j = sub.toJSON();
    const d = await db();
    await d.collection("push_subs").doc(await sha(j.endpoint)).set({
      endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  async function unsubscribe() {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    if (sub) await sub.unsubscribe();
  }

  // ---------- UI ----------
  let box = null;
  function close() { if (box) { box.classList.remove("push--in"); const b = box; setTimeout(() => b.remove(), 250); box = null; } }
  function show(html, onYes, yesLabel) {
    close();
    box = document.createElement("div");
    box.className = "push"; box.setAttribute("role", "dialog"); box.setAttribute("aria-live", "polite");
    box.innerHTML = `<img class="push__logo" src="images/emblem.svg" alt="">
      <div class="push__body">${html}
        <p class="push__err" hidden></p>
        <div class="push__btns">
          ${onYes ? `<button type="button" class="btn push__yes">${yesLabel || "Присылать"}</button>` : ""}
          <button type="button" class="push__no">${onYes ? "Нет" : "Понятно"}</button>
        </div></div>`;
    document.body.appendChild(box);
    requestAnimationFrame(() => box && box.classList.add("push--in"));
    // «Нет» не запоминаем — при следующем открытии сайта плашка появится снова.
    box.querySelector(".push__no").onclick = () => { if (!onYes) store.set("hint"); close(); renderFooter(); };
    if (onYes) box.querySelector(".push__yes").onclick = async (e) => {
      const btn = e.currentTarget; btn.disabled = true; btn.textContent = "Подключаем…";
      try { await onYes(); store.set("yes"); box.querySelector(".push__body").innerHTML = "<b>Готово!</b><p>Теперь новинки FC Durum будут приходить вам уведомлениями.</p>"; setTimeout(close, 2600); }
      catch (err) {
        const p = box.querySelector(".push__err"); p.hidden = false;
        p.textContent = err && err.message === "denied"
          ? "Уведомления запрещены в настройках браузера. Разрешите их для этого сайта и попробуйте снова."
          : "Не получилось подключить уведомления. Попробуйте ещё раз чуть позже.";
        btn.disabled = false; btn.textContent = "Присылать";
      }
      renderFooter();
    };
  }
  const TEXT = `<b>Уведомлять о новинках FC Durum?</b>
    <p>Новости, посты в Ленте, изменения в составе и анкетах игроков — сразу на телефон или компьютер.</p>`;
  function offer() {
    if (supported) return show(TEXT, subscribe);
    if (ios && !standalone) return show(`<b>Уведомления о новинках FC Durum</b>
      <p>На iPhone уведомления работают, если добавить сайт на экран «Домой»: кнопка «Поделиться» → «На экран „Домой“». Потом откройте сайт с иконки — и включите уведомления.</p>`);
    show(`<b>Уведомления недоступны</b><p>Этот браузер не поддерживает уведомления. Попробуйте Chrome, Edge, Firefox или Safari.</p>`);
  }

  async function isOn() {
    if (!supported || Notification.permission !== "granted") return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return !!(reg && (await reg.pushManager.getSubscription()));
  }
  async function renderFooter() {
    const row = document.querySelector(".footer__row");
    if (!row) return;
    let b = document.getElementById("push-toggle");
    if (!b) { b = document.createElement("button"); b.type = "button"; b.id = "push-toggle"; b.className = "push-toggle"; row.appendChild(b); }
    const on = await isOn();
    b.textContent = on ? "🔔 Уведомления включены · отключить" : "🔔 Уведомлять о новинках";
    b.onclick = async () => {
      if (on) { await unsubscribe().catch(() => {}); store.set("no"); renderFooter(); }
      else offer();
    };
  }

  // Уже разрешил уведомления на этом устройстве — плашку не показываем никогда,
  // а подписку тихо обновляем (если браузер её сменил или запись в базе пропала).
  async function resync() {
    try { await subscribe(); store.set("yes"); } catch (_) {}
  }

  function start() {
    renderFooter();
    if (supported && Notification.permission === "granted" && store.get() !== "no") {
      resync().then(renderFooter);         // уже подписан — плашку не показываем
      return;
    }
    if (supported && Notification.permission === "denied") return;   // запрещено в браузере — кнопка не сработает
    if (!supported && !(ios && !standalone)) return;
    if (!supported && store.get() === "hint") return;                 // подсказку для iPhone показываем один раз
    setTimeout(offer, 2500);               // не подписан (в т.ч. нажимал «Нет») — показываем при каждом открытии
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
