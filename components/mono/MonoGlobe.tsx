"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Globo decorativo del skin Mono: esfera de puntos + meridianos en la tinta
 * del tema, rotación lenta y tilt con el puntero. Pensado como ilustración
 * (estilo line-art) para la sección "Quién soy".
 */

const DOT_VERT = /* glsl */ `
  attribute float aSize;
  uniform float uPx;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = max(0.4, -mv.z);
    gl_PointSize = min(aSize * uPx * (2.6 / depth), 10.0 * uPx);
    gl_Position = projectionMatrix * mv;
  }
`;

const DOT_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.2, d) * uOpacity;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function readInk(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
  return value || "#111111";
}

export function MonoGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.z = 3.1;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const globe = new THREE.Group();
    globe.rotation.x = 0.42;
    scene.add(globe);

    // Puntos en espiral de Fibonacci
    const COUNT = 760;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i += 1) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = golden * i;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      sizes[i] = 1 + Math.random() * 1.1;
    }
    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const dotMaterial = new THREE.ShaderMaterial({
      vertexShader: DOT_VERT,
      fragmentShader: DOT_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uPx: { value: pixelRatio },
        uColor: { value: new THREE.Color(readInk()) },
        uOpacity: { value: 0.5 },
      },
    });
    globe.add(new THREE.Points(dotGeometry, dotMaterial));

    // Meridianos / paralelos line-art
    const ringMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(readInk()),
      transparent: true,
      opacity: 0.16,
    });
    const rings: THREE.Object3D[] = [];
    const makeRing = (rotX: number, rotY: number, scale = 1) => {
      const curve = new THREE.EllipseCurve(0, 0, 1.001 * scale, 1.001 * scale, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(90);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.LineLoop(geometry, ringMaterial);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      globe.add(ring);
      rings.push(ring);
      return geometry;
    };
    const ringGeometries = [
      makeRing(Math.PI / 2, 0),
      makeRing(Math.PI / 2, Math.PI / 3),
      makeRing(Math.PI / 2, -Math.PI / 3),
      makeRing(0.12, 0, 0.72),
    ];

    const applyInk = () => {
      const ink = new THREE.Color(readInk());
      (dotMaterial.uniforms.uColor.value as THREE.Color).copy(ink);
      ringMaterial.color.copy(ink);
      renderer.render(scene, camera);
    };
    const themeObserver = new MutationObserver(applyInk);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-skin"],
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    let frame = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      globe.rotation.y += delta * 0.22;
      globe.rotation.x += (0.42 + pointer.y * 0.16 - globe.rotation.x) * 0.05;
      globe.rotation.z += (pointer.x * -0.08 - globe.rotation.z) * 0.05;
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
      { threshold: 0.05 },
    );
    viewObserver.observe(root);
    const onVisibility = () => syncLoop();
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) renderer.render(scene, camera);
    else syncLoop();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      dotGeometry.dispose();
      dotMaterial.dispose();
      ringGeometries.forEach((geometry) => geometry.dispose());
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="mono-globe" aria-hidden="true">
      <canvas ref={canvasRef} className="mono-globe__canvas" />
    </div>
  );
}
