"use client";

import { projects, type Project } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

function ProjectArt({ hue }: { hue: number }) {
  return (
    <div
      className="relative h-44 overflow-hidden rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02] md:h-52"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 62% / 0.35), hsl(${(hue + 60) % 360} 70% 58% / 0.25))`,
      }}
    >
      {/* mockup abstracto */}
      <div className="absolute inset-x-8 top-8 rounded-t-2xl border border-white/25 bg-white/50 p-4 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-2 dark:bg-white/10">
        <div className="mb-3 h-2 w-14 rounded-full bg-black/20 dark:bg-white/25" />
        <div className="flex gap-2.5">
          <div
            className="h-14 flex-1 rounded-lg"
            style={{ background: `hsl(${hue} 75% 60% / 0.55)` }}
          />
          <div className="h-14 flex-1 rounded-lg bg-black/10 dark:bg-white/15" />
        </div>
      </div>
    </div>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <SpotlightCard
      className="group h-full rounded-3xl border border-line bg-elev transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10"
    >
      <a href="#" className="relative z-[2] block h-full p-5 md:p-6">
        <ProjectArt hue={p.hue} />
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-accent">
              {p.title} <span className="font-sans font-normal text-soft">— {p.subtitle}</span>
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-faint">
              <span className="gradient-text font-semibold">✦</span>
              {p.aiNote}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-faint">
            {p.year}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-soft">
              {t}
            </span>
          ))}
          <span className="ml-auto flex items-baseline gap-1.5">
            <span className="gradient-text font-display text-lg font-bold">{p.stat.value}</span>
            <span className="text-[12px] text-faint">{p.stat.label}</span>
          </span>
        </div>
      </a>
    </SpotlightCard>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-28 py-24 md:py-32">
      <div className="aurora aurora--2 right-[-20%] top-[10%] h-[45vh] w-[40vw]" />
      <div className="relative mx-auto w-[min(1100px,100%-2.5rem)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.2em] text-accent">
                02 · Proyectos
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-bold tracking-[-0.03em]">
                Producto que <span className="gradient-text">mueve métricas</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-[15px] text-soft">
              Cada proyecto lleva una nota de cómo la IA aceleró el proceso — sin reemplazar el criterio.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-5">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08} className={p.size === "lg" ? "md:col-span-3" : "md:col-span-2"}>
              <Card p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
