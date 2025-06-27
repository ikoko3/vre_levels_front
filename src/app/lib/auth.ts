import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'vre',
  clientId: 'nextjs-frontend',
});

export default keycloak;

type User = {
  name: string;
  email: string;
  roles: string[];
};


function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getCookie('kc-token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      name: payload.name || payload.preferred_username,
      email: payload.email,
      roles: payload.resource_access?.['nextjs-frontend']?.roles || [],
    };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

export async function logout() {
  const redirectUri = window.location.origin;
  window.location.href = `http://localhost:8080/realms/vre/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(redirectUri)}`;
}