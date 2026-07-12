"use client";

import { useEffect, useState } from "react";

type TypedOptions = {
  /** ms por carácter (se le suma un jitter aleatorio pequeño) */
  speed?: number;
  /** retraso inicial en ms antes de empezar a tipear */
  delay?: number;
  /** solo tipea cuando es true (p. ej. sección visible / skin activo) */
  active?: boolean;
};

/**
 * Efecto máquina-de-escribir para los prompts del skin Terminal.
 * Respeta prefers-reduced-motion (muestra el texto completo al instante).
 */
export function useTyped(
  text: string,
  { speed = 62, delay = 0, active = true }: TypedOptions = {},
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) {
        timer = window.setTimeout(tick, speed + Math.random() * 46);
      }
    };
    timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [text, speed, delay, active]);

  return { typed: text.slice(0, count), done: count >= text.length };
}
