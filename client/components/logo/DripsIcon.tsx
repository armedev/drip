interface DripsIconProps {
  size?: number
  color?: string
  bg?: string
  className?: string
}

export function DripsIcon({
  size = 32,
  color = '#e8c27a',
  bg = '#0f0f0f',
  className,
}: DripsIconProps) {
  const scale = size / 220
  const w = Math.round(162 * scale)

  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 162 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DRIP logo"
    >
      <rect x="0" y="0" width="48" height="36" rx="3" fill={color}/>
      <rect x="80" y="0" width="56" height="36" rx="3" fill={color}/>
      <rect x="48" y="0" width="32" height="220" fill={color}/>
      <ellipse cx="64" cy="2" rx="32" ry="16" fill={bg}/>
      <path d="M80 36 C80 36,162 60,162 140 C162 220,80 236,80 236 L80 36Z" fill={color}/>
      <path d="M90 62 C90 62,134 80,134 140 C134 200,90 210,90 210 L90 62Z" fill={bg}/>
    </svg>
  )
}
