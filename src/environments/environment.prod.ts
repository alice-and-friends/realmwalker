import { RealmWalkerEnvironment } from "./environment.model";
import { CacheLocation } from "@auth0/auth0-spa-js";
import { Capacitor } from "@capacitor/core";
import config from '../../capacitor.config';

const platform = Capacitor.getPlatform();
const cacheLocation: CacheLocation = 'localstorage';

export const environment: RealmWalkerEnvironment = {
  production: true,
  googleAnalytics: {
    trackingId: 'G-DZ52M7EK0S',
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWxpY2VjeWFuIiwiYSI6ImNsZ3FyenlwNjBzcTczb21yZHBzdnhkYmUifQ.fRSbavjs74FfwfMunA6qSg',
    styleUrl: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
  },
  auth0: {
    appId: '',
    domain: '',
    clientId: '',
    useRefreshTokens: true,
    useRefreshTokensFallback: true,
    cacheLocation: cacheLocation,
    authorizationParams: {
      audience: 'realmwalker',
      redirect_uri: platform === 'web' ? window.location.origin : `${config.appId}://realmwalker.eu.auth0.com/capacitor/${config.appId}/callback`,
      scope: 'openid profile email offline_access',
    },
  },
  realmwalkerApi: {
    host: 'https://<host>/api',
  },
  realmWalker: {
    mapRefreshRate: 6, // Every n seconds
    zoom: 12,
    minZoom: 8,
  },
};
