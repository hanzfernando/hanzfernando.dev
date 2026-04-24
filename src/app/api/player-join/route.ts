import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const userAgent = req.headers.get('user-agent') ?? 'unknown'
  const country = req.headers.get('x-vercel-ip-country') ?? 'unknown'
  const region = req.headers.get('x-vercel-ip-country-region') ?? 'unknown'
  const city = req.headers.get('x-vercel-ip-city') ?? 'unknown'

  const char = ['🧑', '👧', '🧔', '👩'][body.character] ?? '🧑'

  console.log(
    `\n┌─ player join ──────────────────────────\n` +
    `│ ${char}  ${body.username}\n` +
    `│ 🌍  ${city}, ${region}, ${country}\n` +
    `│ 🌐  ${ip}\n` +
    `│ 📱  ${userAgent}\n` +
    `│ 🕐  ${new Date().toISOString()}\n` +
    `└────────────────────────────────────────`
  )

  return NextResponse.json({ ok: true })
}