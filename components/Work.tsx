"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/lib/data";
import { Reveal } from "./Reveal";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // parallax: la "imagen" se mueve más lento que la tarjeta
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Reveal delay={(index % 2) * 0.08}>
      <a href="#" className="group block">
        <div
          ref={ref}
          className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line"
        >
          {/* capa con parallax */}
          <motion.div
            style={{ y }}
            className={`absolute inset-[-12%] bg-gradient-to-br ${project.gradient} dark:opacity-0`}
          />
          <motion.div
            style={{ y }}
            className={`absolute inset-[-12%] bg-gradient-to-br ${project.accentDark} opacity-0 dark:opacity-100`}
          />
          <div className="grid-bg absolute inset-0 opacity-60" />

          {/* mockup abstracto */}
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="w-full max-w-sm space-y-3 rounded-xl border border-white/20 bg-white/40 p-5 backdrop-blur-sm dark:bg-white/5">
              <div className="h-2.5 w-16 rounded-full bg-black/20 dark:bg-white/20" />
              <div className="h-16 w-full rounded-lg bg-black/10 dark:bg-white/10" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="h-10 flex-1 rounded-lg bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          </div>

          {/* stat que aparece al hover */}
          <div className="absolute bottom-4 left-4 flex items-baseline gap-2 rounded-full bg-black/70 px-4 py-2 font-mono text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            <span className="text-lg font-semibold text-accent">{project.stat.value}</span>
            <span className="text-xs text-white/70">{project.stat.label}</span>
          </div>
          <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white/90 backdrop-blur-md">
            {project.year}
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
              {project.title} <span className="text-soft">— {project.subtitle}</span>
            </h3>
            <p className="mt-1 font-mono text-xs text-faint">{project.role}</p>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-soft transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent">
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-soft">
              {t}
            </span>
          ))}
        </div>
      </a>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-line py-24 md:py-32">
      <div className="mx-auto w-[min(1180px,100%-2.5rem)]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-4 font-mono text-sm text-accent">02 — proyectos</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-[-0.025em] text-ink">
                Trabajo <span className="text-accent">seleccionado</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm font-mono text-sm text-soft">
              Casos donde el diseño movió métricas y el frontend hizo justicia al diseño.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-16" : ""}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
