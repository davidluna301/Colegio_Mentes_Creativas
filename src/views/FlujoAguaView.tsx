import FlujoAgua from "../components/FlujoAgua";

export default function FlujoAguaView() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-[#f1f8e9] text-[#004d61]">
      {/* Panel de información */}
      <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-4 text-[#00796b]">
          El Ciclo del Agua 💧
        </h2>
        <p className="text-lg mb-3 leading-relaxed">
          El ciclo del agua describe cómo el agua circula de forma continua en
          la Tierra. El sol calienta los océanos y ríos, produciendo
          <strong> evaporación</strong>.
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          El vapor de agua sube y se enfría, formando <strong>nubes</strong> en
          un proceso de <strong>condensación</strong>.
        </p>
        <p className="text-lg mb-3 leading-relaxed">
          Finalmente, el agua vuelve a la superficie como{" "}
          <strong>precipitación</strong> (lluvia, nieve o granizo), cerrando el
          ciclo natural que permite la vida.
        </p>
        <p className="text-md italic text-[#00796b] mt-4">
          “Nada se pierde, todo se transforma… incluso el agua que bebemos hoy
          pudo haber sido una nube hace unos días.”
        </p>
      </div>

      {/* Visualización interactiva */}
      <div className="w-full lg:w-2/3">
        <FlujoAgua />
      </div>
    </div>
  );
}
