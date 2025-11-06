import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function FlujoAgua() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [rotation, setRotation] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Escena y cámara
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb3e5fc); // Azul pastel
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    setRenderer(renderer);

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 🌊 Mar
    const waterGeometry = new THREE.PlaneGeometry(10, 10, 10);
    const waterMaterial = new THREE.MeshPhongMaterial({
      color: 0x81d4fa,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    scene.add(water);

    // ☁️ Nubes
    const cloudGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const clouds: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(i - 2, 2 + Math.random(), -1);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // 💧 Gotas
    const dropGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    const dropMaterial = new THREE.MeshStandardMaterial({ color: 0x4fc3f7 });
    const drops: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i++) {
      const drop = new THREE.Mesh(dropGeometry, dropMaterial);
      drop.position.set((Math.random() - 0.5) * 3, Math.random() * 2 + 1, 0);
      scene.add(drop);
      drops.push(drop);
    }

    // 🌞 Sol
    const sunGeometry = new THREE.SphereGeometry(0.6, 24, 24);
    const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xfff176 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-3, 3, -2);
    scene.add(sun);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      if (rotation) {
        clouds.forEach((c) => (c.position.x += 0.005));
        if (clouds[0].position.x > 3) {
          clouds.forEach((c) => (c.position.x = -3));
        }

        drops.forEach((d) => {
          d.position.y -= 0.05;
          if (d.position.y < -1.5) d.position.y = Math.random() * 2 + 1;
        });
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#d0f0f6] text-[#004d61]">
      <h1 className="text-3xl font-bold p-4">Ciclo del Agua 🌧️</h1>

      <div
        ref={mountRef}
        className="w-3/4 h-3/4 border-4 border-[#81d4fa] rounded-2xl shadow-lg"
      />

      <div className="flex gap-4 p-4">
        <button
          onClick={() => setRotation(!rotation)}
          className="px-4 py-2 bg-[#aed581] hover:bg-[#9ccc65] rounded-lg font-semibold"
        >
          {rotation ? "Detener Animación" : "Iniciar Animación"}
        </button>
      </div>
    </div>
  );
}
