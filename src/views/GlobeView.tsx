// UI: Spanish; Logic/comments: English
import Globe from "../components/Globe";

export default function GlobeView() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Info panel */}
      <section className="w-full lg:w-1/3 p-8 flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Globo Terráqueo Interactivo</h2>
        <p>
          Explora un globo 3D sencillo y toca los marcadores para ver datos básicos de
          ciudades importantes del mundo.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Girar:</strong> arrastra con el mouse.</li>
          <li><strong>Zoom:</strong> rueda del mouse o gestos.</li>
          <li><strong>Marcadores:</strong> clic para seleccionar y ver información.</li>
        </ul>
        <p className="text-sm opacity-80">
          Pensado para ser liviano y sin texturas externas, ideal para Vite + React.
        </p>
      </section>

      {/* Visual */}
      <section className="w-full lg:w-2/3">
        <Globe />
      </section>
    </div>
  );
}
