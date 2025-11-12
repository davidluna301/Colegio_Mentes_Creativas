// UI: Spanish (labels), Logic & comments: English
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Sky } from "@react-three/drei";
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
  /* eslint-disable-next-line no-unused-vars */
  onClickVoxel: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  // simple spawn animation: scale from 0.2 -> 1
  useEffect(() => {
    if (!ref.current) return;
    ref.current.scale.setScalar(0.2);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // lerp scale to 1
    const s = ref.current.scale.x;
    const ns = s + (1 - s) * Math.min(1, delta * 8);
    ref.current.scale.setScalar(ns);
  });

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
  const [lastAction, setLastAction] = useState<
    | { type: "add" | "remove"; key: string; block?: BlockType }
    | undefined
  >(undefined);

  // Add voxel at integer position if empty
  const addVoxel = useCallback((x: number, y: number, z: number, t?: BlockType) => {
    const k = keyOf(x, y, z);
    setVoxels((prev) => {
      if (prev.has(k)) return prev;
      const next = new Map(prev);
      next.set(k, t ?? tipo);
      // store last action for undo
      setLastAction({ type: "add", key: k, block: t ?? tipo });
      // sound feedback
      playSound("place");
      return next;
    });
  }, [tipo]);

  // Remove voxel at integer position
  const removeVoxel = useCallback((x: number, y: number, z: number) => {
    const k = keyOf(x, y, z);
    setVoxels((prev) => {
      if (!prev.has(k)) return prev;
      const next = new Map(prev);
      const removed = prev.get(k);
      next.delete(k);
      setLastAction({ type: "remove", key: k, block: removed });
      playSound("remove");
      return next;
    });
  }, []);

  // simple sound generator using WebAudio
  function playSound(kind: "place" | "remove" | "error") {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      if (kind === "place") o.frequency.value = 880;
      if (kind === "remove") o.frequency.value = 440;
      if (kind === "error") o.frequency.value = 220;
      g.gain.value = 0.05;
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 120);
    } catch {
      // ignore audio errors in some environments
    }
  }

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
    const out = JSON.stringify(arr);
    setExportText(out);
    // copy to clipboard to make it easy for kids/teacher
    if (navigator.clipboard) {
      navigator.clipboard.writeText(out).then(() => {
        alert("Guardado en portapapeles ✔");
      });
    }
  }, [voxels]);

  // Import from JSON pasted by the user
  const importJSON = useCallback(() => {
    try {
      const text = exportText || prompt("Pega el JSON aquí:") || "";
      const arr = JSON.parse(text) as VoxelData[];
      const map = new Map<string, BlockType>();
      for (const v of arr) map.set(v.key, v.type);
      setVoxels(map);
      playSound("place");
    } catch {
      playSound("error");
      alert("JSON inválido");
    }
  }, [exportText]);

  const undo = useCallback(() => {
    const act = lastAction;
    if (!act) return playSound("error");
    if (act.type === "add") {
      // remove the added
      setVoxels((prev) => {
        const next = new Map(prev);
        next.delete(act.key);
        return next;
      });
      playSound("remove");
    } else if (act.type === "remove") {
      // restore removed
      setVoxels((prev) => {
        const next = new Map(prev);
        if (act.block) next.set(act.key, act.block);
        return next;
      });
      playSound("place");
    }
    setLastAction(undefined);
  }, [lastAction]);

  const clearAll = useCallback(() => setVoxels(new Map()), []);

  // Build an array of voxel entries for rendering
  const voxelEntries = useMemo(() => Array.from(voxels.entries()), [voxels]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Controls - kid friendly (horizontal info inline) */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/90 shadow">
        <div className="flex gap-2">
          <button
            aria-label="Construir"
            title="Construir"
            className={`text-2xl w-14 h-14 rounded-full flex items-center justify-center ${mode === "Construir" ? "bg-sky-500 text-white" : "bg-white"}`}
            onClick={() => setMode("Construir")}
          >
            🔨
          </button>
          <button
            aria-label="Borrar"
            title="Borrar"
            className={`text-2xl w-14 h-14 rounded-full flex items-center justify-center ${mode === "Borrar" ? "bg-rose-400 text-white" : "bg-white"}`}
            onClick={() => setMode("Borrar")}
          >
            🧹
          </button>
        </div>

        <div className="flex gap-2">
          {/* block picker as big colored buttons with emoji */}
          <button className={`w-12 h-12 rounded-full flex items-center justify-center text-lg`} style={{ background: BLOCK_COLOR.Hierba }} onClick={() => setTipo("Hierba")}>🟩</button>
          <button className={`w-12 h-12 rounded-full flex items-center justify-center text-lg`} style={{ background: BLOCK_COLOR.Tierra }} onClick={() => setTipo("Tierra")}>🟫</button>
          <button className={`w-12 h-12 rounded-full flex items-center justify-center text-lg`} style={{ background: BLOCK_COLOR.Piedra }} onClick={() => setTipo("Piedra")}>⬜</button>
          <button className={`w-12 h-12 rounded-full flex items-center justify-center text-lg`} style={{ background: BLOCK_COLOR.Madera }} onClick={() => setTipo("Madera")}>🪵</button>
          <button className={`w-12 h-12 rounded-full flex items-center justify-center text-lg`} style={{ background: BLOCK_COLOR.Agua }} onClick={() => setTipo("Agua")}>💧</button>
        </div>

        {/* short horizontal hint */}
        <span className="text-sm opacity-80 hidden md:inline">
          Toca el piso para poner bloques. Usa 🧹 para borrar. Mantén Shift para borrar rápido.
        </span>

        <div className="ml-auto flex gap-2">
          <button className="px-3 py-2 rounded-full bg-emerald-500 text-white" onClick={exportJSON}>💾</button>
          <button className="px-3 py-2 rounded-full bg-indigo-500 text-white" onClick={importJSON}>📥</button>
          <button className="px-3 py-2 rounded-full bg-slate-500 text-white" onClick={() => { clearAll(); playSound("remove"); }}>🔄</button>
          <button className="px-3 py-2 rounded-full bg-yellow-400 text-white" onClick={undo}>↶</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden shadow bg-sky-50">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true }}
          camera={{ position: [8, 8, 8], fov: 45 }}
        >
          {/* Cielo físico y luz ambiente sutil */}
          <Sky
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.49}
            azimuth={0.25}
          />
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

          {/* Grid helper suave */}
          <Grid
            args={[60, 60]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#cfe8ff"
            sectionSize={5}
            sectionColor="#90caf9"
            fadeDistance={45}
            infiniteGrid
          />

          {/* Voxels */}
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

          {/* Sombras suaves bajo los bloques */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={80}
            blur={2.5}
            far={15}
            resolution={1024}
            color="#80bfff"
          />

          <OrbitControls makeDefault enablePan={false} minDistance={6} maxDistance={30} />
        </Canvas>
      </div>
      {/* No extra info section: keep screen clean for kids */}
    </div>
  );
}
