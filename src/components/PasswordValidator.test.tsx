import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordValidator from "../components/PasswordValidator";

describe("PasswordValidator Component", () => {
  test("muestra los requisitos iniciales como no cumplidos", () => {
    render(<PasswordValidator />);

    expect(screen.getByText(/Al menos 8 caracteres/)).toHaveTextContent("❌");
    expect(screen.getByText(/Contiene un número/)).toHaveTextContent("❌");
    expect(screen.getByText(/Contiene una letra mayúscula/)).toHaveTextContent("❌");
  });

  test("valida correctamente cuando se escribe una contraseña válida", () => {
    render(<PasswordValidator />);
    const input = screen.getByPlaceholderText("Escriba su contraseña");

    fireEvent.change(input, { target: { value: "Password123" } });

    expect(screen.getByText(/Al menos 8 caracteres/)).toHaveTextContent("✔️");
    expect(screen.getByText(/Contiene un número/)).toHaveTextContent("✔️");
    expect(screen.getByText(/Contiene una letra mayúscula/)).toHaveTextContent("✔️");
  });

  test("detecta cuando solo algunas reglas se cumplen", () => {
    render(<PasswordValidator />);
    const input = screen.getByPlaceholderText("Escriba su contraseña");

    fireEvent.change(input, { target: { value: "password123" } });

    expect(screen.getByText(/Al menos 8 caracteres/)).toHaveTextContent("✔️");
    expect(screen.getByText(/Contiene un número/)).toHaveTextContent("✔️");
    expect(screen.getByText(/Contiene una letra mayúscula/)).toHaveTextContent("❌");
  });
});
