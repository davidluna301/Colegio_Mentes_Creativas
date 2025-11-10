import { motion } from "framer-motion";

export default function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[#F4F9FF]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
      >

        {/* Logo ilustrado estilo infantil */}
        <motion.div
          className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFB703] to-[#FB8500] flex items-center justify-center shadow-xl"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <svg
            className="w-24 h-24"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Carita con gorrito (estilo amigable) */}
            <circle cx="50" cy="50" r="40" fill="#FFF" />
            <circle cx="38" cy="45" r="5" fill="#333" />
            <circle cx="62" cy="45" r="5" fill="#333" />
            <path d="M35 60 Q50 72 65 60" stroke="#333" strokeWidth="4" fill="transparent" />
            <path d="M25 30 L75 30 L65 10 L35 10 Z" fill="#219EBC" />
          </svg>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#023047] mb-4 drop-shadow-sm">
          Colegio Mentes Creativas
        </h2>

        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-[#333]">
          Un espacio donde aprender es una aventura y cada idea tiene un lugar para florecer.
          Aquí exploramos, construimos y soñamos, mientras desarrollamos proyectos llenos de creatividad.
        </p>

      </motion.div>

      {/* Dibujos decorativos */}
      <motion.div
        className="absolute bottom-10 left-10 opacity-40"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
        <span className="text-6xl">🌱</span>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 opacity-40"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
      </motion.div>
    </div>
  );
}
