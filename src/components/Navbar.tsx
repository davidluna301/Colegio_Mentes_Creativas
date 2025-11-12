// src/components/Navbar.tsx
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.header 
      className="h-16 sticky top-0 z-10 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border-b-4 border-[#4FC3F7] shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#FF6B6B] shadow-md border-2 border-[#4FC3F7]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-lg">🎓</span>
          </motion.div>
          <motion.h1 
            className="text-xl font-black bg-gradient-to-r from-[#023047] to-[#219EBC] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Colegio Mentes Creativas
          </motion.h1>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;