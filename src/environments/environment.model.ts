import { CacheLocation } from "@auth0/auth0-spa-js";

export interface GoogleAnalyticsConfig {
  trackingId: string;
}

export interface MapboxConfig {
  accessToken: string;
  style: string;
}

export interface Auth0AuthorizationParams {
  audience: string;
  redirect_uri: string;
  scope: string;
}

export interface Auth0Config {
  appId: string;
  domain: string;
  clientId: string;
  useRefreshTokens: boolean;
  useRefreshTokensFallback: boolean;
  cacheLocation: CacheLocation;
  authorizationParams: Auth0AuthorizationParams;
}

export interface RealmWalkerAPIConfig {
  host: string;
}

export interface RealmWalkerConfig {
  mapRefreshRate: number;
}

export interface RealmWalkerEnvironment {
  production: boolean;
  googleAnalytics: GoogleAnalyticsConfig;
  mapbox: MapboxConfig;
  auth0: Auth0Config;
  realmwalkerApi: RealmWalkerAPIConfig;
  realmWalker: RealmWalkerConfig;
}
