const CACHE_NAME =
  'gestion-paiements-v1';


const FICHIERS =
  [
    './',
    './index.html',
    './paiements.html'
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
              FICHIERS
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
          function(cachesExistants) {

            return Promise.all(

              cachesExistants
                .filter(
                  function(cache) {

                    return (
                      cache !==
                      CACHE_NAME
                    );

                  }
                )
                .map(
                  function(cache) {

                    return caches.delete(
                      cache
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
 * REQUETES
 ************************************************************/

self.addEventListener(
  'fetch',
  function(event) {

    /*
     * On ne met PAS les requêtes
     * Google Apps Script dans le cache.
     */

    if (
      event.request.url.includes(
        'script.google.com'
      )
    ) {

      return;

    }


    /*
     * Pour le frontend :
     * cache d'abord.
     */

    event.respondWith(

      caches
        .match(
          event.request
        )
        .then(
          function(reponseCache) {

            if (
              reponseCache
            ) {

              return reponseCache;

            }


            return fetch(
              event.request
            )
            .then(
              function(reponseInternet) {

                /*
                 * On met en cache
                 * uniquement les réponses
                 * valides.
                 */

                if (
                  reponseInternet &&
                  reponseInternet.status === 200 &&
                  reponseInternet.type === 'basic'
                ) {

                  const copie =
                    reponseInternet.clone();


                  caches
                    .open(
                      CACHE_NAME
                    )
                    .then(
                      function(cache) {

                        cache.put(
                          event.request,
                          copie
                        );

                      }
                    );

                }


                return reponseInternet;

              }
            );

          }
        )

    );

  }
);
