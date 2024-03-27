export const environment = {
  production: true,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWxpY2VjeWFuIiwiYSI6ImNsZ3FyenlwNjBzcTczb21yZHBzdnhkYmUifQ.fRSbavjs74FfwfMunA6qSg'
  },
  auth: {
    domain: '',
    clientId: '',
    authorizationParams: {
      audience: 'dev-realmwalker',
      redirect_uri: window.location.origin
    },
  },
  api: {
    host: ''
  },
  config: {
    mapRefreshRate: 10,
  },
};
