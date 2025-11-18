import React, { useState, useEffect, useRef } from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number; className?: string };

const Cloud = ({ size = 18, className = "", ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M19 18a4 4 0 0 0 0-8 5 5 0 0 0-9.9-.3A3.5 3.5 0 0 0 5 13.5 3.5 3.5 0 0 0 8.5 17H19z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Droplets = ({ size = 18, className = "", ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M12 3s5 5.5 5 9a5 5 0 1 1-10 0c0-3.5 5-9 5-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Wind = ({ size = 18, className = "", ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <path d="M3 12h13a3 3 0 1 0-2.82-4H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 17h9a2 2 0 1 0-1.88-2.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface CloudParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  delay: number;
}

export default function WaterCycle() {
  const [paused, setPaused] = useState(false);
  const [raining, setRaining] = useState(true);
  const [intensity, setIntensity] = useState(40);
  const [wind, setWind] = useState(0);
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const [evaporationActive, setEvaporationActive] = useState(true);
  const [cloudParticles, setCloudParticles] = useState<CloudParticle[]>([]);
  const frameRef = useRef<number | null>(null);
  const [stats, setStats] = useState({
    dropsCollected: 0,
    cyclesCompleted: 0
  });

  // Inicializa partículas de evaporación
  useEffect(() => {
    setCloudParticles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 100 + Math.random() * 200,
        y: 350,
        opacity: 0.3 + Math.random() * 0.4,
        delay: i * 0.3
      }))
    );
  }, []);

  // Inicializa gotas
  useEffect(() => {
    setDrops(
      Array.from({ length: intensity }, (_, i) => ({
        id: i,
        x: 390 + Math.random() * 320,
        y: 170 + Math.random() * 60,
        speed: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 3
      }))
    );
  }, [intensity]);

  // Animación de lluvia
  useEffect(() => {
    if (paused || !raining) return;

    const animate = () => {
      setDrops((prev) =>
        prev.map((d) => {
          let ny = d.y + d.speed;
          let nx = d.x + wind;
          
          if (ny > 320) {
            setStats(s => ({ ...s, dropsCollected: s.dropsCollected + 1 }));
            ny = 170;
            nx = 390 + Math.random() * 320;
          }
          
          if (nx < 380) nx = 380 + Math.random() * 40;
          if (nx > 710) nx = 690 - Math.random() * 40;
          
          return { ...d, x: nx, y: ny };
        })
      );
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [paused, raining, wind]);

  const togglePause = () => setPaused((prev) => !prev);
  const toggleRaining = () => setRaining((r) => !r);
  const toggleWind = () => setWind((w) => (w === 0 ? 0.8 : 0));
  const toggleEvaporation = () => setEvaporationActive(e => !e);
  const resetStats = () => setStats({ dropsCollected: 0, cyclesCompleted: 0 });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
      {/* Header mejorado */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm py-4 px-6 border-b border-sky-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplets className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-slate-800">Ciclo del Agua</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="font-semibold text-blue-800">Gotas: {stats.dropsCollected}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Panel de visualización */}
        <div className="flex-1 flex flex-col gap-4">
          <div
            role="region"
            aria-label="Visualización del ciclo del agua"
            data-testid="water-cycle"
            className={`relative w-full aspect-[16/9] rounded-2xl border-2 border-sky-300 bg-gradient-to-t from-sky-200 via-sky-100 to-sky-50 overflow-hidden shadow-2xl transition-all ${
              paused ? "opacity-60 paused" : ""
            }`}
          >
            <svg viewBox="0 0 800 450" className="w-full h-full">
              {/* Sol con rayos */}
              <g className={evaporationActive ? "animate-pulse" : ""}>
                <circle cx="700" cy="80" r="45" className="fill-yellow-300" />
                <circle cx="700" cy="80" r="50" className="fill-yellow-200 opacity-50" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={i}
                    x1="700"
                    y1="80"
                    x2={700 + Math.cos((i * Math.PI) / 4) * 70}
                    y2={80 + Math.sin((i * Math.PI) / 4) * 70}
                    className="stroke-yellow-400"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                ))}
              </g>

              {/* Terreno mejorado */}
              <path d="M0 320 L800 320 L800 450 L0 450 Z" className="fill-green-600" />
              <path d="M0 320 Q200 310 400 320 T800 320" className="fill-green-500" />
              
              {/* Montañas */}
              <path d="M330 300 L420 180 L500 300 Z" className="fill-stone-500" />
              <path d="M360 260 L420 190 L480 260 Z" className="fill-stone-400" />
              <path d="M380 240 L420 200 L460 240 Z" className="fill-white opacity-60" />

              {/* Lago/Océano */}
              <ellipse cx="150" cy="340" rx="120" ry="40" className="fill-blue-400 opacity-70" />
              <ellipse cx="150" cy="340" rx="100" ry="30" className="fill-blue-300 opacity-50" />

              {/* Partículas de evaporación */}
              {evaporationActive && (
                <g>
                  {cloudParticles.map((p) => (
                    <circle
                      key={p.id}
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      className="fill-blue-300 animate-bounce"
                      opacity={p.opacity}
                      style={{ animationDelay: `${p.delay}s`, animationDuration: '3s' }}
                    />
                  ))}
                </g>
              )}

              {/* Nube interactiva */}
              <g
                className="cursor-pointer hover:opacity-90 transition-opacity"
                transform="translate(380 110)"
                onClick={toggleRaining}
              >
                <ellipse cx="60" cy="40" rx="55" ry="38" className="fill-gray-100 stroke-gray-300" strokeWidth="2" />
                <ellipse cx="110" cy="45" rx="50" ry="34" className="fill-gray-100 stroke-gray-300" strokeWidth="2" />
                <ellipse cx="20" cy="50" rx="45" ry="30" className="fill-gray-100 stroke-gray-300" strokeWidth="2" />
                {raining && (
                  <ellipse cx="60" cy="42" rx="50" ry="35" className="fill-gray-400 opacity-30" />
                )}
                <text
                  x="60"
                  y="50"
                  textAnchor="middle"
                  className="fill-slate-700 text-xs font-semibold"
                  fontSize={11}
                >
                  {raining ? "☁️ Lluvia" : "☁️ Nube"}
                </text>
              </g>

              {/* Lluvia dinámica */}
              {raining && (
                <g>
                  {drops.map((d) => (
                    <g key={d.id}>
                      <rect
                        x={d.x}
                        y={d.y}
                        width={d.size}
                        height={d.size * 4}
                        rx={d.size / 2}
                        className="fill-blue-400"
                        opacity={paused ? 0.3 : 0.8}
                      />
                      <rect
                        x={d.x + 1}
                        y={d.y}
                        width={d.size / 2}
                        height={d.size * 3}
                        className="fill-blue-200"
                        opacity={0.4}
                      />
                    </g>
                  ))}
                </g>
              )}

              {/* Flujo de agua (escorrentía) */}
              {Array.from({ length: 5 }).map((_, i) => (
                <path
                  key={"flow" + i}
                  d={`M ${500 - i * 40} 300 Q ${450 - i * 40} 330 ${200 + i * 10} 340`}
                  className="fill-none stroke-blue-500"
                  strokeWidth={3}
                  strokeDasharray="6 10"
                  opacity="0.6"
                  style={{
                    animation: paused ? 'none' : 'dash 2s linear infinite',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}

              {/* Indicador de viento */}
              {wind !== 0 && (
                <g transform="translate(50 50)">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M ${i * 15} 0 L ${20 + i * 15} 0`}
                      className="stroke-slate-400"
                      strokeWidth="2"
                      opacity="0.5"
                      style={{
                        animation: 'slideRight 1s linear infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* Barra de fases del ciclo */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90 backdrop-blur-sm text-white py-3 px-4">
              <div className="flex items-center justify-between text-xs md:text-sm font-medium max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Evaporación</span>
                </div>
                <span className="text-cyan-300">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Condensación</span>
                </div>
                <span className="text-cyan-300">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Precipitación</span>
                </div>
                <span className="text-cyan-300">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Escorrentía</span>
                </div>
              </div>
            </div>

            {/* Overlay de pausa */}
            {paused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white/95 px-8 py-4 rounded-2xl shadow-2xl">
                  <p className="text-2xl font-bold text-slate-800">⏸️ Pausado</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel de controles */}
        <div className="lg:w-80 flex flex-col gap-4">
          {/* Control principal */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Droplets size={20} className="text-blue-600" />
              Control Principal
            </h2>
            <button
              onClick={togglePause}
              className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 ${
                paused
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {paused ? "▶️ Reanudar" : "⏸️ Pausar"}
            </button>
          </div>

          {/* Controles de lluvia */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Cloud size={18} className="text-blue-500" />
              Precipitación
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Intensidad</label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {intensity}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={150}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <button
                onClick={toggleRaining}
                className={`w-full py-2 rounded-lg font-medium transition-all ${
                  raining
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                }`}
              >
                {raining ? "🌧️ Detener Lluvia" : "☁️ Iniciar Lluvia"}
              </button>
            </div>
          </div>

          {/* Controles ambientales */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wind size={18} className="text-cyan-500" />
              Ambiente
            </h3>
            <div className="space-y-3">
              <button
                onClick={toggleWind}
                className={`w-full py-2 rounded-lg font-medium transition-all ${
                  wind !== 0
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                }`}
              >
                {wind !== 0 ? "💨 Viento: ON" : "🍃 Viento: OFF"}
              </button>
              <button
                onClick={toggleEvaporation}
                className={`w-full py-2 rounded-lg font-medium transition-all ${
                  evaporationActive
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                }`}
              >
                {evaporationActive ? "☀️ Evaporación: ON" : "🌑 Evaporación: OFF"}
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border border-blue-200">
            <h3 className="font-bold text-slate-800 mb-3">📊 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Gotas colectadas:</span>
                <span className="font-bold text-blue-600">{stats.dropsCollected}</span>
              </div>
              <button
                onClick={resetStats}
                className="w-full mt-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                🔄 Reiniciar
              </button>
            </div>
          </div>

          {/* Info educativa */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              💡 <strong>Tip:</strong> Haz clic en la nube para iniciar/detener la lluvia. Ajusta la intensidad y activa el viento para ver diferentes patrones.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -16;
          }
        }
        @keyframes slideRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(15px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
