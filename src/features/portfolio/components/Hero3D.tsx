"use client";
import { useEffect, useRef } from "react";
import { styles } from "@/shared/ui";

const PARTICLES = 600;
const ROTATION_SPEED = 0.0025;

/**
 * Lightweight Three.js backdrop: a wireframe icosahedron + drifting particles.
 * Loaded on the client only (dynamic import), honours prefers-reduced-motion, cleans up on unmount.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let dispose = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2563eb";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.z = 6;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);

      const solid = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.8, 1),
        new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.35 }),
      );
      scene.add(solid);

      const positions = new Float32Array(PARTICLES * 3);
      for (let i = 0; i < PARTICLES * 3; i++) positions[i] = (Math.random() - 0.5) * 14;
      const points = new THREE.Points(
        new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(positions, 3)),
        new THREE.PointsMaterial({ color: accent, size: 0.035, transparent: true, opacity: 0.6 }),
      );
      scene.add(points);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        solid.position.x = w > 640 ? 2.2 : 0;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let raf = 0;
      let mouseX = 0;
      const onMove = (e: PointerEvent) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6; };
      window.addEventListener("pointermove", onMove);

      const frame = () => {
        solid.rotation.y += ROTATION_SPEED;
        solid.rotation.x += ROTATION_SPEED * 0.4;
        solid.rotation.z += (mouseX - solid.rotation.z) * 0.02;
        points.rotation.y -= ROTATION_SPEED * 0.3;
        renderer.render(scene, camera);
        if (!reduce) raf = requestAnimationFrame(frame);
      };
      frame();

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        solid.geometry.dispose();
        (solid.material as InstanceType<typeof THREE.Material>).dispose();
        points.geometry.dispose();
        (points.material as InstanceType<typeof THREE.Material>).dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { cancelled = true; dispose(); };
  }, []);

  return <div ref={ref} className={styles.hero3d.canvas} aria-hidden />;
}
