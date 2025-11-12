// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Inicializa el tema al cargar
  useEffect(() => {
    setIsMounted(true);
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved) {
      const isDarkMode = saved === "dark";
      root.classList.toggle("dark", isDarkMode);
      setIsDark(isDarkMode);
    } else if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      root.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");
    
    root.classList.toggle("dark");
    setIsDark(nextIsDark);
    
    const next = nextIsDark ? "dark" : "light";
    localStorage.setItem("theme", next);
    
    // Notifica a la app para que vistas activas reaccionen en vivo
    document.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme: next } }));
  };

  // Evitar hidratación no coincidente
  if (!isMounted) {
    return (
      <header className="h-16 sticky top-0 z-10 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border-b-4 border-[#4FC3F7]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo placeholder */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
          {/* Botón placeholder */}
          <div className="w-20 h-10 bg-white/20 rounded-xl animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      className="h-16 sticky top-0 z-10 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border-b-4 border-[#4FC3F7] shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Lado izquierdo: logo + marca */}
        <motion.div 
          className="flex items-center gap-3 font-black text-[#023047]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#FF6B6B] shadow-lg border-2 border-[#4FC3F7]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-lg">🎓</span>
          </motion.div>
          <motion.span 
            className="text-lg bg-gradient-to-r from-[#023047] to-[#219EBC] bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Colegio Mentes Creativas
          </motion.span>
        </motion.div>

        {/* Lado derecho: botón de tema interactivo */}
        
      </div>

      {/* Elemento decorativo inferior */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-[#4FC3F7] to-transparent rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </motion.header>
  );
};

export default Navbar;