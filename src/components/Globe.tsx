import { useMemo, useRef, useState, Suspense, Dispatch, SetStateAction } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { MapPin, Globe as GlobeIcon, Users, Navigation } from "lucide-react";

type City = { 
  name: string; 
  country: string; 
  lat: number; 
  lon: number; 
  population: number;
  continent: string;
};

const CITIES: City[] = [
  { name: "Bogotá", country: "Colombia", lat: 4.711, lon: -74.072, population: 7744000, continent: "América del Sur" },
  { name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332, population: 9200000, continent: "América del Norte" },
  { name: "Nueva York", country: "Estados Unidos", lat: 40.7128, lon: -74.006, population: 8800000, continent: "América del Norte" },
  { name: "Los Ángeles", country: "Estados Unidos", lat: 34.0522, lon: -118.2437, population: 3900000, continent: "América del Norte" },
  { name: "Londres", country: "Reino Unido", lat: 51.5074, lon: -0.1278, population: 9000000, continent: "Europa" },
  { name: "París", country: "Francia", lat: 48.8566, lon: 2.3522, population: 2148000, continent: "Europa" },
  { name: "Berlín", country: "Alemania", lat: 52.52, lon: 13.405, population: 3645000, continent: "Europa" },
  { name: "Madrid", country: "España", lat: 40.4168, lon: -3.7038, population: 3223000, continent: "Europa" },
  { name: "Tokio", country: "Japón", lat: 35.6762, lon: 139.6503, population: 13960000, continent: "Asia" },
  { name: "Pekín", country: "China", lat: 39.9042, lon: 116.4074, population: 21540000, continent: "Asia" },
  { name: "Shanghái", country: "China", lat: 31.2304, lon: 121.4737, population: 24280000, continent: "Asia" },
  { name: "Seúl", country: "Corea del Sur", lat: 37.5665, lon: 126.978, population: 9776000, continent: "Asia" },
  { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, population: 12442000, continent: "Asia" },
  { name: "Sídney", country: "Australia", lat: -33.8688, lon: 151.2093, population: 5230000, continent: "Oceanía" },
  { name: "São Paulo", country: "Brasil", lat: -23.5505, lon: -46.6333, population: 12330000, continent: "América del Sur" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, population: 3075000, continent: "América del Sur" },
  { name: "El Cairo", country: "Egipto", lat: 30.0444, lon: 31.2357, population: 9500000, continent: "África" },
  { name: "Ciudad del Cabo", country: "Sudáfrica", lat: -33.9249, lon: 18.4241, population: 4618000, continent: "África" },
  { name: "Dubái", country: "Emiratos Árabes", lat: 25.2048, lon: 55.2708, population: 3331000, continent: "Asia" },
  { name: "Moscú", country: "Rusia", lat: 55.7558, lon: 37.6173, population: 12500000, continent: "Europa" },
];

const EARTH_TEXTURE_URL = "/textures/earth.jpg";
const EARTH_BUMP_URL = "/textures/earth-bump.jpg";

const EARTH_RADIUS = 2.2;

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const latLonToVector3 = (lat: number, lon: number, radius = EARTH_RADIUS) => {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon + 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

interface CityMarkerProps {
  city: City;
  isSelected: boolean;
  onSelect: Dispatch<SetStateAction<City>>;
}

const CityMarker = ({ city, isSelected, onSelect }: CityMarkerProps) => {
  const position = useMemo(() => latLonToVector3(city.lat, city.lon), [city.lat, city.lon]);

  return (
    <group
      position={position.toArray() as [number, number, number]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(city);
      }}
    >
      <mesh>
        <sphereGeometry args={[isSelected ? 0.09 : 0.07, 16, 16]} />
        <meshStandardMaterial color={isSelected ? "#f97316" : "#38bdf8"} />
      </mesh>
      <mesh position={[0, 0.2, 0]}
        scale={isSelected ? 1.2 : 1}
      >
        <coneGeometry args={[0.02, 0.12, 8]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
    </group>
  );
};

interface GlobeMeshProps {
  isRotating: boolean;
  onSelectCity: Dispatch<SetStateAction<City>>;
  selectedCity: City;
}

const GlobeMesh = ({ isRotating, onSelectCity, selectedCity }: GlobeMeshProps) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);
  const bump = useLoader(THREE.TextureLoader, EARTH_BUMP_URL);

  useFrame((_, delta) => {
    if (isRotating && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial map={texture} bumpMap={bump} bumpScale={0.05} shininess={10} />
      </mesh>
      {CITIES.map((city) => (
        <CityMarker
          key={city.name}
          city={city}
          isSelected={selectedCity.name === city.name}
          onSelect={onSelectCity}
        />
      ))}
    </group>
  );
};

const numberFormatter = new Intl.NumberFormat("es-ES");

export default function Globe() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [isRotating, setIsRotating] = useState(true);

  const continents = useMemo(
    () => Array.from(new Set(CITIES.map(({ continent }) => continent))),
    [],
  );
  const totalPopulation = useMemo(
    () => CITIES.reduce((acc, { population }) => acc + population, 0),
    [],
  );

  return (
    <section className="space-y-8" data-testid="globe-experience">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,0.8fr] gap-6">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/50 backdrop-blur shadow-xl border border-white/40">
          <div className="p-6 border-b border-white/30 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20">
                <GlobeIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">Globo interactivo</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mapa global educativo</h2>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Explora ciudades clave en todos los continentes. Usa el botón para pausar la rotación
              y haz click sobre los marcadores para consultar los datos destacados.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> Población total aproximada: {numberFormatter.format(totalPopulation)}</span>
              <span className="inline-flex items-center gap-1"><Navigation className="h-4 w-4" /> Continentes activos: {continents.length}</span>
            </div>
            <button
              className="self-start px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition"
              onClick={() => setIsRotating((prev) => !prev)}
            >
              {isRotating ? "Pausar Rotación" : "Reanudar Rotación"}
            </button>
          </div>

          <div className="h-[420px]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#83c5be" />
              <Stars radius={80} depth={50} count={2000} factor={4} fade />
              <Suspense fallback={null}>
                <GlobeMesh isRotating={isRotating} onSelectCity={setSelectedCity} selectedCity={selectedCity} />
              </Suspense>
              <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
            </Canvas>
          </div>
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-white/40 shadow p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-rose-500" />
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Ciudad seleccionada</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong className="text-base text-slate-900 dark:text-white">{selectedCity.name}</strong> — {selectedCity.country}
            </p>
            <p className="text-sm text-slate-500 mt-1">Población aprox.: {numberFormatter.format(selectedCity.population)}</p>
            <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-2">
              <p>Latitud: {selectedCity.lat}°</p>
              <p>Longitud: {selectedCity.lon}°</p>
              <p className="col-span-2">Continente: {selectedCity.continent}</p>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Consejo: puedes orbitar con el mouse y tocar los puntos para cambiar de ciudad.
            </p>
          </article>

          <article className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-white/40 shadow p-5">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">Datos básicos 🌍</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Radio:</strong> ~6,371 km</li>
              <li><strong>Diámetro:</strong> ~12,742 km</li>
              <li><strong>Edad:</strong> ~4.54 mil millones de años</li>
              <li><strong>Continentes:</strong> África, América, Antártida, Asia, Europa, Oceanía</li>
              <li><strong>Océanos:</strong> Pacífico, Atlántico, Índico, Ártico, Antártico</li>
            </ul>
          </article>
        </aside>
      </div>

      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-white/40 shadow-xl p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Ciudades incluidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <button
              key={city.name}
              className={`text-left p-4 rounded-2xl border transition shadow-sm hover:shadow-md ${
                selectedCity.name === city.name
                  ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10"
                  : "border-white/40 bg-white/50"
              }`}
              onClick={() => setSelectedCity(city)}
            >
              <p className="font-semibold text-slate-900 dark:text-white">{city.name}</p>
              <p className="text-sm text-slate-500">{city.country}</p>
              <p className="text-xs text-slate-400 mt-1">{city.continent}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}