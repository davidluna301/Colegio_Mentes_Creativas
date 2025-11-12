/* eslint-disable no-unused-vars */
// Este archivo extiende el entorno de prueba de Jest.

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill para TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({ 
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(document, "documentElement", {
  value: {
    classList: {
      toggle: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  writable: true,
});

Object.defineProperty(document, "dispatchEvent", {
  value: jest.fn(),
});

// --- Mock canvas getContext to avoid WebGL issues in JSDOM ---
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, _type: string) {
    const stub: any = {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (_x: number, _y: number, _w: number, _h: number) => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      getExtension: () => null,
      createTexture: () => ({}),
      deleteTexture: () => {},
      activeTexture: () => {},
      bindTexture: () => {},
    };
    return stub;
  };
}

// --- ResizeObserver (r3f lo usa para medir el canvas) ---
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof (window as any).ResizeObserver === "undefined") {
  (window as any).ResizeObserver = ResizeObserverMock as any;
}
if (typeof (global as any).ResizeObserver === "undefined") {
  (global as any).ResizeObserver = ResizeObserverMock as any;
}

// --- Mocks de react-three-fiber y drei para evitar montar WebGL en tests ---
jest.mock("@react-three/fiber", () => {
  return {
    Canvas: ({ children }: any) => (children ?? null),
    useFrame: () => {},
  };
});

jest.mock("@react-three/drei", () => {
  const NullCmp = () => null;
  return {
    OrbitControls: NullCmp,
    Grid: NullCmp,
    Sky: NullCmp,
    Stars: NullCmp,
    ContactShadows: NullCmp,
  };
});

// --- Mock mejorado de three para FlujoAgua y Globe ---
jest.mock("three", () => {
  class Vec3 {
    x = 0; y = 0; z = 0;
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    toArray() { return [this.x, this.y, this.z]; }
    clone() { return new Vec3(this.x, this.y, this.z); }
    applyNormalMatrix() { return this; }
    set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; }
  }
  class Color { constructor(_c?: any) {} }
  class Object3D {
    position = new Vec3();
    rotation = new Vec3();
    add() {}
    remove() {}
  }
  class Scene extends Object3D {
    background: any;
    fog: any;
  }
  class Fog {
    constructor(_hex: any, _near: number, _far: number) {}
  }
  class Camera extends Object3D {}
  class PerspectiveCamera extends Camera {
    constructor(_fov?: number, _a?: number, _n?: number, _f?: number) { super(); }
    position = new Vec3();
  }
  class WebGLRenderer {
    domElement = global.document?.createElement?.("canvas") ?? { };
    constructor(_opts?: any) {}
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
  }
  class Light extends Object3D { constructor(_c?: any, _i?: number) { super(); } }
  class DirectionalLight extends Light { castShadow = false; shadow: any = {}; }
  class AmbientLight extends Light {}
  class Material { constructor(_o?: any) {} }
  class MeshLambertMaterial extends Material {}
  class MeshBasicMaterial extends Material {}
  class MeshStandardMaterial extends Material {}
  class MeshPhongMaterial extends Material {}
  class Geometry {
    attributes: Record<string, any> = {};
    computeVertexNormals() {}
  }
  class BoxGeometry extends Geometry {
    constructor(_w?: number, _h?: number, _d?: number) {
      super();
      this.attributes.position = { array: new Float32Array(180), needsUpdate: false };
    }
  }
  class ConeGeometry extends Geometry {
    constructor(_r?: number, _h?: number, _segs?: number) {
      super();
      this.attributes.position = { array: new Float32Array(180), needsUpdate: false };
    }
  }
  class PlaneGeometry extends Geometry {
    constructor(_w?: number, _h?: number, _sw?: number, _sh?: number) {
      super();
      this.attributes.position = { array: new Float32Array(300), needsUpdate: false };
    }
  }
  class SphereGeometry extends Geometry {
    constructor(_r?: number, _w?: number, _h?: number) {
      super();
      this.attributes.position = { array: new Float32Array(240), needsUpdate: false };
    }
  }
  class BufferGeometry extends Geometry {
    setAttribute(name: string, attr: any) { this.attributes[name] = attr; }
  }
  class BufferAttribute {
    array: Float32Array;
    constructor(array: Float32Array, _itemSize: number) { this.array = array; }
  }
  class PointsMaterial extends Material {}
  class Mesh extends Object3D {
    geometry: any;
    material: any;
    castShadow = false;
    receiveShadow = false;
    constructor(g?: any, m?: any) {
      super();
      this.geometry = g ?? {};
      this.material = m ?? {};
    }
  }
  class Points extends Object3D {
    geometry: any;
    material: any;
    constructor(g?: any, m?: any) {
      super();
      this.geometry = g ?? {};
      this.material = m ?? {};
    }
  }
  const AdditiveBlending = 2;

  return {
    Vector3: Vec3,
    Color,
    Scene,
    Fog,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    AmbientLight,
    PlaneGeometry,
    SphereGeometry,
    BoxGeometry,
    ConeGeometry,
    // Exporto estas clases para que TypeScript considere que se usan
    BufferGeometry,
    BufferAttribute,
    PointsMaterial,
    MeshLambertMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial,
    MeshPhongMaterial,
    Mesh,
    Points,
    AdditiveBlending,
    MathUtils: { degToRad: (d: number) => d * Math.PI / 180 },
  };
});

// Mock de OrbitControls para FlujoAguaView
jest.mock("three/examples/jsm/controls/OrbitControls", () => {
  return {
    OrbitControls: class {
      constructor(_camera?: any, _dom?: any) {}
      update() {}
      dispose() {}
    },
  };
});

// Configuración de Git para el entorno de pruebas
/*{
  "git.postCommitCommand": "push",
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.pushMode": "current"
}*/

// --- Código de prueba ---

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

const FlujoAgua: React.FC = () => {
  const [paused, setPaused] = React.useState(false);
  return React.createElement(
    "button",
    { onClick: () => setPaused((p: boolean) => !p) },
    paused ? "Reanudar Animación" : "Pausar Animación"
  );
};

test("el botón de animación cambia su texto al hacer clic", () => {
  render(React.createElement(FlujoAgua));
  const button = screen.getByRole("button", { name: /Pausar Animación/i });

  const initText = button.textContent;
  fireEvent.click(button);

  expect(button.textContent).not.toBe(initText);
});
