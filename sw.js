// Service worker FC Durum: показывает push-уведомления о новинках сайта.
// Тип уведомления (kind): news — новость, post — Лента, player — анкета/состав.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Вибро-«мелодии» по типам (Android): свисток, тройной свисток, гудок.
const VIBRATE = {
  news: [120, 60, 380],
  post: [70, 40, 70, 40, 160],
  player: [250, 80, 600],
};

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "FC Durum", body: e.data ? e.data.text() : "" }; }
  const base = self.registration.scope;
  const kind = d.kind || "news";
  const abs = (p) => (p ? (/^https?:/.test(p) ? p : base + p) : undefined);
  e.waitUntil((async () => {
    await self.registration.showNotification(d.title || "FC Durum", {
      body: d.body || "На сайте новинка",
      icon: abs(d.icon) || base + "images/icon-192.png",
      badge: base + "images/badge-96.png",
      image: abs(d.image),
      tag: d.tag || undefined,
      renotify: !!d.tag,
      silent: false,
      vibrate: VIBRATE[kind] || VIBRATE.news,
      timestamp: Date.now(),
      data: { url: base + (d.url || ""), kind },
      actions: [{ action: "open", title: kind === "post" ? "Читать пост" : kind === "player" ? "Открыть анкету" : "Читать" }],
    });
    // Если сайт открыт — пусть он сыграет звук (системный звук уведомления браузер не даёт менять).
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) c.postMessage({ type: "fcd-push", kind });
  })());
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope) && "focus" in c) { await c.navigate(url).catch(() => {}); return c.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
