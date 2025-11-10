import { render, screen, fireEvent } from "@testing-library/react";
import FlujoAgua from "./FlujoAgua";

describe("FlujoAgua Component", () => {
  test("renderiza el título principal", () => {
    render(<FlujoAgua />);
    expect(
      screen.getByText(/Ciclo del Agua Interactivo/i)
    ).toBeInTheDocument();
  });

  test("renderiza el contenedor del modelo 3D", () => {
    render(<FlujoAgua />);
    const viewer = screen.getByRole("region");
    expect(viewer).toBeInTheDocument();
  });

  test("el botón de animación cambia su texto al hacer clic", () => {
    render(<FlujoAgua />);
    const button = screen.getByRole("button");

    const initText = button.textContent;
    fireEvent.click(button);
    const finalText = button.textContent;

    expect(initText).not.toBe(finalText);
  });
});
