import FlujoAguaview from "../views/FlujoAguaView";
import { useState } from "react";

export default function FlujoAgua() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen bg-[#dff3ff] text-black p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Ciclo del Agua Interactivo 3D
      </h1>

<<<<<<< HEAD
      {/* Viewer 3D */}
      <div className="flex justify-center w-full h-[70vh]">
        <FlujoAguaview paused={paused} />
      </div>
=======
      <div
        ref={mountRef}
        role="region"
        aria-label="Contenedor Three.js - Ciclo del Agua"
        className="w-4/5 h-3/4 border-4 border-[#4fc3f7] rounded-2xl shadow-lg"
      />
>>>>>>> 688ae11 (Solucion de test)

      {/* Botones */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPaused(!paused)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          {paused ? "Reanudar Animación" : "Pausar Animación"}
        </button>
      </div>

      {/* Menú acordeón */}
      <div className="mt-6 w-full max-w-4xl mx-auto space-y-3">
        <Acordeon titulo="Evaporación">
          El sol calienta el agua del océano, que sube como vapor hacia la atmósfera.
        </Acordeon>

        <Acordeon titulo="Condensación">
          El vapor se enfría en las alturas, formando nubes debido a la condensación.
        </Acordeon>

        <Acordeon titulo="Precipitación">
          Cuando las nubes se saturan, liberan agua como lluvia o nieve.
        </Acordeon>

        <Acordeon titulo="Escorrentía">
          El agua corre por montañas y ríos hasta volver al océano.
        </Acordeon>

        <Acordeon titulo="Infiltración">
          Parte del agua se filtra en el suelo y viaja como corriente subterránea.
        </Acordeon>
      </div>
    </div>
  );
}

interface AcordeonProps {
  titulo: string;
  children: React.ReactNode;
}

function Acordeon({ titulo, children }: AcordeonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-400 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 bg-gray-200 font-semibold text-left"
      >
        {titulo}
      </button>

      {open && (
        <div className="px-4 py-2 bg-white border-t border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}


