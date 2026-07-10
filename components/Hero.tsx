"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { heroStats, profile, rotatingWords } from "@/lib/data";
import { AIConsole } from "./AIConsole";

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
          className="accent-text col-start-1 row-start-1 whitespace-nowrap"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 md:pt-36">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="accent-glow left-1/2 top-[-10%] h-[50vh] w-[70vw] -translate-x-1/2" />

      {/* marcas de esquina, motivo suizo/agencia */}
      <span className="plus-mark left-6 top-24 hidden md:block" />
      <span className="plus-mark right-6 top-24 hidden md:block" />

      <div className="relative z-10 mx-auto w-[min(1100px,100%-2.5rem)] text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-soft"
          style={{ backgroundColor: "var(--glass)", backdropFilter: "blur(12px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Product Design × Código × IA — disponible para proyectos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[13ch] font-display text-[clamp(2.4rem,7.5vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.035em]"
        >
          Diseño y construyo producto <RotatingWord />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-soft"
        >
          Soy <strong className="text-ink">{profile.name}</strong>, {profile.role.toLowerCase()}.{" "}
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <AIConsole />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 flex max-w-lg items-stretch justify-center divide-x divide-[var(--line)]"
        >
          {heroStats.map((s) => (
            <li key={s.label} className="flex-1 px-4 md:px-7">
              <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                <span className="accent-text">{s.value}</span>
              </p>
              <p className="mt-1 text-xs text-faint md:text-[13px]">{s.label}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
