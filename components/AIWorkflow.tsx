"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { workflow } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const AUTO_ADVANCE_MS = 6000;

export function AIWorkflow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stage = workflow[active];

  // auto-avance suave; se pausa al interactuar
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % workflow.length),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(id);
  }, [paused]);

  function select(i: number) {
    setActive(i);
    setPaused(true);
  }

  return (
    <section id="workflow" className="relative scroll-mt-28 py-24 md:py-32">
      <div className="mx-auto w-[min(1100px,100%-2.5rem)]">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.2em] text-accent">
              01 · Workflow AI-enhanced
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.03em]">
              La IA no diseña por mí. <span className="gradient-text">Multiplica lo que diseño.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-soft">
              Así integro IA en cada fase del proceso de producto — del research al deploy — sin
              perder el criterio de diseño en el camino.
            </p>
          </Reveal>
        </div>

        {/* stepper */}
        <Reveal delay={0.1}>
          <div className="relative mb-8">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:justify-center">
              {workflow.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => select(i)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition-all ${
                    i === active
                      ? "border-transparent text-white"
                      : "border-line text-soft hover:border-accent hover:text-ink"
                  }`}
                  style={
                    i === active
                      ? { background: "linear-gradient(135deg, var(--g1), var(--g3))" }
                      : { backgroundColor: "var(--bg-elev)" }
                  }
                >
                  <span className="mr-1.5 font-mono text-[11px] opacity-70">{s.step}</span>
                  {s.title}
                </button>
              ))}
            </div>
            {/* barra de progreso del auto-avance */}
            <div className="mx-auto mt-4 h-[3px] w-40 overflow-hidden rounded-full" style={{ backgroundColor: "var(--line)" }}>
              {!paused && (
                <motion.div
                  key={active}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                  className="h-full origin-left"
                  style={{ background: "linear-gradient(90deg, var(--g1), var(--g2))" }}
                />
              )}
            </div>
          </div>
        </Reveal>

        {/* panel del stage activo */}
        <Reveal delay={0.15}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 md:grid-cols-[1.1fr_1fr]"
            >
              {/* descripción */}
              <SpotlightCard className="gradient-border rounded-3xl p-7 md:p-9">
                <p className="font-mono text-[13px] text-faint">
                  fase {stage.step} / 05
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {stage.title}
                </h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-soft">{stage.desc}</p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {stage.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-elev px-3 py-1.5 text-[12.5px] font-medium text-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line bg-elev p-4">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, var(--g1), var(--g2))" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">AI boost</p>
                    <p className="text-[14.5px] font-semibold text-ink">{stage.boost}</p>
                  </div>
                </div>
              </SpotlightCard>

              {/* mock de prompt */}
              <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-elev">
                <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--g1), var(--g3))" }}
                  >
                    ✦
                  </span>
                  <span className="font-mono text-xs text-faint">ai-session · {stage.id}.md</span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-5 md:p-6">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">Prompt</p>
                    <p className="font-mono text-[13.5px] leading-relaxed text-ink">
                      {stage.prompt}
                      <span className="caret ml-1" />
                    </p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--bg)" }}>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "var(--g2)" }} />
                      Generando
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full" style={{ backgroundColor: "var(--line)" }} />
                      <div className="h-2 w-[85%] rounded-full" style={{ backgroundColor: "var(--line)" }} />
                      <div className="h-2 w-[60%] rounded-full" style={{ backgroundColor: "var(--line)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
