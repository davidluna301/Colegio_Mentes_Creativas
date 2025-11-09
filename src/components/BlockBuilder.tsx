// UI: Spanish (labels), Logic & comments: English
import React, { useState, useCallback, useRef, useMemo } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, StatsGl } from "@react-three/drei";
import * as THREE from "three";

type BlockType = "Tierra" | "Hierba" | "Piedra" | "Madera" | "Agua";
type Mode = "Construir" | "Borrar";

// Palette for block types (simple flat colors to avoid textures)
const BLOCK_COLOR: Record<BlockType, string> = {
  Tierra: "#8d6e63",
  Hierba: "#66bb6a",
  Piedra: "#90a4ae",
  Madera: "#a1887f",
  Agua: "#4fc3f7",
};

// A single voxel block
function Voxel({
  position,
  color,
  onClickVoxel,
}: {
  position: [number, number, number];
  color: string;
  onClickVoxel: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh
      ref={ref}
      position={position}
      castShadow
      receiveShadow
      onPointerDown={onClickVoxel}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Serialize/Deserialize helpers
type VoxelData = { key: string; type: BlockType };
function keyOf(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}
function parseKey(k: string): [number, number, number] {
  const [x, y, z] = k.split(",").map((n) => parseInt(n, 10));
  return [x, y, z];
}

export default function BlockBuilder() {
  // Using a Map to store voxel type by key to keep insertion order deterministic
  const [voxels, setVoxels] = useState<Map<string, BlockType>>(new Map());
  const [tipo, setTipo] = useState<BlockType>("Hierba");
  const [mode, setMode] = useState<Mode>("Construir");
  const [exportText, setExportText] = useState<string>("");

  // Add voxel at integer position if empty
  const addVoxel = useCallback((x: number, y: number, z: number, t?: BlockType) => {
    const k = keyOf(x, y, z);
    setVoxels((prev) => {
      if (prev.has(k)) return prev;
      const next = new Map(prev);
      next.set(k, t ?? tipo);
      return next;
    });
  }, [tipo]);

  // Remove voxel at integer position
  const removeVoxel = useCallback((x: number, y: number, z: number) => {
    const k = keyOf(x, y, z);
    setVoxels((prev) => {
      if (!prev.has(k)) return prev;
      const next = new Map(prev);
      next.delete(k);
      return next;
    });
  }, []);

  // Handle clicking on existing voxel: place adjacent (build) or delete
  const handleVoxelPointer = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Get clicked voxel position
    const [vx, vy, vz] = (e.object as THREE.Mesh).position.toArray().map(Math.round);
    if (mode === "Borrar" || e.shiftKey) {
      removeVoxel(vx, vy, vz);
      return;
    }
    // Figure out the face normal to place adjacent block
    const faceNormal = (e.face?.normal ?? new THREE.Vector3()).clone();
    // Transform to world space normal (mesh might be rotated in general)
    const worldNormal = faceNormal.applyNormalMatrix(
      new THREE.Matrix3().getNormalMatrix(e.object.matrixWorld)
    );
    const nx = Math.round(worldNormal.x);
    const ny = Math.round(worldNormal.y);
    const nz = Math.round(worldNormal.z);
    addVoxel(vx + nx, vy + ny, vz + nz);
  }, [addVoxel, removeVoxel, mode]);

  // Handle ground clicks: place on grid at y=0
  const handleGroundPointer = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (mode === "Borrar") return;
    const p = e.point; // intersection with plane
    const gx = Math.round(p.x);
    const gz = Math.round(p.z);
    const gy = 0.5; // sits on ground
    addVoxel(gx, gy, gz);
  }, [addVoxel, mode]);

  // Export current voxels to JSON
  const exportJSON = useCallback(() => {
    const arr: VoxelData[] = [];
    voxels.forEach((type, key) => arr.push({ key, type }));
    setExportText(JSON.stringify(arr, null, 2));
  }, [voxels]);

  // Import from JSON pasted by the user
  const importJSON = useCallback(() => {
    try {
      const arr = JSON.parse(exportText) as VoxelData[];
      const map = new Map<string, BlockType>();
      for (const v of arr) map.set(v.key, v.type);
      setVoxels(map);
    } catch (err) {
      alert("JSON inválido");
    }
  }, [exportText]);

  const clearAll = useCallback(() => setVoxels(new Map()), []);

  // Build an array of voxel entries for rendering
  const voxelEntries = useMemo(() => Array.from(voxels.entries()), [voxels]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white/70 dark:bg-slate-800 shadow">
        <span className="font-semibold mr-2">Modo:</span>
        <div className="inline-flex rounded-lg overflow-hidden border">
          <button
            className={`px-3 py-2 ${mode === "Construir" ? "bg-sky-500 text-white" : "bg-white dark:bg-slate-700"}`}
            onClick={() => setMode("Construir")}
          >
            Construir
          </button>
          <button
            className={`px-3 py-2 ${mode === "Borrar" ? "bg-rose-500 text-white" : "bg-white dark:bg-slate-700"}`}
            onClick={() => setMode("Borrar")}
          >
            Borrar
          </button>
        </div>

        <label className="ml-4 font-semibold">Bloque:</label>
        <select
          className="border rounded-md px-2 py-2 bg-white dark:bg-slate-700"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as BlockType)}
        >
          {Object.keys(BLOCK_COLOR).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button className="px-3 py-2 rounded-md bg-emerald-500 text-white" onClick={exportJSON}>
            Exportar
          </button>
          <button className="px-3 py-2 rounded-md bg-indigo-500 text-white" onClick={importJSON}>
            Importar
          </button>
          <button className="px-3 py-2 rounded-md bg-slate-500 text-white" onClick={clearAll}>
            Reiniciar
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden shadow bg-sky-50 dark:bg-slate-900">
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[8, 12, 10]}
            intensity={0.9}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          {/* Ground plane */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
            onPointerDown={handleGroundPointer}
          >
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color={"#e3f2fd"} />
          </mesh>

          {/* Nice grid helper */}
          <Grid
            args={[60, 60]}
            cellSize={1}
            cellThickness={0.8}
            cellColor="#bbdefb"
            sectionSize={5}
            sectionColor="#90caf9"
            fadeDistance={40}
            infiniteGrid
          />

          {/* Render voxels */}
          {voxelEntries.map(([key, type]) => {
            const [x, y, z] = parseKey(key);
            return (
              <Voxel
                key={key}
                position={[x, y, z]}
                color={BLOCK_COLOR[type]}
                onClickVoxel={handleVoxelPointer}
              />
            );
          })}

          <OrbitControls makeDefault />
          {/* <StatsGl /> Uncomment if you want a small FPS meter */}
        </Canvas>
      </div>

      {/* Import/Export area */}
      <div className="rounded-xl bg-white/70 dark:bg-slate-800 p-3 shadow">
        <p className="text-sm opacity-80 mb-1">
          Copia/pega aquí para guardar o cargar tu construcción (JSON).
        </p>
        <textarea
          value={exportText}
          onChange={(e) => setExportText(e.target.value)}
          placeholder="[]"
          className="w-full h-32 p-2 rounded-md border bg-white dark:bg-slate-900"
        />
      </div>
    </div>
  );
}
