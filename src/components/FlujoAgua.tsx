// FlujoAgua.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function FlujoAgua() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 600;

    // Scene & camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfefff); // cielo claro

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Controls (rotar con mouse)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controlsRef.current = controls;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfff5cc, 1.0);
    sunLight.position.set(8, 12, 6);
    scene.add(sunLight);

    // --- Terreno (planeado con ligeras ondulaciones) ---
    const terrainGeo = new THREE.PlaneGeometry(30, 18, 64, 64);
    // deformar vértices para crear montañas suaves
    for (let i = 0; i < (terrainGeo.attributes.position.count || 0); i++) {
      const x = terrainGeo.attributes.position.getX(i);
      const y = terrainGeo.attributes.position.getY(i);
      // simple ruido procedural
      const heightFactor =
        Math.sin(x * 0.4) * 0.2 + Math.cos(y * 0.3) * 0.15 + Math.random() * 0.02;
      terrainGeo.attributes.position.setZ(i, heightFactor - 1.2);
    }
    terrainGeo.computeVertexNormals();
    const terrainMat = new THREE.MeshLambertMaterial({ color: 0xb2df8a });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1.6;
    scene.add(terrain);

    // --- Montañas (conos) ---
    const mountainMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
    for (let i = 0; i < 4; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1 + Math.random() * 1.8, 3 + Math.random() * 2, 16), mountainMat);
      cone.position.set(-6 + i * 3.5, 0.3 + Math.random() * 0.6, -2 - Math.random() * 3);
      cone.rotation.y = Math.random() * Math.PI;
      scene.add(cone);
    }

    // --- Rio (simple banda azul curvada) ---
    const riverPathPoints: THREE.Vector3[] = [];
    for (let i = -8; i <= 8; i += 1) {
      const px = i;
      const py = -1.4 + Math.sin(i * 0.4) * 0.05;
      const pz = -4 + Math.cos(i * 0.1) * 0.5;
      riverPathPoints.push(new THREE.Vector3(px * 0.4, py, pz * 0.6));
    }
    // Crear río simple: una tira de planos (as a gradient would be nicer)
    const riverGeom = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < riverPathPoints.length - 1; i++) {
      const left = riverPathPoints[i].clone().add(new THREE.Vector3(0, 0, -0.8));
      const right = riverPathPoints[i].clone().add(new THREE.Vector3(0, 0, 0.8));
      positions.push(left.x, left.y, left.z);
      positions.push(right.x, right.y, right.z);
    }
    riverGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const riverMat = new THREE.MeshBasicMaterial({ color: 0x0288d1, side: THREE.DoubleSide });
    const riverMesh = new THREE.Mesh(riverGeom, riverMat);
    riverMesh.rotation.x = 0;
    scene.add(riverMesh);

    // --- Cuerpo de agua (laguna / mar) ---
    const lakeGeo = new THREE.CircleGeometry(2.2, 32);
    const lakeMat = new THREE.MeshPhongMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.9 });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(6, -1.55, 2);
    scene.add(lake);

    // --- Nubes (suma de esferas) ---
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for (let c = 0; c < 5; c++) {
      const cloud = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const sph = new THREE.Mesh(new THREE.SphereGeometry(0.6 + Math.random() * 0.4, 12, 12), cloudMat);
        sph.position.set(Math.random() * 0.8, Math.random() * 0.3, Math.random() * 0.4);
        cloud.add(sph);
      }
      cloud.position.set(-6 + c * 3, 3 + Math.random() * 0.5, -2 + Math.random() * 2);
      cloud.scale.setScalar(0.9 + Math.random() * 0.5);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // --- Lluvia (Points que caen) ---
    const rainCount = 120;
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 10; // x
      rainPositions[i * 3 + 1] = Math.random() * 4 + 0.5; // y
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x4fc3f7, size: 0.06 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    // --- Sol (esfera emisora y glow simulado por luz direccional) ---
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), new THREE.MeshBasicMaterial({ color: 0xfff176 }));
    sun.position.set(8, 8, -3);
    scene.add(sun);

    // Animación
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Controls update
      controls.update();

      // mover nubes lentamente
      cloudGroup.children.forEach((c, i) => {
        c.position.x += 0.008 + i * 0.0005;
        if (c.position.x > 12) c.position.x = -12;
      });

      // lluvia: bajar y resetear
      const pos = rainGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < rainCount; i++) {
        let y = pos.getY(i);
        y -= 8 * dt * (0.3 + Math.random() * 0.6);
        if (y < -2) y = Math.random() * 4 + 2;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      // pequeño brillo en el lago (animación simple)
      lake.material.opacity = 0.75 + Math.sin(clock.elapsedTime * 1.5) * 0.1;

      renderer.render(scene, camera);
    };

    // start animation loop conditionally
    if (running) animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      // remove canvas
      if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
    // we intentionally want to re-run effect when 'running' changes: start/stop loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // toggle animation running state
  const toggleRunning = () => setRunning((r) => !r);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full h-[68vh] rounded-xl overflow-hidden border-2 border-sky-300" ref={mountRef} data-testid="three-mount" />
      <div className="flex gap-3 mt-3">
        <button
          onClick={toggleRunning}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
          data-testid="toggle-button"
        >
          {running ? "Detener Animación" : "Reanudar Animación"}
        </button>
        <p className="self-center text-slate-700">Arrastra para rotar — usa rueda para acercar/alejar</p>
      </div>
    </div>
  );
}
