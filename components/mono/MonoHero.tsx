"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { useCommandSurface } from "@/components/command/CommandProvider";
import { getGsap, prefersReducedMotion } from "@/components/mono/monoGsap";

const WORDMARK = "ESPINOSA";
const PARTNERS = ["Rappi", "Kapital Bank", "Credicorp Capital", "Modyo"];
const GRID_COLUMNS = 12;

/**
 * Reloj de Bogotá. Para un perfil remoto evaluado desde otros husos, la hora
 * local es dato, no adorno. Devuelve null en el servidor para no arriesgar
 * un desajuste de hidratación.
 */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Bogota",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null;
  return (
    <span className="mono-hero__clock">
      <time dateTime={time}>{time}</time> BOG
    </span>
  );
}

/**
 * Hero del skin Mono: tipografía como objeto. Sin fotografía — el titular es
 * la pieza y el apellido cierra la composición calzado exacto de borde a borde
 * del contenedor (`textLength` ajusta solo el tracking, nunca los glifos, así
 * que la letra nunca se deforma). Detrás, la retícula de 12 columnas sobre la
 * que está construida la página, dibujada al entrar.
 */
export function MonoHero() {
  const { openSurface } = useCommandSurface();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const isCompact = window.matchMedia("(max-width: 980px)").matches;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(
        ".mono-hero__grid i",
        { scaleY: 0, duration: 1.1, stagger: 0.035, ease: "power4.out" },
        0,
      )
        .from(".mono-hero__label", { y: 18, autoAlpha: 0, duration: 0.5 }, 0.15)
        .from(
          ".mono-line__inner",
          { yPercent: 112, duration: 0.95, stagger: 0.1, ease: "power4.out" },
          0.22,
        )
        .from(
          ".mono-hero__sub, .mono-hero__proof, .mono-hero__cta > *",
          { y: 18, autoAlpha: 0, stagger: 0.07, duration: 0.55 },
          0.58,
        )
        .from(
          ".mono-hero__panel",
          { y: 22, autoAlpha: 0, duration: 0.6 },
          0.86,
        )
        .fromTo(
          ".mono-hero__wordmark",
          { clipPath: "inset(100% 0% 0% 0%)", y: 26 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: 1.15,
            ease: "power4.out",
          },
          0.72,
        )
        .from(
          ".mono-hero__meta",
          { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power4.out" },
          0.95,
        )
        .from(
          ".mono-hero__meta > *",
          { autoAlpha: 0, stagger: 0.08, duration: 0.5 },
          1.25,
        );

      if (!isCompact) {
        // Parallax de scroll: la retícula y el apellido se separan del texto.
        gsap.to(".mono-hero__wordmark", {
          yPercent: 26,
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".mono-hero__grid", {
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".mono-hero__meta", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "12% top", end: "45% top", scrub: true },
        });
      }

      // El ticker de GSAP se detiene con la pestaña en segundo plano: sin esto el
      // hero se queda congelado a medio revelar (opacidad y desplazamiento a
      // medias). Se registra con la timeline ya completa.
      const settleIfHidden = () => {
        if (document.hidden) tl.progress(1);
      };
      settleIfHidden();
      document.addEventListener("visibilitychange", settleIfHidden);
      cleanups.push(() => document.removeEventListener("visibilitychange", settleIfHidden));
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} className="mono-hero" id="home-mono" aria-label="Presentación">
      <div className="mono-hero__grid" aria-hidden="true">
        {Array.from({ length: GRID_COLUMNS }, (_, i) => (
          <i key={i} />
        ))}
      </div>

      <div className="mono-hero__inner">
        <div className="mono-hero__top">
          <div className="mono-hero__intro">
            <p className="mono-hero__label">Product Designer — Bogotá · LATAM</p>
            <h1 className="mono-hero__title">
              <span className="mono-line">
                <span className="mono-line__inner">Ruido, fuera.</span>
              </span>
              <span className="mono-line">
                <span className="mono-line__inner">
                  Foco en <em>producto.</em>
                </span>
              </span>
            </h1>
            <p className="mono-hero__sub">{profile.intro}</p>
            <p className="mono-hero__proof">
              <span>
                <b>5+</b> años
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <b>4</b> fintechs
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <b>3</b> mercados
              </span>
            </p>
            <div className="mono-hero__cta">
              {/* Única entrada a la superficie de comando: con aspecto de
                  campo, porque eso es lo que abre. En móvil es el trigger
                  táctil; en desktop, la pista del atajo. */}
              <button
                type="button"
                className="cmd-affordance"
                onClick={() => openSurface()}
                aria-haspopup="dialog"
              >
                <span className="cmd-affordance__prompt" aria-hidden="true">
                  &gt;
                </span>
                <span className="cmd-affordance__label">comando o pregunta</span>
                <kbd className="cmd-affordance__kbd" aria-hidden="true">⌘K</kbd>
              </button>
              <Link href="/#proyectos-mono" className="mono-btn mono-btn--ghost">
                Ver proyectos
              </Link>
            </div>
          </div>

          <aside className="mono-hero__aside">
            <div className="mono-hero__panel">
              {/* Fase 3: aquí entra el panel de instrumento (stack, build,
                  repo) — datos verificables, nunca decoración. */}
              <div className="mono-hero__partners">
                <span>He construido para</span>
                <ul>
                  {PARTNERS.map((partner) => (
                    <li key={partner}>{partner}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div className="mono-hero__stage">
          {/* Todo derivado de las métricas reales de Space Grotesk 700 para
              "ESPINOSA": avance 4.614em, caja alta 0.714em, desbordamiento
              inferior de las redondas 0.014em, y prosas laterales de 0.066em
              (izquierda) y 0.018em (derecha).

              A font-size 216u el avance natural es 996.6u y la caja alta 154.2u
              → viewBox de 157u de alto, con la línea de base en y=154.2 para
              que la caja alta arranque justo en y=0.

              El calce es ÓPTICO, no métrico: alineando la caja de avance, la
              tinta de la E quedaría adentro y la A casi al filo, y el apellido
              se vería corrido a la derecha. Por eso el texto arranca en
              x=-14.26u (la prosa izquierda) y el avance se estira a 1018.15u,
              de modo que la TINTA —no la caja— va exacta de filete a filete.
              `lengthAdjust="spacing"` reparte la diferencia en el tracking
              (+0.014em) sin tocar un solo glifo.

              Si cambias la familia display o la palabra, hay que rehacer estos
              cuatro números con las métricas nuevas. */}
          <svg
            className="mono-hero__wordmark"
            viewBox="0 0 1000 157"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <text x="-14.26" y="154.2" textLength="1018.15" lengthAdjust="spacing">
              {WORDMARK}
            </text>
          </svg>
        </div>

        <div className="mono-hero__meta">
          <span className="mono-hero__status">{profile.availability}</span>
          <LocalTime />
          <a href="#sobre-mi-mono">Scroll ↓</a>
        </div>
      </div>

    </section>
  );
}
