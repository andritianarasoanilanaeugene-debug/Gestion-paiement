/************************************************************
 * SERVICE WORKER
 ************************************************************/

const CACHE_NAME =
  'gestion-paiement-v4';


const FILES_TO_CACHE = [

  './',

  './index.html',

  './paiements.html',

  './classe.html',

  './service-worker.js'

];


/************************************************************
 * INSTALLATION
 ************************************************************/

self.addEventListener(
  'install',
  function(event) {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          function(cache) {

            return cache.addAll(
              FILES_TO_CACHE
            );

          }
        )

    );


    self.skipWaiting();

  }
);


/************************************************************
 * ACTIVATION
 ************************************************************/

self.addEventListener(
  'activate',
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(
          function(names) {

            return Promise.all(

              names
                .filter(
                  function(name) {

                    return (
                      name !==
                      CACHE_NAME
                    );

                  }
                )

                .map(
                  function(name) {

                    return caches.delete(
                      name
                    );

                  }
                )

            );

          }
        )

    );


    self.clients.claim();

  }
);


/************************************************************
 * REQUÊTES
 ************************************************************/

self.addEventListener(
  'fetch',
  function(event) {

    /*
     * Apps Script :
     *
     * JAMAIS de cache.
     */

    if (

      event.request.url.includes(
        'script.google.com'
      )

    ) {

      return;

    }


    /*
     * Navigation HTML :
     *
     * priorité au cache.
     *
     * Cela permet d'ouvrir
     * l'application hors connexion.
     */

    if (
      event.request.mode ===
      'navigate'
    ) {

      event.respondWith(

        caches
          .match(
            './index.html'
          )
          .then(
            function(cached) {

              return (
                cached ||
                fetch(
                  event.request
                )
              );

            }
          )

      );

      return;

    }


    /*
     * Autres fichiers :
     *
     * cache d'abord,
     * réseau ensuite.
     */

    event.respondWith(

      caches
        .match(
          event.request
        )
        .then(
          function(cached) {

            if (cached) {

              return cached;

            }


            return fetch(
              event.request
            );

          }
        )

    );

  }
);
