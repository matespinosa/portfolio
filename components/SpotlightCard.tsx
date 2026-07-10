"use client";

import { ReactNode, useRef, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

// Card con glow radial que sigue al cursor (desktop). En touch simplemente
// no se activa el hover y la card queda estática.
export function SpotlightCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}
