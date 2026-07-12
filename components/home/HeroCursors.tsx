"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursores colaborativos estilo Figma para el hero del skin Signal.
 * Cada cursor recibe un nombre y color aleatorios, deambula suavemente por su
 * zona, hace "clicks" ocasionales y se aparta un poco del puntero real.
 * Decorativo: pointer-events none y oculto para lectores de pantalla.
 */

const NAMES = [
  "Nina",
  "Tom",
  "Aleks",
  "Sofi",
  "Batuhan",
  "Emma",
  "Marco",
  "Zoe",
  "Kenji",
  "Lena",
  "Ana",
  "Teo",
];

const COLORS = ["#8b5cf6", "#ec4899", "#38bdf8", "#34d399", "#f59e0b", "#f43f5e"];

/** Zonas (en % del hero) donde vive cada cursor, alrededor del contenido. */
const ZONES = [
  { x: 7, y: 22, w: 15, h: 22 },
  { x: 72, y: 16, w: 17, h: 20 },
  { x: 5, y: 58, w: 15, h: 18 },
  { x: 74, y: 54, w: 16, h: 18 },
];

type CursorConfig = { name: string; color: string };

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function HeroCursors() {
  const [cursors, setCursors] = useState<CursorConfig[] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowsRef = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const names = shuffle(NAMES).slice(0, ZONES.length);
    const colors = shuffle(COLORS);
    setCursors(names.map((name, i) => ({ name, color: colors[i % colors.length] })));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !cursors) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rect = root.getBoundingClientRect();

    const randomIn = (zone: (typeof ZONES)[number]) => ({
      x: zone.x + Math.random() * zone.w,
      y: zone.y + Math.random() * zone.h,
    });

    const now = performance.now();
    const states = ZONES.map((zone, i) => {
      const start = randomIn(zone);
      const target = randomIn(zone);
      return {
        zone,
        x: start.x,
        y: start.y,
        sx: start.x,
        sy: start.y,
        tx: target.x,
        ty: target.y,
        t0: now + i * 400,
        dur: 2600 + Math.random() * 2200,
        ox: 0,
        oy: 0,
        rot: 0,
        nextClick: now + 2500 + Math.random() * 5000,
      };
    });

    const apply = () => {
      states.forEach((st, i) => {
        const node = nodesRef.current[i];
        if (!node) return;
        const px = (st.x / 100) * rect.width + st.ox;
        const py = (st.y / 100) * rect.height + st.oy;
        node.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
        const arrow = arrowsRef.current[i];
        if (arrow) arrow.style.transform = `rotate(${st.rot.toFixed(1)}deg)`;
      });
    };

    const onResize = () => {
      rect = root.getBoundingClientRect();
      apply();
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(root);

    if (reduced) {
      apply();
      return () => observer.disconnect();
    }

    const pointer = { x: -9999, y: -9999 };
    const onPointerMove = (event: globalThis.PointerEvent) => {
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const clickTimeouts: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;

    const tick = (time: number) => {
      states.forEach((st, i) => {
        const prevX = st.x;
        const t = Math.min(Math.max((time - st.t0) / st.dur, 0), 1);
        const e = easeInOutCubic(t);
        st.x = st.sx + (st.tx - st.sx) * e;
        st.y = st.sy + (st.ty - st.sy) * e;

        if (t >= 1 && time > st.t0 + st.dur + 350 + Math.random() * 400) {
          const target = randomIn(st.zone);
          st.sx = st.x;
          st.sy = st.y;
          st.tx = target.x;
          st.ty = target.y;
          st.t0 = time;
          st.dur = 2600 + Math.random() * 2400;
        }

        // Inclinación de la flecha según la dirección horizontal
        const dx = st.x - prevX;
        const targetRot = Math.max(-11, Math.min(11, dx * 260));
        st.rot += (targetRot - st.rot) * 0.08;

        // Se apartan suavemente del puntero real
        const px = (st.x / 100) * rect.width;
        const py = (st.y / 100) * rect.height;
        const dpx = px - pointer.x;
        const dpy = py - pointer.y;
        const dist = Math.hypot(dpx, dpy);
        let toX = 0;
        let toY = 0;
        if (dist > 0.001 && dist < 150) {
          const force = ((150 - dist) / 150) * 30;
          toX = (dpx / dist) * force;
          toY = (dpy / dist) * force;
        }
        st.ox += (toX - st.ox) * 0.07;
        st.oy += (toY - st.oy) * 0.07;

        // Click ocasional
        if (time > st.nextClick) {
          st.nextClick = time + 4200 + Math.random() * 5600;
          const node = nodesRef.current[i];
          if (node) {
            node.classList.add("is-click");
            clickTimeouts.push(setTimeout(() => node.classList.remove("is-click"), 700));
          }
        }
      });
      apply();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      clickTimeouts.forEach(clearTimeout);
    };
  }, [cursors]);

  if (!cursors) return null;

  return (
    <div ref={rootRef} className="hero-cursors" aria-hidden="true">
      {cursors.map((cursor, i) => (
        <div
          key={cursor.name}
          ref={(el) => {
            nodesRef.current[i] = el;
          }}
          className="hero-cursor"
          style={{ "--c": cursor.color, animationDelay: `${0.25 + i * 0.18}s` } as React.CSSProperties}
        >
          <svg
            ref={(el) => {
              arrowsRef.current[i] = el;
            }}
            className="hero-cursor__arrow"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3.6 1.9 20.5 9.4a.9.9 0 0 1-.1 1.68l-6.86 2.14a.9.9 0 0 0-.55.5l-2.9 6.62a.9.9 0 0 1-1.67-.05L2.4 3.07a.9.9 0 0 1 1.2-1.17Z" />
          </svg>
          <span className="hero-cursor__label">{cursor.name}</span>
          <span className="hero-cursor__ring" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
