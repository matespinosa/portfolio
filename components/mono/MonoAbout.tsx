"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { useSkin } from "@/lib/useSkin";
import { getGsap, prefersReducedMotion } from "@/components/mono/monoGsap";

const MonoGlobe = dynamic(
  () => import("@/components/mono/MonoGlobe").then((m) => m.MonoGlobe),
  { ssr: false },
);

const STATEMENT = profile.about[0];
const PILLS = [
  { label: "Investigo", variant: "outline" },
  { label: "Diseño", variant: "solid" },
  { label: "→", variant: "arrow" },
  { label: "Construyo", variant: "faint" },
] as const;

/** Quién soy: statement con reveal palabra a palabra, globo line-art y pills. */
export function MonoAbout() {
  const skin = useSkin();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || skin !== "mono" || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mono-word",
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: ".mono-about__statement",
            start: "top 78%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
      gsap.from(".mono-about__aside > *", {
        y: 26,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%" },
      });
      gsap.from(".mono-pill", {
        yPercent: 24,
        autoAlpha: 0,
        scale: 0.9,
        stagger: 0.09,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".mono-pills", start: "top 82%" },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [skin]);

  return (
    <section ref={rootRef} className="mono-about section" id="sobre-mi-mono" aria-label="Quién soy">
      <div className="mono-container">
        <div className="mono-about__grid">
          <div className="mono-about__aside">
            <p className="mono-eyebrow">• Quién soy</p>
            {skin === "mono" ? <MonoGlobe /> : null}
            <p className="mono-about__hub">
              <span aria-hidden="true">⊕</span> Diseño desde Bogotá para productos que
              operan en toda LATAM
            </p>
          </div>

          <div className="mono-about__body">
            <p className="mono-about__statement">
              {STATEMENT.split(" ").map((word, i) => (
                <span className="mono-word" key={`${word}-${i}`}>
                  {word}{" "}
                </span>
              ))}
            </p>
            <p className="mono-about__secondary">{profile.about[1]}</p>
            <div className="mono-about__row">
              <ul className="mono-about__skills">
                {profile.skills.map((skill) => (
                  <li key={skill.num}>
                    <span>{skill.num}</span>
                    {skill.title}
                  </li>
                ))}
              </ul>
              <Link className="mono-link" href="/#experiencia-mono">
                Mi trayectoria
                <svg
                  width="14"
                  height="14"
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
              </Link>
            </div>
          </div>
        </div>

        <div className="mono-pills" role="presentation">
          {PILLS.map((pill) => (
            <div key={pill.label} className={`mono-pill mono-pill--${pill.variant}`}>
              {pill.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
