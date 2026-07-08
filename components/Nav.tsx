"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Proyectos" },
  { href: "#activity", label: "Actividad" },
  { href: "#experience", label: "Experiencia" },
  { href: "#contact", label: "Contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 78%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-[72px] w-[min(1180px,100%-2.5rem)] items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded bg-accent font-bold text-[#04120a]">
            M
          </span>
          <span className="text-ink">mateo</span>
          <span className="text-accent">.dev</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-1.5 font-mono text-[13px] text-soft transition-colors hover:bg-elev hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-4 py-2 font-mono text-[13px] font-semibold text-app transition-transform hover:-translate-y-0.5 sm:block"
            style={{ backgroundColor: "var(--ink)", color: "var(--bg)" }}
          >
            Hablemos
          </a>
          <button
            aria-label="Menú"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-4 bg-current transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-line bg-app px-6 py-4 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-mono text-sm text-soft hover:bg-elev hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
