# CSP (Content Security Policy) Fix Guide

## Problem Summary

The production site has **38+ Content Security Policy violations** preventing JavaScript from executing. This is caused by the CSP directive using `'strict-dynamic'` which requires all scripts to have a valid nonce, but Next.js-generated scripts and inline JSON-LD scripts are not receiving the nonce.

**Status:** 🔴 CRITICAL - Blocks core functionality

---

## Root Cause

### Current CSP in `/src/middleware.ts`:

```typescript
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:
```

**Issues:**
1. `'strict-dynamic'` requires nonces on ALL scripts
2. Next.js script chunks don't have nonce attributes
3. Inline JSON-LD scripts in layout.tsx don't have nonce attributes
4. The nonce is generated in middleware but not passed to React components

---

## Solution Options

### OPTION A: Hash-Based CSP (Recommended for Static Scripts)

**Best for:** Sites with static inline scripts (like JSON-LD)

#### Step 1: Remove `'strict-dynamic'` from middleware.ts

File: `/src/middleware.ts`

**Before:**
```typescript
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:
```

**After:**
```typescript
script-src 'self' 'nonce-${nonce}' https: http:
```

#### Step 2: Alternatively, use hashes for static scripts

Replace the nonce approach with hashes for inline scripts:

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' https: http:
    'sha256-21Jtqm++BNUEH0DF6hI9PKw4T70mqn/JLlcBOGbblzA='
    'sha256-4mQ/8uCcb65AJ+bZVy6hl3lzoraYwSmw1/gfEIp+r04='
    'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='
    'sha256-82uOM8rhpReTeMKtoHb1YPuPkiabybfTvFcb4SilIZc='
    'sha256-jgC9qQ78OrXDJ+0oMYDmKlJIDxQLkZocIYvxpVriamM='
    'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='
    'sha256-OKZZA7E99pT2dOg6hjv2lWSzIpN/t2Huuvb56vvGppw='
    'sha256-ot4uWMULOgQERJVeW+1RS4LiQazeh9VYa+IzbwCX43U='
    'sha256-p7GE78bbMHDrE4IWzpiMSttAsTpUu7wwi5/wvnH54Os='
    'sha256-QAlSewaQLi/NPCznjAZSyvQ72heD0VdxmNDDkZeCxgc='
    'sha256-TPcxWaBOFVPBgYrbQIwQ1ELtfs4sBKXcmcu8lNP13GA='
    'sha256-tpDcREQ4p+FPYlHCoMmpUg7ovCgbcmHXUm2azXAiiZc='
    'sha256-VYBOQbvay2A53qufUmFDYz666u4HLTkAFMK8K9sn2TM=';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https://api.anthropic.com https://api.cohere.ai
    https://api.deepgram.com https://*.supabase.co wss://api.deepgram.com
    https://api.elevenlabs.io;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();
```

---

### OPTION B: Nonce-Based (Proper Long-term Solution)

**Best for:** Maximum security with dynamic content

This requires passing the nonce from middleware to React components.

#### Step 1: Update middleware.ts to pass nonce to request context

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header with nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https: http:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://api.anthropic.com https://api.cohere.ai
      https://api.deepgram.com https://*.supabase.co wss://api.deepgram.com
      https://api.elevenlabs.io;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### Step 2: Create a utility to read nonce from headers

Create `/src/lib/nonce.ts`:

```typescript
import { headers } from 'next/headers';

export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('x-nonce') || undefined;
}
```

#### Step 3: Update layout.tsx to use nonce

File: `/src/app/layout.tsx`

```typescript
import { getNonce } from '@/lib/nonce';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getNonce();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          nonce={nonce}
          id="structured-data-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          nonce={nonce}
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          nonce={nonce}
          id="structured-data-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Note:** Layout needs to be async to use `await headers()`

---

### OPTION C: Disable CSP Temporarily (Not Recommended)

**Only for immediate testing purposes**

Remove CSP from middleware.ts temporarily:

```typescript
// Comment out or remove this line:
// response.headers.set('Content-Security-Policy', cspHeader);
```

Or switch to report-only mode:

```typescript
response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
```

---

## Recommended Solution

**Use OPTION A for immediate fix:**
1. Remove `'strict-dynamic'` from the CSP directive
2. Keep the nonce approach for future enhancement
3. This allows Next.js scripts to load while maintaining security

**Then implement OPTION B for long-term:**
1. Convert to proper async layout
2. Pass nonce to all Script components
3. Restore `'strict-dynamic'` for maximum security

---

## Testing Steps

### 1. Make Changes
Update `/src/middleware.ts` with one of the solutions above

### 2. Deploy to Vercel
```bash
git add src/middleware.ts
git commit -m "Fix: Remove strict-dynamic from CSP to allow scripts to load"
git push origin main
```

### 3. Run Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse https://dicoangelo.vercel.app --chrome-flags="--headless"
```

### 4. Verify No CSP Errors
Check that the "errors-in-console" audit now passes (score: 1.0)

### 5. Test Features
- Navigate to the site
- Test Chat feature (Ask Me Anything)
- Test JD Analyzer
- Test Contact form
- Use keyboard navigation (Tab key)

---

## Impact Assessment

### Performance Impact
- **Minimal:** Removing `'strict-dynamic'` has negligible performance impact
- CSP checking is still performed by browser
- Same security level maintained (just not as strict)

### Security Impact
- **Still Excellent:** Site maintains all other security headers
- HTTPS enforced
- Frame-ancestors blocked
- Object-src set to none
- Referrer-Policy configured

### Accessibility Impact
- **Positive:** Fixing this issue enables all scripts to load
- All interactive features will be available
- Keyboard navigation will work properly

---

## Before/After

### Before (Current - Broken)
```
❌ CSP blocks 38+ scripts
❌ Chat feature doesn't work
❌ JD Analyzer doesn't work
❌ Forms not interactive
❌ Keyboard navigation broken
❌ Lighthouse Performance: 100/100 but errors in console
```

### After (Fixed)
```
✅ All scripts load properly
✅ Chat feature works
✅ JD Analyzer works
✅ Forms fully interactive
✅ Keyboard navigation works
✅ Lighthouse: 100/100 with no CSP errors
```

---

## Files to Update

1. **`/src/middleware.ts`** - CSP configuration (REQUIRED)
2. **`/src/app/layout.tsx`** - Optional, for Option B

## Related Documentation

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js: Security](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [OWASP: CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

## Questions?

Refer to the main PRODUCTION_AUDIT_REPORT.md for detailed findings and recommendations.
