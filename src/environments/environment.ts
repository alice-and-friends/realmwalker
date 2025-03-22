import { RealmWalkerEnvironment } from "./environment.model";
import { CacheLocation } from "@auth0/auth0-spa-js";
import { Capacitor } from "@capacitor/core";
import config from '../../capacitor.config';

const platform = Capacitor.getPlatform();
const cacheLocation: CacheLocation = 'localstorage';

export const environment: RealmWalkerEnvironment = {
  production: false,
  googleAnalytics: {
    trackingId: 'G-DVEFFNQGV8',
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWxpY2VjeWFuIiwiYSI6ImNsZ3FyenlwNjBzcTczb21yZHBzdnhkYmUifQ.fRSbavjs74FfwfMunA6qSg',
    styleUrl: 'mapbox://styles/alicecyan/clgs324md001m01qye8obgx8p',
  },
  auth0: {
    appId: 'app.realmwalker',
    domain: 'dev-realmwalker.eu.auth0.com',
    clientId: 'IgZ8a8z20uXVoXa5MtC3NLXk7CKXNLPr',
    useRefreshTokens: true,
    useRefreshTokensFallback: true,
    cacheLocation: cacheLocation,
    authorizationParams: {
      audience: 'dev-realmwalker',
      redirect_uri: platform === 'web' ? window.location.origin : `${config.appId}://dev-realmwalker.eu.auth0.com/capacitor/${config.appId}/callback`,
      scope: 'openid profile email offline_access',
    },
  },
  realmwalkerApi: {
    host: 'https://172.16.4.171:3001/api',
  },
  realmWalker: {
    mapRefreshRate: 0, // Every n seconds
    zoom: 15.5,
    minZoom: 10,
  },
};
