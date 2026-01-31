import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,

  // Session Replay - captures 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable in production only
  enabled: process.env.NODE_ENV === 'production',

  // Privacy controls - filter PII
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    // Filter out sensitive information from request data
    if (event.request) {
      // Remove cookies
      delete event.request.cookies;

      // Remove sensitive headers
      if (event.request.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
        delete event.request.headers['X-API-Key'];
      }

      // Scrub query strings that might contain sensitive data
      if (event.request.query_string) {
        event.request.query_string = '[Filtered]';
      }
    }

    // Filter PII from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          // Remove potential PII fields
          const sensitiveKeys = ['email', 'password', 'token', 'api_key', 'apiKey'];
          sensitiveKeys.forEach(key => {
            if (breadcrumb.data && key in breadcrumb.data) {
              breadcrumb.data[key] = '[Filtered]';
            }
          });
        }
        return breadcrumb;
      });
    }

    // Filter user messages that might contain PII
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map(exception => {
        if (exception.value && typeof exception.value === 'string') {
          // Replace email addresses
          exception.value = exception.value.replace(
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            '[email]'
          );
          // Replace phone numbers
          exception.value = exception.value.replace(
            /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
            '[phone]'
          );
        }
        return exception;
      });
    }

    return event;
  },

  // Ignore known errors that are not actionable
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    // ResizeObserver errors (common, non-critical)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Network errors that are expected
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    // User cancellations
    'AbortError',
    'The user aborted a request',
    // Non-Error promise rejections
    'Non-Error promise rejection captured',
    // Browser quirks
    "Cannot read property 'getBoundingClientRect' of null",
  ],

  // Automatically tag errors with release version if available
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Set environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,

  // Integration configuration
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content
      maskAllText: true,
      // Block all media (images, videos, etc.)
      blockAllMedia: true,
    }),
  ],
});
