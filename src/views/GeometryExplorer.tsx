import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function GeometryExplorer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [, setScene] = useState<THREE.Scene | null>(null);
  const [cube, setCube] = useState<THREE.Mesh | null>(null);
  const [, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [rotation, setRotation] = useState(false);

  // Inicialización de la escena
  useEffect(() => {
    if (!mountRef.current) return;

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x20232a);

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.innerHTML = ""; // Limpia el contenedor
    mountRef.current.appendChild(renderer.domElement);

    // Geometría inicial
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x007bff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Luces
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // Guardar referencias
    setScene(scene);
    setCube(cube);
    setRenderer(renderer);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      if (rotation && cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [rotation]);

  // Cambiar color
  const changeColor = () => {
    if (cube) {
      (cube.material as THREE.MeshStandardMaterial).color.set(
        Math.random() * 0xffffff
      );
    }
  };

  // Escalar objeto
  const scaleUp = () => {
    if (cube) cube.scale.multiplyScalar(1.2);
  };

  const scaleDown = () => {
    if (cube) cube.scale.multiplyScalar(0.8);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-600 text-white">
      <h1 className="text-2xl font-bold p-4">Explorador de Geometría 3D</h1>

      {/* Contenedor Three.js */}
      <div
        ref={mountRef}
        className="w-3/4 h-3/4 border-2 border-gray-700 rounded-lg shadow-lg"
      />

      {/* Controles */}
      <div className="flex gap-4 p-4">
        <button
          onClick={() => setRotation(!rotation)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {rotation ? "Detener Rotación" : "Iniciar Rotación"}
        </button>
        <button
          onClick={changeColor}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          Cambiar Color
        </button>
        <button
          onClick={scaleUp}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
        >
          Aumentar Tamaño
        </button>
        <button
          onClick={scaleDown}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Disminuir Tamaño
        </button>
      </div>
    </div>
  );
}
