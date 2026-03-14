import type { NextApiRequest, NextApiResponse } from 'next'
import { applyApiRateLimit } from '@/server/httpRateLimit'

type HealthResponse = {
  ok: true
  service: string
  timestamp: string
  uptimeSeconds: number
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse | { error: string }>): void {
  if (!applyApiRateLimit(req, res, { maxRequests: 60, windowMs: 60_000 }, 'health')) {
    return
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(200).json({
    ok: true,
    service: 'hanzfernando.dev',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  })
}
