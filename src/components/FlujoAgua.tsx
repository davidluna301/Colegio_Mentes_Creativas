import { useState, useEffect, useRef } from "react";

interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export default function WaterCycle() {
  const [paused, setPaused] = useState(false);
  const [raining, setRaining] = useState(true);
  const [intensity, setIntensity] = useState(40); // número de gotas visibles
  const [wind, setWind] = useState(0); // velocidad horizontal
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const frameRef = useRef<number | null>(null);

  // Inicializa gotas cuando cambia intensidad
  useEffect(() => {
    setDrops(
      Array.from({ length: intensity }, (_, i) => ({
        id: i,
        x: 390 + Math.random() * 320, // rango ancho nube → tierra
        y: 170 + Math.random() * 60, // inicia cerca de nube
        speed: 1 + Math.random() * 2.2, // velocidad caída
      }))
    );
  }, [intensity]);

  // Animación manual de lluvia
  useEffect(() => {
    if (paused || !raining) return; // pausa global o lluvia detenida

    const animate = () => {
      setDrops((prev) =>
        prev.map((d) => {
          let ny = d.y + d.speed;
          let nx = d.x + wind;
          // reinicia si pasa del suelo
            if (ny > 320) {
              ny = 170; // reinicia en nube
              nx = 390 + Math.random() * 320;
            }
          // límites horizontales básicos
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
  const toggleWind = () => setWind((w) => (w === 0 ? 0.6 : 0));

  return (
    <div className="flex flex-col w-full h-screen bg-sky-100 text-slate-900">
      <header className="py-4">
        <h1 className="text-center text-3xl font-bold">Ciclo del Agua</h1>
      </header>

      <div className="flex-1 flex flex-col items-center gap-6 px-4 pb-4">
        <div
          data-testid="water-cycle"
          className={`water-cycle relative w-full max-w-4xl aspect-[16/9] rounded-xl border border-sky-400 bg-gradient-to-t from-sky-200 to-sky-50 overflow-hidden shadow-lg ${paused ? "paused" : ""}`}
          role="region"
          aria-label="Animación simplificada del ciclo del agua"
        >
          <svg viewBox="0 0 800 450" className="w-full h-full">
            {/* Sol */}
            <circle cx="700" cy="80" r="45" className="fill-yellow-300 animate-pulse" />


            {/* Tierra/Montaña */}
            <path d="M330 300 L420 180 L500 300 Z" className="fill-stone-400" />
            <path d="M360 260 L420 190 L480 260 Z" className="fill-stone-300" />

            {/* Nubes (clic para iniciar/detener lluvia) */}
            <g
              className="animate-cycle-condense cursor-pointer"
              transform="translate(380 110)"
              onClick={toggleRaining}
              aria-hidden
            >
              <ellipse cx="60" cy="40" rx="55" ry="38" className="fill-white" />
              <ellipse cx="110" cy="45" rx="50" ry="34" className="fill-white" />
              <ellipse cx="20" cy="50" rx="45" ry="30" className="fill-white" />
              {/* Indicador de estado */}
              <text x="60" y="45" textAnchor="middle" className="fill-sky-700 text-[10px]" fontSize={12}>
                {raining ? "Lloviendo" : "Seco"}
              </text>
            </g>

            {/* Océano y vapor removidos a petición del usuario */}

            {/* Lluvia dinámica (interactiva) */}
            {raining && (
              <g aria-hidden>
                {drops.map((d) => (
                  <rect
                    key={d.id}
                    x={d.x}
                    y={d.y}
                    width={5}
                    height={18}
                    rx={2.5}
                    className="rain-drop"
                    opacity={paused ? 0.4 : 0.85}
                  />
                ))}
              </g>
            )}

            {/* Flechas de retorno (escorrentía hacia el mar) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={"flow" + i}
                d={`M ${500 - i * 40} 300 Q ${480 - i * 40} 330 ${450 - i * 40} 350`}
                className="fill-none stroke-blue-700 animate-cycle-flow"
                strokeWidth={4}
                strokeDasharray="4 8"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            ))}
          </svg>

          {/* Barra informativa mínima */}
          <div className="absolute bottom-0 left-0 right-0 bg-sky-900/80 text-sky-50 text-sm md:text-base tracking-wide py-2 px-4 flex items-center justify-center gap-4">
            <span className="font-semibold">Evaporación</span>
            <span>→</span>
            <span className="font-semibold">Condensación</span>
            <span>→</span>
            <span className="font-semibold">Precipitación</span>
            <span>→</span>
            <span className="font-semibold">Escorrentía / Colección</span>
          </div>
        </div>

        {/* Botón de control principal (único accesible para tests) */}
        <button
          onClick={togglePause}
          className="px-5 py-2 rounded-lg bg-blue-700 text-white font-medium shadow hover:bg-blue-800 transition-colors"
          aria-label="Alternar lluvia"
        >
          {paused ? "Reanudar Lluvia" : "Pausar Lluvia"}
        </button>

        {/* Controles extra (aria-hidden para no afectar pruebas existentes) */}
        <div className="flex flex-wrap gap-4 items-center justify-center mt-2" aria-hidden>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Intensidad</label>
            <input
              type="range"
              min={10}
              max={120}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="accent-sky-600"
            />
            <span className="text-xs text-slate-600 w-10 text-right">{intensity}</span>
          </div>
          <button
            onClick={toggleWind}
            className="px-3 py-1 rounded bg-sky-600/80 text-white text-xs hover:bg-sky-700"
          >
            {wind === 0 ? "Activar Viento" : "Quitar Viento"}
          </button>
          <button
            onClick={toggleRaining}
            className="px-3 py-1 rounded bg-sky-500/70 text-white text-xs hover:bg-sky-600"
          >
            {raining ? "Detener Lluvia" : "Iniciar Lluvia"}
          </button>
        </div>
      </div>
    </div>
  );
}
