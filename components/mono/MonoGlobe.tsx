"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import americasGeography from "@/content/americas-geography.json";

type LatLon = readonly [lat: number, lon: number];
type Position = [lon: number, lat: number];
type LinearRing = Position[];
type PolygonCoordinates = LinearRing[];
type CountryGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: PolygonCoordinates[] };
type CountryFeature = { name: string; iso: string; geometry: CountryGeometry };

const COLOMBIA: LatLon = [4.711, -74.0721];
const AMERICAS_FOCUS = THREE.MathUtils.degToRad(74);
const COUNTRIES = (americasGeography.features as unknown as CountryFeature[])
  .filter((country) => country.name !== "Greenland");

function countryPolygons(country: CountryFeature): PolygonCoordinates[] {
  return country.geometry.type === "Polygon"
    ? [country.geometry.coordinates]
    : country.geometry.coordinates;
}

const LAND_POLYGONS = COUNTRIES.flatMap((country) =>
  countryPolygons(country).map((polygon) => polygon[0]),
);

const COUNTRY_RINGS = COUNTRIES.flatMap((country) =>
  countryPolygons(country).flatMap((polygon) => polygon),
);

const DOT_VERT = /* glsl */ `
  attribute float aSize;
  uniform float uPx;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = max(0.4, -mv.z);
    gl_PointSize = min(aSize * uPx * (2.65 / depth), 9.0 * uPx);
    gl_Position = projectionMatrix * mv;
  }
`;

const DOT_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.15, d) * uOpacity;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function readInk(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#111111";
}

function latLonToVector(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon);
  const cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.sin(theta),
    radius * Math.sin(phi),
    radius * cosPhi * Math.cos(theta),
  );
}

function longitudeNear(lon: number, reference: number): number {
  let adjusted = lon;
  while (adjusted - reference > 180) adjusted -= 360;
  while (adjusted - reference < -180) adjusted += 360;
  return adjusted;
}

function pointInPolygon(lat: number, lon: number, polygon: LinearRing): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [rawLonI, latI] = polygon[i];
    const [rawLonJ, latJ] = polygon[j];
    const lonI = longitudeNear(rawLonI, lon);
    const lonJ = longitudeNear(rawLonJ, lon);
    const crosses = (latI > lat) !== (latJ > lat)
      && lon < ((lonJ - lonI) * (lat - latI)) / (latJ - latI || 1e-7) + lonI;
    if (crosses) inside = !inside;
  }
  return inside;
}

function sampledOutline(polygon: LinearRing, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < polygon.length - 1; i += 1) {
    const [lonA, latA] = polygon[i];
    const [rawLonB, latB] = polygon[i + 1];
    const lonB = longitudeNear(rawLonB, lonA);
    const steps = Math.max(2, Math.ceil(Math.max(Math.abs(latB - latA), Math.abs(lonB - lonA)) / 1.5));
    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      points.push(latLonToVector(
        THREE.MathUtils.lerp(latA, latB, t),
        THREE.MathUtils.lerp(lonA, lonB, t),
        radius,
      ));
    }
  }
  const [lon, lat] = polygon[polygon.length - 1];
  points.push(latLonToVector(lat, lon, radius));
  return points;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makePointGeometry(points: THREE.Vector3[], sizes: number[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  return geometry;
}

function makePointMaterial(pixelRatio: number, opacity: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: DOT_VERT,
    fragmentShader: DOT_FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uPx: { value: pixelRatio },
      uColor: { value: new THREE.Color(readInk()) },
      uOpacity: { value: opacity },
    },
  });
}

export function MonoGlobe() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const label = labelRef.current;
    if (!root || !canvas || !label) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
    camera.position.z = 3.15;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const globe = new THREE.Group();
    globe.rotation.set(-0.08, AMERICAS_FOCUS, -0.035);
    scene.add(globe);

    const sphereGeometry = new THREE.SphereGeometry(0.992, 36, 24);
    const depthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false });
    globe.add(new THREE.Mesh(sphereGeometry, depthMaterial));

    const gridMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(readInk()),
      transparent: true,
      opacity: 0.055,
    });
    const gridGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 18, 10));
    globe.add(new THREE.LineSegments(gridGeometry, gridMaterial));

    const random = seededRandom(2026);
    const atmospherePoints: THREE.Vector3[] = [];
    const atmosphereSizes: number[] = [];
    for (let i = 0; i < 540; i += 1) {
      const y = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
      atmospherePoints.push(new THREE.Vector3(
        Math.cos(angle) * ringRadius,
        y,
        Math.sin(angle) * ringRadius,
      ).multiplyScalar(1.006));
      atmosphereSizes.push(0.55 + random() * 0.65);
    }
    const atmosphereGeometry = makePointGeometry(atmospherePoints, atmosphereSizes);
    const atmosphereMaterial = makePointMaterial(pixelRatio, 0.2);
    globe.add(new THREE.Points(atmosphereGeometry, atmosphereMaterial));

    const landPoints: THREE.Vector3[] = [];
    const landSizes: number[] = [];
    for (let lat = -56; lat <= 83; lat += 1.65) {
      for (let lon = -170; lon <= -30; lon += 1.65) {
        const jitteredLat = lat + (random() - 0.5) * 0.72;
        const jitteredLon = lon + (random() - 0.5) * 0.72;
        if (!LAND_POLYGONS.some((polygon) => pointInPolygon(jitteredLat, jitteredLon, polygon))) continue;
        landPoints.push(latLonToVector(jitteredLat, jitteredLon, 1.014));
        landSizes.push(0.95 + random() * 1.05);
      }
    }
    const landGeometry = makePointGeometry(landPoints, landSizes);
    const landMaterial = makePointMaterial(pixelRatio, 0.76);
    globe.add(new THREE.Points(landGeometry, landMaterial));

    const outlineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(readInk()),
      transparent: true,
      opacity: 0.44,
    });
    const outlineGeometries = COUNTRY_RINGS.map((ring) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(sampledOutline(ring, 1.018));
      globe.add(new THREE.Line(geometry, outlineMaterial));
      return geometry;
    });

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(readInk()),
      transparent: true,
      opacity: 0.13,
    });
    const orbitGeometries: THREE.BufferGeometry[] = [];
    const makeOrbit = (rotation: [number, number, number], scale: [number, number]) => {
      const curve = new THREE.EllipseCurve(0, 0, scale[0], scale[1], 0, Math.PI * 2);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(128));
      const orbit = new THREE.LineLoop(geometry, orbitMaterial);
      orbit.rotation.set(...rotation);
      orbitGroup.add(orbit);
      orbitGeometries.push(geometry);
    };
    makeOrbit([Math.PI / 2.45, 0.18, -0.18], [1.2, 0.8]);
    makeOrbit([Math.PI / 2, -0.46, 0.12], [1.13, 0.92]);

    const marker = new THREE.Group();
    marker.position.copy(latLonToVector(COLOMBIA[0], COLOMBIA[1], 1.035));
    globe.add(marker);
    const markerNormal = marker.position.clone().normalize();
    const markerGeometry = new THREE.SphereGeometry(0.019, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(readInk()) });
    marker.add(new THREE.Mesh(markerGeometry, markerMaterial));

    const ringGeometry = new THREE.RingGeometry(0.029, 0.035, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(readInk()),
      transparent: true,
      opacity: 0.46,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const markerRing = new THREE.Mesh(ringGeometry, ringMaterial);
    markerRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), markerNormal);
    markerRing.position.copy(markerNormal.clone().multiplyScalar(0.006));
    marker.add(markerRing);

    const themeMaterials = [gridMaterial, outlineMaterial, orbitMaterial, markerMaterial, ringMaterial];
    const applyInk = () => {
      const ink = new THREE.Color(readInk());
      (atmosphereMaterial.uniforms.uColor.value as THREE.Color).copy(ink);
      (landMaterial.uniforms.uColor.value as THREE.Color).copy(ink);
      themeMaterials.forEach((material) => material.color.copy(ink));
    };
    applyInk();
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

    const projected = new THREE.Vector3();
    const worldPosition = new THREE.Vector3();
    const updateLabel = () => {
      marker.getWorldPosition(worldPosition);
      projected.copy(worldPosition).project(camera);
      const width = root.clientWidth;
      const height = root.clientHeight;
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      label.style.transform = `translate3d(${(x + 12).toFixed(1)}px, ${(y - 10).toFixed(1)}px, 0)`;
      label.style.opacity = worldPosition.z > 0.05 ? "1" : "0";
    };

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      updateLabel();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    let frame = 0;
    let running = false;
    let inView = true;

    const render = (time: number) => {
      const reduced = reducedQuery.matches;
      const breathe = reduced ? 0 : Math.sin(time * 0.00022) * 0.022;
      globe.rotation.y += (AMERICAS_FOCUS + breathe + pointer.x * 0.035 - globe.rotation.y) * 0.045;
      globe.rotation.x += (-0.08 + pointer.y * 0.035 - globe.rotation.x) * 0.045;
      orbitGroup.rotation.z = reduced ? 0 : Math.sin(time * 0.00016) * 0.045;
      markerRing.scale.setScalar(reduced ? 1 : 1 + (Math.sin(time * 0.0032) + 1) * 0.09);
      ringMaterial.opacity = reduced ? 0.46 : 0.2 + (Math.sin(time * 0.0032) + 1) * 0.1;
      renderer.render(scene, camera);
      updateLabel();
      frame = requestAnimationFrame(render);
    };

    const syncLoop = () => {
      const shouldRun = inView && !document.hidden && !reducedQuery.matches;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(render);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
        renderer.render(scene, camera);
        updateLabel();
      }
    };
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncLoop();
    }, { threshold: 0.05 });
    viewObserver.observe(root);
    const onVisibility = () => syncLoop();
    const onReducedMotion = () => syncLoop();
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onReducedMotion);
    syncLoop();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedMotion);
      window.removeEventListener("pointermove", onPointerMove);
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      landGeometry.dispose();
      landMaterial.dispose();
      sphereGeometry.dispose();
      depthMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      outlineGeometries.forEach((geometry) => geometry.dispose());
      outlineMaterial.dispose();
      orbitGeometries.forEach((geometry) => geometry.dispose());
      orbitMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="mono-globe" aria-hidden="true">
      <canvas ref={canvasRef} className="mono-globe__canvas" />
      <span ref={labelRef} className="mono-globe__label">
        <i /> Bogotá · Colombia
      </span>
    </div>
  );
}
