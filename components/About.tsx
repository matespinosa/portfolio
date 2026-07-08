"use client";

import { Reveal } from "./Reveal";
import { stack } from "@/lib/data";

const codeLines: { t: string; c?: "key" | "str" | "num" | "kw" | "fn" | "com" }[][] = [
  [{ t: "const ", c: "kw" }, { t: "designer ", c: "fn" }, { t: "= {" }],
  [{ t: "  role", c: "key" }, { t: ": " }, { t: "'Senior Product Designer'", c: "str" }, { t: "," }],
  [{ t: "  alsoDoes", c: "key" }, { t: ": [" }, { t: "'Frontend'", c: "str" }, { t: ", " }, { t: "'Motion'", c: "str" }, { t: "]," }],
  [{ t: "  yearsOfXP", c: "key" }, { t: ": " }, { t: "8", c: "num" }, { t: "," }],
  [{ t: "  shipsToProd", c: "key" }, { t: ": " }, { t: "true", c: "kw" }, { t: "," }],
  [{ t: "  believesIn", c: "key" }, { t: ": " }, { t: "'diseño con intención'", c: "str" }, { t: "," }],
  [{ t: "  bridge", c: "key" }, { t: ": () " }, { t: "=> ", c: "kw" }, { t: "'design ↔ code'", c: "str" }, { t: "," }],
  [{ t: "};" }],
];

const colorFor: Record<string, string> = {
  key: "#7ee787",
  str: "#a5d6ff",
  num: "#79c0ff",
  kw: "#ff7b72",
  fn: "#d2a8ff",
  com: "#8b949e",
};

export function About() {
  return (
    <section id="about" className="mx-auto w-[min(1180px,100%-2.5rem)] scroll-mt-24 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Reveal>
            <p className="mb-4 font-mono text-sm text-accent">01 — sobre mí</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
              Un diseñador que
              <br />
              <span className="text-accent">habla el idioma</span> de
              <br />
              quien construye
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-soft">
              Empecé diseñando interfaces y terminé enamorado del código. Hoy diseño
              productos pensando en cómo se van a construir: componentes, estados,
              tokens y micro-interacciones. Hablo con producto e ingeniería sin traductor.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2">
              {stack.slice(0, 8).map((s) => (
                <span key={s} className="rounded-md border border-line bg-elev px-3 py-1.5 font-mono text-xs text-soft">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* editor de código */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-line bg-elev shadow-2xl shadow-black/5">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-xs text-faint">designer.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed md:text-sm">
              <code>
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-4 select-none text-faint">{String(i + 1).padStart(2, " ")}</span>
                    <span>
                      {line.map((tok, j) => (
                        <span key={j} style={tok.c ? { color: colorFor[tok.c] } : { color: "var(--ink-soft)" }}>
                          {tok.t}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
