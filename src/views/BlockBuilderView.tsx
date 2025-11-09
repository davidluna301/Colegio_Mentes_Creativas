// UI: Spanish; Logic/comments: English
import BlockBuilder from "../components/BlockBuilder";

export default function BlockBuilderView() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Info panel */}
      <section className="w-full lg:w-1/3 p-8 flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Construcción con Bloques</h2>
        <p>
          Crea estructuras tipo <strong>Minecraft</strong> con el mouse. Haz clic sobre un bloque
          para construir adyacente a la cara seleccionada. <kbd>Shift</kbd> o modo{" "}
          <strong>Borrar</strong> elimina el bloque.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Construir:</strong> Coloca nuevos bloques.</li>
          <li><strong>Borrar:</strong> Elimina bloques con un clic.</li>
          <li><strong>Exportar/Importar:</strong> Guarda o carga tu mundo en JSON.</li>
          <li><strong>Reiniciar:</strong> Limpia el plano.</li>
        </ul>
        <p className="text-sm opacity-80">
          UI en español; comentarios y lógica en inglés como pediste. ✨
        </p>
      </section>

      {/* Visual */}
      <section className="w-full lg:w-2/3">
        <BlockBuilder />
      </section>
    </div>
  );
}
