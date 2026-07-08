"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/lib/data";
import { MagneticButton } from "./MagneticButton";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yType = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yCanvas = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />

      {/* Canvas 3D con parallax */}
      <motion.div
        style={{ y: yCanvas }}
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 opacity-90 md:right-[2%] md:h-[680px] md:w-[680px]"
      >
        <HeroCanvas />
      </motion.div>

      {/* halo del acento */}
      <div
        className="pointer-events-none absolute right-[8%] top-[30%] h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)", opacity: 0.14 }}
      />

      <motion.div
        style={{ y: yType, opacity }}
        className="relative mx-auto flex min-h-[100svh] w-[min(1180px,100%-2.5rem)] flex-col justify-center pt-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-line bg-elev px-3.5 py-1.5 font-mono text-[13px] text-soft"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Disponible para proyectos · {profile.location}
        </motion.p>

        <p className="mb-4 font-mono text-sm text-accent">{"// product designer that ships code"}</p>

        <h1 className="max-w-[16ch] text-[clamp(2.7rem,8vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
          {"Diseño, "}
          <span className="accent-gradient animate-gradient-x">construyo</span>
          {" y envío productos digitales"}
        </h1>

        <div className="mt-8 flex max-w-xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg text-soft">
            Soy <strong className="text-ink">{profile.name}</strong>. {profile.tagline}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-[#04120a] transition-shadow hover:shadow-[0_0_30px_-6px_var(--accent)]"
          >
            Ver proyectos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Contáctame
          </MagneticButton>
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.25em] text-faint md:block">
        scroll ↓
      </div>
    </section>
  );
}
