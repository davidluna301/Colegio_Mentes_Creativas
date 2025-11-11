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
// Provides a minimal stub so libraries trying to access 2D/3D contexts
// won't throw in the test environment.
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, _type: string) {
    // Return a very small stub object that includes commonly-used functions.
    // Tests / libs just need it to exist — it doesn't need to perform drawing.
    const stub: any = {
      // 2D canvas ops
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
      // WebGL related placeholders (some libs check existence)
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
    Canvas: () => null,
    useFrame: () => {},
    // Exporta tipos en build real; en tests no son necesarios
  };
});

jest.mock("@react-three/drei", () => {
  return {
    OrbitControls: () => null,
    Grid: () => null,
  };
});

// --- Mock ligero de three para FlujoAgua (evita WebGLRenderer real) ---
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
  class Scene extends Object3D {}
  class Camera extends Object3D {}
  class PerspectiveCamera extends Camera {
    constructor(_fov?: number, _a?: number, _n?: number, _f?: number) { super(); }
  }
  class WebGLRenderer {
    domElement = global.document?.createElement?.("canvas") ?? { };
    constructor(_opts?: any) {}
    setSize() {}
    render() {}
    dispose() {}
  }
  class Light extends Object3D { constructor(_c?: any, _i?: number) { super(); } }
  class DirectionalLight extends Light {}
  class AmbientLight extends Light {}
  class Material { constructor(_o?: any) {} }
  class MeshLambertMaterial extends Material {}
  class MeshBasicMaterial extends Material {}
  class MeshStandardMaterial extends Material {}
  class Geometry {}
  class PlaneGeometry extends Geometry { constructor(_w?: number, _h?: number, _sw?: number, _sh?: number) { super(); } }
  class SphereGeometry extends Geometry { constructor(_r?: number, _w?: number, _h?: number) { super(); } }
  class BufferGeometry extends Geometry {
    attributes: Record<string, any> = {};
    setAttribute(name: string, attr: any) { this.attributes[name] = attr; }
  }
  class BufferAttribute {
    array: Float32Array;
    constructor(array: Float32Array, _itemSize: number) { this.array = array; }
  }
  class PointsMaterial extends Material {}
  class Mesh extends Object3D {
    constructor(_g?: any, _m?: any) { super(); }
  }
  class Points extends Object3D {
    constructor(_g?: any, _m?: any) { super(); }
  }

  return {
    // Clases expuestas
    Vector3: Vec3,
    Color,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    AmbientLight,
    PlaneGeometry,
    SphereGeometry,
    MeshLambertMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Mesh,
    BufferGeometry,
    BufferAttribute,
    PointsMaterial,
    Points,
    // Constantes típicas (si alguna lib las consulta)
    MathUtils: { degToRad: (d: number) => d * Math.PI / 180 },
  };
});

// Configuración de Git para el entorno de pruebas
/*{
  "git.postCommitCommand": "push",
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.pushMode": "current"
}*/