// Corvo Transfer's service worker: lets the page install as an app, open offline, and take
// files from Android's share sheet ("Share -> Transfer"). Network first, so a new version
// of the page shows right away; the saved copy is only for when there's no connection.
const CACHE = "corvo-transfer-v1";
const SHARE = "corvo-share";
const SHELL = ["./", "./app.js", "./manifest.webmanifest", "./icon-256.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== SHARE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method === "POST" && url.pathname.endsWith("/share")) {
    e.respondWith(share(e.request));
    return;
  }
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./"))),
  );
});

/** Files shared in: kept for the page (app.ts takeShared), which opens with ?shared=N. */
async function share(request) {
  const form = await request.formData();
  const files = form.getAll("files").filter((f) => typeof f !== "string");
  const c = await caches.open(SHARE);
  for (const k of await c.keys()) await c.delete(k);
  let i = 0;
  for (const f of files) {
    await c.put(
      new Request(`./shared/${i++}`),
      new Response(f, { headers: { "x-name": encodeURIComponent(f.name || "file"), "content-type": f.type || "application/octet-stream" } }),
    );
  }
  return Response.redirect(new URL(`./?shared=${files.length}`, self.registration.scope).href, 303);
}
