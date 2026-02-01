import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Define Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https: http: ${process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://api.anthropic.com https://api.cohere.ai https://api.deepgram.com https://*.supabase.co wss://api.deepgram.com https://api.elevenlabs.io;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
