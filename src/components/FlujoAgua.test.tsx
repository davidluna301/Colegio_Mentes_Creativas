import { render, screen, fireEvent } from "@testing-library/react";
import FlujoAgua from "./FlujoAgua";

describe("FlujoAgua Component", () => {
  test("renderiza el título del componente", () => {
    render(<FlujoAgua />);
    const title = screen.getByText(/Ciclo del Agua Interactivo/i);
    expect(title).toBeInTheDocument();
  });

  test("renderiza el contenedor donde se monta Three.js", () => {
    render(<FlujoAgua />);
    const container = screen.getByRole("region"); // contenedor accesible
    expect(container).toBeInTheDocument();
  });

  test("el botón de animación cambia su texto al hacer clic", () => {
    render(<FlujoAgua />);

    const button = screen.getByRole("button", {
      name: /Detener Animación|Reanudar Ciclo/i,
    });

    expect(button).toBeInTheDocument();
    const initialText = button.textContent;

    fireEvent.click(button);
    const afterClickText = button.textContent;

    expect(afterClickText).not.toBe(initialText);
  });
});
