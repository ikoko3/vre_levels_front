export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
export const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL ?? 'http://localhost:8080';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL ?? 'http://localhost:4000';
export const KEYCLOAK_AUTH_URL = `${KEYCLOAK_BASE_URL}/realms/vre/protocol/openid-connect/auth`;
export const KEYCLOAK_LOGOUT_URL = `${KEYCLOAK_BASE_URL}/realms/vre/protocol/openid-connect/logout`;
