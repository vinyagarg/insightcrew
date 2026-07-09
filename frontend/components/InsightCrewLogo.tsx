export function InsightCrewLogo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const sizes = {
    sm: { icon: 'w-5 h-5', text: 'text-sm' },
    md: { icon: 'w-8 h-8', text: 'text-base' },
    lg: { icon: 'w-12 h-12', text: 'text-xl' },
  }

  const sizeConfig = sizes[size]

  return (
    <div className="flex items-center gap-2.5">
      {/* Logo Icon - Geometric Hexagon with Nodes */}
      <div className={`${sizeConfig.icon} relative flex-shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer hexagon */}
          <path
            d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent"
            opacity="0.6"
          />

          {/* Inner hexagon */}
          <path
            d="M16 8 L24 12 L24 20 L16 24 L8 20 L8 12 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent-light"
          />

          {/* Center circle */}
          <circle cx="16" cy="16" r="3" fill="currentColor" className="text-accent" />

          {/* Corner nodes */}
          <circle cx="16" cy="4" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
          <circle cx="26" cy="10" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
          <circle cx="26" cy="22" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
          <circle cx="16" cy="28" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
          <circle cx="6" cy="22" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
          <circle cx="6" cy="10" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />

          {/* Connection lines */}
          <line x1="16" y1="4" x2="16" y2="8" stroke="currentColor" strokeWidth="1" className="text-accent" opacity="0.3" />
          <line x1="16" y1="24" x2="16" y2="28" stroke="currentColor" strokeWidth="1" className="text-accent" opacity="0.3" />
          <line x1="8" y1="12" x2="12" y2="14" stroke="currentColor" strokeWidth="1" className="text-accent" opacity="0.3" />
          <line x1="20" y1="14" x2="24" y2="12" stroke="currentColor" strokeWidth="1" className="text-accent" opacity="0.3" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`${sizeConfig.text} font-semibold text-foreground font-display tracking-tight`}>
          InsightCrew
        </span>
      )}
    </div>
  )
}

export function InsightCrewLogoIcon() {
  return (
    <div className="w-12 h-12 relative flex-shrink-0">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent"
          opacity="0.6"
        />
        <path
          d="M16 8 L24 12 L24 20 L16 24 L8 20 L8 12 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent-light"
        />
        <circle cx="16" cy="16" r="3" fill="currentColor" className="text-accent" />
        <circle cx="16" cy="4" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
        <circle cx="26" cy="10" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
        <circle cx="26" cy="22" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
        <circle cx="16" cy="28" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
        <circle cx="6" cy="22" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
        <circle cx="6" cy="10" r="1.5" fill="currentColor" className="text-accent-light opacity-80" />
      </svg>
    </div>
  )
}
