import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido dinámico (cada vista) */}
        <main className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
