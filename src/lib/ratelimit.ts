import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Create rate limiters for different endpoints
export const chatRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:chat',
});

export const jdAnalyzerRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:jd-analyzer',
});

export const ttsRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit:tts',
});

/**
 * Helper function to get client identifier (IP or fallback to 'anonymous')
 */
export function getClientIdentifier(headers: Headers): string {
  // Try to get IP from various headers
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

  // Return first available IP or fallback to 'anonymous'
  return forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp || 'anonymous';
}

/**
 * Helper function to create rate limit response headers
 */
export function createRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  };
}
