import { useEffect, useRef } from "react";
import * as THREE from "three";
import React, { useMemo } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Props {
  paused: boolean;
}

export default function FlujoAguaview({ paused }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Basic scene
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

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    // LIGHT
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(100, 200, 100);
    scene.add(light);

    // Terrain
    const terrainGeo = new THREE.BoxGeometry(30, 2, 20);
    const terrainMat = new THREE.MeshStandardMaterial({ color: "#7cc271" });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -1;
    scene.add(terrain);

    // Ocean
    const oceanGeo = new THREE.BoxGeometry(12, 1.5, 12);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: "#3ba5ff",
      transparent: true,
      opacity: 0.8,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(-8, -0.6, 0);
    scene.add(ocean);

    // Mountain
    const mountainGeo = new THREE.ConeGeometry(4, 7, 4);
    const mountainMat = new THREE.MeshStandardMaterial({ color: "#8b8b8b" });
    const mountain = new THREE.Mesh(mountainGeo, mountainMat);
    mountain.position.set(10, 2, 2);
    scene.add(mountain);

    // Snow
    const snowGeo = new THREE.ConeGeometry(4, 3, 4);
    const snowMat = new THREE.MeshStandardMaterial({ color: "white" });
    const snow = new THREE.Mesh(snowGeo, snowMat);
    snow.position.set(10, 5, 2);
    scene.add(snow);

    // Sun
    const sunGeo = new THREE.SphereGeometry(2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: "#ffd900" });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(-5, 9, -5);
    scene.add(sun);

    // Clouds
    const cloudMat = useMemo(
  () =>
    new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      transparent: true,
      opacity: 0.8
    }),
  []
);
    const makeCloud = (x: number, y: number, z: number): THREE.Mesh => {
    const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 8, 8),
      cloudMat
    );
    cloud.position.set(x, y, z);
    scene.add(cloud);
    return cloud;
    };

    const clouds = [
      makeCloud(5, 8, 0),
      makeCloud(7, 8, 2),
      makeCloud(6, 8, -2),
    ];

    // Rain (particles)
    const rainGeo = new THREE.BufferGeometry();
    const rainCount = 300;
    const rainPositions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = 9 + Math.random() * 2;
      rainPositions[i + 1] = 6 + Math.random() * 2;
      rainPositions[i + 2] = Math.random() * 4 - 2;
    }

    rainGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(rainPositions, 3)
    );

    const rainMatParticle = new THREE.PointsMaterial({
      color: "#4fa3dd",
      size: 0.1,
    });

    const rain = new THREE.Points(rainGeo, rainMatParticle);
    scene.add(rain);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (!paused) {
        // Rain falling
        const pos = rainGeo.attributes.position;
        for (let i = 0; i < rainCount; i++) {
          pos.array[i * 3 + 1] -= 0.1;
          if (pos.array[i * 3 + 1] < 0) {
            pos.array[i * 3 + 1] = 7;
          }
        }
        pos.needsUpdate = true;

        // Sun animation
        sun.rotation.y += 0.003;

        // Clouds
        clouds.forEach(c => (c.position.x -= 0.01));
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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
