'use client'

import { useMemo, useState } from 'react'

type TechBadgeProps = {
  tagUrl: string
  className?: string
}

const extractBadgeLabel = (tagUrl: string): string => {
  try {
    const match = tagUrl.match(/\/badge\/([^?-]+)/i)
    if (!match?.[1]) {
      return 'Tech'
    }

    const decoded = decodeURIComponent(match[1])
    const cleaned = decoded.split('-')[0].replace(/_/g, ' ').trim()
    return cleaned || 'Tech'
  } catch {
    return 'Tech'
  }
}

export default function TechBadge({ tagUrl, className = '' }: TechBadgeProps) {
  const [hasError, setHasError] = useState(false)
  const label = useMemo(() => extractBadgeLabel(tagUrl), [tagUrl])

  if (hasError) {
    return (
      <span className={`inline-flex h-5 items-center border border-[#111827] bg-white px-2 text-[10px] text-[#1e3553] ${className}`}>
        {label}
      </span>
    )
  }

  return (
    <picture>
      <img
        src={tagUrl}
        alt={`${label} badge`}
        className={`h-5 w-auto border border-[#111827] bg-white ${className}`}
        loading='lazy'
        width={110}
        height={20}
        referrerPolicy='no-referrer'
        onError={() => setHasError(true)}
      />
    </picture>

  )
}