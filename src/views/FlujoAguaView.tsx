import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Props {
  paused: boolean;
}

export default function FlujoAguaview({ paused }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#bde7ff");

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      500
    );
    camera.position.set(10, 10, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(100, 200, 100);
    scene.add(light);

    const terrain = new THREE.Mesh(
      new THREE.BoxGeometry(30, 2, 20),
      new THREE.MeshStandardMaterial({ color: "#7cc271" })
    );
    terrain.position.y = -1;
    scene.add(terrain);

    const ocean = new THREE.Mesh(
      new THREE.BoxGeometry(12, 1.5, 12),
      new THREE.MeshStandardMaterial({
        color: "#3ba5ff",
        transparent: true,
        opacity: 0.8,
      })
    );
    ocean.position.set(-8, -0.6, 0);
    scene.add(ocean);

    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(4, 7, 4),
      new THREE.MeshStandardMaterial({ color: "#8b8b8b" })
    );
    mountain.position.set(10, 2, 2);
    scene.add(mountain);

    const snow = new THREE.Mesh(
      new THREE.ConeGeometry(4, 3, 4),
      new THREE.MeshStandardMaterial({ color: "white" })
    );
    snow.position.set(10, 5, 2);
    scene.add(snow);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({ color: "#ffd900" })
    );
    sun.position.set(-5, 9, -5);
    scene.add(sun);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      transparent: true,
      opacity: 0.8,
    });
    const makeCloud = (x: number, y: number, z: number): THREE.Mesh => {
      const cloud = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), cloudMaterial);
      cloud.position.set(x, y, z);
      scene.add(cloud);
      return cloud;
    };
    const clouds = [makeCloud(5, 8, 0), makeCloud(7, 8, 2), makeCloud(6, 8, -2)];

    const rainGeo = new THREE.BufferGeometry();
    const rainCount = 300;
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = 9 + Math.random() * 2;
      rainPositions[i + 1] = 6 + Math.random() * 2;
      rainPositions[i + 2] = Math.random() * 4 - 2;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    const rain = new THREE.Points(
      rainGeo,
      new THREE.PointsMaterial({ color: "#4fa3dd", size: 0.1 })
    );
    scene.add(rain);

    const animate = () => {
      requestAnimationFrame(animate);
      if (!paused) {
        const pos = rainGeo.attributes.position;
        for (let i = 0; i < rainCount; i++) {
          pos.array[i * 3 + 1] -= 0.1;
          if (pos.array[i * 3 + 1] < 0) pos.array[i * 3 + 1] = 7;
        }
        sun.rotation.y += 0.003;
        clouds.forEach((c) => (c.position.x -= 0.01));
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [paused]);

  return (
    <div
      ref={mountRef}
      role="region"
      className="w-full h-full rounded-xl border-2 border-blue-600 shadow-lg"
    />
  );
}
