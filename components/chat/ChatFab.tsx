"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { useChatLauncher } from "./ChatProvider";
import { MessageCircleIcon } from "./icons";

/** Coordenadas alineadas al borde del botón (58×58) */
const SIZE = 58;
const CX = SIZE / 2;
const CY = SIZE / 2;
/** Radio del stroke = borde exacto del círculo del botón */
const R = SIZE / 2 - 1.25;
/** Cada línea cubre ~47.5% → vacío total ~5% */
const ARC_DEG = 171;
const TRAIL_STEPS = 16;

function polar(deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

function arcPath(startDeg: number, sweepDeg: number) {
  const endDeg = startDeg + sweepDeg;
  const s = polar(startDeg);
  const e = polar(endDeg);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

type Beam = {
  id: "a" | "b";
  /** CSS vars del skin activo */
  color: string;
  glow: string;
  start: number;
};

const BEAMS: Beam[] = [
  {
    id: "a",
    color: "var(--fab-line-a)",
    glow: "var(--fab-line-a-soft)",
    start: 0,
  },
  {
    id: "b",
    color: "var(--fab-line-b)",
    glow: "var(--fab-line-b-soft)",
    start: 180,
  },
];

function trailSegments(start: number, color: string, glow: string, id: string) {
  const step = ARC_DEG / TRAIL_STEPS;
  return Array.from({ length: TRAIL_STEPS }, (_, i) => {
    const t = (i + 1) / TRAIL_STEPS;
    return {
      key: `${id}-${i}`,
      d: arcPath(start + i * step, step * 1.05),
      opacity: 0.12 + t * t * 0.88,
      width: 1.5 + t * 1.7,
      stroke: t > 0.7 ? color : glow,
    };
  });
}

export function ChatFab() {
  const { open, openChat } = useChatLauncher();
  const [chatSectionVisible, setChatSectionVisible] = useState(false);
  const spinRef = useRef<SVGGElement>(null);
  const beamRefs = useRef<(SVGGElement | null)[]>([]);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const section = document.querySelector("#pregunta");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setChatSectionVisible(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open || chatSectionVisible) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !spinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(spinRef.current, {
        rotation: 360,
        svgOrigin: `${CX} ${CY}`,
        duration: 6.2,
        ease: "none",
        repeat: -1,
      });

      beamRefs.current.forEach((beam, i) => {
        if (!beam) return;
        gsap.to(beam, {
          opacity: 0.72,
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.6,
        });
      });
    });

    return () => ctx.revert();
  }, [open, chatSectionVisible]);

  if (open) return null;

  return (
    <button
      type="button"
      className={`chat-fab${chatSectionVisible ? " is-away" : ""}`}
      aria-label="Abrir asistente del portafolio"
      aria-hidden={chatSectionVisible}
      tabIndex={chatSectionVisible ? -1 : 0}
      title="Abrir asistente"
      onClick={() => openChat()}
    >
      <svg
        className="chat-fab__ring"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
      >
        <defs>
          {BEAMS.map((beam) => (
            <filter
              key={beam.id}
              id={`${uid}-${beam.id}`}
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.3 0"
                result="bloom"
              />
              <feMerge>
                <feMergeNode in="bloom" />
                <feMergeNode in="bloom" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        <circle
          className="chat-fab__track"
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        <g ref={spinRef} className="chat-fab__spin">
          {BEAMS.map((beam, i) => {
            const segments = trailSegments(beam.start, beam.color, beam.glow, beam.id);
            return (
              <g
                key={beam.id}
                ref={(el) => {
                  beamRefs.current[i] = el;
                }}
                className={`chat-fab__beam chat-fab__beam--${beam.id}`}
                filter={`url(#${uid}-${beam.id})`}
              >
                <path
                  d={arcPath(beam.start, ARC_DEG)}
                  fill="none"
                  stroke={beam.glow}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.28"
                />
                {segments.map((seg) => (
                  <path
                    key={seg.key}
                    d={seg.d}
                    fill="none"
                    stroke={seg.stroke}
                    strokeWidth={seg.width}
                    strokeLinecap="round"
                    opacity={seg.opacity}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>
      <span className="chat-fab__icon" aria-hidden="true">
        <MessageCircleIcon size={23} />
      </span>
    </button>
  );
}
