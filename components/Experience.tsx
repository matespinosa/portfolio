"use client";

import { experience } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-28 py-24 md:py-32">
      <div className="mx-auto w-[min(1100px,100%-2.5rem)]">
        <div className="mb-12">
          <Reveal>
            <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.2em] text-accent">
              03 · Experiencia
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-bold tracking-[-0.03em]">
              Trayectoria <span className="gradient-text">profesional</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-4">
          {experience.map((e, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <SpotlightCard className="rounded-3xl border border-line bg-elev transition-transform duration-300 hover:-translate-y-0.5">
                <div className="relative z-[2] grid gap-2 p-6 md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-8 md:p-7">
                  <span className="font-mono text-[13px] text-faint">{e.period}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight md:text-xl">
                      {e.role} <span className="gradient-text">@ {e.company}</span>
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[14.5px] text-soft">{e.desc}</p>
                  </div>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="hidden text-faint md:block"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
