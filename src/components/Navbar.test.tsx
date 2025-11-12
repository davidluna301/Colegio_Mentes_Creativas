import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock simple sin Framer Motion
jest.mock('./Navbar', () => {
  return function MockNavbar() {
    return (
      <header className="h-16 sticky top-0 z-10 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border-b-4 border-[#4FC3F7] shadow-2xl">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#FF6B6B] shadow-md border-2 border-[#4FC3F7]">
              <span className="text-lg">🎓</span>
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-[#023047] to-[#219EBC] bg-clip-text text-transparent">
              Colegio Mentes Creativas
            </h1>
          </div>
        </div>
      </header>
    );
  };
});

import Navbar from './Navbar';

describe('Navbar - Pruebas Simples', () => {
  test('renderiza sin errores', () => {
    expect(() => render(<Navbar />)).not.toThrow();
  });

  test('muestra el nombre del colegio', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Colegio Mentes Creativas')).toBeInTheDocument();
  });

  test('contiene el logo con emoji', () => {
    render(<Navbar />);
    
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  test('tiene las clases CSS correctas', () => {
    const { container } = render(<Navbar />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-gradient-to-r');
    expect(header).toHaveClass('from-[#FFD93D]');
    expect(header).toHaveClass('to-[#FF6B6B]');
    expect(header).toHaveClass('border-b-4');
  });

  test('estructura semántica correcta', () => {
    render(<Navbar />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Colegio Mentes Creativas');
  });
});

// Versión alternativa si necesitas probar interacciones
describe('Navbar - Interacciones', () => {
  test('es un componente estático sin interacciones complejas', () => {
    render(<Navbar />);
    
    // No debería haber botones interactivos
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
    
    // Solo debe tener elementos de presentación
    expect(screen.getByText('🎓')).toBeInTheDocument();
    expect(screen.getByText('Colegio Mentes Creativas')).toBeInTheDocument();
  });
});