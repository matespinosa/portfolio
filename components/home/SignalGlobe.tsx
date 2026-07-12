"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Mundo interactivo del hero (skin Signal): globo de puntos violeta con
 * continentes, atmósfera, órbitas punteadas con cometas y partículas.
 * Arrastra para rotarlo; rota solo y hace parallax con el puntero.
 * Se monta vía dynamic import solo cuando el skin activo es "signal".
 */

const ROWS = 48;
const COLS = 96;

/**
 * Máscara equirectangular de continentes (48 filas x 96 columnas).
 * Cada fila lista rangos [inicio, fin] (inclusivos) de columnas con tierra.
 * Fila 0 = 90°N, columna 0 = 180°O. Resolución ~3.75° por celda.
 */
const LAND: number[][][] = [
  [],
  [[26, 30], [33, 37]],
  [[22, 30], [32, 40], [51, 53]],
  [[16, 30], [33, 41], [51, 52], [60, 64], [74, 78]],
  [[4, 10], [12, 30], [34, 42], [52, 56], [58, 88]],
  [[3, 11], [13, 30], [35, 42], [50, 57], [58, 90]],
  [[2, 10], [14, 30], [36, 40], [43, 44], [49, 92]],
  [[2, 9], [14, 31], [37, 40], [49, 93]],
  [[2, 7], [15, 21], [25, 32], [46, 47], [49, 94]],
  [[14, 21], [26, 32], [45, 47], [49, 89], [92, 94]],
  [[13, 31], [45, 90]],
  [[13, 30], [45, 88]],
  [[13, 30], [45, 62], [64, 83], [86, 87]],
  [[13, 29], [45, 47], [50, 51], [53, 61], [63, 82], [85, 86]],
  [[14, 28], [44, 46], [50, 51], [58, 81], [84, 85]],
  [[15, 27], [43, 57], [59, 81]],
  [[17, 24], [26, 26], [43, 57], [59, 63], [66, 80]],
  [[17, 23], [25, 27], [43, 59], [60, 63], [66, 79]],
  [[19, 24], [26, 29], [43, 57], [59, 63], [66, 71], [73, 77]],
  [[22, 26], [43, 57], [59, 61], [66, 70], [73, 77], [79, 80]],
  [[23, 27], [43, 62], [67, 69], [73, 77], [79, 81]],
  [[25, 28], [29, 33], [44, 61], [69, 69], [73, 77], [79, 81]],
  [[27, 35], [45, 58], [59, 60], [74, 80]],
  [[26, 36], [46, 58], [73, 75], [76, 79], [80, 81], [84, 88]],
  [[26, 38], [47, 58], [74, 76], [77, 79], [84, 89]],
  [[26, 38], [47, 58], [75, 78], [85, 89]],
  [[26, 38], [47, 58], [76, 80], [85, 89]],
  [[27, 37], [48, 58], [59, 60], [78, 85]],
  [[27, 36], [48, 57], [59, 60], [77, 86]],
  [[27, 35], [48, 57], [59, 60], [76, 87]],
  [[28, 34], [48, 56], [59, 59], [76, 88]],
  [[28, 33], [49, 56], [76, 88]],
  [[28, 33], [50, 55], [77, 87]],
  [[28, 32], [51, 54], [79, 86]],
  [[28, 31], [84, 85], [92, 93]],
  [[28, 31], [84, 84], [91, 93]],
  [[28, 30], [90, 92]],
  [[28, 30]],
  [[28, 30]],
  [],
  [],
  [],
  [[0, 10], [14, 40], [46, 70], [76, 95]],
  [[2, 44], [50, 93]],
  [[0, 95]],
  [[4, 90]],
  [[10, 80]],
  [],
];

const DOT_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aShade;
  uniform float uPx;
  uniform float uTime;
  varying float vShade;
  varying float vTwinkle;
  void main() {
    vShade = aShade;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.8 + 0.2 * sin(uTime * 1.35 + aShade * 43.0);
    vTwinkle = tw;
    // depth acotado + clamp: un punto casi en el plano de cámara no puede
    // explotar a miles de px (con blending aditivo congela la GPU)
    float depth = max(0.35, -mv.z);
    gl_PointSize = min(aSize * uPx * (3.4 / depth) * (0.82 + 0.3 * tw), 20.0 * uPx);
    gl_Position = projectionMatrix * mv;
  }
`;

const DOT_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vShade;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.16, d) * uOpacity * vTwinkle;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(mix(uColorB, uColorA, vShade), alpha);
  }
`;

const GLOW_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    float i = pow(max(0.0, 0.74 - dot(vNormal, vec3(0.0, 0.0, 1.0))), uPower);
    gl_FragColor = vec4(uColor, 1.0) * i * uStrength;
  }
`;

function latLonToXYZ(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

type DotSpec = { positions: number[]; sizes: number[]; shades: number[] };

function specToGeometry(spec: DotSpec) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(spec.positions, 3));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(spec.sizes, 1));
  geometry.setAttribute("aShade", new THREE.Float32BufferAttribute(spec.shades, 1));
  return geometry;
}

function buildLandSpec(): DotSpec {
  const spec: DotSpec = { positions: [], sizes: [], shades: [] };
  for (let r = 0; r < ROWS; r += 1) {
    for (const [start, end] of LAND[r] ?? []) {
      for (let c = start; c <= end; c += 1) {
        for (let s = 0; s < 3; s += 1) {
          const lat = 90 - ((r + Math.random()) * 180) / ROWS;
          const lon = -180 + ((c + Math.random()) * 360) / COLS;
          spec.positions.push(...latLonToXYZ(lat, lon, 1));
          spec.sizes.push(1.9 + Math.random() * 1.5);
          spec.shades.push(Math.random());
        }
      }
    }
  }
  return spec;
}

function buildRingSpec(radius: number, count: number): DotSpec {
  const spec: DotSpec = { positions: [], sizes: [], shades: [] };
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    spec.positions.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
    spec.sizes.push(1 + Math.random() * 0.7);
    spec.shades.push(Math.random());
  }
  return spec;
}

function buildStarSpec(count: number): DotSpec {
  const spec: DotSpec = { positions: [], sizes: [], shades: [] };
  for (let i = 0; i < count; i += 1) {
    const v = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    );
    if (v.lengthSq() < 0.001) v.set(0.3, 0.5, 0.4);
    // Cascarón lejos del plano de la cámara (z = 3.6) para que ninguna
    // partícula cruce cerca del lente
    v.normalize().multiplyScalar(4.6 + Math.random() * 2.2);
    spec.positions.push(v.x, v.y, v.z);
    spec.sizes.push(0.9 + Math.random() * 1.2);
    spec.shades.push(Math.random());
  }
  return spec;
}

export function SignalGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const disposables: { dispose: () => void }[] = [];
    const timedMaterials: THREE.ShaderMaterial[] = [];

    const makeDotMaterial = (colorA: string, colorB: string, opacity: number) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uPx: { value: pixelRatio },
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(colorA) },
          uColorB: { value: new THREE.Color(colorB) },
          uOpacity: { value: opacity },
        },
      });
      disposables.push(material);
      timedMaterials.push(material);
      return material;
    };

    const makePoints = (spec: DotSpec, material: THREE.ShaderMaterial) => {
      const geometry = specToGeometry(spec);
      disposables.push(geometry);
      return new THREE.Points(geometry, material);
    };

    const parallax = new THREE.Group();
    scene.add(parallax);

    const globe = new THREE.Group();
    parallax.add(globe);

    // Esfera que ocluye la cara trasera de los puntos
    const orbGeometry = new THREE.SphereGeometry(0.986, 48, 48);
    const orbMaterial = new THREE.MeshBasicMaterial({ color: 0x110c1e });
    disposables.push(orbGeometry, orbMaterial);
    globe.add(new THREE.Mesh(orbGeometry, orbMaterial));

    // Continentes punteados
    const landMaterial = makeDotMaterial("#dcd0ff", "#8b5cf6", 1);
    globe.add(makePoints(buildLandSpec(), landMaterial));

    // Atmósfera (fresnel aditivo)
    const glowGeometry = new THREE.SphereGeometry(1, 48, 48);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERT,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color("#6d28d9") },
        uPower: { value: 4.0 },
        uStrength: { value: 0.72 },
      },
    });
    disposables.push(glowGeometry, glowMaterial);
    const atmosphere = new THREE.Mesh(glowGeometry, glowMaterial);
    atmosphere.scale.setScalar(1.22);
    globe.add(atmosphere);

    // Órbitas punteadas con cometas (como las flechas de la referencia)
    const spinners: { group: THREE.Group; speed: number }[] = [];
    const cometMaterials: THREE.MeshBasicMaterial[] = [];
    const ringMaterial = makeDotMaterial("#c4b5fd", "#8b5cf6", 0.5);
    const faintRingMaterial = makeDotMaterial("#a78bfa", "#6d28d9", 0.28);

    const makeRing = (
      radius: number,
      tiltX: number,
      tiltZ: number,
      speed: number,
      material: THREE.ShaderMaterial,
      withComet: boolean,
    ) => {
      const tilt = new THREE.Group();
      tilt.rotation.set(tiltX, 0, tiltZ);
      const spin = new THREE.Group();
      tilt.add(spin);
      spin.add(makePoints(buildRingSpec(radius, 150), material));

      if (withComet) {
        const coneGeometry = new THREE.ConeGeometry(0.009, 0.038, 10);
        const coneMaterial = new THREE.MeshBasicMaterial({
          color: 0xe9d5ff,
          transparent: true,
          opacity: 0.75,
        });
        disposables.push(coneGeometry, coneMaterial);
        cometMaterials.push(coneMaterial);
        const comet = new THREE.Mesh(coneGeometry, coneMaterial);
        comet.position.set(radius, 0, 0);
        comet.rotation.x = speed >= 0 ? -Math.PI / 2 : Math.PI / 2;
        spin.add(comet);

        const trail: DotSpec = { positions: [], sizes: [], shades: [] };
        const behind = speed >= 0 ? 1 : -1;
        for (let k = 1; k <= 14; k += 1) {
          const angle = behind * k * 0.045;
          trail.positions.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
          trail.sizes.push(Math.max(0.5, 2.6 - k * 0.16));
          trail.shades.push(1 - k / 16);
        }
        spin.add(makePoints(trail, ringMaterial));
      }

      spinners.push({ group: spin, speed });
      globe.add(tilt);
    };

    makeRing(1.42, 1.34, 0.24, 0.16, ringMaterial, true);
    makeRing(1.64, 1.18, -0.38, -0.1, ringMaterial, true);
    makeRing(1.94, 1.42, 0.06, 0.05, faintRingMaterial, false);

    // Partículas ambientales
    const starMaterial = makeDotMaterial("#b7a5f7", "#5b21b6", 0.38);
    const stars = makePoints(buildStarSpec(340), starMaterial);
    parallax.add(stars);

    // Paleta según tema: aditivo sobre fondo oscuro, normal sobre claro
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
        orbMaterial.color.set(0x110c1e);
        setDots(landMaterial, "#dcd0ff", "#8b5cf6", 1);
        setDots(ringMaterial, "#c4b5fd", "#8b5cf6", 0.5);
        setDots(faintRingMaterial, "#a78bfa", "#6d28d9", 0.28);
        setDots(starMaterial, "#b7a5f7", "#5b21b6", 0.38);
        glowMaterial.uniforms.uColor.value.set("#6d28d9");
        glowMaterial.uniforms.uStrength.value = 0.72;
        glowMaterial.blending = THREE.AdditiveBlending;
        cometMaterials.forEach((m) => m.color.set(0xe9d5ff));
      } else {
        orbMaterial.color.set(0xefeaf8);
        setDots(landMaterial, "#6d28d9", "#4c1d95", 0.92);
        setDots(ringMaterial, "#7c3aed", "#8b5cf6", 0.5);
        setDots(faintRingMaterial, "#8b5cf6", "#a78bfa", 0.3);
        setDots(starMaterial, "#7c3aed", "#6d28d9", 0.2);
        glowMaterial.uniforms.uColor.value.set("#8b5cf6");
        glowMaterial.uniforms.uStrength.value = 0.38;
        glowMaterial.blending = THREE.NormalBlending;
        cometMaterials.forEach((m) => m.color.set(0x7c3aed));
      }
      glowMaterial.needsUpdate = true;
      renderer.render(scene, camera);
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Estado de interacción
    const pointerTarget = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocity = 0;
    let pitch = 0;
    const BASE_PITCH = 0.6;
    globe.rotation.y = -0.28; // arranca centrado en el meridiano de Bogotá
    globe.rotation.x = BASE_PITCH;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      const w = Math.max(width, 1);
      const h = Math.max(height, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const scale = Math.max(halfH * 1.18, Math.min(halfW * 0.58, halfH * 1.9));
      globe.scale.setScalar(scale);
      globe.position.y = -0.34 * halfH - scale;
      stars.position.y = globe.position.y * 0.22;
      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!event.isPrimary) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velocity = 0;
      root.classList.add("is-dragging");
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: globalThis.PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      pointerTarget.y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      if (!dragging || !event.isPrimary) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      globe.rotation.y += dx * 0.005;
      velocity = dx * 0.005;
      pitch = THREE.MathUtils.clamp(pitch + dy * 0.0028, -0.34, 0.42);
    };
    const endDrag = () => {
      dragging = false;
      root.classList.remove("is-dragging");
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", endDrag, { passive: true });
    window.addEventListener("pointercancel", endDrag, { passive: true });

    let frame = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (!dragging) {
        globe.rotation.y += delta * 0.07 + velocity;
        velocity *= 0.93;
      }
      globe.rotation.x += (BASE_PITCH + pitch - globe.rotation.x) * 0.08;
      parallax.rotation.y += (pointerTarget.x * 0.05 - parallax.rotation.y) * 0.04;
      parallax.rotation.x += (pointerTarget.y * 0.035 - parallax.rotation.x) * 0.04;
      stars.rotation.y += delta * 0.008;
      spinners.forEach((spinner) => {
        spinner.group.rotation.y += delta * spinner.speed;
      });
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
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="signal-globe" aria-hidden="true">
      <canvas ref={canvasRef} className="signal-globe__canvas" />
    </div>
  );
}
