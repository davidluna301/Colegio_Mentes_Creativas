// src/components/Navbar.tsx
import React, { useEffect } from "react";

const Navbar: React.FC = () => {
  // Inicializa el tema al cargar
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved) {
      root.classList.toggle("dark", saved === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.classList.toggle("dark") ? "dark" : "light";
    localStorage.setItem("theme", next);
    // Notifica a la app para que vistas activas reaccionen en vivo
    document.dispatchEvent(new CustomEvent("theme:changed", { detail: { theme: next } }));
  };

  return (
    <header className="h-14 sticky top-0 z-10 bg-white/70 dark:bg-slate-900/60 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Lado izquierdo: logo + marca */}
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white">
            U
          </div>
          <span>UCC : Prácticas Desarrollo</span>
        </div>

        {/* Lado derecho: botón de tema */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition"
          >
            Tema
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
