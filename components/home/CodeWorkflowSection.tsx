"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const workflow = [
  {
    tool: "Claude",
    title: "Expandir el problema",
    body: "Convierto research, restricciones y señales del negocio en hipótesis que el equipo puede discutir.",
  },
  {
    tool: "Codex",
    title: "Probar con código",
    body: "Construyo interacciones reales para validar estados, accesibilidad y decisiones antes del handoff.",
  },
  {
    tool: "Cursor",
    title: "Cerrar la distancia",
    body: "Trabajo sobre el producto junto a ingeniería, desde tokens hasta detalles de comportamiento.",
  },
] as const;

export function CodeWorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const artifactRef = useRef<HTMLElement>(null);
  const quickRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickSheenX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickSheenY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const artifact = artifactRef.current;
    if (!section || !artifact) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let context: gsap.Context | null = null;

    const setup = () => {
      context?.revert();
      if (document.documentElement.dataset.skin !== "signal") return;

      context = gsap.context(() => {
        const intro = section.querySelector(".signal-lab__intro");
        const steps = gsap.utils.toArray<HTMLElement>(".signal-lab__step", section);

        gsap.fromTo(
          intro,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: intro, start: "top 78%", once: true },
          },
        );

        gsap.fromTo(
          artifact,
          { autoAlpha: 0, y: 72, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: artifact, start: "top 82%", once: true },
          },
        );

        gsap.fromTo(
          steps,
          { autoAlpha: 0, y: 38 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: ".signal-lab__workflow", start: "top 84%", once: true },
          },
        );

        quickRotateX.current = gsap.quickTo(artifact, "rotationX", { duration: 0.55, ease: "power3.out" });
        quickRotateY.current = gsap.quickTo(artifact, "rotationY", { duration: 0.55, ease: "power3.out" });
        const sheen = section.querySelector(".signal-lab__sheen");
        if (sheen) {
          quickSheenX.current = gsap.quickTo(sheen, "x", { duration: 0.45, ease: "power2.out" });
          quickSheenY.current = gsap.quickTo(sheen, "y", { duration: 0.45, ease: "power2.out" });
        }
      }, section);
      ScrollTrigger.refresh();
    };

    setup();
    const observer = new MutationObserver(setup);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });

    return () => {
      observer.disconnect();
      context?.revert();
    };
  }, []);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    quickRotateX.current?.(-y * 7);
    quickRotateY.current?.(x * 8);
    quickSheenX.current?.(event.clientX - bounds.left - 130);
    quickSheenY.current?.(event.clientY - bounds.top - 130);
  }

  function onPointerLeave() {
    quickRotateX.current?.(0);
    quickRotateY.current?.(0);
  }

  return (
    <section ref={sectionRef} className="section signal-lab" id="workflow" aria-labelledby="signal-lab-title">
      <div className="container">
        <div className="signal-lab__intro">
          <p className="signal-lab__kicker">Diseñar también es construir</p>
          <h2 id="signal-lab-title">Del frame al producto funcionando.</h2>
          <p>
            Uso IA y código para explorar más rápido, discutir con evidencia y entregar decisiones que ya conocen sus límites técnicos.
          </p>
        </div>

        <article
          ref={artifactRef}
          className="signal-lab__artifact"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <span className="signal-lab__sheen" />
          <div className="signal-lab__artifact-head">
            <span>Interaction contract</span>
            <span>TypeScript</span>
          </div>
          <pre>
            <code>
              <span className="code-keyword">type</span> ProductDecision = {`{`} {"\n"}
              {"  "}userNeed: <span className="code-type">Evidence</span>; {"\n"}
              {"  "}interface: <span className="code-type">Prototype</span>; {"\n"}
              {"  "}quality: <span className="code-string">{`"measured"`}</span>; {"\n"}
              {`}`};
            </code>
          </pre>
        </article>

        <div className="signal-lab__workflow">
          {workflow.map((item) => (
            <article className="signal-lab__step" key={item.tool}>
              <span>{item.tool}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
