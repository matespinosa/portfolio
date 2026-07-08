"use client";

import { motion } from "framer-motion";
import { ContributionGraph } from "./ContributionGraph";
import { Reveal } from "./Reveal";
import { activityStats, languages, recentActivity } from "@/lib/data";

const activityIcon: Record<string, JSX.Element> = {
  commit: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" /></svg>
  ),
  pr: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" /></svg>
  ),
  star: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" /></svg>
  ),
};

export function GitHubActivity() {
  return (
    <section id="activity" className="scroll-mt-24 border-t border-line bg-elev/40 py-24 md:py-32">
      <div className="mx-auto w-[min(1180px,100%-2.5rem)]">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="mb-4 font-mono text-sm text-accent">03 — building in public</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-[-0.025em] text-ink">
              No solo diseño.
              <br />
              <span className="text-accent">Construyo y commiteo.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg text-soft">
              Prototipo con código real, mantengo design systems y contribuyo al frontend.
              Esta es mi actividad — como en GitHub.
            </p>
          </Reveal>
        </div>

        {/* stats */}
        <Reveal delay={0.05}>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {activityStats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-elev p-5">
                <p className="font-mono text-2xl font-semibold text-ink md:text-3xl">{s.value}</p>
                <p className="mt-1 font-mono text-xs text-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* grafo de contribuciones */}
        <Reveal delay={0.08}>
          <ContributionGraph />
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* lenguajes */}
          <Reveal delay={0.05}>
            <div className="rounded-xl border border-line bg-elev p-6">
              <p className="mb-5 font-mono text-sm text-soft">Lenguajes más usados</p>
              <div className="mb-4 flex h-2.5 overflow-hidden rounded-full">
                {languages.map((l) => (
                  <motion.div
                    key={l.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{ backgroundColor: l.color }}
                  />
                ))}
              </div>
              <ul className="grid grid-cols-2 gap-y-2.5">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-center gap-2 font-mono text-xs text-soft">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.name} <span className="text-faint">{l.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* actividad reciente */}
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line bg-elev p-6">
              <p className="mb-5 font-mono text-sm text-soft">Actividad reciente</p>
              <ul className="space-y-4">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-accent">
                      {activityIcon[a.type]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-accent">{a.repo}</p>
                      <p className="truncate text-sm text-ink">{a.msg}</p>
                    </div>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-faint">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
