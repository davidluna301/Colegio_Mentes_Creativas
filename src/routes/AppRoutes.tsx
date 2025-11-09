import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

// Views
import HomePage from "../views/HomePage";
import LayoutsView from "../views/LayoutsView";
import SettingsView from "../views/SettingsView";
import FlujoAguaView from "../views/FlujoAguaView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="layouts" element={<LayoutsView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="FlujoAgua" element={<FlujoAguaView />} />
      </Route>
    </Routes>
  );
}