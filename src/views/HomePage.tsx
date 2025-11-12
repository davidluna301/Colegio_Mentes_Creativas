import { motion } from "framer-motion";

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1F5FE] via-[#B3E5FC] to-[#81D4FA] relative overflow-hidden">
      {/* Fondo con elementos decorativos */}
      <div className="absolute inset-0">
        {/* Nubes decorativas */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-5xl opacity-25"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          ☁️
        </motion.div>
        
        {/* Estrellas/burbujas flotantes */}
        <motion.div
          className="absolute top-1/3 left-1/4 text-3xl"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/3 text-2xl"
          animate={{ y: [0, -15, 0], rotate: [0, -360] }}
          transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-16 px-6 relative z-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >

          {/* Logo principal mejorado */}
          <motion.div
            className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#6BCF7F] flex items-center justify-center shadow-2xl border-4 border-white"
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <img
             src="/logo2.png"
             alt="Logo"
             className="w-32 h-32 object-contain rounded-full"
             />
          </motion.div>

          {/* Título principal */}
          <motion.h1
            className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-[#D50000] via-[#FF6F00] to-[#33691E] bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Colegio Mentes Creativas
          </motion.h1>

          {/* Subtítulo animado */}
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[#01579B] font-semibold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            🚀 Donde el aprendizaje es una <span className="text-[#FF4081] font-bold">aventura épica</span> 
            <br />
            y cada idea se convierte en un <span className="text-[#7B1FA2] font-bold">superpoder</span> ✨
          </motion.p>

          {/* Descripción principal */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-[#B3E5FC] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="text-lg md:text-xl text-[#0277BD] leading-relaxed">
              ¡Bienvenidos a nuestro mundo mágico de aprendizaje! 
              Aquí exploramos galaxias de conocimiento, construimos castillos de ideas 
              y hacemos realidad los sueños más increíbles. 
              <span className="block mt-3 text-[#FF6F00] font-bold">
                ¡Prepara tu imaginación para despegar! 🎨🚀
              </span>
            </p>
          </motion.div>

          {/* Elementos interactivos */}
          <motion.div
            className="flex gap-6 justify-center items-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              className="text-4xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎨
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
            >
              🔬
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
            >
              📚
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.9 }}
            >
              🎭
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elementos decorativos inferiores */}
      <motion.div
        className="absolute bottom-8 left-8 text-5xl"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.6 }}
        transition={{ duration: 1, delay: 1.5 }}
        whileHover={{ scale: 1.2, opacity: 1 }}
      >
        🌈
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-4xl"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.6 }}
        transition={{ duration: 1, delay: 1.8 }}
        whileHover={{ scale: 1.2, opacity: 1 }}
      >
        🦄
      </motion.div>

      {/* Olas decorativas en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
          <path 
            d="M0,0 V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="#4FC3F7"
          ></path>
          <path 
            d="M0,0 V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            fill="#29B6F6"
          ></path>
          <path 
            d="M0,0 V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="#0288D1"
          ></path>
        </svg>
      </div>
    </div>
  );
}