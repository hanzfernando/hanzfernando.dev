import type { NextApiRequest, NextApiResponse } from 'next'
import { applyApiRateLimit } from '@/server/httpRateLimit'
import type { TLSSocket } from 'tls'

type HealthResponse = {
  ok: true
  service: string
  timestamp: string
  uptimeSeconds: number
  warmedRoot: boolean
}

async function warmRootRoute(req: NextApiRequest): Promise<boolean> {
  const host = req.headers.host
  if (!host) return false

  const forwardedProto = req.headers['x-forwarded-proto']
  const proto =
    typeof forwardedProto === 'string'
      ? forwardedProto.split(',')[0].trim()
      : (req.socket as TLSSocket).encrypted
        ? 'https'
        : 'http'

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const response = await fetch(`${proto}://${host}/`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        // Avoid recursive warming if the root ever calls this endpoint in the future.
        'x-health-warmup': '1',
      },
    })

    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse | { error: string }>,
): Promise<void> {
  if (!applyApiRateLimit(req, res, { maxRequests: 60, windowMs: 60_000 }, 'health')) {
    return
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const warmedRoot = await warmRootRoute(req)

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    ok: true,
    service: 'hanzfernando.dev',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    warmedRoot,
  })
}
