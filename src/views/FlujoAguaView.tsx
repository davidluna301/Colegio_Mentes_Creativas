import WaterCycle from "../components/FlujoAgua";

interface Props { paused?: boolean }

export default function FlujoAguaView(_props: Props) {
  void _props; // evitar lint por variable no usada (compatibilidad con rutas)
  return <WaterCycle />;
}
