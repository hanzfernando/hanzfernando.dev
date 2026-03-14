import type { NextApiRequest, NextApiResponse } from 'next'

interface FixedWindowBucket {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const buckets = new Map<string, FixedWindowBucket>()

function getClientIp(req: NextApiRequest): string {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim()
  }

  if (Array.isArray(xff) && xff.length > 0) {
    return xff[0]
  }

  return req.socket.remoteAddress ?? 'unknown'
}

export function applyApiRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  config: RateLimitConfig,
  scope = 'global',
): boolean {
  const now = Date.now()
  const key = `${scope}:${getClientIp(req)}`
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    })

    res.setHeader('X-RateLimit-Limit', String(config.maxRequests))
    res.setHeader('X-RateLimit-Remaining', String(config.maxRequests - 1))
    return true
  }

  if (existing.count >= config.maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    res.setHeader('Retry-After', String(retryAfterSeconds))
    res.setHeader('X-RateLimit-Limit', String(config.maxRequests))
    res.setHeader('X-RateLimit-Remaining', '0')
    res.status(429).json({ error: 'Too Many Requests' })
    return false
  }

  existing.count += 1
  res.setHeader('X-RateLimit-Limit', String(config.maxRequests))
  res.setHeader('X-RateLimit-Remaining', String(config.maxRequests - existing.count))
  return true
}
