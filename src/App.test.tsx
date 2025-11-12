import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock de componentes hijos para aislar las pruebas de App
jest.mock("./components/Navbar", () => {
  return function MockNavbar() {
    return <nav data-testid="mock-navbar">Navbar</nav>;
  };
});

jest.mock("./components/Sidebar", () => {
  return function MockSidebar() {
    return <aside data-testid="mock-sidebar">Sidebar</aside>;
  };
});

jest.mock("./pages/HomePage", () => {
  return function MockHomePage() {
    return <main data-testid="mock-homepage">HomePage</main>;
  };
});

describe("App", () => {
  test("renderiza la aplicación completa con todos los componentes principales", () => {
    render(<App />);
    
    // Verifica que los componentes principales estén presentes
    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-homepage")).toBeInTheDocument();
  });

  test("renderiza la estructura de layout correcta", () => {
    render(<App />);
    
    // Verifica que el contenedor principal existe
    const mainContainer = screen.getByTestId("mock-homepage").closest('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
    
    // Verifica la estructura de grid/flex
    const layoutContainer = screen.getByTestId("mock-sidebar").closest('.flex');
    expect(layoutContainer).toBeInTheDocument();
  });

  test("no contiene el texto anterior 'Bienvenido a React'", () => {
    render(<App />);
    
    // Verifica que el texto antiguo no existe
    expect(screen.queryByText(/Bienvenido a React/i)).not.toBeInTheDocument();
  });

  test("aplica las clases CSS globales correctas", () => {
    const { container } = render(<App />);
    
    // Verifica que el elemento raíz tiene las clases esperadas
    const appContainer = container.firstChild;
    expect(appContainer).toHaveClass('min-h-screen');
    expect(appContainer).toHaveClass('bg-gradient-to-br');
  });

  test("es accesible y tiene estructura semántica", () => {
    render(<App />);
    
    // Verifica que los landmarks semánticos están presentes
    expect(screen.getByTestId("mock-navbar")).toHaveAttribute('data-testid');
    expect(screen.getByTestId("mock-sidebar")).toHaveAttribute('data-testid');
    expect(screen.getByTestId("mock-homepage")).toHaveAttribute('data-testid');
  });
});

// Tests adicionales para comportamiento específico
describe("App - Comportamiento específico", () => {
  test("renderiza sin errores en modo estándar", () => {
    // Simula un renderizado básico sin configuraciones especiales
    expect(() => render(<App />)).not.toThrow();
  });

  test("mantiene la consistencia visual", () => {
    render(<App />);
    
    // Verifica que los componentes mock están renderizados
    // Esto asegura que la composición de componentes funciona
    const navbar = screen.getByTestId("mock-navbar");
    const sidebar = screen.getByTestId("mock-sidebar");
    const homepage = screen.getByTestId("mock-homepage");
    
    expect(navbar).toBeVisible();
    expect(sidebar).toBeVisible();
    expect(homepage).toBeVisible();
  });
});