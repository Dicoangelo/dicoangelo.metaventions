import * as Sentry from '@sentry/nextjs';

/**
 * Wrapper for API routes to add performance monitoring and error tracking
 *
 * Usage:
 * ```ts
 * export const POST = withSentryAPI('chat', async (request) => {
 *   // Your API logic here
 * });
 * ```
 */
export function withSentryAPI(
  operationName: string,
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    return await Sentry.startSpan(
      {
        op: 'http.server',
        name: `API ${operationName}`,
        attributes: {
          'http.method': request.method,
          'http.url': request.url,
        },
      },
      async () => {
        // Add request metadata
        Sentry.setContext('request', {
          method: request.method,
          url: request.url,
          headers: {
            'user-agent': request.headers.get('user-agent'),
            'content-type': request.headers.get('content-type'),
          },
        });

        try {
          const response = await handler(request);

          // Record response status
          Sentry.setTag('response.status', response.status);

          return response;
        } catch (error) {
          // Capture the error
          Sentry.captureException(error, {
            tags: {
              api_route: operationName,
            },
            contexts: {
              request: {
                method: request.method,
                url: request.url,
              },
            },
          });

          // Re-throw to maintain normal error handling
          throw error;
        }
      }
    );
  };
}

/**
 * Track AI model performance metrics
 *
 * Usage:
 * ```ts
 * const tracker = trackAIPerformance('chat', 'claude-sonnet-4');
 * // ... AI call
 * tracker.finish({ tokens: 150, success: true });
 * ```
 */
export function trackAIPerformance(
  feature: 'chat' | 'jd-analyzer' | 'tts',
  model: string
) {
  Sentry.setTag('ai.feature', feature);
  Sentry.setTag('ai.model', model);

  const spanId = Sentry.startInactiveSpan({
    op: 'ai.inference',
    name: `${feature} - ${model}`,
  });

  return {
    /**
     * Finish tracking with optional metadata
     */
    finish: (metadata?: {
      tokens?: number;
      success?: boolean;
      error?: string;
    }) => {
      if (metadata) {
        if (metadata.tokens) {
          Sentry.setMeasurement('ai.tokens', metadata.tokens, 'none');
        }
        if (metadata.success !== undefined) {
          Sentry.setTag('ai.success', metadata.success);
        }
        if (metadata.error) {
          Sentry.setContext('ai.error', { message: metadata.error });
        }
      }
      spanId?.end();
    },
  };
}

/**
 * Log custom breadcrumb for debugging
 *
 * Usage:
 * ```ts
 * logBreadcrumb('User initiated chat', { query: 'shortened-query' });
 * ```
 */
export function logBreadcrumb(
  message: string,
  data?: Record<string, any>,
  level: 'info' | 'warning' | 'error' | 'debug' = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Manually capture an exception with additional context
 *
 * Usage:
 * ```ts
 * captureException(error, { feature: 'chat', userId: 'anonymous' });
 * ```
 */
export function captureException(
  error: Error,
  context?: {
    feature?: string;
    userId?: string;
    extra?: Record<string, any>;
  }
) {
  Sentry.captureException(error, {
    tags: {
      feature: context?.feature,
    },
    user: context?.userId
      ? {
          id: context.userId,
        }
      : undefined,
    extra: context?.extra,
  });
}
