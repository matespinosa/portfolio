"use client";

import { marqueeItems } from "@/lib/data";

export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative -rotate-1 border-y border-line py-4" style={{ backgroundColor: "var(--bg-elev)" }}>
      <div className="flex overflow-hidden">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 animate-[marquee_30s_linear_infinite] items-center gap-7 pr-7"
          >
            {items.map((s, i) => (
              <span key={i} className="flex items-center gap-7 whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.14em] text-soft">
                {s}
                <span className="gradient-text text-base">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
    </div>
  );
}
