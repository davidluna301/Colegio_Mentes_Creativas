import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../views/HomePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Aquí luego agregaremos las rutas a los programas educativos */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
