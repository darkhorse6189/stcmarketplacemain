import React, { useState, useEffect, createContext, useContext } from "react";
import { createKeycloakInstance } from "./SSOConfig";
import dhmarketplaceServiceInstance from "./DHMarketPlaceServices";
import { jwtDecode } from "jwt-decode";

// creating a context so tht we can store data/value that can be accessable easily in other component
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //using props here
  const [authenticated, setAuthenticated] = useState(false);

  const [ssoEnvVariable, setSsoEnvVariable] = useState();
  const [keycloakInstance, setKeycloakInstance] = useState();
  const [ssoDisabled, setSsoDisabled] = useState(false);
  useEffect(() => {
    dhmarketplaceServiceInstance.getAuthEnviromentVariable().then((data) => {
      //calling backend to retrive SSO url

      const ssoConfig = data?.data?.ReactEnvironmentVariableResponse;
      setSsoEnvVariable(ssoConfig);
      console.log("ssoConfig:", ssoConfig);
      console.log("ssoConfig.SSO_URL:", ssoConfig.SSO_URL);
      console.log("ssoConfig.SSO_REALM:", ssoConfig.SSO_REALM);
      console.log("ssoConfig.SSO_CLIENT_ID:", ssoConfig.SSO_CLIENT_ID);

      if (
        ssoConfig.SSO_URL === null ||
        ssoConfig.SSO_REALM === null ||
        ssoConfig.SSO_CLIENT_ID === null
      //   !import.meta.env.VITE_APP_SSO_URL ||
      // !import.meta.env.VITE_APP_SSO_REALM ||
      // !import.meta.env.VITE_APP_SSO_CLIENT_ID
      ) {
        setSsoDisabled(true);
        setAuthenticated(true); // Auto-authenticate when SSO is disabled
        return;
      }

      const kc = createKeycloakInstance(ssoConfig);
      // const ssoConfig = {
      //   VITE_APP_SSO_URL: import.meta.env.VITE_APP_SSO_URL,
      //   VITE_APP_SSO_REALM: import.meta.env.VITE_APP_SSO_REALM,
      //   VITE_APP_SSO_CLIENT_ID: import.meta.env.VITE_APP_SSO_CLIENT_ID
      // }
      // const kc = createKeycloakInstance(ssoConfig);
      setKeycloakInstance(kc); // passing it to createKeycloakInstance/AuthenticationConfig,js
    });
  }, []);

  useEffect(() => {
    if (keycloakInstance && !ssoDisabled) {
      keycloakInstance
        .init({
          onLoad: "login-required", // Force login immediately if the user isn't already authenticated.
          pkceMethod: "S256", // Prevents authorization code interception attacks.
          checkLoginIframe: false, //  periodically check if the user is still logged in  if true
        })
        .then((auth) => {

          try {
            const decodedUser = jwtDecode(keycloakInstance.token);
            console.log('Decoded User:', decodedUser);
            if (!sessionStorage.getItem("userId")) {
              sessionStorage.setItem("userId", JSON.stringify(decodedUser.preferred_username));
            }
          } catch (error) {
            console.error('Failed to decode token:', error);
          }

          setAuthenticated(auth);
          //  console.log("IsAuthenticated"+authenticated)
          //  console.log(" Client Roles:", keycloakInstance.tokenParsed?.resource_access?.ssoEnvVariable.data.ReactEnviromentVariableResponse.SSO_CLIENT_ID?.roles);
        })
        .catch(console.error);
    }

  }, [keycloakInstance, ssoDisabled]);

  const checkRole = () => {
    if (ssoDisabled) return true;

    const role = ssoEnvVariable?.SSO_ROLE;
    if (!role)
      console.error("Environment Variable REACT_APP_SSO_ROLE not passed");

    return keycloakInstance.tokenParsed?.resource_access?.[
      ssoEnvVariable?.SSO_CLIENT_ID
    ]?.roles.includes(role);
  };

  const getMatchingRoles = () => {
    if (ssoDisabled) return [];

    const rolesFromEnv =  ssoEnvVariable?.SSO_ROLE;
    // const rolesFromEnv =  import.meta.env.VITE_APP_SSO_ROLE;
    if (!rolesFromEnv) return [];

    const requiredRoles = rolesFromEnv.split(",").map((r) => r.trim());

      const userRoles =
        keycloakInstance?.tokenParsed?.resource_access?.[
          ssoEnvVariable?.SSO_CLIENT_ID
      ]?.roles || [];      

    // const userRoles =
    //   keycloakInstance?.tokenParsed?.resource_access?.[
    //     import.meta.env.VITE_APP_SSO_CLIENT_ID
    //   ]?.roles || [];      
    console.log("keycloakInstance: ", keycloakInstance)
     console.log("keycloakInstance?.tokenParsed:", keycloakInstance?.tokenParsed); 
    return requiredRoles.filter((role) => userRoles.includes(role));
  };

  const logout = () => {
    keycloakInstance.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    // here we are passing/storing keycloakInstanc , authenticated, checkRole, logout into AuthContext sothat it can be access in other component via AuthContext
    <AuthContext.Provider
      value={{
        keycloakInstance,
        authenticated,
        getMatchingRoles,
        checkRole,
        logout,
        ssoDisabled
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// I created a custom hook  to use the Auth context
export const useAuth = () => useContext(AuthContext);
