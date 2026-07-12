function iconProps(size = 16) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
}

export function SparkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M19 5l-2.5 2.5M7.5 16.5L5 19" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function RestartIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function ArrowUpIcon() {
  return (
    <svg {...iconProps(17)}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function CoinsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <circle cx="9" cy="9" r="6" />
      <path d="M17.6 11.6A6 6 0 1 1 12.4 17.6" />
    </svg>
  );
}

export function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function RouteIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19h7a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7" />
    </svg>
  );
}

export function LayersIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <path d="m12 2 9 4.9-9 4.9-9-4.9L12 2Z" />
      <path d="m3 11.9 9 4.9 9-4.9" />
      <path d="m3 16.8 9 4.9 9-4.9" />
    </svg>
  );
}

export function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 8 8.3 5.4a1.4 1.4 0 0 0 1.4 0L21 8" />
    </svg>
  );
}

export function MessageCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-3.7-.8L3 21l1.7-5A8.7 8.7 0 1 1 21 11.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.6" />
    </svg>
  );
}

export function MicIcon({ size = 18 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
    </svg>
  );
}

export function StopIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...iconProps(size)}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
