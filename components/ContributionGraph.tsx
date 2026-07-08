"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { buildContributions, monthLabels, dayLabels } from "@/lib/contributions";

const levelClass = [
  "bg-[#ebedf0] dark:bg-[#161b22]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
];

export function ContributionGraph() {
  const weeks = useMemo(() => buildContributions(), []);
  const reduce = useReducedMotion();

  const total = useMemo(
    () => weeks.flat().reduce((sum, d) => sum + d.count, 0),
    [weeks]
  );

  return (
    <div className="rounded-xl border border-line bg-elev p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-soft">
          <span className="font-semibold text-ink">{total.toLocaleString("es")}</span> contribuciones en el último año
        </p>
        <span className="hidden font-mono text-xs text-faint sm:block">2025 → 2026</span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex flex-col gap-2">
          {/* etiquetas de mes */}
          <div className="ml-8 flex gap-[3px]">
            {weeks.map((_, w) => {
              // muestra la etiqueta ~cada 4.4 semanas
              const monthIndex = Math.floor((w / 53) * 12);
              const show = w % 4 === 0 && w < 52;
              return (
                <div key={w} className="w-[11px] font-mono text-[9px] text-faint">
                  {show ? monthLabels[monthIndex] : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            {/* etiquetas de día */}
            <div className="flex flex-col gap-[3px] pr-1">
              {dayLabels.map((d, i) => (
                <div key={i} className="flex h-[11px] items-center font-mono text-[9px] text-faint">
                  {d}
                </div>
              ))}
            </div>

            {/* celdas */}
            <div className="flex gap-[3px]">
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((day, d) => (
                    <motion.div
                      key={d}
                      title={`${day.count} contribuciones`}
                      className={`h-[11px] w-[11px] rounded-[2px] ${levelClass[day.level]}`}
                      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.3 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.28,
                        delay: reduce ? 0 : Math.min(w * 0.008 + d * 0.004, 1.2),
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* leyenda */}
          <div className="ml-8 mt-2 flex items-center gap-1.5 font-mono text-[10px] text-faint">
            <span>Menos</span>
            {levelClass.map((c, i) => (
              <span key={i} className={`h-[11px] w-[11px] rounded-[2px] ${c}`} />
            ))}
            <span>Más</span>
          </div>
        </div>
      </div>
    </div>
  );
}
