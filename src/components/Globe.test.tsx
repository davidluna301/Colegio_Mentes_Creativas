import { render, screen } from "@testing-library/react";
import Globe from "../components/Globe";

test("muestra datos básicos del globo", () => {
  render(<Globe />);
  expect(screen.getByText(/Datos básicos/i)).toBeInTheDocument();
});
