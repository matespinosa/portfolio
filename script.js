/* ============================================================
   Interacciones: reveals al hacer scroll, header con blur,
   nav activo, contador de stats, tema claro/oscuro y menú móvil.
   Sin dependencias externas.
   ============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tema claro / oscuro ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  const storedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (systemDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Header con blur al hacer scroll ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Reveal on scroll (con stagger por grupo) ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        // Los elementos que entran juntos en el viewport se escalonan entre sí.
        const entering = entries.filter((e) => e.isIntersecting);
        entering.forEach((entry, i) => {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(i * 90, 450)}ms`);
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Contador animado de stats ---------- */
  const counters = document.querySelectorAll(".stat__num");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion) {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  } else {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ---------- Nav link activo según sección visible ---------- */
  const sections = document.querySelectorAll("section[id]");
  const linkFor = (id) => document.querySelector(`.nav__link[href="#${id}"]`);

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav__link.is-active").forEach((l) => l.classList.remove("is-active"));
        const link = linkFor(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => activeObserver.observe(s));
})();
