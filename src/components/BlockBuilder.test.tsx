import { render, screen } from "@testing-library/react";
import BlockBuilder from "./BlockBuilder";

test("renderiza controles de BlockBuilder", () => {
  render(<BlockBuilder />);
  expect(screen.getByText(/Modo/i)).toBeInTheDocument();
  expect(screen.getByText(/Construir/i)).toBeInTheDocument();
  expect(screen.getByText(/Borrar/i)).toBeInTheDocument();
});
