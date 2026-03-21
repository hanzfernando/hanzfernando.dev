import React from 'react'
import { GraduationCap, Handshake, User, Building2 } from 'lucide-react'

type UseCase = 'University' | 'Commissioned' | 'Personal' | 'Company'

type UseCaseBadgeProps = {
  useCase: string
  className?: string
}

const variantByUseCase: Record<UseCase, { style: string; icon: React.ReactNode }> = {
  University:   { style: 'bg-[#1e3a8a] text-[#bfdbfe]', icon: <GraduationCap size={10} strokeWidth={2.5} /> },
  Commissioned: { style: 'bg-[#78350f] text-[#fde68a]', icon: <Handshake     size={10} strokeWidth={2.5} /> },
  Personal:     { style: 'bg-[#14532d] text-[#bbf7d0]', icon: <User           size={10} strokeWidth={2.5} /> },
  Company:      { style: 'bg-[#2e1065] text-[#ddd6fe]', icon: <Building2      size={10} strokeWidth={2.5} /> },
}

const normalizeUseCase = (useCase: string): UseCase | null =>
  useCase in variantByUseCase ? (useCase as UseCase) : null

export default function UseCaseBadge({ useCase, className = '' }: UseCaseBadgeProps) {
  const normalized = normalizeUseCase(useCase)
  const variant = normalized ? variantByUseCase[normalized] : null
  const style = variant?.style ?? 'bg-[#1c1917] text-[#d6d3d1]'
  const icon = variant?.icon ?? null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${style} ${className}`}
      title={`Use Case: ${useCase}`}
    >
      {icon}
      {useCase}
    </span>
  )
}