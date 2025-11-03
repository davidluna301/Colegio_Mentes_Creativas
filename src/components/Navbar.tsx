import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-orange-400 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold tracking-wide">
          🧠 Mentes Creativas
        </h1>
        <ul className="flex space-x-4 text-lg">
          <li>
            <Link
              to="/"
              className="hover:text-yellow-200 transition-colors font-semibold"
            >
              Inicio
            </Link>
          </li>
          {/* Aquí se añadirán los enlaces a los programas educativos */}
          <li>
            <Link
              to="/programas"
              className="hover:text-yellow-200 transition-colors font-semibold"
            >
              Programas
            </Link>
          </li>
          <li>
            <Link
              to="/acerca"
              className="hover:text-yellow-200 transition-colors font-semibold"
            >
              Acerca de
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
