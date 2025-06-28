"use client";

import React, { createContext, useEffect, useState } from "react";
import keycloak from "../lib/auth";
import {initializeRoleCache} from "@app/lib/roles"; 

interface AuthContextType {
  keycloak: Keycloak.KeycloakInstance | null;
  initialized: boolean;
  user: {
    name: string;
    email: string;
    roles: string[];
  } | null;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  initialized: false,
  user: null,
  logout: () => {},
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
  keycloak
    .init({ onLoad: 'login-required', checkLoginIframe: false })
    .then(async (authenticated) => {
      if (authenticated && keycloak.tokenParsed) {
        const { name, email, resource_access } = keycloak.tokenParsed;

        const clientRoles =
          resource_access?.['nextjs-frontend']?.roles || []; // ← change this line

        await initializeRoleCache();

        setUser({
          name: name || 'Unknown',
          email: email || 'No email',
          roles: clientRoles,
        });
      }

      setInitialized(true);
    });
}, []);


  const logout = () => {
    setUser(null); // clear local state
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        initialized,
        user,
        logout,
      }}
    >
      {initialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
