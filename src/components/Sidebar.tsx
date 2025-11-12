import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHome, 
  FaWater, 
  FaCube, 
  FaGlobeAmericas,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
  emoji?: string;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome />, emoji: "🏠" },
  { label: "Ciclo del Agua", route: "/FlujoAgua", icon: <FaWater />, emoji: "💧" },
  { label: "Bloques 3D", route: "/bloques", icon: <FaCube />, emoji: "🧊" },
  { label: "Globo Interactivo", route: "/globo", icon: <FaGlobeAmericas />, emoji: "🌎" },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(true);

  const renderNavItem = ({ label, route, icon, emoji }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 font-medium
         transition-all duration-300 group relative overflow-hidden
         ${isActive 
           ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D] text-white shadow-lg scale-105" 
           : "bg-white/80 hover:bg-white text-[#023047] hover:scale-105 hover:shadow-md"
         }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Efecto de fondo animado */}
          <motion.div
            className={`absolute inset-0 rounded-xl ${
              isActive 
                ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFD93D]" 
                : "bg-gradient-to-r from-[#B3E5FC] to-[#81D4FA]"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="relative z-10 flex items-center gap-3">
            {/* Icono/Emoji con animación */}
            <motion.div
              className={`text-xl ${isActive ? "text-white" : "text-[#FF6B6B]"}`}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {emoji}
            </motion.div>
            
            {/* Icono React */}
            <div className={`text-lg ${isActive ? "text-white" : "text-[#219EBC]"}`}>
              {icon}
            </div>
            
            {/* Texto */}
            <span className="font-bold text-sm tracking-wide">
              {label}
            </span>
          </div>

          {/* Indicador activo */}
          {isActive && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <motion.aside 
      className="hidden md:block w-full md:w-[280px] bg-gradient-to-b from-[#E1F5FE] to-[#B3E5FC] border-r-4 border-[#FFD93D] shadow-2xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="p-4 space-y-4">
        {/* Header del Sidebar */}
        <motion.div 
          className="text-center mb-6 pt-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D] flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-black bg-gradient-to-r from-[#D50000] to-[#FF6F00] bg-clip-text text-transparent">
            Menú de Aventuras
          </h3>
        </motion.div>

        {/* Acordeón Main Items */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-[#B3E5FC]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setOpenMain(!openMain)}
            className="w-full text-left flex items-center justify-between rounded-xl px-4 py-3 
                       bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white font-bold
                       shadow-md hover:shadow-lg transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ rotate: openMain ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                className="text-lg"
              >
                🚀
              </motion.span>
              <span className="text-sm tracking-wide">Misiones Creativas</span>
            </div>
            <motion.div
              animate={{ rotate: openMain ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className="text-white/80"
            >
              {openMain ? <FaChevronUp /> : <FaChevronDown />}
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openMain && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <motion.div 
                  className="pt-4 space-y-2"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {mainItems.map((item, index) => (
                    <motion.div
                      key={item.route}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {renderNavItem(item)}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Elementos decorativos */}
        <motion.div 
          className="flex justify-center gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="text-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="text-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            🌟
          </motion.div>
          <motion.div
            className="text-2xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
          >
            🎨
          </motion.div>
        </motion.div>

        {/* Footer decorativo */}
        <motion.div 
          className="text-center text-xs text-[#0288D1] font-semibold pt-4 border-t border-[#B3E5FC]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>¡Elige tu aventura!</p>
          <p className="text-[#FF6F00]">✨ Aprender nunca fue tan divertido ✨</p>
        </motion.div>
      </div>
    </motion.aside>
  );
}