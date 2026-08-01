"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import * as THREE from "three";

export function SignalCursorField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 6.8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    scene.add(group);

    const accent = new THREE.Color(0xff6a3d);
    const soft = new THREE.Color(0xaaa9a2);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.72,
      wireframe: true,
    });
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: soft,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const particlesMaterial = new THREE.PointsMaterial({
      color: accent,
      size: 0.026,
      transparent: true,
      opacity: 0.52,
      sizeAttenuation: true,
    });

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.45, 0.22, 150, 16, 2, 3), torusMaterial);
    torus.rotation.x = 0.7;
    group.add(torus);

    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 2), shellMaterial);
    shell.rotation.z = 0.35;
    group.add(shell);

    const particlePositions = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i += 1) {
      const radius = 2.5 + ((i * 47) % 31) / 80;
      const angle = i * 2.399963;
      const y = 1 - (i / 239) * 2;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      particlePositions[i * 3] = Math.cos(angle) * radial * radius;
      particlePositions[i * 3 + 1] = y * radius;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radial * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, particlesMaterial);
    group.add(particles);

    let frame = 0;
    let lastTime = 0;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      group.rotation.y += (pointerRef.current.x * 0.45 - group.rotation.y) * 0.045;
      group.rotation.x += (-pointerRef.current.y * 0.28 - group.rotation.x) * 0.045;
      torus.rotation.z += delta * 0.12;
      shell.rotation.y -= delta * 0.055;
      particles.rotation.y += delta * 0.02;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    if (reduced) {
      renderer.render(scene, camera);
    } else {
      frame = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      particleGeometry.dispose();
      particlesMaterial.dispose();
      torus.geometry.dispose();
      torusMaterial.dispose();
      shell.geometry.dispose();
      shellMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerRef.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  }

  function onPointerLeave() {
    pointerRef.current = { x: 0, y: 0 };
  }

  return (
    <div
      ref={rootRef}
      className="signal-field"
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <canvas ref={canvasRef} className="signal-field__canvas" />
      <div className="signal-field__code">
        <div className="signal-field__bar">
          <span>prototype.tsx</span>
          <span>ready</span>
        </div>
        <pre>
          <code>
            <span className="code-muted">01</span> {`const insight = await research();`} {"\n"}
            <span className="code-muted">02</span> {`const flow = shape(insight);`} {"\n"}
            <span className="code-accent">03</span> {`ship(<Product intent={flow} />);`}
          </code>
        </pre>
        <div className="signal-field__status">
          <span>Design</span>
          <span>Code</span>
          <span>Validate</span>
        </div>
      </div>
    </div>
  );
}
