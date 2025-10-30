import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "../components/TodoList";

describe("TodoList Component", () => {
  test("agrega una tarea correctamente", () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Nueva tarea");
    const addButton = screen.getByText("Agregar");

    // Simular agregar tarea
    fireEvent.change(input, { target: { value: "Comprar leche" } });
    fireEvent.click(addButton);

    // Validar que la tarea aparece en la lista
    expect(screen.getByText("Comprar leche")).toBeInTheDocument();
  });

  test("elimina una tarea correctamente", () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Nueva tarea");
    const addButton = screen.getByText("Agregar");

    // Agregar tarea
    fireEvent.change(input, { target: { value: "Estudiar React" } });
    fireEvent.click(addButton);

    // Eliminar tarea
    const deleteButton = screen.getByText("Eliminar");
    fireEvent.click(deleteButton);

    // Validar que la tarea desapareció
    expect(screen.queryByText("Estudiar React")).not.toBeInTheDocument();
  });

  test("no agrega tareas vacías", () => {
    render(<TodoList />);

    const addButton = screen.getByText("Agregar");
    fireEvent.click(addButton);

    // Validar que no hay elementos en la lista
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });

  test("agrega varias tareas y elimina una específica", () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Nueva tarea");
    const addButton = screen.getByText("Agregar");

    // Agregar varias tareas
    fireEvent.change(input, { target: { value: "Tarea 1" } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: "Tarea 2" } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: "Tarea 3" } });
    fireEvent.click(addButton);

    // Eliminar la segunda tarea
    const deleteButtons = screen.getAllByText("Eliminar");
    fireEvent.click(deleteButtons[1]); // eliminar "Tarea 2"

    expect(screen.queryByText("Tarea 2")).not.toBeInTheDocument();
    expect(screen.getByText("Tarea 1")).toBeInTheDocument();
    expect(screen.getByText("Tarea 3")).toBeInTheDocument();
  });
});
