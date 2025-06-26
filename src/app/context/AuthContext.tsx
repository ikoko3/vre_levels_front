"use client";

import React, { createContext, useEffect, useState } from "react";
import keycloak from "../lib/keycloak";

interface AuthContextType {
  keycloak: Keycloak.KeycloakInstance | null;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  keycloak: null,
  initialized: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: "login-required" }).then(() => {
      setInitialized(true);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, initialized }}>
      {initialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
