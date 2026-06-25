/* EatBC service worker — offline shell + safe caching + Web Push + notification routing */
const CACHE = "eatbc-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon.svg", "/favicon.svg"];

/* ── Web Push: server sends a push event → SW shows the notification ── */
self.addEventListener("push", (e) => {
  let data = { title: "EatBC", body: "Time to check in!", icon: "/icon.svg", url: "/" };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icon.svg",
      data: { url: data.url },
      tag: "eatbc-nudge",         // replaces previous unread nudge
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      /* If app is already open in a tab, focus it and tell it to go to dash */
      for (const client of list) {
        if (new URL(client.url).origin === self.location.origin) {
          client.focus();
          client.postMessage({ type: "EATBC_NOTIF_CLICK" });
          return;
        }
      }
      /* App is closed — open it with a flag so it navigates to dash on load */
      return clients.openWindow("/?from=notif");
    })
  );
});

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Never cache API or cross-origin (e.g. OpenFoodFacts) — always go to network.
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) return;

  // App navigation: network-first, fall back to cached shell when offline.
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static assets: cache-first, then network + store.
  e.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
    )
  );
});
