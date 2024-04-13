// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import config from '../../capacitor.config';
import {CacheLocation} from "@auth0/auth0-spa-js";
import {Capacitor} from "@capacitor/core";

const platform = Capacitor.getPlatform();
const cacheLocation: CacheLocation = 'localstorage'

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWxpY2VjeWFuIiwiYSI6ImNsZ3FyenlwNjBzcTczb21yZHBzdnhkYmUifQ.fRSbavjs74FfwfMunA6qSg'
  },
  auth: {
    appId: 'app.realmwalker',
    domain: 'dev-realmwalker.eu.auth0.com',
    clientId: 'IgZ8a8z20uXVoXa5MtC3NLXk7CKXNLPr',
    useRefreshTokens: true,
    useRefreshTokensFallback: true, // https://community.auth0.com/t/auth0-spa-2-x-returning-missing-refresh-token/98999/18
    cacheLocation: cacheLocation,
    authorizationParams: {
      audience: 'dev-realmwalker',
      redirect_uri: platform === 'web' ? window.location.origin : `${config.appId}://dev-realmwalker.eu.auth0.com/capacitor/${config.appId}/callback`,
      scope: 'openid profile email offline_access'
    },
  },
  api: {
    host: 'https://localhost:3001/api',
    // host: 'https://192.168.1.8:3001/api',
  },
  config: {
    mapRefreshRate: 0, // Every n seconds
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
