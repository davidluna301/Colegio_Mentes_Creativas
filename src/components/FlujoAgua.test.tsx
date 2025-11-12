import { render, screen, fireEvent } from "@testing-library/react";
import FlujoAgua from "./FlujoAgua";

describe("FlujoAgua Component", () => {
  test("renderiza el título principal", () => {
    render(<FlujoAgua />);
    expect(screen.getByText(/Ciclo del Agua/i)).toBeInTheDocument();
  });

  test("renderiza el contenedor del modelo 3D", () => {
    render(<FlujoAgua />);
    const viewer = screen.getByRole("region");
    expect(viewer).toBeInTheDocument();
  });

  test("el botón pausa y reanuda cambiando texto y clase", () => {
    render(<FlujoAgua />);
    const button = screen.getByRole("button");
    const container = screen.getByTestId("water-cycle");

    expect(container.className).not.toMatch(/paused/);
    fireEvent.click(button);
    expect(container.className).toMatch(/paused/);
    const firstText = button.textContent;
    fireEvent.click(button);
    const secondText = button.textContent;
    expect(firstText).not.toBe(secondText);
    expect(container.className).not.toMatch(/paused/);
  });
});
