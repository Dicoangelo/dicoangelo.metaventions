# Deployment Checklist - Phase 1

**Target**: Deploy Phase 1 (Foundation & Infrastructure) to production
**Prerequisites**: Upstash and Sentry accounts configured

---

## Pre-Deployment Checklist

### 1. Environment Variables ⚠️ REQUIRED

Add these to your `.env.local` (development) and Vercel environment variables (production):

#### Upstash/Vercel KV (Rate Limiting)
```env
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your-token-here
```

**How to get**:
1. Go to https://vercel.com/integrations/upstash
2. Install Upstash Redis integration
3. Copy `KV_REST_API_URL` and `KV_REST_API_TOKEN`
4. OR: Create account at https://upstash.com and create a Redis database

#### Sentry (Error Tracking)
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/789012
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/789012
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=dicoangelo-portfolio
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

**How to get**:
1. Create account at https://sentry.io
2. Create new Next.js project
3. Copy DSN from project settings
4. Get auth token from Settings → Account → API → Auth Tokens
5. See `SENTRY_SETUP.md` for detailed instructions

#### Existing Variables (Keep These)
```env
ANTHROPIC_API_KEY=sk-ant-...
COHERE_API_KEY=...
SUPABASE_URL=https://...
SUPABASE_KEY=eyJ...
DEEPGRAM_API_KEY=...
ADMIN_PASSWORD=...
```

---

### 2. Local Testing ✅

Run these commands to verify everything works locally:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Run tests
npm test

# Expected: 22/22 tests passing
# If any fail, do NOT proceed to deployment

# 3. Run build
npm run build

# Expected: Build succeeds without errors
# Warnings about CSS/Tailwind are OK

# 4. Test production build locally
npm run start

# Expected: Server starts on http://localhost:3000

# 5. Manual testing checklist:
# [ ] Homepage loads
# [ ] Chat works (if Anthropic API key configured)
# [ ] JD Analyzer works
# [ ] Theme toggle works
# [ ] Keyboard shortcuts (press ?)
# [ ] Back to top button appears on scroll
# [ ] No console errors
```

---

### 3. Rate Limiting Test (After Upstash Setup)

Test rate limiting works before deploying:

```bash
# Start dev server
npm run dev

# In another terminal, test rate limiting:
# (This script makes 15 rapid requests to trigger rate limit)

curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}' \
  -i

# Repeat 15 times quickly
# After 10th request, you should see:
# HTTP/1.1 429 Too Many Requests
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 0
# {"error":"Rate limit exceeded. Please wait a moment before trying again."}
```

**If rate limiting doesn't work**:
- Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- Check Upstash dashboard to confirm Redis is active
- Restart dev server after adding env vars

---

### 4. Sentry Test (After Sentry Setup)

Test error tracking works:

**Option A: Trigger test error in development**

1. Temporarily enable Sentry in dev:
   ```typescript
   // sentry.client.config.ts
   enabled: true, // Change from: process.env.NODE_ENV === 'production'
   ```

2. Add test error button to page:
   ```tsx
   <button onClick={() => { throw new Error('Test Sentry error'); }}>
     Test Error
   </button>
   ```

3. Click button, check Sentry dashboard for error

4. **IMPORTANT**: Revert changes before deploying:
   ```typescript
   enabled: process.env.NODE_ENV === 'production',
   ```

**Option B: Test in production after deployment**
- Deploy first
- Trigger an error (e.g., invalid API request)
- Check Sentry dashboard

---

### 5. Security Headers Test

Verify security headers are present:

```bash
# Start dev server
npm run dev

# Check headers (in another terminal)
curl -I http://localhost:3000

# Expected headers:
# Content-Security-Policy: default-src 'self'; script-src...
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
```

---

## Deployment Steps

### Step 1: Add Environment Variables to Vercel

```bash
# If using Vercel CLI:
vercel env add KV_REST_API_URL
# Enter value when prompted

vercel env add KV_REST_API_TOKEN
vercel env add NEXT_PUBLIC_SENTRY_DSN
vercel env add SENTRY_DSN
vercel env add SENTRY_ORG
vercel env add SENTRY_PROJECT
vercel env add SENTRY_AUTH_TOKEN
```

**OR via Vercel Dashboard**:
1. Go to your project on https://vercel.com
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development
4. Make sure `NEXT_PUBLIC_SENTRY_DSN` is marked as "Expose to client"

---

### Step 2: Deploy to Vercel

**Option A: Git Push (Recommended)**
```bash
git add .
git commit -m "Phase 1 complete: Testing, security, error tracking"
git push origin main
```
Vercel will automatically deploy.

**Option B: Vercel CLI**
```bash
vercel --prod
```

---

### Step 3: Post-Deployment Verification

After deployment, verify everything works:

#### A. Check Deployment Build Logs
- Go to Vercel dashboard
- Click on your deployment
- Check "Build Logs" - should complete successfully
- Look for Sentry source map upload confirmation

#### B. Test Rate Limiting (Production)
```bash
# Replace with your production URL
PROD_URL="https://dicoangelo.com"

# Make 15 rapid requests
for i in {1..15}; do
  curl -X POST $PROD_URL/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"test '$i'"}]}' \
    -i | grep -E "(HTTP|X-RateLimit)"
  sleep 0.1
done

# After 10th request, should see:
# HTTP/2 429
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 0
```

#### C. Test Security Headers (Production)
```bash
curl -I https://dicoangelo.com

# Verify headers are present:
# ✓ Content-Security-Policy
# ✓ Strict-Transport-Security
# ✓ X-Frame-Options: DENY
# ✓ X-Content-Type-Options: nosniff
# ✓ Referrer-Policy
```

#### D. Test Error Boundaries
1. Visit https://dicoangelo.com
2. Open browser console
3. No errors should be logged
4. Interact with site normally

#### E. Trigger Test Error (Sentry Verification)
1. Send invalid request to API:
   ```bash
   curl -X POST https://dicoangelo.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":"invalid"}' # Invalid: should be array
   ```

2. Check Sentry dashboard (https://sentry.io)
3. Error should appear within 1-2 minutes
4. Verify stack trace shows correct file/line numbers (source maps working)

#### F. Check Performance Metrics
1. Go to Sentry → Performance
2. Filter by operation: `http.server`
3. Should see API endpoints with response times
4. Check AI inference times

---

### Step 4: Monitor for 24 Hours

After deployment, monitor:

**Upstash Dashboard** (https://console.upstash.com):
- Check "Commands" graph for rate limiting activity
- Verify requests are being tracked

**Sentry Dashboard** (https://sentry.io):
- Monitor for unexpected errors
- Check error rate (should be <1% of requests)
- Review any errors and determine if they're critical

**Vercel Analytics**:
- Monitor Core Web Vitals
- Verify no performance regression
- LCP should remain <2.5s
- FID should remain <100ms
- CLS should remain <0.1

---

## Troubleshooting

### Rate Limiting Not Working

**Symptom**: No 429 errors even after 20+ requests

**Solutions**:
1. Verify environment variables are set in Vercel:
   ```bash
   vercel env ls
   ```
2. Check Upstash dashboard - is Redis database active?
3. Verify Redis URL format: `https://` prefix required
4. Redeploy after adding env vars:
   ```bash
   vercel --prod --force
   ```

---

### Sentry Not Capturing Errors

**Symptom**: No errors appear in Sentry dashboard

**Solutions**:
1. Verify DSN is correct and project is active
2. Check environment variables:
   ```bash
   vercel env ls | grep SENTRY
   ```
3. Verify `NEXT_PUBLIC_SENTRY_DSN` is exposed to client
4. Check Sentry project settings → Client Keys (DSN)
5. Look for Sentry initialization logs in browser console (dev mode)
6. Verify source maps uploaded: Check build logs for "Source maps uploaded"

---

### Source Maps Not Working

**Symptom**: Stack traces show minified code, not original TypeScript

**Solutions**:
1. Verify `SENTRY_AUTH_TOKEN` is set and valid
2. Verify `SENTRY_ORG` and `SENTRY_PROJECT` match Sentry account
3. Check build logs for source map upload errors
4. Generate new auth token in Sentry with correct permissions:
   - project:read
   - project:releases
   - org:read

---

### CSP Violations in Browser Console

**Symptom**: Console errors like "Refused to load... violates CSP"

**Solutions**:
1. Check browser console for blocked resource URLs
2. Add allowed domains to `src/middleware.ts` CSP config:
   ```typescript
   connect-src 'self' https://new-domain.com;
   ```
3. Redeploy after updating CSP

---

### Build Failures

**Symptom**: Vercel build fails

**Solutions**:
1. Check build logs for specific error
2. Run `npm run build` locally to reproduce
3. Common issues:
   - Missing dependencies: Run `npm install`
   - Type errors: Run `npm run lint` to check
   - Sentry config issues: Verify all Sentry env vars are set
4. If Sentry causing issues, temporarily disable:
   ```typescript
   // next.config.ts
   export default nextConfig; // Remove withSentryConfig wrapper
   ```

---

## Rollback Plan

If deployment causes issues:

### Quick Rollback (Vercel)
1. Go to Vercel dashboard
2. Deployments → Previous deployment
3. Click "..." → "Promote to Production"
4. Previous version restored in <1 minute

### Git Rollback
```bash
# Find commit before Phase 1
git log --oneline

# Revert to that commit
git revert <commit-hash>
git push origin main
```

### Disable Specific Features
If only one feature is problematic:

**Disable Rate Limiting**:
Remove rate limiting checks from API routes (comment out)

**Disable Sentry**:
Set `enabled: false` in all Sentry config files

**Disable Security Headers**:
Comment out middleware export in `src/middleware.ts`

---

## Success Criteria

Deployment is successful when:

- ✅ Build completes without errors
- ✅ All tests passing (22/22)
- ✅ Rate limiting working (429 errors after 10 requests)
- ✅ Security headers present on all pages
- ✅ Sentry capturing errors (test error appears in dashboard)
- ✅ Source maps working (readable stack traces)
- ✅ No console errors on homepage
- ✅ Core Web Vitals maintained (LCP <2.5s, CLS <0.1)
- ✅ All existing features working (chat, JD analyzer, etc.)

---

## Post-Deployment Tasks

After successful deployment:

1. **Set up Sentry Alerts** (Recommended):
   - Go to Sentry → Alerts → Create Alert
   - Alert on: "Error count > 10 in 1 hour"
   - Notify: Email + Slack (optional)

2. **Monitor Upstash Usage**:
   - Free tier: 10,000 commands/day
   - Upgrade if exceeded

3. **Monitor Sentry Usage**:
   - Free tier: 5,000 errors/month
   - Adjust sample rates if exceeded

4. **Update Documentation**:
   - Mark Phase 1 as deployed in README
   - Document any deployment-specific notes

5. **Create Monitoring Dashboard** (Optional):
   - Combine Vercel + Upstash + Sentry metrics
   - Track overall site health

---

## Next Steps After Deployment

Once Phase 1 is deployed and verified:

1. **Monitor for 24-48 hours**
2. **Fix any production issues**
3. **Begin Phase 2**: GSAP animations
4. **Begin Phase 4.1**: Refactor page.tsx

---

**Checklist Summary**:
```
[ ] Environment variables added to .env.local
[ ] Environment variables added to Vercel
[ ] All tests passing locally (npm test)
[ ] Build succeeds locally (npm run build)
[ ] Rate limiting tested and working
[ ] Security headers verified
[ ] Deployed to Vercel
[ ] Post-deployment verification complete
[ ] Sentry capturing errors
[ ] Source maps working
[ ] Monitoring dashboards checked
[ ] No regressions in Core Web Vitals
```

---

**Last Updated**: 2026-01-31
**Ready to deploy!** ✅
