// src/components/Navbar.test.tsx
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Navbar - Renderizado", () => {
  test("renderiza el título principal 'UCC : Prácticas Desarrollo'", () => {
    render(<Navbar />);
    expect(screen.getByText(/UCC : Prácticas Desarrollo/i)).toBeInTheDocument();
  });

  test("renderiza el botón con el texto 'Tema'", () => {
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /Tema/i })).toBeInTheDocument();
  });
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window.ResizeObserver === "undefined") {
  (window as any).ResizeObserver = ResizeObserverMock;
}
if (typeof global.ResizeObserver === "undefined") {
  (global as any).ResizeObserver = ResizeObserverMock;
}

