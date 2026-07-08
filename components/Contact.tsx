"use client";

import { profile, socials } from "@/lib/data";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-24 md:py-32">
      <div className="mx-auto w-[min(1180px,100%-2.5rem)]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <Reveal>
              <p className="mb-4 font-mono text-sm text-accent">05 — contacto</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                ¿Construimos
                <br />
                algo <span className="accent-gradient animate-gradient-x">juntos?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-soft">
                Producto, frontend o esa idea que no te deja dormir. Respondo en menos de 24 horas.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-4 py-2 font-mono text-sm text-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* terminal */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-line bg-elev shadow-2xl shadow-black/5">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-xs text-faint">~ / contacto</span>
              </div>
              <div className="space-y-2 p-5 font-mono text-[13px] md:text-sm">
                <p className="text-soft">
                  <span className="text-accent">➜</span> <span className="text-violet">~</span> whoami
                </p>
                <p className="text-ink">{profile.name} · {profile.role} {profile.subrole}</p>
                <p className="text-soft">
                  <span className="text-accent">➜</span> <span className="text-violet">~</span> cat email.txt
                </p>
                <a href={`mailto:${profile.email}`} className="block break-all text-accent hover:underline">
                  {profile.email}
                </a>
                <p className="text-soft">
                  <span className="text-accent">➜</span> <span className="text-violet">~</span> ./say-hi.sh
                  <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent" />
                </p>

                <div className="pt-3">
                  <MagneticButton
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-[#04120a]"
                  >
                    Enviar mensaje
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
