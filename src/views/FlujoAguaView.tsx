import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Props {
  paused: boolean;
}

interface Droplet {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  stage: number;
  progress: number;
  cloudId: number;
}

export default function FlujoAguaview({ paused }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";

  useEffect(() => {
    if (!mountRef.current) return;
    if (isTest) return;

    // ===== SCENE SETUP =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#87ceeb");
    scene.fog = new THREE.Fog("#87ceeb", 200, 500);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(25, 18, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = true;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // ===== LUCES =====
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(30, 40, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // ===== TERRENO =====
    const terrainGeometry = new THREE.BoxGeometry(80, 4, 60);
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: "#8b7355",
      roughness: 0.9,
      metalness: 0.05,
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.position.y = -3;
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Césped
    const grassGeometry = new THREE.BoxGeometry(80, 1, 60);
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: "#4a7c3c",
      roughness: 0.95,
      metalness: 0,
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = 0.5;
    grass.castShadow = true;
    grass.receiveShadow = true;
    scene.add(grass);

    // ===== OCÉANO =====
    const oceanGeometry = new THREE.PlaneGeometry(30, 25, 200, 200);
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: "#0066cc",
      metalness: 0.5,
      roughness: 0.1,
      wireframe: false,
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(-20, 1, 5);
    ocean.castShadow = true;
    ocean.receiveShadow = true;
    scene.add(ocean);

    const oceanPositionsArray = oceanGeometry.attributes.position.array as Float32Array;
    const oceanOriginalPositions = new Float32Array(oceanPositionsArray);

    // ===== MONTAÑA =====
    const mountainGeometry = new THREE.ConeGeometry(8, 16, 64);
    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: "#5a5a5a",
      roughness: 0.95,
      metalness: 0,
    });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(20, 6, 5);
    mountain.castShadow = true;
    mountain.receiveShadow = true;
    scene.add(mountain);

    // Nieve
    const snowGeometry = new THREE.ConeGeometry(8, 8, 64);
    const snowMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.8,
      metalness: 0,
    });
    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
    snow.position.set(20, 12, 5);
    snow.castShadow = true;
    snow.receiveShadow = true;
    scene.add(snow);

    // ===== SOL =====
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshBasicMaterial({ color: "#ffeb3b" })
    );
    sun.position.set(30, 25, -20);
    scene.add(sun);

    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: "#ffeb3b",
        transparent: true,
        opacity: 0.2,
      })
    );
    sunGlow.position.copy(sun.position);
    scene.add(sunGlow);

    // ===== NUBES =====
    const createCloud = (x: number, y: number, z: number) => {
      const cloudGroup = new THREE.Group();
      const spheres = [
        { size: 3, offset: [0, 0, 0] },
        { size: 2.8, offset: [2.5, 0.5, -0.5] },
        { size: 2.6, offset: [-2.5, 0.3, 0.5] },
        { size: 2.4, offset: [1.5, -0.4, 1.5] },
        { size: 2.2, offset: [-1.5, -0.3, -1] },
      ];

      spheres.forEach((sphere) => {
        const cloudPart = new THREE.Mesh(
          new THREE.SphereGeometry(sphere.size, 16, 16),
          new THREE.MeshStandardMaterial({
            color: "#ffffff",
            emissive: 0xffffff,
            emissiveIntensity: 0.2,
            roughness: 0.9,
            metalness: 0,
            transparent: true,
            opacity: 0.95,
          })
        );
        cloudPart.position.set(sphere.offset[0], sphere.offset[1], sphere.offset[2]);
        cloudPart.castShadow = true;
        cloudPart.receiveShadow = true;
        cloudGroup.add(cloudPart);
      });

      cloudGroup.position.set(x, y, z);
      scene.add(cloudGroup);
      return cloudGroup;
    };

    const clouds = [
      createCloud(-5, 16, 0),
      createCloud(12, 17, -8),
      createCloud(25, 16, 8),
    ];

    const cloudStartPositions = clouds.map((c) => ({
      x: c.position.x,
      y: c.position.y,
      z: c.position.z,
    }));

    // ===== RÍO =====
    const riverPath: THREE.Vector3[] = [
      new THREE.Vector3(20, 6.5, 5),      // Cima de montaña
      new THREE.Vector3(15, 4, 3),
      new THREE.Vector3(8, 2.5, 2),
      new THREE.Vector3(2, 1.5, 1),
      new THREE.Vector3(-5, 1, 2),
      new THREE.Vector3(-12, 0.8, 3),
      new THREE.Vector3(-18, 0.5, 5),     // Océano
    ];

    const riverCurve = new THREE.CatmullRomCurve3(riverPath);
    const riverTubeGeometry = new THREE.TubeGeometry(riverCurve, 40, 0.8, 6);
    const riverMaterial = new THREE.MeshStandardMaterial({
      color: "#3b82f6",
      metalness: 0.4,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const river = new THREE.Mesh(riverTubeGeometry, riverMaterial);
    river.castShadow = true;
    river.receiveShadow = true;
    scene.add(river);

    // ===== GOTITAS DE AGUA =====
    const dropletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const droplets: Droplet[] = [];

    const dropletMaterials = {
      ocean: new THREE.MeshStandardMaterial({
        color: "#0066cc",
        metalness: 0.6,
        roughness: 0.2,
      }),
      rising: new THREE.MeshStandardMaterial({
        color: "#b3d9ff",
        metalness: 0.2,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8,
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: "#e0f2fe",
        metalness: 0.1,
        roughness: 0.4,
        transparent: true,
        opacity: 0.85,
      }),
      rain: new THREE.MeshStandardMaterial({
        color: "#0ea5e9",
        metalness: 0.5,
        roughness: 0.15,
      }),
      river: new THREE.MeshStandardMaterial({
        color: "#3b82f6",
        metalness: 0.4,
        roughness: 0.2,
      }),
    };

    for (let i = 0; i < 200; i++) {
      const mesh = new THREE.Mesh(dropletGeometry, dropletMaterials.ocean);
      mesh.position.x = -20 + Math.random() * 10;
      mesh.position.y = 1;
      mesh.position.z = 2 + Math.random() * 8;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      droplets.push({
        mesh,
        position: mesh.position.clone(),
        stage: 0,
        progress: Math.random(),
        cloudId: Math.floor(Math.random() * 3),
      });
    }

    // ===== LLUVIA EN NUBES (mejorada: gotas con posiciones mundiales y velocidades) =====
    const rainParticles: THREE.Points[] = [];
    const rainSpeedsArr: number[][] = [];
    const rainOffsetsArr: Float32Array[] = [];
    const rainCount = 300;

    for (let c = 0; c < 3; c++) {
      const rainGeo = new THREE.BufferGeometry();
      const rainPositions = new Float32Array(rainCount * 3);
      const offsets = new Float32Array(rainCount * 2); // store local x,z offsets per drop
      const speeds: number[] = [];

      for (let i = 0; i < rainCount; i++) {
        const ox = (Math.random() - 0.5) * 10;
        const oz = (Math.random() - 0.5) * 10;
        const startY = clouds[c].position.y + 0.5 + Math.random() * 1.2; // start near cloud height

        rainPositions[i * 3] = clouds[c].position.x + ox; // world X
        rainPositions[i * 3 + 1] = startY + Math.random() * 1.8; // world Y
        rainPositions[i * 3 + 2] = clouds[c].position.z + oz; // world Z

        offsets[i * 2] = ox;
        offsets[i * 2 + 1] = oz;
        speeds.push(0.16 + Math.random() * 0.28);
      }

      rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));

      const rain = new THREE.Points(
        rainGeo,
        new THREE.PointsMaterial({
          color: "#3b82f6",
          size: 0.12,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.75,
        })
      );
      scene.add(rain);
      rainParticles.push(rain);
      rainSpeedsArr.push(speeds);
      rainOffsetsArr.push(offsets);
    }

    // ===== ANIMACIÓN =====
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      if (!paused) {
        time += 0.016;

        // Animar océano (olas)
        const oceanPositions = ocean.geometry.attributes.position;
        for (let i = 0; i < oceanPositions.count; i++) {
          const x = oceanOriginalPositions[i * 3];
          const z = oceanOriginalPositions[i * 3 + 2];
          const wave1 = Math.sin(x * 0.15 + time) * 0.4;
          const wave2 = Math.cos(z * 0.1 + time * 0.8) * 0.3;
          (oceanPositions.array as Float32Array)[i * 3 + 1] = wave1 + wave2;
        }
        oceanPositions.needsUpdate = true;

        // Mover nubes y actualizar lluvia (cada gota tiene caída propia)
        clouds.forEach((cloud, idx) => {
          cloud.position.x = cloudStartPositions[idx].x + Math.sin(time * 0.3 + idx * 2) * 8;
          cloud.position.z = cloudStartPositions[idx].z + Math.cos(time * 0.25 + idx * 1.5) * 6;

          const rain = rainParticles[idx];
          const rainGeo = rain.geometry as THREE.BufferGeometry;
          const rainPos = rainGeo.attributes.position as THREE.BufferAttribute;
          const arr = rainPos.array as Float32Array;
          const offsets = rainOffsetsArr[idx];
          const speeds = rainSpeedsArr[idx];

          for (let i = 0; i < rainCount; i++) {
            // caída vertical
            arr[i * 3 + 1] -= speeds[i];

            // seguir ligeramente el movimiento horizontal de la nube (drift)
            arr[i * 3] = cloud.position.x + offsets[i * 2] + Math.sin(time * 0.5 + i) * 0.02;
            arr[i * 3 + 2] = cloud.position.z + offsets[i * 2 + 1] + Math.cos(time * 0.4 + i) * 0.02;

            // si toca el suelo (o cerca), regenerar en la nube
            if (arr[i * 3 + 1] < 0.8) {
              arr[i * 3 + 1] = cloud.position.y + 0.6 + Math.random() * 1.4;
              // reset horizontal offsets relative to cloud
              offsets[i * 2] = (Math.random() - 0.5) * 10;
              offsets[i * 2 + 1] = (Math.random() - 0.5) * 10;
              speeds[i] = 0.16 + Math.random() * 0.28;
              arr[i * 3] = cloud.position.x + offsets[i * 2];
              arr[i * 3 + 2] = cloud.position.z + offsets[i * 2 + 1];
            }
          }

          rainPos.needsUpdate = true;
        });

        // Ciclo del agua con gotitas
        droplets.forEach((droplet, idx) => {
          droplet.progress += 0.0008;
          if (droplet.progress >= 1) {
            droplet.progress = 0;
            droplet.stage = (droplet.stage + 1) % 5;
          }

          const progress = droplet.progress;
          const stage = droplet.stage;
          const cloudIdx = droplet.cloudId;

          switch (stage) {
            case 0: // Océano
              droplet.mesh.position.x = -20 + Math.random() * 10;
              droplet.mesh.position.y = 1 + Math.sin(time * 2 + idx) * 0.2;
              droplet.mesh.position.z = 2 + Math.random() * 8;
              droplet.mesh.material = dropletMaterials.ocean;
              break;

            case 1: // Evaporación (sube del océano a la nube)
              const oceanStart = new THREE.Vector3(-20 + (idx % 15) * 1.3, 1, 2 + (Math.floor(idx / 15) % 5) * 1.6);
              const cloudPos = clouds[cloudIdx].position;
              const cloudRise = new THREE.Vector3(
                cloudPos.x + (Math.random() - 0.5) * 8,
                cloudPos.y,
                cloudPos.z + (Math.random() - 0.5) * 8
              );
              droplet.mesh.position.lerpVectors(oceanStart, cloudRise, progress);
              droplet.mesh.material = dropletMaterials.rising;
              break;

            case 2: // En la nube
              const cloudPos2 = clouds[cloudIdx].position;
              droplet.mesh.position.x = cloudPos2.x + (Math.random() - 0.5) * 6;
              droplet.mesh.position.y = cloudPos2.y + (Math.random() - 0.5) * 4;
              droplet.mesh.position.z = cloudPos2.z + (Math.random() - 0.5) * 6;
              droplet.mesh.material = dropletMaterials.cloud;
              break;

            case 3: // Lluvia (cae desde la nube a la montaña)
              const cloudDropStart = new THREE.Vector3(
                clouds[cloudIdx].position.x + (Math.random() - 0.5) * 8,
                clouds[cloudIdx].position.y,
                clouds[cloudIdx].position.z + (Math.random() - 0.5) * 8
              );
              const mountainTop = new THREE.Vector3(20 + (Math.random() - 0.5) * 3, 10, 5 + (Math.random() - 0.5) * 2);
              droplet.mesh.position.lerpVectors(cloudDropStart, mountainTop, progress);
              droplet.mesh.material = dropletMaterials.rain;
              break;

            case 4: // Río (fluye por el río hacia el océano)
              const riverPoint = riverCurve.getPoint(progress);
              droplet.mesh.position.copy(riverPoint);
              droplet.mesh.material = dropletMaterials.river;
              break;
          }
        });

        // Animar sol
        sunGlow.scale.set(
          1 + Math.sin(time * 1.5) * 0.15,
          1 + Math.sin(time * 1.5) * 0.15,
          1 + Math.sin(time * 1.5) * 0.15
        );
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      oceanGeometry.dispose();
      mountainGeometry.dispose();
      snowGeometry.dispose();
      riverTubeGeometry.dispose();
      dropletGeometry.dispose();
      rainParticles.forEach((rp) => {
        rp.geometry.dispose();
      });
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [paused, isTest]);

  return (
    <div
      ref={mountRef}
      role="region"
      className="w-full h-full rounded-xl border-2 border-blue-600 shadow-lg overflow-hidden"
    />
  );
}
