import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <div className="h-full w-full">
      {/* Aquí React Router renderiza el componente de la ruta activa */}
      <Outlet />
    </div>
  );
}
