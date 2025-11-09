// FlujoAguaView.tsx
import FlujoAgua from "../components/FlujoAgua";

export default function FlujoAguaView() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-[#f0fbff] text-[#03363d]">
      <aside className="w-full lg:w-1/3 p-8">
        <h1 className="text-3xl font-bold mb-4">Ciclo del Agua — Interactivo 3D</h1>
        <p className="mb-3">
          Explora el ciclo del agua en 3D: <strong>evaporación</strong> (sol y nubes),
          <strong> condensación</strong>, <strong>precipitación</strong> (lluvia), y
          <strong> escorrentía</strong> (ríos y lagos).
        </p>
        <ul className="list-disc pl-5">
          <li>Interacción: rota el modelo con el mouse (arrastrar)</li>
          <li>Pausar / Reanudar la animación con el botón</li>
          <li>Observa la lluvia, nubes, montañas, ríos y cuerpos de agua</li>
        </ul>
        <p className="mt-4 italic text-sm text-[#005662]">
          Consejo: usa la rueda del ratón o gesto de trackpad para acercar/alejar.
        </p>
      </aside>

      <main className="w-full lg:w-2/3 p-4">
        <FlujoAgua />
      </main>
    </div>
  );
}
