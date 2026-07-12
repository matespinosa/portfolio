"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/content/experience";
import { useSkin } from "@/lib/useSkin";
import { getGsap, prefersReducedMotion } from "@/components/mono/monoGsap";

/**
 * Trayectoria como narrativa: año gigante sticky que cambia según la entrada
 * activa, riel de progreso scrubbed y entradas que se revelan al hacer scroll.
 */
export function MonoJourney() {
  const skin = useSkin();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || skin !== "mono" || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const entries = gsap.utils.toArray<HTMLElement>(".mono-entry");
      entries.forEach((entry, index) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
        gsap.from(entry, {
          y: 44,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: entry, start: "top 82%" },
        });
      });

      gsap.fromTo(
        ".mono-journey__rail i",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".mono-journey__entries",
            start: "top 60%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [skin]);

  const current = experience[active] ?? experience[0];
  const year = current.period.slice(0, 4);

  return (
    <section
      ref={rootRef}
      className="mono-journey section"
      id="experiencia-mono"
      aria-label="Trayectoria"
    >
      <div className="mono-container">
        <header className="mono-section-head">
          <p className="mono-eyebrow">• Trayectoria</p>
          <h2>
            De construir interfaces
            <br /> a liderar producto.
          </h2>
        </header>

        <div className="mono-journey__grid">
          <div className="mono-journey__side">
            <div className="mono-journey__year" key={year} aria-hidden="true">
              {year}
            </div>
            <p className="mono-journey__role">
              {current.role} · {current.company}
            </p>
            <div className="mono-journey__rail" aria-hidden="true">
              <i />
            </div>
            <p className="mono-journey__count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
            </p>
          </div>

          <ol className="mono-journey__entries">
            {experience.map((item, index) => (
              <li
                className={`mono-entry${index === active ? " is-active" : ""}`}
                key={`${item.company}-${item.period}`}
              >
                <p className="mono-entry__period">{item.period}</p>
                <h3>{item.company}</h3>
                <p className="mono-entry__role">{item.role}</p>
                <p className="mono-entry__desc">{item.description}</p>
                <ul className="mono-entry__tags" aria-label="Áreas">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
