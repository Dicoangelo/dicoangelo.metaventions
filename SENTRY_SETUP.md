# Sentry Error Tracking Setup

This document explains how Sentry is configured for error tracking and performance monitoring on dicoangelo.com.

## Overview

Sentry is configured to:
- ✅ Track client-side errors (browser)
- ✅ Track server-side errors (API routes)
- ✅ Track edge runtime errors (middleware)
- ✅ Monitor performance of AI endpoints
- ✅ Filter out PII (Personally Identifiable Information)
- ✅ Provide session replay for debugging
- ✅ Custom error boundaries for better UX

## Configuration Files

### Core Config Files
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `next.config.ts` - Webpack plugin integration for source maps

### Utility Files
- `src/lib/sentry-utils.ts` - Helper functions for API monitoring
- `src/components/errors/ErrorBoundary.tsx` - General error boundary
- `src/components/errors/AIErrorBoundary.tsx` - AI-specific error boundary

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Public DSN (safe to expose in browser)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/789012

# Server-side DSN (same as above, but not exposed to browser)
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/789012

# Organization and project names
SENTRY_ORG=your-org-name
SENTRY_PROJECT=dicoangelo-portfolio

# Auth token for uploading source maps (get from Sentry settings)
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## How to Get Your Sentry Credentials

1. **Create a Sentry Account**
   - Go to https://sentry.io
   - Sign up for a free account (includes 5K errors/month)

2. **Create a New Project**
   - Click "Create Project"
   - Select "Next.js" as the platform
   - Name it "dicoangelo-portfolio"
   - Copy the DSN that's shown

3. **Get Your Auth Token**
   - Go to Settings → Account → API → Auth Tokens
   - Click "Create New Token"
   - Select scopes: `project:read`, `project:releases`, `org:read`
   - Copy the token

4. **Add Variables to `.env.local`**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=<your-dsn>
   SENTRY_DSN=<your-dsn>
   SENTRY_ORG=<your-org-slug>
   SENTRY_PROJECT=dicoangelo-portfolio
   SENTRY_AUTH_TOKEN=<your-auth-token>
   ```

## Privacy & Security Features

### PII Filtering
Sentry is configured to automatically filter out:
- Cookies and authorization headers
- Email addresses from error messages
- Phone numbers from error messages
- API keys and tokens
- Chat message content (only metadata tracked)
- Job description text (only metadata tracked)

### What Gets Tracked
- Error type and stack trace
- Browser/device information
- Page URL (without query parameters)
- Performance metrics (response time, etc.)
- User actions (clicks, navigation) - anonymized

### What Does NOT Get Tracked
- User messages or prompts
- API keys or tokens
- Email addresses or phone numbers
- Cookies or session data
- Request/response bodies from AI APIs

## Usage Examples

### 1. Wrap AI Components with Error Boundaries

```tsx
import { AIErrorBoundary } from '@/components/errors/AIErrorBoundary';

export default function ChatPage() {
  return (
    <AIErrorBoundary feature="chat">
      <ChatComponent />
    </AIErrorBoundary>
  );
}
```

### 2. Track API Performance

```tsx
import { withSentryAPI, trackAIPerformance } from '@/lib/sentry-utils';

export const POST = withSentryAPI('chat', async (request) => {
  const tracker = trackAIPerformance('chat', 'claude-sonnet-4');

  try {
    // Your AI API call
    const response = await anthropic.messages.create({...});

    tracker.finish({ tokens: 150, success: true });
    return new Response(response);
  } catch (error) {
    tracker.finish({ success: false, error: error.message });
    throw error;
  }
});
```

### 3. Manual Error Capture

```tsx
import { captureException, logBreadcrumb } from '@/lib/sentry-utils';

try {
  logBreadcrumb('User submitted job description', { length: jdText.length });

  const result = await analyzeJD(jdText);

  logBreadcrumb('Analysis complete', { fitScore: result.fit_score });
} catch (error) {
  captureException(error, {
    feature: 'jd-analyzer',
    extra: { jdLength: jdText.length },
  });
}
```

### 4. General Error Boundary

```tsx
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

export default function SomeSection() {
  return (
    <ErrorBoundary
      fallback={<div>This section is temporarily unavailable</div>}
      onError={(error) => console.error('Section error:', error)}
    >
      <ComplexComponent />
    </ErrorBoundary>
  );
}
```

## Performance Monitoring

Sentry tracks:
- **API Response Times**: How long each endpoint takes
- **AI Inference Time**: Time for Claude/Cohere API calls
- **Token Usage**: Number of tokens used per request
- **Success Rates**: Percentage of successful API calls

View performance data:
1. Go to Sentry dashboard
2. Click "Performance" tab
3. Filter by operation type: `http.server` or `ai.inference`

## Error Alerts

Configure alerts in Sentry:
1. Go to Alerts → Create Alert
2. Set conditions (e.g., "10 errors in 1 hour")
3. Add notification channels (email, Slack, etc.)

Recommended alerts:
- High error rate on `/api/chat` (>5 errors/min)
- High error rate on `/api/analyze-jd` (>5 errors/min)
- Any error with tag `feature:chat` (immediate notification)

## Session Replay

Session replay is configured with privacy-first settings:
- All text is masked
- All media (images, videos) is blocked
- Only captures 10% of sessions
- Captures 100% of sessions with errors

To view replays:
1. Go to Sentry dashboard
2. Click "Replays" tab
3. Filter by errors or specific users

## Testing in Development

Sentry is **disabled in development** by default. To test:

1. Temporarily enable in `sentry.client.config.ts`:
   ```ts
   enabled: true, // Change from: process.env.NODE_ENV === 'production'
   ```

2. Trigger a test error:
   ```tsx
   <button onClick={() => { throw new Error('Test error'); }}>
     Test Sentry
   </button>
   ```

3. Check Sentry dashboard for the error

## Source Maps

Source maps are automatically uploaded to Sentry during production builds:
- Allows you to see original TypeScript code in stack traces
- Maps minified production code back to source
- Only uploaded in production (not development)

To verify source maps are working:
1. Trigger an error in production
2. Go to Sentry dashboard
3. Click on the error
4. Stack trace should show original file names and line numbers

## Troubleshooting

### "Sentry DSN not found"
- Make sure `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`
- Restart the dev server after adding env variables

### "Source maps not uploading"
- Check that `SENTRY_AUTH_TOKEN` is correct
- Verify `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry account
- Run `npm run build` and check for upload errors

### "Too many errors captured"
- Review `ignoreErrors` list in Sentry config files
- Add common non-critical errors to the ignore list
- Adjust sample rate: `tracesSampleRate: 0.1` (10%)

### "PII being captured"
- Check `beforeSend` hook in Sentry config
- Test with sensitive data and verify it's filtered in dashboard
- Add additional filters if needed

## Cost Management

Sentry free tier includes:
- 5,000 errors/month
- 10,000 performance transactions/month
- 50 replay sessions/month

To stay within free tier:
- Keep `tracesSampleRate` at 0.1 (10%)
- Keep `replaysSessionSampleRate` at 0.1 (10%)
- Add common errors to `ignoreErrors` list
- Monitor usage in Sentry dashboard

## Next Steps

1. ✅ Create Sentry account
2. ✅ Add environment variables
3. ✅ Deploy to production
4. ✅ Verify errors are being captured
5. ✅ Set up alerts for critical endpoints
6. ✅ Review and adjust sample rates based on usage

---

**Last Updated**: 2026-01-31
**Sentry Version**: @sentry/nextjs 8.x
