"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const NAV = [
  { id: "home", label: "Home", hash: "/#home" },
  { id: "proyectos", label: "Proyectos", hash: "/#proyectos" },
  { id: "sobre-mi", label: "Sobre mí", hash: "/#sobre-mi" },
  { id: "experiencia", label: "Experiencia", hash: "/#experiencia" },
  { id: "contacto", label: "Contacto", hash: "/#contacto" },
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") ||
      "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Cambiar tema"
      title="Cambiar tema"
      onClick={toggle}
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setActiveId("");
      return;
    }

    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="siteHeader">
      <nav className="nav container" aria-label="Navegación principal">
        <Link href="/#home" className="nav__logo">
          <span className="nav__logo-dot" aria-hidden="true" />
          Mateo&nbsp;Espinosa
        </Link>
        <ul className={`nav__links${menuOpen ? " is-open" : ""}`} id="navLinks">
          {NAV.map((item) => (
            <li key={item.id}>
              <Link
                href={item.hash}
                className={`nav__link${activeId === item.id ? " is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <ThemeToggle />
          <Link href="/#contacto" className="btn btn--primary btn--sm nav__cta">
            Hablemos
          </Link>
          <button
            className="nav__burger"
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
      <span className="sr-only">{profile.name}</span>
    </header>
  );
}
