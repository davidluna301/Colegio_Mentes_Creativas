import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function FlujoAgua() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Escena y cámara
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaee1f9); // azul cielo
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 8);

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Terreno
    const terrainGeometry = new THREE.PlaneGeometry(12, 6, 32, 32);
    const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0xb2df8a });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2.2;
    terrain.position.y = -1.8;
    scene.add(terrain);

    // Sol ☀️
    const sunGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfff176 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(4, 3, -2);
    scene.add(sun);

    // Nubes ☁️
    const clouds: THREE.Mesh[] = [];
    const cloudGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = 0; i < 3; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(-3 + i * 3, 2.5 + Math.random(), -1);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // Gotas 💧
    const dropGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const dropMaterial = new THREE.MeshStandardMaterial({ color: 0x4fc3f7 });
    const drops: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const drop = new THREE.Mesh(dropGeometry, dropMaterial);
      drop.position.set(
        -2 + Math.random() * 4,
        -1 + Math.random() * 3,
        Math.random() - 0.5
      );
      scene.add(drop);
      drops.push(drop);
    }

    // Flujo superficial (agua regresando)
    const flowGeometry = new THREE.BufferGeometry();
    const flowMaterial = new THREE.PointsMaterial({ color: 0x0288d1, size: 0.05 });
    const flowPositions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      flowPositions[i * 3] = -3 + (i / 100) * 6;
      flowPositions[i * 3 + 1] = -1.7 + Math.sin(i / 10) * 0.1;
      flowPositions[i * 3 + 2] = 0;
    }
    flowGeometry.setAttribute("position", new THREE.BufferAttribute(flowPositions, 3));
    const flow = new THREE.Points(flowGeometry, flowMaterial);
    scene.add(flow);

    // Animación
    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      if (rotation) {
        // Movimiento nubes
        clouds.forEach((c) => {
          c.position.x += 0.01;
          if (c.position.x > 4) c.position.x = -4;
        });

        // Movimiento gotas (evaporación + lluvia)
        drops.forEach((d, i) => {
          if (i % 2 === 0) {
            d.position.y += 0.03;
            if (d.position.y > 2.5) d.position.y = -1.5;
          } else {
            d.position.y -= 0.04;
            if (d.position.y < -1.5) d.position.y = 2.5;
          }
        });

        // Movimiento del flujo
        const positions = flowGeometry.attributes.position.array as Float32Array;
        t += 0.02;
        for (let i = 0; i < 100; i++) {
          positions[i * 3 + 1] = -1.7 + Math.sin(i / 10 + t) * 0.05;
        }
        flowGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [rotation]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#e1f5fe] text-[#004d61]">
      <h1 className="text-3xl font-bold p-4">Ciclo del Agua Interactivo 🌎</h1>

      <div
        ref={mountRef}
        className="w-4/5 h-3/4 border-4 border-[#4fc3f7] rounded-2xl shadow-lg"
      />

      <div className="flex gap-4 p-4">
        <button
          onClick={() => setRotation(!rotation)}
          className="px-4 py-2 bg-[#81d4fa] hover:bg-[#4fc3f7] text-[#004d61] font-semibold rounded-lg shadow-md"
        >
          {rotation ? "Detener Animación" : "Reanudar Ciclo"}
        </button>
      </div>
    </div>
  );
}
