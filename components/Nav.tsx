"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#ask", label: "Pregúntale" },
  { href: "#work", label: "Proyectos" },
  { href: "#workflow", label: "Workflow IA" },
  { href: "#experience", label: "Experiencia" },
  { href: "#contact", label: "Contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 md:top-5">
      <nav
        className={`mx-auto flex h-14 w-[min(1100px,100%-1.5rem)] items-center justify-between rounded-full border px-2.5 pl-5 transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-black/5" : ""
        }`}
        style={{
          backgroundColor: "var(--glass)",
          borderColor: scrolled ? "var(--line)" : "transparent",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <a href="#home" className="flex items-center gap-2 font-display text-[15px] font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[13px] font-extrabold text-[var(--accent-ink)]">
            M
          </span>
          mateo<span className="accent-text">.ai</span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-soft transition-colors hover:bg-elev hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-full bg-accent px-[1.15rem] py-[0.6rem] text-[13.5px] font-semibold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5 sm:block"
          >
            Hablemos
          </a>
          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-4 rounded bg-current transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 rounded bg-current transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 w-[min(1100px,100%-1.5rem)] rounded-3xl border border-line p-3 md:hidden"
            style={{
              backgroundColor: "var(--glass)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-soft hover:bg-elev hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
