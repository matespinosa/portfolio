"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "@/content/projects";
import { useSkin } from "@/lib/useSkin";
import { getGsap, prefersReducedMotion } from "@/components/mono/monoGsap";

/**
 * Proyectos como deck apilado: cada caso es una tarjeta negra sticky; al
 * entrar la siguiente, la anterior se escala y oscurece (scrub con GSAP).
 */
export function MonoShowcase() {
  const skin = useSkin();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || skin !== "mono" || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".mono-card");
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.94,
          filter: "brightness(0.55)",
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top+=140",
            scrub: true,
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [skin]);

  return (
    <section
      ref={rootRef}
      className="mono-showcase section"
      id="proyectos-mono"
      aria-label="Proyectos seleccionados"
    >
      <div className="mono-container">
        <header className="mono-section-head">
          <p className="mono-eyebrow">• Portfolio</p>
          <h2>Casos que mueven métricas.</h2>
          <p className="mono-section-head__meta">
            {String(projects.length).padStart(2, "0")} proyectos · fintech, banca y
            marketplaces
          </p>
        </header>

        <ol className="mono-deck">
          {projects.map((project, index) => {
            const metric = project.results[0];
            return (
              <li className="mono-card" key={project.slug} style={{ "--i": index } as React.CSSProperties}>
                <Link href={`/proyectos/${project.slug}`} className="mono-card__link">
                  <div className="mono-card__top">
                    <span className="mono-card__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ul className="mono-card__tags" aria-label="Etiquetas">
                      {project.tags.slice(0, 3).map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span className="mono-card__year">{project.year}</span>
                  </div>

                  <div className="mono-card__body">
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                  </div>

                  <div className="mono-card__bottom">
                    {metric ? (
                      <p className="mono-card__metric">
                        <b>{metric.metric}</b> {metric.label}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="mono-card__cta">
                      Ver caso de estudio
                      <span className="mono-card__arrow" aria-hidden="true">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
