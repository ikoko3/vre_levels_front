import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'vre',
  clientId: 'visual_components',
});

export default keycloak;
