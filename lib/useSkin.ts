"use client";

import { useEffect, useState } from "react";
import { isSkinId, type SkinId } from "@/lib/skins";

/**
 * Lee el skin activo desde el atributo `data-skin` de <html> y se mantiene
 * sincronizado cuando el VisualPill lo cambia. Devuelve `null` durante SSR y
 * el primer render (antes de montar) para evitar mismatches de hidratación.
 */
export function useSkin(): SkinId | null {
  const [skin, setSkin] = useState<SkinId | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const value = root.getAttribute("data-skin");
      setSkin(isSkinId(value) ? value : null);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-skin"] });
    return () => observer.disconnect();
  }, []);

  return skin;
}
