/**
 * Rate limiting with Vercel KV or in-memory fallback
 */

// In-memory fallback rate limiter
const memoryStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function createMemoryRateLimiter(requests: number, windowMs: number) {
  return {
    async limit(key: string): Promise<RateLimitResult> {
      const now = Date.now();
      const record = memoryStore.get(key);

      if (!record || now > record.resetTime) {
        memoryStore.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, limit: requests, remaining: requests - 1, reset: now + windowMs };
      }

      if (record.count >= requests) {
        return { success: false, limit: requests, remaining: 0, reset: record.resetTime };
      }

      record.count++;
      return { success: true, limit: requests, remaining: requests - record.count, reset: record.resetTime };
    }
  };
}

// Try to use Vercel KV, fall back to memory
let useVercelKV = false;
let kvRatelimit: any = null;

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { Ratelimit } = require('@upstash/ratelimit');
    const { kv } = require('@vercel/kv');
    kvRatelimit = { Ratelimit, kv };
    useVercelKV = true;
  }
} catch {
  // Vercel KV not available, use memory fallback
}

function createRateLimiter(requests: number, windowMs: number, prefix: string) {
  if (useVercelKV && kvRatelimit) {
    return new kvRatelimit.Ratelimit({
      redis: kvRatelimit.kv,
      limiter: kvRatelimit.Ratelimit.slidingWindow(requests, `${windowMs / 1000} s`),
      analytics: true,
      prefix: `@upstash/ratelimit:${prefix}`,
    });
  }
  return createMemoryRateLimiter(requests, windowMs);
}

// Rate limiters for different endpoints
export const chatRateLimit = createRateLimiter(10, 60 * 1000, 'chat'); // 10 req/min
export const jdAnalyzerRateLimit = createRateLimiter(5, 60 * 1000, 'jd-analyzer'); // 5 req/min
export const ttsRateLimit = createRateLimiter(10, 60 * 1000, 'tts'); // 10 req/min
export const adminAuthRateLimit = createRateLimiter(3, 60 * 1000, 'admin-auth'); // 3 req/min

/**
 * Helper function to get client identifier (IP or fallback to 'anonymous')
 */
export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

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
