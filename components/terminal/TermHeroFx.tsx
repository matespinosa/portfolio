"use client";

import dynamic from "next/dynamic";
import { useSkin } from "@/lib/useSkin";

// three.js solo se descarga cuando el skin Terminal está activo
const TermField = dynamic(
  () => import("@/components/terminal/TermField").then((m) => m.TermField),
  { ssr: false },
);

/** Capa de efectos del hero exclusiva del skin Terminal: domo dither 3D. */
export function TermHeroFx() {
  const skin = useSkin();
  if (skin !== "terminal") return null;

  return <TermField />;
}
