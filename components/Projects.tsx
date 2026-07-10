"use client";

import { projects, type Project } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

function ProjectArt() {
  return (
    <div className="grid-bg relative h-44 overflow-hidden rounded-2xl border border-line bg-app transition-transform duration-500 ease-out group-hover:scale-[1.02] md:h-52">
      {/* mockup abstracto, monocromo con un solo detalle de acento */}
      <div className="absolute inset-x-8 top-8 rounded-t-2xl border border-line bg-elev p-4 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <div className="mb-3 h-2 w-14 rounded-full bg-[var(--line)]" />
        <div className="flex gap-2.5">
          <div className="h-14 flex-1 rounded-lg bg-accent/80" />
          <div className="h-14 flex-1 rounded-lg bg-[var(--line)]" />
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
        <ProjectArt />
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-accent">
              {p.title} <span className="font-sans font-normal text-soft">— {p.subtitle}</span>
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-faint">
              <span className="accent-text font-semibold">✦</span>
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
            <span className="accent-text font-display text-lg font-bold">{p.stat.value}</span>
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
      <div className="mx-auto w-[min(1100px,100%-2.5rem)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.2em] text-accent">
                02 · Proyectos
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-bold tracking-[-0.03em]">
                Producto que <span className="accent-text">mueve métricas</span>
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
