"use client";

import { useEffect, useRef } from "react";

type Vec3 = { set: (x: number, y: number, z: number) => void };

type MeshObj = {
  rotation: { x: number; y: number; z: number };
  position: Vec3;
};

type CanvasTex = {
  colorSpace?: unknown;
  anisotropy: number;
  needsUpdate: boolean;
  dispose: () => void;
};

type ThreeLib = {
  Scene: new () => { add: (object: unknown) => void };
  Group: new () => {
    add: (object: unknown) => void;
    rotation: { x: number; y: number; z: number };
  };
  PerspectiveCamera: new (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => {
    position: { z: number; y: number };
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
  BoxGeometry: new (w: number, h: number, d: number) => { dispose: () => void };
  PlaneGeometry: new (w: number, h: number) => { dispose: () => void };
  MeshStandardMaterial: new (params: Record<string, unknown>) => {
    dispose: () => void;
  };
  Mesh: new (geometry: unknown, material: unknown) => MeshObj;
  CanvasTexture: new (canvas: HTMLCanvasElement) => CanvasTex;
  SRGBColorSpace?: unknown;
  AmbientLight: new (color: number, intensity: number) => unknown;
  HemisphereLight: new (
    sky: number,
    ground: number,
    intensity: number,
  ) => unknown;
  DirectionalLight: new (color: number, intensity: number) => {
    position: Vec3;
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

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paintPlateBase(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#16382c";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = "#1f4a3a";
  roundedRect(ctx, 36, 36, 952, 952, 160);
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 92, 38, 0.35)";
  ctx.lineWidth = 10;
  roundedRect(ctx, 70, 70, 884, 884, 140);
  ctx.stroke();
}

function makePlateFace() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  paintPlateBase(ctx);
  ctx.fillStyle = "#c45c26";
  ctx.font = "700 430px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "-18px";
  ctx.fillText("YS", 512, 560);
  return canvas;
}

function makeNameFace() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  paintPlateBase(ctx);
  ctx.fillStyle = "#f4efe6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "2px";
  ctx.font = "600 92px Georgia, 'Times New Roman', serif";
  ctx.fillText("YOUR SITE", 512, 430);
  ctx.fillText("SOLUTION", 512, 560);
  ctx.fillStyle = "rgba(196, 92, 38, 0.9)";
  ctx.fillRect(362, 630, 300, 4);
  return canvas;
}

function makeEdgeFace() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, "#16382c");
  grad.addColorStop(0.45, "#1f4a3a");
  grad.addColorStop(0.7, "#c45c26");
  grad.addColorStop(1, "#16382c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}

export function ThreePreview() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;
    const listeners: Array<[string, EventListener]> = [];

    const on = (type: string, handler: EventListener) => {
      mount.addEventListener(type, handler, { passive: false });
      listeners.push([type, handler]);
    };

    loadThree()
      .then((THREE) => {
        if (disposed || !mountRef.current) return;

        const width = mount.clientWidth || 320;
        const height = mount.clientHeight || 260;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 20);
        camera.position.z = 3.1;
        camera.position.y = 0.12;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const prepareMap = (canvas: HTMLCanvasElement) => {
          const map = new THREE.CanvasTexture(canvas);
          if (THREE.SRGBColorSpace) map.colorSpace = THREE.SRGBColorSpace;
          map.anisotropy = 8;
          map.needsUpdate = true;
          return map;
        };

        const faceMap = prepareMap(makePlateFace());
        const nameMap = prepareMap(makeNameFace());
        const edgeMap = prepareMap(makeEdgeFace());

        const faceMat = new THREE.MeshStandardMaterial({
          map: faceMap,
          roughness: 0.32,
          metalness: 0.18,
        });
        const nameMat = new THREE.MeshStandardMaterial({
          map: nameMap,
          roughness: 0.32,
          metalness: 0.18,
        });
        const edgeMat = new THREE.MeshStandardMaterial({
          map: edgeMap,
          roughness: 0.28,
          metalness: 0.35,
        });

        const plateGeo = new THREE.BoxGeometry(1.7, 1.7, 0.22);
        const labelGeo = new THREE.PlaneGeometry(1.7, 1.7);
        const plate = new THREE.Mesh(plateGeo, edgeMat);

        const front = new THREE.Mesh(labelGeo, faceMat);
        front.position.set(0, 0, 0.112);

        const back = new THREE.Mesh(labelGeo, nameMat);
        back.position.set(0, 0, -0.112);
        back.rotation.y = Math.PI;

        const group = new THREE.Group();
        group.add(plate);
        group.add(front);
        group.add(back);
        scene.add(group);

        scene.add(new THREE.HemisphereLight(0xf4efe6, 0x1a1c19, 1.05));
        scene.add(new THREE.AmbientLight(0xf4efe6, 0.25));
        const key = new THREE.DirectionalLight(0xffe4c4, 1.35);
        key.position.set(2.2, 2.4, 3.2);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xc45c26, 0.45);
        rim.position.set(-2.4, -0.6, 1.2);
        scene.add(rim);

        let rotX = 0.18;
        let rotY = -0.35;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let lastMove = 0;

        const tick = () => {
          if (!dragging && performance.now() - lastMove > 400) {
            rotY += 0.007;
          }
          group.rotation.x = rotX;
          group.rotation.y = rotY;
          renderer.render(scene, camera);
          frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);

        const pointerPos = (event: Event) => {
          const e = event as PointerEvent;
          return { x: e.clientX, y: e.clientY };
        };

        const onDown = (event: Event) => {
          event.preventDefault();
          const { x, y } = pointerPos(event);
          dragging = true;
          lastX = x;
          lastY = y;
          lastMove = performance.now();
          mount.classList.add("is-dragging");
          try {
            mount.setPointerCapture((event as PointerEvent).pointerId);
          } catch {
            /* older browsers */
          }
        };

        const onMove = (event: Event) => {
          if (!dragging) return;
          event.preventDefault();
          const { x, y } = pointerPos(event);
          rotY += (x - lastX) * 0.01;
          rotX += (y - lastY) * 0.01;
          rotX = Math.max(-0.7, Math.min(0.7, rotX));
          lastX = x;
          lastY = y;
          lastMove = performance.now();
        };

        const onUp = () => {
          dragging = false;
          mount.classList.remove("is-dragging");
        };

        on("pointerdown", onDown);
        on("pointermove", onMove);
        on("pointerup", onUp);
        on("pointercancel", onUp);
        on("pointerleave", onUp);

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
          listeners.forEach(([type, handler]) => mount.removeEventListener(type, handler));
          faceMap.dispose();
          nameMap.dispose();
          edgeMap.dispose();
          faceMat.dispose();
          nameMat.dispose();
          edgeMat.dispose();
          plateGeo.dispose();
          labelGeo.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        };
      })
      .then((cleanup) => {
        if (disposed) cleanup?.();
        else {
          (mount as HTMLDivElement & { __cleanup?: () => void }).__cleanup = cleanup;
        }
      })
      .catch(() => {
        if (mount && !mount.querySelector("canvas")) {
          mount.append("3D preview needs WebGL in this browser.");
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
      role="application"
      aria-label="Interactive Three.js plate with YS on one side and Your Site Solution on the other. Drag to rotate."
      tabIndex={0}
    >
      <p className="three-hint">Drag to turn</p>
    </div>
  );
}
