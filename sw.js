// Service worker FC Durum: показывает push-уведомления о новинках сайта.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "FC Durum", body: e.data ? e.data.text() : "" }; }
  const base = self.registration.scope;
  e.waitUntil(self.registration.showNotification(d.title || "FC Durum", {
    body: d.body || "На сайте новинка",
    icon: base + "images/icon-192.png",
    badge: base + "images/badge-96.png",
    image: d.image ? base + d.image : undefined,
    tag: d.tag || undefined,
    data: { url: base + (d.url || "") },
  }));
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
