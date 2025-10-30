// src/views/LayoutsView.tsx

export default function LayoutsView() {
  return (
    <div className="space-y-8">
      {/* A) Container básico */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Container básico
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Usa <code>container mx-auto px-4</code> para crear secciones centradas
            con padding lateral responsivo.
          </p>
        </div>
      </section>

      {/* B) MaxWidth para textos */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-prose md:max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            MaxWidth para textos
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-200 leading-relaxed">
            Controla el ancho máximo del bloque de texto con <code>max-w-prose</code> 
            o <code>max-w-3xl</code> y centra con <code>mx-auto</code>. Esto mejora la 
            legibilidad en pantallas grandes.
          </p>
        </div>
      </section>

      {/* C) Grilla centrada dentro de un container */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Grid dentro de container
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
              >
                Card {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
