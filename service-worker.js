const CACHE_NAME =
  'gestion-paiement-v2';


const FILES_TO_CACHE = [

  './',

  './index.html',

  './paiements.html',

  './classe.html',

  './service-worker.js'

];


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

                    return name !==
                      CACHE_NAME;

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


self.addEventListener(
  'fetch',
  function(event) {

    /*
     * On ne met PAS les appels Apps Script
     * dans le cache.
     *
     * L'API Google Sheets doit toujours
     * être appelée directement.
     */

    if (
      event.request.url.includes(
        'script.google.com'
      )
    ) {

      return;

    }


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
