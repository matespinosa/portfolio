"use client";

import dynamic from "next/dynamic";
import { useSkin } from "@/lib/useSkin";
import { HeroCursors } from "@/components/home/HeroCursors";

// three.js solo se descarga cuando el skin Signal está activo
const SignalGlobe = dynamic(
  () => import("@/components/home/SignalGlobe").then((m) => m.SignalGlobe),
  { ssr: false },
);

/** Capa de efectos del hero exclusiva del skin Signal: globo 3D + cursores. */
export function SignalHeroFx() {
  const skin = useSkin();
  if (skin !== "signal") return null;

  return (
    <>
      <SignalGlobe />
      <HeroCursors />
    </>
  );
}
