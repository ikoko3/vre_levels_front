'use client';

import React, { createContext, useEffect, useState } from 'react';
import keycloak from '../lib/auth';
import { initializeRoleCache } from '@app/lib/roles';
import { API_BASE_URL } from '@app/constants/config';

interface AuthContextType {
  keycloak: Keycloak.KeycloakInstance | null;
  initialized: boolean;
  user: {
    name: string;
    email: string;
    roles: string[];
    id: string;
    app_id: string;
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
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then(async (authenticated) => {
        if (authenticated && keycloak.tokenParsed) {
          const { name, email, resource_access, sub } = keycloak.tokenParsed;

          const clientRoles = resource_access?.['nextjs-frontend']?.roles || [];

          await initializeRoleCache();

          const res = await fetch(`${API_BASE_URL}/user-by-reference/${sub}`);
          if (!res.ok) throw new Error('Failed to fetch user');

          setUser({
            name: name || 'Unknown',
            email: email || 'No email',
            roles: clientRoles,
            id: sub,
            app_id: (await res.json()).id,
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
