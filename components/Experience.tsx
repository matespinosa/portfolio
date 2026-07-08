"use client";

import { experience } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-t border-line py-24 md:py-32">
      <div className="mx-auto w-[min(1180px,100%-2.5rem)]">
        <div className="mb-14">
          <Reveal>
            <p className="mb-4 font-mono text-sm text-accent">04 — experiencia</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-[-0.025em] text-ink">
              Trayectoria <span className="text-accent">profesional</span>
            </h2>
          </Reveal>
        </div>

        <ol className="border-t border-line">
          {experience.map((e, i) => (
            <Reveal as="li" key={i} delay={i * 0.04}>
              <div className="group grid gap-3 border-b border-line py-8 transition-colors md:grid-cols-[200px_1fr] md:gap-8 md:py-9 md:hover:pl-2">
                <div className="font-mono text-sm text-faint">{e.period}</div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                      {e.role}
                    </h3>
                    <span className="font-mono text-sm text-accent">
                      @ {e.company} · {e.location}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-soft">{e.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-soft">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
