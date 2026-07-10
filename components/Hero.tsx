"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { heroStats, profile, rotatingWords } from "@/lib/data";
import { MagneticButton } from "./MagneticButton";

function RotatingWord() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % rotatingWords.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {/* fantasma para reservar el ancho de la palabra más larga */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {rotatingWords.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text col-start-1 row-start-1 whitespace-nowrap"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* aurora */}
      <div className="aurora aurora--1 left-[-10%] top-[-15%] h-[55vh] w-[55vw]" />
      <div className="aurora aurora--2 right-[-15%] top-[15%] h-[60vh] w-[50vw]" />
      <div className="aurora aurora--3 bottom-[-25%] left-[20%] h-[50vh] w-[45vw]" />

      <div className="relative z-10 mx-auto w-[min(1100px,100%-2.5rem)] pb-16 pt-32 text-center md:pt-36">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-soft"
          style={{ backgroundColor: "var(--glass)", backdropFilter: "blur(12px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: "var(--g2)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--g2)" }} />
          </span>
          Product Design × Código × IA — disponible para proyectos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[13ch] font-display text-[clamp(2.6rem,8.5vw,6rem)] font-bold leading-[1.02] tracking-[-0.035em]"
        >
          Diseño y construyo producto <RotatingWord />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-xl text-balance text-lg text-soft"
        >
          Soy <strong className="text-ink">{profile.name}</strong>, {profile.role.toLowerCase()}.{" "}
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="#workflow"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[15px] font-semibold text-white shadow-xl transition-shadow hover:shadow-[0_8px_40px_-8px_var(--g1)]"
          >
            <span
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: "linear-gradient(135deg, var(--g1), var(--g3))" }}
            />
            Ver mi workflow con IA
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </MagneticButton>
          <MagneticButton
            href="#work"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-accent"
          >
            Proyectos
          </MagneticButton>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 flex max-w-lg items-stretch justify-center divide-x divide-[var(--line)]"
        >
          {heroStats.map((s) => (
            <li key={s.label} className="flex-1 px-4 md:px-7">
              <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                <span className="gradient-text">{s.value}</span>
              </p>
              <p className="mt-1 text-xs text-faint md:text-[13px]">{s.label}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
