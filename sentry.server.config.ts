import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,

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
        delete event.request.headers['x-api-key'];
        delete event.request.headers['anthropic-api-key'];
        delete event.request.headers['cohere-api-key'];
      }

      // Filter query strings
      if (event.request.query_string) {
        event.request.query_string = '[Filtered]';
      }

      // Filter request body data
      if (event.request.data) {
        // Don't log the actual message content from AI APIs
        if (typeof event.request.data === 'object' && event.request.data !== null) {
          const filtered: Record<string, any> = { ...event.request.data };
          const sensitiveFields = [
            'messages',
            'jd_text',
            'text',
            'apiKey',
            'api_key',
            'password',
            'token',
            'email',
          ];

          sensitiveFields.forEach(field => {
            if (field in filtered) {
              filtered[field] = '[Filtered]';
            }
          });

          event.request.data = filtered;
        }
      }
    }

    // Filter contexts
    if (event.contexts) {
      // Remove runtime context that might contain env vars
      delete event.contexts.runtime;
    }

    // Filter extra data
    if (event.extra) {
      const sensitiveKeys = ['env', 'config', 'apiKey', 'token'];
      sensitiveKeys.forEach(key => {
        if (key in event.extra!) {
          delete event.extra![key];
        }
      });
    }

    return event;
  },

  // Ignore known server-side errors
  ignoreErrors: [
    // Network timeouts
    'ETIMEDOUT',
    'ECONNRESET',
    'ENOTFOUND',
    // Rate limit errors (expected behavior)
    'Rate limit exceeded',
    // Expected validation errors
    'ValidationError',
    // Aborted requests
    'AbortError',
  ],

  // Automatically tag errors with release version
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Set environment
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});
