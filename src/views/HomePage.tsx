import { motion } from "framer-motion";

export default function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* SVG de React */}
        <svg
          className="w-32 h-32 mx-auto mb-6"
          viewBox="0 0 841.9 595.3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#61DAFB">
            <path d="M421 296.5c0-25.6 20.8-46.4 46.4-46.4s46.4 20.8 46.4 46.4-20.8 46.4-46.4 46.4-46.4-20.8-46.4-46.4z"/>
            <path d="M421 183.5c-68.7 0-124.5 55.8-124.5 124.5s55.8 124.5 124.5 124.5 124.5-55.8 124.5-124.5S489.7 183.5 421 183.5zm0 219.8c-52.6 0-95.3-42.7-95.3-95.3s42.7-95.3 95.3-95.3 95.3 42.7 95.3 95.3-42.7 95.3-95.3 95.3z"/>
          </g>
        </svg>

        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Bienvenido a React 🚀
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Este es un ejemplo simple de una landing page responsiva usando{" "}
          <span className="font-bold text-sky-300">React + TailwindCSS</span>.
        </p>
        <div className="space-x-4">
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition">
            Empezar
          </button>
          <button className="border border-indigo-600 text-indigo-600 bg-white px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition">
            Ver más
          </button>
        </div>
      </motion.div>
    </div>
  );
}
