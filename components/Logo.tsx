export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="mareaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <radialGradient id="mareaCore" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
      </defs>
      {/* Eye outline */}
      <path
        d="M12 65 C 45 18, 155 18, 188 65 C 155 112, 45 112, 12 65 Z"
        stroke="url(#mareaGrad)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {/* Iris circle */}
      <circle cx="100" cy="65" r="40" fill="url(#mareaCore)" stroke="url(#mareaGrad)" strokeWidth="4" />
      {/* Compass star */}
      <g>
        <path d="M100 30 L108 60 L100 65 L92 60 Z" fill="url(#mareaGrad)" />
        <path d="M100 100 L108 70 L100 65 L92 70 Z" fill="#a78bfa" />
        <path d="M65 65 L95 57 L100 65 L95 73 Z" fill="#a78bfa" />
        <path d="M135 65 L105 57 L100 65 L105 73 Z" fill="url(#mareaGrad)" />
        <path d="M76 41 L98 62 L94 66 Z" fill="#c4b5fd" opacity="0.85" />
        <path d="M124 89 L102 68 L106 64 Z" fill="#7c3aed" opacity="0.85" />
        <path d="M124 41 L102 62 L106 66 Z" fill="#c4b5fd" opacity="0.85" />
        <path d="M76 89 L98 68 L94 64 Z" fill="#7c3aed" opacity="0.85" />
        <circle cx="100" cy="65" r="5" fill="#e9d5ff" />
      </g>
    </svg>
  );
}

export function Logo({ withText = true, className = "" }: { withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-auto" />
      {withText && (
        <span className="font-display text-xl font-semibold tracking-wide text-gradient">
          MAREA <span className="font-sans text-sm tracking-[0.3em] text-marea-300">TOURS</span>
        </span>
      )}
    </div>
  );
}
