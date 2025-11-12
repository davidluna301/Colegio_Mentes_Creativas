
// Componente decorativo de flujo de agua en CSS puro.
// Muestra varias "corrientes" animadas que simbolizan el movimiento continuo del agua.
export default function WaterFlow() {
  return (
    <div
      className="relative w-full max-w-4xl mx-auto h-20 md:h-24 overflow-hidden rounded-lg bg-gradient-to-r from-sky-300 via-sky-200 to-sky-300 shadow-inner border border-sky-400"
      aria-label="Flujo continuo de agua"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 h-full flow-stream"
          style={{
            animationDelay: `${i * 0.8}s`,
            transform: `translateY(${i * 3}px)`,
            opacity: 0.55 + (i % 2) * 0.15,
          }}
        />
      ))}
      {/* Brillo superior */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
    </div>
  );
}