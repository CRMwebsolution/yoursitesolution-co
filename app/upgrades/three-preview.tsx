"use client";

import { useEffect, useRef } from "react";

type ThreeLib = {
  Scene: new () => {
    add: (object: unknown) => void;
  };
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => {
    position: { z: number };
    aspect: number;
    updateProjectionMatrix: () => void;
  };
  WebGLRenderer: new (params: {
    antialias: boolean;
    alpha: boolean;
  }) => {
    setPixelRatio: (value: number) => void;
    setSize: (width: number, height: number) => void;
    setClearColor: (color: number, alpha: number) => void;
    render: (scene: unknown, camera: unknown) => void;
    dispose: () => void;
    domElement: HTMLCanvasElement;
  };
  BoxGeometry: new (w: number, h: number, d: number) => unknown;
  MeshStandardMaterial: new (params: {
    color: number;
    metalness: number;
    roughness: number;
  }) => unknown;
  Mesh: new (
    geometry: unknown,
    material: unknown,
  ) => {
    rotation: { x: number; y: number };
  };
  AmbientLight: new (color: number, intensity: number) => unknown;
  DirectionalLight: new (
    color: number,
    intensity: number,
  ) => {
    position: { set: (x: number, y: number, z: number) => void };
  };
};

function loadThree(): Promise<ThreeLib> {
  const existing = (window as Window & { THREE?: ThreeLib }).THREE;
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.async = true;
    script.onload = () => {
      const lib = (window as Window & { THREE?: ThreeLib }).THREE;
      if (!lib) reject(new Error("Three.js failed to load"));
      else resolve(lib);
    };
    script.onerror = () => reject(new Error("Three.js script error"));
    document.head.appendChild(script);
  });
}

export function ThreePreview() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;

    loadThree()
      .then((THREE) => {
        if (disposed || !mountRef.current) return;

        const width = mount.clientWidth || 320;
        const height = mount.clientHeight || 260;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 20);
        camera.position.z = 2.4;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
          color: 0xc47a4a,
          metalness: 0.2,
          roughness: 0.35,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        scene.add(new THREE.AmbientLight(0xf4efe6, 0.7));
        const key = new THREE.DirectionalLight(0xffffff, 1.1);
        key.position.set(2, 3, 4);
        scene.add(key);

        const tick = (time: number) => {
          mesh.rotation.x = time / 2400;
          mesh.rotation.y = time / 1600;
          renderer.render(scene, camera);
          frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);

        const resize = () => {
          if (!mountRef.current) return;
          const nextWidth = mountRef.current.clientWidth || width;
          const nextHeight = mountRef.current.clientHeight || height;
          camera.aspect = nextWidth / nextHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(nextWidth, nextHeight);
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        return () => {
          window.cancelAnimationFrame(frame);
          resizeObserver?.disconnect();
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        };
      })
      .then((cleanup) => {
        if (disposed) cleanup?.();
        else {
          const previous = () => undefined;
          void previous;
          (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = cleanup;
        }
      })
      .catch(() => {
        if (mount && !mount.textContent) {
          mount.textContent = "3D preview needs WebGL in this browser.";
        }
      });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      const cleanup = (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-preview"
      role="img"
      aria-label="Live Three.js preview of a rotating copper cube"
    />
  );
}
