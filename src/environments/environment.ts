// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWxpY2VjeWFuIiwiYSI6ImNsZ3FyenlwNjBzcTczb21yZHBzdnhkYmUifQ.fRSbavjs74FfwfMunA6qSg'
  },
  auth: {
    domain: 'dev-realmwalker.eu.auth0.com',
    clientId: 'IgZ8a8z20uXVoXa5MtC3NLXk7CKXNLPr',
    authorizationParams: {
      audience: 'dev-realmwalker',
      redirect_uri: window.location.origin
    },
  },
  api: {
    host: 'http://localhost:3000/api'
  },
  config: {
    mapRefreshRate: 0,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
