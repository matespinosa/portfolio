"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Fondo del hero del skin Terminal: domo de puntos cuadrados (dither/halftone)
 * que emerge del borde inferior, con ondas lentas y un barrido de escaneo que
 * recorre la superficie — fósforo verde sobre negro, tinta verde sobre papel.
 * Se monta vía dynamic import solo cuando el skin activo es "terminal".
 */

const DOME_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aShade;
  uniform float uPx;
  uniform float uTime;
  uniform float uWave;
  varying float vShade;
  varying float vBoost;
  void main() {
    vec3 n = normalize(position);
    float lat = asin(clamp(n.y, -1.0, 1.0));
    float lon = atan(n.z, n.x);
    // ondas suaves que recorren el domo
    float w = sin(lon * 6.0 + uTime * 0.8) * cos(lat * 9.0 - uTime * 1.25)
            + 0.55 * sin(lon * 11.0 - uTime * 0.55);
    float r = 1.0 + w * 0.014 * uWave;
    // barrido de escaneo: sube del horizonte a la cúspide y reinicia
    float sweep = fract(uTime * 0.11) * 1.85 - 0.15;
    float band = exp(-pow((lat - sweep) * 8.0, 2.0));
    vShade = aShade;
    vBoost = band;
    vec4 mv = modelViewMatrix * vec4(n * r, 1.0);
    float depth = max(0.4, -mv.z);
    gl_PointSize = clamp(aSize * uPx * (2.7 / depth) * (1.0 + band * 0.55), 1.0, 13.0 * uPx);
    gl_Position = projectionMatrix * mv;
  }
`;

const DOME_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vShade;
  varying float vBoost;
  void main() {
    // puntos cuadrados: look pixel/dither en vez de glow circular
    vec2 c = abs(gl_PointCoord - 0.5);
    if (max(c.x, c.y) > 0.5) discard;
    float tone = clamp(vShade * 0.72 + vBoost, 0.0, 1.0);
    float alpha = uOpacity * (0.3 + 0.7 * max(vShade, vBoost));
    gl_FragColor = vec4(mix(uColorB, uColorA, tone), alpha);
  }
`;

type DotSpec = { positions: number[]; sizes: number[]; shades: number[] };

function specToGeometry(spec: DotSpec) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(spec.positions, 3));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(spec.sizes, 1));
  geometry.setAttribute("aShade", new THREE.Float32BufferAttribute(spec.shades, 1));
  return geometry;
}

/** Retícula lat/lon del hemisferio superior, densidad constante por área. */
function buildDomeSpec(): DotSpec {
  const spec: DotSpec = { positions: [], sizes: [], shades: [] };
  const ROWS = 60;
  const MAX_COLS = 200;
  for (let row = 0; row <= ROWS; row += 1) {
    const lat = (row / ROWS) * Math.PI * 0.5;
    const cols = Math.max(10, Math.round(Math.cos(lat) * MAX_COLS));
    for (let col = 0; col < cols; col += 1) {
      const lon = (col / cols) * Math.PI * 2 + (row % 2) * (Math.PI / cols);
      spec.positions.push(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon),
      );
      spec.sizes.push(1.05 + Math.random() * 1.6);
      spec.shades.push(Math.random());
    }
  }
  return spec;
}

/** Polvo de píxeles disperso sobre el horizonte, muy tenue. */
function buildDustSpec(count: number): DotSpec {
  const spec: DotSpec = { positions: [], sizes: [], shades: [] };
  for (let i = 0; i < count; i += 1) {
    const v = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 0.9 + 0.08,
      Math.random() * 2 - 1,
    );
    if (v.lengthSq() < 0.001) v.set(0.4, 0.5, 0.2);
    v.normalize().multiplyScalar(2.1 + Math.random() * 2.4);
    spec.positions.push(v.x, v.y, v.z);
    spec.sizes.push(0.8 + Math.random() * 1.1);
    spec.shades.push(Math.random());
  }
  return spec;
}

export function TermField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.z = 3.4;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const disposables: { dispose: () => void }[] = [];
    const timedMaterials: THREE.ShaderMaterial[] = [];

    const makeDotMaterial = (colorA: string, colorB: string, opacity: number, wave: number) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: DOME_VERT,
        fragmentShader: DOME_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uPx: { value: pixelRatio },
          uTime: { value: 0 },
          uWave: { value: wave },
          uColorA: { value: new THREE.Color(colorA) },
          uColorB: { value: new THREE.Color(colorB) },
          uOpacity: { value: opacity },
        },
      });
      disposables.push(material);
      timedMaterials.push(material);
      return material;
    };

    const parallax = new THREE.Group();
    scene.add(parallax);

    const dome = new THREE.Group();
    parallax.add(dome);

    // Esfera opaca que ocluye la cara trasera del domo (evita moiré)
    const orbGeometry = new THREE.SphereGeometry(0.985, 48, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({ color: 0x060907 });
    disposables.push(orbGeometry, orbMaterial);
    dome.add(new THREE.Mesh(orbGeometry, orbMaterial));

    const domeMaterial = makeDotMaterial("#c9ffd8", "#1c5c30", 0.92, 1);
    const domeGeometry = specToGeometry(buildDomeSpec());
    disposables.push(domeGeometry);
    dome.add(new THREE.Points(domeGeometry, domeMaterial));

    const dustMaterial = makeDotMaterial("#9ef5b7", "#17492a", 0.3, 0);
    const dustGeometry = specToGeometry(buildDustSpec(240));
    disposables.push(dustGeometry);
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    parallax.add(dust);

    // Paleta según tema: fósforo aditivo en oscuro, tinta verde en claro
    const applyTheme = () => {
      const dark = document.documentElement.getAttribute("data-theme") !== "light";
      const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      const setDots = (
        material: THREE.ShaderMaterial,
        colorA: string,
        colorB: string,
        opacity: number,
      ) => {
        material.uniforms.uColorA.value.set(colorA);
        material.uniforms.uColorB.value.set(colorB);
        material.uniforms.uOpacity.value = opacity;
        material.blending = blending;
        material.needsUpdate = true;
      };
      if (dark) {
        orbMaterial.color.set(0x060907);
        setDots(domeMaterial, "#c9ffd8", "#1c5c30", 0.92);
        setDots(dustMaterial, "#9ef5b7", "#17492a", 0.3);
      } else {
        orbMaterial.color.set(0xf3f6f2);
        setDots(domeMaterial, "#0b7c37", "#a7cdb2", 0.9);
        setDots(dustMaterial, "#31905b", "#bcd9c4", 0.34);
      }
      renderer.render(scene, camera);
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const pointerTarget = { x: 0, y: 0 };
    const onPointerMove = (event: globalThis.PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      const w = Math.max(width, 1);
      const h = Math.max(height, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      // El domo cubre todo el ancho; su cúspide asoma bajo la mitad del hero
      const scale = Math.max(halfW * 1.18, halfH * 0.85);
      dome.scale.setScalar(scale);
      dome.position.y = -0.28 * halfH - scale;
      dust.position.y = dome.position.y * 0.16;
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    let frame = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      dome.rotation.y += delta * 0.045;
      dust.rotation.y -= delta * 0.006;
      parallax.rotation.y += (pointerTarget.x * 0.05 - parallax.rotation.y) * 0.045;
      parallax.rotation.x += (pointerTarget.y * 0.03 - parallax.rotation.x) * 0.045;
      timedMaterials.forEach((material) => {
        material.uniforms.uTime.value = time / 1000;
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const syncLoop = () => {
      const shouldRun = inView && !document.hidden && !reduced;
      if (shouldRun && !running) {
        running = true;
        lastTime = performance.now();
        frame = requestAnimationFrame(render);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncLoop();
      },
      { threshold: 0.02 },
    );
    viewObserver.observe(root);

    const onVisibility = () => syncLoop();
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      // Frame único con el barrido a media altura para que no quede plano
      timedMaterials.forEach((material) => {
        material.uniforms.uTime.value = 3.2;
      });
      renderer.render(scene, camera);
    } else {
      syncLoop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="term-field" aria-hidden="true">
      <canvas ref={canvasRef} className="term-field__canvas" />
    </div>
  );
}
