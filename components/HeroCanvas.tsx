"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function ParticleSphere({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const count = 2200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribución uniforme en la superficie de una esfera (spiral)
      const t = i / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.15 + Math.sin(i * 12.9898) * 0.06;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.02;
    // parallax suave hacia el puntero
    const px = state.pointer.x * 0.25;
    const py = state.pointer.y * 0.25;
    mouse.current.x += (px - mouse.current.x) * 0.04;
    mouse.current.y += (py - mouse.current.y) * 0.04;
    ref.current.rotation.y += mouse.current.x * 0.01;
    ref.current.rotation.x += -mouse.current.y * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "light" ? "#1f9d47" : "#39d353";

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ParticleSphere color={color} />
      <ambientLight intensity={0.4} />
    </Canvas>
  );
}
