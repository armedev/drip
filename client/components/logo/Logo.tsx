import { DripsIcon } from './DripsIcon'

interface LogoProps {
  bg?: string
}

export function Logo({ bg = '#161616' }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(232,194,122,0.4)]">
        <DripsIcon size={28} bg={bg} />
      </div>
      <span className="font-mono font-bold text-accent-gold tracking-[0.25em] text-[15px] transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(232,194,122,0.3)]">
        DRIP
      </span>
    </div>
  )
}
