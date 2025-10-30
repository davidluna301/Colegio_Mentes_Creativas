import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClickCounter from "../components/ClickCounter";

describe("ClickCounter Component", () => {
  beforeEach(() => {
    // Mock localStorage
    let store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      clear: () => { store = {}; },
      removeItem: (key: string) => { delete store[key]; },
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  test("persiste el valor en localStorage", () => {
    localStorage.setItem("click-counter", "5");
    render(<ClickCounter />);

    expect(screen.getByText(/Has hecho clic:/)).toHaveTextContent("Has hecho clic: 5 veces");

    const button = screen.getByRole("button", { name: /Haz clic aquí/i });
    fireEvent.click(button);

    expect(screen.getByText(/Has hecho clic:/)).toHaveTextContent("Has hecho clic: 6 veces");
    expect(localStorage.getItem("click-counter")).toBe("6");
  });
});
