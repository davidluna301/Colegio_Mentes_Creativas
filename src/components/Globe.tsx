// UI: Spanish (labels). Logic & comments: English
import React, { useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type City = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population?: number;
};

const CITIES: City[] = [
  { name: "Bogotá", country: "Colombia", lat: 4.711, lon: -74.072, population: 7744000 },
  { name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332, population: 9200000 },
  { name: "Nueva York", country: "Estados Unidos", lat: 40.7128, lon: -74.0060, population: 8800000 },
  { name: "Tokio", country: "Japón", lat: 35.6762, lon: 139.6503, population: 13960000 },
  { name: "París", country: "Francia", lat: 48.8566, lon: 2.3522, population: 2148000 },
  { name: "Sídney", country: "Australia", lat: -33.8688, lon: 151.2093, population: 5230000 },
];

// Convert lat/lon (degrees) to Cartesian on sphere
function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180); // from top
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z =  radius * Math.sin(phi) * Math.sin(theta);
  const y =  radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobeMesh({
  onPointerDown,
  spinning,
  setSpinning
}: {
  onPointerDown?: (e: ThreeEvent<MouseEvent>) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    // Slow rotation for a pleasing idle animation
    if (spinning && ref.current) ref.current.rotation.y += dt * 0.2;
  });
  return (
    <mesh ref={ref} onPointerDown={onPointerDown}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial color="#90caf9" roughness={0.8} metalness={0.0} />
      {/* Simple continents silhouette using slightly extruded noise (fake) */}
      <mesh>
        <sphereGeometry args={[3.01, 64, 64]} />
        <meshStandardMaterial color="#4caf50" wireframe opacity={0.4} transparent />
      </mesh>
    </mesh>
  );
}

function CityMarker({
  city,
  selected,
  onSelect,
}: {
  city: City;
  selected: boolean;
  onSelect: (c: City) => void;
}) {
  const pos = useMemo(() => latLonToVec3(city.lat, city.lon, 3.05), [city]);
  return (
    <mesh
      position={pos}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(city);
      }}
    >
      <sphereGeometry args={[selected ? 0.12 : 0.08, 16, 16]} />
      <meshStandardMaterial color={selected ? "#ff7043" : "#fdd835"} />
    </mesh>
  );
}

export default function Globe() {
  const [selected, setSelected] = useState<City | null>(CITIES[0]);
  const [spinning, setSpinning] = useState(true);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden shadow bg-slate-100 dark:bg-slate-900">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} />
          <GlobeMesh spinning={spinning} setSpinning={setSpinning} />
          {CITIES.map((c) => (
            <CityMarker
              key={c.name}
              city={c}
              selected={selected?.name === c.name}
              onSelect={(c) => setSelected(c)}
            />
          ))}
          <OrbitControls
            enablePan={false}
            onStart={() => setSpinning(false)}
            onEnd={() => setSpinning(true)}
          />
        </Canvas>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/70 dark:bg-slate-800 p-4 shadow">
          <h3 className="font-bold text-lg mb-2">Datos básicos 🌍</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Radio:</strong> ~6,371 km</li>
            <li><strong>Diámetro:</strong> ~12,742 km</li>
            <li><strong>Edad:</strong> ~4.54 mil millones de años</li>
            <li><strong>Continentes:</strong> África, América, Antártida, Asia, Europa, Oceanía</li>
            <li><strong>Océanos:</strong> Pacífico, Atlántico, Índico, Ártico, Antártico</li>
          </ul>
          <div className="mt-3">
            <button
              className="px-3 py-2 rounded-md bg-indigo-500 text-white"
              onClick={() => setSpinning((s) => !s)}
            >
              {spinning ? "Pausar Rotación" : "Reanudar Rotación"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white/70 dark:bg-slate-800 p-4 shadow lg:col-span-2">
          <h3 className="font-bold text-lg mb-2">Ciudad seleccionada</h3>
          {selected ? (
            <div className="text-sm">
              <p><strong>{selected.name}</strong> — {selected.country}</p>
              {selected.population && <p>Población aprox.: {selected.population.toLocaleString("es-CO")}</p>}
              <p>Lat: {selected.lat.toFixed(3)}°, Lon: {selected.lon.toFixed(3)}°</p>
              <p className="opacity-80 mt-2">
                Consejo: puedes orbitar con el mouse y tocar los puntos para cambiar de ciudad.
              </p>
            </div>
          ) : (
            <p className="opacity-80">Toca un marcador en el globo para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
