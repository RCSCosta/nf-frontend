// NF-Entrada Service Worker — sempre busca versão mais recente
const CACHE_NAME = 'nf-entrada-v1';

self.addEventListener('install', event => {
  self.skipWaiting(); // Ativa imediatamente sem esperar
});

self.addEventListener('activate', event => {
  // Remove caches antigos
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Para o index.html — sempre busca da rede (nunca do cache)
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para outros recursos — rede primeiro, cache como fallback
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => caches.match(event.request))
  );
});
