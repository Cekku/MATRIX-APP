// Service worker della Matrix: prima la rete (così le versioni nuove arrivano subito), copia locale se manca la rete.
// Quando cambia qualcosa nell'app si alza VERSIONE: i telefoni prendono la nuova da soli.
const VERSIONE = 'matrix-0.4.2';
const GUSCIO = [
  './', './index.html', './manifest.webmanifest', './js/accesso.js', './js/config.js', './js/costrutto.js', './js/versione.js', './js/nativo.js', './js/dati.js', './js/plancia.js', './css/plancia.css',
  './vendor/supabase/supabase.js', './vendor/three/three.min.js', './vendor/three/GLTFLoader.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-64.png', './icons/icona.svg',
];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(GUSCIO))); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('matrix-') && k !== VERSIONE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // accesso e dati: sempre e solo dalla rete, mai in copia
  if (url.hostname.endsWith('supabase.co')) return;
  // solo i file dell'app stessa; nessun altro sito
  if (url.origin === location.origin) {
    e.respondWith(fetch(req, { cache: 'no-cache' })
      .then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSIONE).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(hit => hit || caches.match('./index.html'))));
  }
});
