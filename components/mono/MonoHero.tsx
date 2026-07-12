"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import mateoLandscape from "@/assets/masteo-landscape.png";
import mateoPortrait from "@/assets/mateo-mono-clean.png";
import { profile } from "@/content/profile";
import { useSkin } from "@/lib/useSkin";
import { useChatLauncher } from "@/components/chat/ChatProvider";
import { HeroCursors } from "@/components/home/HeroCursors";
import { SparkIcon } from "@/components/chat/icons";
import { getGsap, prefersReducedMotion } from "@/components/mono/monoGsap";

const GHOST_WORD = "MATEO";
const PARTNERS = ["Rappi", "Kapital Bank", "Credicorp Capital", "Modyo"];

/**
 * Hero del skin Mono: retrato B&N integrado con mix-blend sobre gris papel,
 * tipografía gigante fantasma detrás de la persona, streaks de motion blur,
 * cursores colaborativos y CTA hacia el asistente de IA.
 * En móvil el retrato pasa a círculo con más aire entre bloques.
 */
export function MonoHero() {
  const skin = useSkin();
  const { openChat } = useChatLauncher();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || skin !== "mono" || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const isCompact = window.matchMedia("(max-width: 980px)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".mono-hero__label", { y: 18, autoAlpha: 0, duration: 0.5 }, 0.1)
        .from(
          ".mono-line__inner",
          { yPercent: 112, duration: 0.95, stagger: 0.1, ease: "power4.out" },
          0.18,
        )
        .from(
          ".mono-hero__sub, .mono-hero__proof, .mono-hero__cta > *",
          { y: 18, autoAlpha: 0, stagger: 0.07, duration: 0.55 },
          0.55,
        )
        .from(
          ".mono-hero__card, .mono-hero__partners, .mono-hero__meta > *",
          { y: 22, autoAlpha: 0, stagger: 0.08, duration: 0.6 },
          0.85,
        );

      if (isCompact) {
        tl.fromTo(
          ".mono-hero__portrait",
          { autoAlpha: 0, scale: 0.86, y: 18 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.85, ease: "power3.out" },
          0.45,
        );
      } else {
        tl.fromTo(
          ".mono-hero__img",
          {
            clipPath: "inset(62% 10% 0% 10%)",
            scale: 1.12,
            "--mono-image-blur": "14px",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            "--mono-image-blur": "0px",
            duration: 1.25,
            ease: "power4.inOut",
          },
          0.3,
        )
          .from(
            ".mono-hero__ghost span",
            { yPercent: 62, autoAlpha: 0, stagger: 0.05, duration: 0.75 },
            0.72,
          )
          .fromTo(
            ".mono-hero__streak--a",
            { xPercent: -46, autoAlpha: 0 },
            { xPercent: 26, autoAlpha: 1, duration: 1, ease: "power2.out" },
            0.55,
          )
          .to(".mono-hero__streak--a", { autoAlpha: 0, duration: 0.7 }, 1.35)
          .fromTo(
            ".mono-hero__streak--b",
            { xPercent: 42, autoAlpha: 0 },
            { xPercent: -18, autoAlpha: 0.8, duration: 1.05, ease: "power2.out" },
            0.7,
          )
          .to(".mono-hero__streak--b", { autoAlpha: 0, duration: 0.7 }, 1.5);

        gsap.to(".mono-hero__img", {
          yPercent: -7,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".mono-hero__ghost", {
          yPercent: 30,
          autoAlpha: 0.4,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".mono-hero__meta", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "12% top", end: "45% top", scrub: true },
        });
      }
    }, root);

    // Parallax sutil con el mouse (solo desktop con hover)
    let removeMove: (() => void) | undefined;
    if (!isCompact && window.matchMedia("(hover: hover)").matches) {
      const imgX = gsap.quickTo(".mono-hero__img", "x", { duration: 0.7, ease: "power3.out" });
      const ghostX = gsap.quickTo(".mono-hero__ghost", "x", { duration: 0.9, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const ratio = event.clientX / window.innerWidth - 0.5;
        imgX(ratio * 14);
        ghostX(ratio * -26);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      removeMove = () => window.removeEventListener("pointermove", onMove);
    }

    return () => {
      removeMove?.();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [skin]);

  return (
    <section ref={rootRef} className="mono-hero" id="home-mono" aria-label="Presentación">
      <div className="mono-hero__inner">
        <div className="mono-hero__top">
          <div className="mono-hero__intro">
            <p className="mono-hero__label">
              <span aria-hidden="true">|</span> Product Designer — Bogotá · LATAM
            </p>
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
              <span className="mono-hero__stars" aria-hidden="true">
                ★★★★★
              </span>
              5+ años · 4 fintechs · 3 mercados LATAM
            </p>
            <div className="mono-hero__cta">
              <button type="button" className="mono-btn mono-btn--solid" onClick={() => openChat()}>
                Chatea con mi IA
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </button>
              <Link href="/#proyectos-mono" className="mono-btn mono-btn--ghost">
                Ver proyectos
              </Link>
            </div>
          </div>

          <aside className="mono-hero__aside">
            <button type="button" className="mono-hero__card" onClick={() => openChat()}>
              <span className="mono-hero__card-logo" aria-hidden="true">
                <SparkIcon size={17} />
              </span>
              <span className="mono-hero__card-copy">
                <strong>Diseño para explorar.</strong>
                <small>Pregúntale a mi IA por cualquier caso →</small>
              </span>
            </button>
            <div className="mono-hero__partners">
              <span>He construido para</span>
              <ul>
                {PARTNERS.map((partner) => (
                  <li key={partner}>{partner}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <figure className="mono-hero__stage" aria-hidden="false">
          <div className="mono-hero__ghost" aria-hidden="true">
            {GHOST_WORD.split("").map((letter, i) => (
              <span key={`${letter}-${i}`}>{letter}</span>
            ))}
          </div>
          <div className="mono-hero__img-wrap">
            <Image
              src={mateoLandscape}
              alt="Mateo Espinosa con gafas, retratado en blanco y negro con efecto de movimiento"
              priority
              sizes="(max-width: 980px) 1px, (max-width: 1100px) 94vw, 980px"
              className="mono-hero__img"
            />
          </div>
          <div className="mono-hero__portrait">
            <Image
              src={mateoPortrait}
              alt="Mateo Espinosa, retrato en blanco y negro"
              priority
              sizes="(max-width: 980px) 220px, 1px"
              className="mono-hero__portrait-img"
            />
          </div>
          <span className="mono-hero__streak mono-hero__streak--a" aria-hidden="true" />
          <span className="mono-hero__streak mono-hero__streak--b" aria-hidden="true" />
          <figcaption className="sr-only">
            Mateo Espinosa — retrato en blanco y negro con efecto de movimiento.
          </figcaption>
        </figure>

        <div className="mono-hero__meta">
          <span>• 5+ años de experiencia</span>
          <span>• Based in Bogotá</span>
          <a href="#pregunta">Scroll ↓</a>
        </div>
      </div>

      {skin === "mono" ? <HeroCursors /> : null}
    </section>
  );
}
