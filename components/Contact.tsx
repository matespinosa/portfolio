"use client";

import { profile, socials } from "@/lib/data";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-28 overflow-hidden py-24 md:py-36">
      <div className="aurora aurora--1 bottom-[-30%] left-[-10%] h-[50vh] w-[45vw]" />
      <div className="aurora aurora--3 bottom-[-20%] right-[-10%] h-[45vh] w-[40vw]" />

      <div className="relative mx-auto w-[min(820px,100%-2.5rem)] text-center">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] uppercase tracking-[0.2em] text-accent">
            04 · Contacto
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2.2rem,6.5vw,4.4rem)] font-bold leading-[1.03] tracking-[-0.035em]">
            ¿Tienes un producto en mente? <span className="gradient-text">Hablemos.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-md text-lg text-soft">
            Escríbeme como le escribirías a tu IA favorita — pero con respuesta humana en menos de 24h.
          </p>
        </Reveal>

        {/* "prompt input" — el CTA con forma de chat de IA */}
        <Reveal delay={0.15}>
          <div className="gradient-border mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-full p-2 pl-6 text-left shadow-2xl shadow-black/5">
            <span className="hidden truncate text-[15px] text-faint sm:block">
              Hola Mateo, quiero construir…
            </span>
            <span className="caret hidden sm:inline-block" />
            <MagneticButton
              href={`mailto:${profile.email}`}
              className="relative ml-auto inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[14.5px] font-semibold text-white"
            >
              <span
                className="absolute inset-0 -z-10"
                style={{ background: "linear-gradient(135deg, var(--g1), var(--g3))" }}
              />
              Enviar mensaje
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block font-mono text-sm text-soft underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {profile.email}
          </a>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-line bg-elev px-5 py-2.5 text-[13.5px] font-medium text-soft transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
