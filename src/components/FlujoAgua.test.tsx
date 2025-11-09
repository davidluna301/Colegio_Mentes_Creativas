// FlujoAgua.test.tsx
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import FlujoAgua from "./FlujoAgua";

// Mocks para three y OrbitControls (evita crear GL contexts durante tests)
jest.mock("three", () => {
  const actualThree = jest.requireActual("three");
  // mock WebGLRenderer minimal
  class MockRenderer {
    domElement = document.createElement("canvas");
    setSize() {}
    render() {}
    dispose() {}
  }
  return {
    ...actualThree,
    WebGLRenderer: MockRenderer,
    // keep other classes functional enough for the component not to crash
  };
});

jest.mock("three/examples/jsm/controls/OrbitControls", () => {
  return {
    OrbitControls: jest.fn().mockImplementation(() => {
      return {
        enableDamping: true,
        dampingFactor: 0.05,
        minDistance: 5,
        maxDistance: 30,
        update: jest.fn(),
        dispose: jest.fn(),
      };
    }),
  };
});

describe("FlujoAgua component (interacción básica)", () => {
  test("renderiza el contenedor de three y el botón toggle", () => {
    render(<FlujoAgua />);

    const mount = screen.getByTestId("three-mount");
    expect(mount).toBeInTheDocument();

    const button = screen.getByTestId("toggle-button");
    expect(button).toBeInTheDocument();
    // texto inicial debe ser detener animación (estado por defecto true)
    expect(button).toHaveTextContent(/Detener Animación|Detener/);
  });

  test("al hacer click cambia el texto del botón (pausar / reanudar)", () => {
    render(<FlujoAgua />);

    const button = screen.getByTestId("toggle-button");
    // click -> pausa (cambia a 'Reanudar Animación')
    fireEvent.click(button);
    expect(button).toHaveTextContent(/Reanudar Animación|Reanudar/);

    // click otra vez -> volver a 'Detener Animación'
    fireEvent.click(button);
    expect(button).toHaveTextContent(/Detener Animación|Detener/);
  });
});
