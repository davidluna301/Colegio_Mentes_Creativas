import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sky } from "@react-three/drei";
import * as THREE from "three";

type City = { name: string; country: string; lat: number; lon: number; population?: number };

const CITIES: City[] = [
  { name: "Bogotá", country: "Colombia", lat: 4.711, lon: -74.072, population: 7744000 },
  { name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332, population: 9200000 },
  { name: "Nueva York", country: "Estados Unidos", lat: 40.7128, lon: -74.006, population: 8800000 },
  { name: "Tokio", country: "Japón", lat: 35.6762, lon: 139.6503, population: 13960000 },
  { name: "París", country: "Francia", lat: 48.8566, lon: 2.3522, population: 2148000 },
  { name: "Sídney", country: "Australia", lat: -33.8688, lon: 151.2093, population: 5230000 },
];

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobeMesh({ spinning, texture, showTexture }: { spinning: boolean; texture?: THREE.Texture; showTexture: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (spinning && ref.current) ref.current.rotation.y += dt * 0.2; });
  return (
    <group>
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[3, 96, 96]} />
        {showTexture && texture ? (
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
        ) : (
          <meshStandardMaterial color="#9bd1ff" roughness={0.85} metalness={0} />
        )}
        {!showTexture && (
          <mesh>
            <sphereGeometry args={[3.01, 96, 96]} />
            <meshStandardMaterial color="#4caf50" wireframe opacity={0.35} transparent />
          </mesh>
        )}
      </mesh>
      <mesh>
        <sphereGeometry args={[3.15, 64, 64]} />
        <meshBasicMaterial color="#5ecbff" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* eslint-disable no-unused-vars */
function CityMarker({ city, selected, onSelect }: { city: City; selected: boolean; onSelect: (c: City) => void }) {
  const pos = useMemo(() => latLonToVec3(city.lat, city.lon, 3.05), [city]);
  return (
    <mesh
      position={pos}
      onPointerDown={(e) => { e.stopPropagation(); onSelect(city); }}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[selected ? 0.12 : 0.085, 16, 16]} />
      <meshStandardMaterial color={selected ? "#ff7043" : "#fdd835"} emissive={selected ? "#ff7043" : "#fdd835"} emissiveIntensity={0.2} />
    </mesh>
  );
}
/* eslint-enable no-unused-vars */

export default function Globe() {
  const [selected, setSelected] = useState<City | null>(CITIES[0]);
  const [spinning, setSpinning] = useState(true);
  const [showMap, setShowMap] = useState(true);

  // Textura muy sencilla dibujando continentes como polígonos sobre proyección equirectangular
  const mapTexture = useMemo(() => {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctxTmp = canvas.getContext('2d');
    if (!ctxTmp) return undefined;
    const ctx: CanvasRenderingContext2D = ctxTmp;
    ctx.fillStyle = '#2064a8'; // océano
    ctx.fillRect(0,0,w,h);
    const PX = (lon:number)=> (lon+180)/360*w;
    const PY = (lat:number)=> (90-lat)/180*h;
    function drawPoly(list:[number,number][], fill='#3ca55b') {
      ctx.beginPath();
      list.forEach(([lon,lat],i)=>{ const x=PX(lon), y=PY(lat); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    // Polígonos muy simplificados
    drawPoly([[-170,72],[-150,60],[-130,55],[-105,50],[-95,45],[-85,30],[-95,20],[-110,25],[-125,40],[-150,58]]); // N. América
    drawPoly([[-81,12],[-75,-2],[-70,-15],[-63,-25],[-54,-45],[-45,-35],[-40,-10],[-50,5]]); // S. América
    drawPoly([[-18,34],[-10,20],[5,10],[12,-10],[25,-28],[38,-20],[32,5],[20,25],[5,35]]); // África
    drawPoly([[-10,60],[0,50],[15,52],[30,48],[25,60],[10,65]]); // Europa
    drawPoly([[30,55],[45,50],[60,55],[90,46],[120,45],[135,55],[150,60],[140,70],[120,65],[90,56],[60,55],[42,56]]); // Asia
    drawPoly([[113,-10],[120,-25],[140,-35],[155,-30],[150,-15],[132,-10]]); // Australia
    drawPoly([[-50,82],[-40,78],[-25,76],[-30,84]]); // Groenlandia
    drawPoly([[-180,-60],[-120,-70],[-60,-74],[-30,-75],[30,-76],[90,-72],[150,-66],[180,-60]]); // Antártida
    // Sutil gradiente de iluminación
    const grad = ctx.createLinearGradient(0,0,w,h); grad.addColorStop(0,'rgba(255,255,255,0.08)'); grad.addColorStop(1,'rgba(0,0,40,0.25)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; return tex;
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/90 shadow text-sm">
        <button className={`px-3 py-2 rounded-md ${spinning?"bg-indigo-600 text-white":"bg-indigo-100 text-indigo-700"}`} onClick={()=> setSpinning(s=>!s)}>
          {spinning?"Pausar rotación":"Rotar"}
        </button>
        <button className={`px-3 py-2 rounded-md ${showMap?"bg-green-600 text-white":"bg-green-100 text-green-700"}`} onClick={()=> setShowMap(m=>!m)}>
          {showMap?"Quitar mapa":"Mostrar mapa"}
        </button>
        {selected && (
          <span><strong>{selected.name}</strong> ({selected.country}) • Lat {selected.lat.toFixed(1)} Lon {selected.lon.toFixed(1)}</span>
        )}
      </div>
      <div className="flex-1 min-h-[420px] rounded-xl overflow-hidden shadow bg-slate-100 dark:bg-slate-900">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <Stars radius={80} depth={50} count={2500} factor={4} saturation={0} fade />
          <Sky distance={450000} sunPosition={[10, 3, -10]} inclination={0.52} azimuth={0.2} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow shadow-mapSize={[1024,1024]} />
          <GlobeMesh spinning={spinning} texture={showMap?mapTexture:undefined} showTexture={showMap} />
          {CITIES.map((city)=> (
            <CityMarker key={city.name} city={city} selected={selected?.name===city.name} onSelect={setSelected} />
          ))}
          <OrbitControls enablePan={false} onStart={()=> setSpinning(false)} onEnd={()=> setSpinning(true)} />
        </Canvas>
      </div>
    </div>
  );
}
