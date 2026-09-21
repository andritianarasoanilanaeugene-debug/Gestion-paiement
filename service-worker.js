const CACHE_NAME = 'gestion-paiement-v4';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './paiements.html',
  './classe.html',
  './service-worker.js'
];

self.addEventListener('install', event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))

  );

  self.skipWaiting();

});


self.addEventListener('activate', event => {

  event.waitUntil(

    caches
      .keys()
      .then(names =>

        Promise.all(

          names
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))

        )

      )

  );

  self.clients.claim();

});


self.addEventListener('fetch', event => {

  /*
   * Les appels Google Apps Script
   * ne doivent jamais être mis dans le cache.
   */

  if (
    event.request.url.includes('script.google.com')
  ) {

    return;

  }


  /*
   * Pour les fichiers de l'application :
   * on utilise le cache s'il existe,
   * sinon on demande le fichier au réseau.
   */

  event.respondWith(

    caches
      .match(event.request)
      .then(cached => {

        if (cached) {

          return cached;

        }

        return fetch(event.request);

      })

  );

});
