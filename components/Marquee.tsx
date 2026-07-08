"use client";

import { stack } from "@/lib/data";

export function Marquee() {
  const items = [...stack, ...stack];
  return (
    <div className="border-y border-line bg-elev py-4">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-8 pr-8">
          {items.map((s, i) => (
            <span key={i} className="flex items-center gap-8 font-mono text-sm text-soft">
              {s}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-8 pr-8" aria-hidden>
          {items.map((s, i) => (
            <span key={i} className="flex items-center gap-8 font-mono text-sm text-soft">
              {s}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
    </div>
  );
}
