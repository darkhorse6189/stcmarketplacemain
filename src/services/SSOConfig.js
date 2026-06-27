import Keycloak from "keycloak-js";

export const createKeycloakInstance = (config) => {
 return new Keycloak({
    // url: config.SSO_URL,
    // realm: config.SSO_REALM,
    // clientId: config.SSO_CLIENT_ID,
    url: config.VITE_APP_SSO_URL,
    realm: config.VITE_APP_SSO_REALM,
    clientId: config.VITE_APP_SSO_CLIENT_ID,
  });
};
