import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Lower for edge runtime to reduce overhead
  tracesSampleRate: 0.05,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable in production only
  enabled: process.env.NODE_ENV === 'production',

  // Privacy controls - filter PII (same as server config)
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    // Filter sensitive request data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }
    }

    return event;
  },

  // Automatically tag errors with release version
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Set environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});
