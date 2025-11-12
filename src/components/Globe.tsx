// UI: Spanish (labels). Logic & comments: English
import { useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sky } from "@react-three/drei";
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
}: {
  onPointerDown?: (e: ThreeEvent<MouseEvent>) => void;
  spinning: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    // Slow rotation for a pleasing idle animation
    if (spinning && ref.current) ref.current.rotation.y += dt * 0.2;
  });
  return (
    <group>
      {/* Base planet */}
      <mesh ref={ref} onPointerDown={onPointerDown} castShadow receiveShadow>
        <sphereGeometry args={[3, 96, 96]} />
        <meshStandardMaterial color="#9bd1ff" roughness={0.85} metalness={0.0} />
        {/* Simple continents wireframe layer */}
        <mesh>
          <sphereGeometry args={[3.01, 96, 96]} />
          <meshStandardMaterial color="#4caf50" wireframe opacity={0.35} transparent />
        </mesh>
      </mesh>

      {/* Atmosphere glow (subtle) */}
      <mesh>
        <sphereGeometry args={[3.15, 64, 64]} />
        <meshBasicMaterial
          color="#5ecbff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
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
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[selected ? 0.12 : 0.085, 16, 16]} />
      <meshStandardMaterial color={selected ? "#ff7043" : "#fdd835"} emissive={selected ? "#ff7043" : "#fdd835"} emissiveIntensity={0.2}/>
    </mesh>
  );
}

export default function Globe() {
  const [selected, setSelected] = useState<City | null>(CITIES[0]);
  const [spinning, setSpinning] = useState(true);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Top bar: keep only essential info horizontally */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/90 shadow">
        <button
          aria-label={spinning ? "Pausar rotación" : "Reanudar rotación"}
          title={spinning ? "Pausar rotación" : "Reanudar rotación"}
          className={`text-xl w-12 h-12 rounded-full flex items-center justify-center ${spinning ? "bg-indigo-500 text-white" : "bg-white"}`}
          onClick={() => setSpinning((s) => !s)}
        >
          {spinning ? "⏸️" : "▶️"}
        </button>

        {/* Selected city info (essential) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>
            <strong>Ciudad:</strong> {selected ? `${selected.name} (${selected.country})` : "—"}
          </span>
          {selected?.population && (
            <span>
              <strong>Población:</strong> {selected.population.toLocaleString("es-CO")}
            </span>
          )}
          {selected && (
            <span>
              <strong>Lat/Lon:</strong> {selected.lat.toFixed(2)}°, {selected.lon.toFixed(2)}°
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden shadow bg-slate-100 dark:bg-slate-900">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
          {/* Stars + sky for depth */}
          <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade />
          <Sky distance={450000} sunPosition={[10, 3, -10]} inclination={0.52} azimuth={0.2} />

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} />
          <GlobeMesh spinning={spinning} />
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
            minDistance={5}
            maxDistance={16}
            onStart={() => setSpinning(false)}
            onEnd={() => setSpinning(true)}
          />
        </Canvas>
      </div>
      {/* No extra panels: keep screen clean and focused on globe */}
    </div>
  );
}
