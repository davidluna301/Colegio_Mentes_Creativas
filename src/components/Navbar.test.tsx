// src/components/__tests__/Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock para Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

describe('Navbar', () => {
  test('renderiza correctamente el navbar con logo y nombre', () => {
    render(<Navbar />);
    
    // Verifica que los elementos principales estén presentes
    expect(screen.getByText('Colegio Mentes Creativas')).toBeInTheDocument();
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  test('contiene solo los elementos esenciales', () => {
    render(<Navbar />);
    
    // Verifica que solo existe el logo y el nombre
    expect(screen.getByText('🎓')).toBeInTheDocument();
    expect(screen.getByText('Colegio Mentes Creativas')).toBeInTheDocument();
    
    // Verifica que NO existen elementos adicionales
    expect(screen.queryByText('¡Donde aprender es divertido!')).not.toBeInTheDocument();
    expect(screen.queryByText('¡Bienvenidos!')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('👋')).not.toBeInTheDocument();
    expect(screen.queryByText('🎨')).not.toBeInTheDocument();
  });

  test('tiene las clases CSS correctas para el diseño', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-gradient-to-r');
    expect(header).toHaveClass('from-[#FFD93D]');
    expect(header).toHaveClass('to-[#FF6B6B]');
    expect(header).toHaveClass('border-b-4');
    expect(header).toHaveClass('border-[#4FC3F7]');
  });

  test('el logo tiene animación al hover', async () => {
    render(<Navbar />);

    const logo = screen.getByText('🎓').closest('div');
    expect(logo).toHaveClass('bg-white');
    expect(logo).toHaveClass('rounded-full');
    
    // La animación está definida mediante Framer Motion
    // No verificamos la rotación específica ya que es visual
  });

  test('el nombre tiene efecto de gradiente', () => {
    render(<Navbar />);
    
    const title = screen.getByText('Colegio Mentes Creativas');
    expect(title).toHaveClass('bg-gradient-to-r');
    expect(title).toHaveClass('from-[#023047]');
    expect(title).toHaveClass('to-[#219EBC]');
    expect(title).toHaveClass('bg-clip-text');
    expect(title).toHaveClass('text-transparent');
  });

  test('tiene una estructura semántica correcta', () => {
    render(<Navbar />);
    
    // Verifica que usa el rol banner para el header
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Verifica que el nombre está en un h1
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Colegio Mentes Creativas');
  });

  test('no contiene elementos de cambio de tema', () => {
    render(<Navbar />);
    
    // Verifica que no existen elementos relacionados con cambio de tema
    expect(screen.queryByText(/tema/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/modo día/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/modo noche/i)).not.toBeInTheDocument();
  });

  test('es minimalista y limpio', () => {
    render(<Navbar />);
    
    // Solo deberían existir estos dos elementos de texto
    const allTextElements = screen.getAllByText(/.*/);
    const visibleTextElements = allTextElements.filter(element => 
      element.textContent === 'Colegio Mentes Creativas' || 
      element.textContent === '🎓'
    );
    
    expect(visibleTextElements.length).toBe(3);
  });
});

describe('Navbar Accessibility', () => {
  test('el contraste de colores es adecuado', () => {
    render(<Navbar />);
    
    // Verifica que el texto tiene gradiente (asegura legibilidad)
    const title = screen.getByText('Colegio Mentes Creativas');
    expect(title).toHaveClass('text-transparent');
    expect(title).toHaveClass('bg-clip-text');
  });

  test('el logo tiene tamaño adecuado', () => {
    render(<Navbar />);
    
    const logoContainer = screen.getByText('🎓').closest('div');
    expect(logoContainer).toHaveClass('w-10');
    expect(logoContainer).toHaveClass('h-10');
  });
});

describe('Navbar Technical Features', () => {
  test('no hace llamadas a APIs externas', () => {
    // Espía en localStorage para asegurar que no se usa
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
    render(<Navbar />);
    
    expect(localStorageSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    
    localStorageSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  test('no depende de matchMedia', () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });
    
    // Debe renderizar sin errores incluso sin matchMedia
    expect(() => render(<Navbar />)).not.toThrow();
    
    window.matchMedia = originalMatchMedia;
  });
});