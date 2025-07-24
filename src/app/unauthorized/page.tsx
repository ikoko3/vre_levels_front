'use client';

import { useEffect } from 'react';
import { KEYCLOAK_AUTH_URL } from '@app/constants/config';

export default function UnauthorizedPage() {
  useEffect(() => {
    const loginUrl = new URL(KEYCLOAK_AUTH_URL);

    loginUrl.searchParams.set('client_id', 'nextjs-frontend');
    loginUrl.searchParams.set(
      'redirect_uri',
      window.location.origin + '/callback',
    );
    loginUrl.searchParams.set('response_type', 'code');
    loginUrl.searchParams.set('scope', 'openid');

    // Delay a bit before redirecting
    setTimeout(() => {
      window.location.href = loginUrl.toString();
    }, 1000); // 1 second delay
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔒 Session expired</h1>
      <p>Redirecting you to login...</p>
    </div>
  );
}
