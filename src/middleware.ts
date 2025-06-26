// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';

const RS256_ALG = 'RS256';
const PUBLIC_PATHS = ['/', '/favicon.ico', '/public', '/api/public'];

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('kc-token')?.value;

  if (!token) {

    const redirectAfterLogin = request.nextUrl.pathname;

    const loginUrl = new URL(
      'http://localhost:8080/realms/vre/protocol/openid-connect/auth'
    );
    loginUrl.searchParams.set('client_id', 'nextjs-frontend');
    loginUrl.searchParams.set('redirect_uri', 'http://localhost:4000/callback');
    loginUrl.searchParams.set('response_type', 'code');
    loginUrl.searchParams.set('scope', 'openid');
    loginUrl.searchParams.set('state', encodeURIComponent(redirectAfterLogin)); // preserve path


    return NextResponse.redirect(loginUrl);
  }

  try {
    const publicKey = await importSPKI(process.env.KEYCLOAK_PUBLIC_KEY!, RS256_ALG);
    const { payload } = await jwtVerify(token, publicKey);
    console.log('Verified user:', payload);

    return NextResponse.next();
  } catch (err) {
    console.error('Invalid token:', err);
    return NextResponse.redirect(`${request.nextUrl.origin}/unauthorized`);
  }
}

export const config = {
  matcher: [
    // Apply middleware only to application routes
    '/((?!_next/|favicon.ico|callback).*)',
  ],
};