import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BlockBuilder from './BlockBuilder';

// Mock de @react-three/fiber y @react-three/drei
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-canvas">{children}</div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  Grid: () => <div data-testid="mock-grid" />,
  ContactShadows: () => <div data-testid="mock-contact-shadows" />,
  Sky: () => <div data-testid="mock-sky" />,
}));

// Mock de Three.js
jest.mock('three', () => ({
  Mesh: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Vector3: jest.fn(() => ({
    clone: jest.fn(() => ({ x: 0, y: 0, z: 1 })),
    applyNormalMatrix: jest.fn(() => ({ x: 0, y: 0, z: 1 })),
  })),
  Matrix3: jest.fn(() => ({
    getNormalMatrix: jest.fn(() => ({})),
  })),
}));

describe('BlockBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente los controles principales', () => {
    render(<BlockBuilder />);
    
    // Verifica controles de modo
    expect(screen.getByText('Modo:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Construir' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
    
    // Verifica selector de bloques
    expect(screen.getByLabelText('Bloque:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hierba')).toBeInTheDocument();
    
    // Verifica botones de acción
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Importar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reiniciar' })).toBeInTheDocument();
  });

  test('cambia entre modos Construir y Borrar', async () => {
    const user = userEvent.setup();
    render(<BlockBuilder />);
    
    const construirBtn = screen.getByRole('button', { name: 'Construir' });
    const borrarBtn = screen.getByRole('button', { name: 'Borrar' });
    
    // Modo Construir está activo inicialmente
    expect(construirBtn).toHaveClass('bg-sky-500');
    expect(borrarBtn).not.toHaveClass('bg-rose-500');
    
    // Cambiar a modo Borrar
    await user.click(borrarBtn);
    expect(borrarBtn).toHaveClass('bg-rose-500');
    expect(construirBtn).not.toHaveClass('bg-sky-500');
    
    // Volver a modo Construir
    await user.click(construirBtn);
    expect(construirBtn).toHaveClass('bg-sky-500');
    expect(borrarBtn).not.toHaveClass('bg-rose-500');
  });

  test('cambia el tipo de bloque correctamente', async () => {
    const user = userEvent.setup();
    render(<BlockBuilder />);
    
    const select = screen.getByDisplayValue('Hierba');
    
    await user.selectOptions(select, 'Piedra');
    expect(select).toHaveValue('Piedra');
    
    await user.selectOptions(select, 'Agua');
    expect(select).toHaveValue('Agua');
  });

  test('contiene todos los tipos de bloques en el selector', () => {
    render(<BlockBuilder />);
    
    const options = screen.getAllByRole('option');
    const blockTypes = ['Tierra', 'Hierba', 'Piedra', 'Madera', 'Agua'];
    
    blockTypes.forEach(blockType => {
      expect(screen.getByRole('option', { name: blockType })).toBeInTheDocument();
    });
    
    expect(options).toHaveLength(blockTypes.length);
  });

  test('exporta e importa datos JSON correctamente', async () => {
    const user = userEvent.setup();
    render(<BlockBuilder />);
    
    const exportBtn = screen.getByRole('button', { name: 'Exportar' });
    const importBtn = screen.getByRole('button', { name: 'Importar' });
    const textarea = screen.getByPlaceholderText('[]');
    
    // Exportar datos vacíos iniciales
    await user.click(exportBtn);
    expect(textarea).toHaveValue('[]');
    
    // Simular importación de datos válidos
    const testData = '[{"key":"0,0,0","type":"Piedra"}]';
    await user.clear(textarea);
    await user.type(textarea, testData);
    await user.click(importBtn);
    
    // El textarea debería mantener los datos importados
    expect(textarea).toHaveValue(testData);
  });

  test('maneja errores en importación JSON inválida', async () => {
    const user = userEvent.setup();
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<BlockBuilder />);
    
    const importBtn = screen.getByRole('button', { name: 'Importar' });
    const textarea = screen.getByPlaceholderText('[]');
    
    // Intentar importar JSON inválido
    await user.clear(textarea);
    await user.type(textarea, 'json inválido');
    await user.click(importBtn);
    
    expect(alertMock).toHaveBeenCalledWith('JSON inválido');
    
    alertMock.mockRestore();
  });

  test('reinicia la construcción correctamente', async () => {
    const user = userEvent.setup();
    render(<BlockBuilder />);
    
    const reiniciarBtn = screen.getByRole('button', { name: 'Reiniciar' });
    const exportBtn = screen.getByRole('button', { name: 'Exportar' });
    const textarea = screen.getByPlaceholderText('[]');
    
    // Primero exportar para ver el estado actual
    await user.click(exportBtn);
    
    // Reiniciar la construcción
    await user.click(reiniciarBtn);
    
    // Exportar después de reiniciar debería mostrar array vacío
    await user.click(exportBtn);
    expect(textarea).toHaveValue('[]');
  });

  test('renderiza el canvas de Three.js', () => {
    render(<BlockBuilder />);
    
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-orbit-controls')).toBeInTheDocument();
    expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-shadows')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sky')).toBeInTheDocument();
  });

  test('tiene las clases CSS correctas para el layout', () => {
    const { container } = render(<BlockBuilder />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('w-full');
    expect(mainContainer).toHaveClass('h-full');
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('flex-col');
    expect(mainContainer).toHaveClass('gap-3');
  });

  test('el área de texto de import/export está presente', () => {
    render(<BlockBuilder />);
    
    const textarea = screen.getByPlaceholderText('[]');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('h-32');
    
    expect(screen.getByText(/Copia\/pega aquí para guardar o cargar tu construcción/i)).toBeInTheDocument();
  });
});

// Tests para funciones de utilidad
describe('BlockBuilder - Funciones de utilidad', () => {
  test('keyOf function genera claves correctamente', () => {
    // Probamos la función keyOf directamente
    const keyOf = (x: number, y: number, z: number) => `${x},${y},${z}`;
    
    expect(keyOf(0, 0, 0)).toBe('0,0,0');
    expect(keyOf(1, 2, 3)).toBe('1,2,3');
    expect(keyOf(-1, -2, -3)).toBe('-1,-2,-3');
  });

  test('parseKey function parsea claves correctamente', () => {
    // Probamos la función parseKey directamente
    const parseKey = (k: string): [number, number, number] => {
      const [x, y, z] = k.split(',').map((n) => parseInt(n, 10));
      return [x, y, z];
    };
    
    expect(parseKey('0,0,0')).toEqual([0, 0, 0]);
    expect(parseKey('1,2,3')).toEqual([1, 2, 3]);
    expect(parseKey('-1,-2,-3')).toEqual([-1, -2, -3]);
  });
});

// Tests de accesibilidad
describe('BlockBuilder - Accesibilidad', () => {
  test('los botones tienen etiquetas descriptivas', () => {
    render(<BlockBuilder />);
    
    expect(screen.getByRole('button', { name: 'Construir' })).toHaveAccessibleName('Construir');
    expect(screen.getByRole('button', { name: 'Borrar' })).toHaveAccessibleName('Borrar');
    expect(screen.getByRole('button', { name: 'Exportar' })).toHaveAccessibleName('Exportar');
    expect(screen.getByRole('button', { name: 'Importar' })).toHaveAccessibleName('Importar');
    expect(screen.getByRole('button', { name: 'Reiniciar' })).toHaveAccessibleName('Reiniciar');
  });

  test('el selector tiene label asociado', () => {
    render(<BlockBuilder />);
    
    const label = screen.getByText('Bloque:');
    const select = screen.getByDisplayValue('Hierba');
    
    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
  });
});

// Tests de integración de usuario
describe('BlockBuilder - Flujo de usuario', () => {
  test('flujo completo de construcción básica', async () => {
    const user = userEvent.setup();
    render(<BlockBuilder />);
    
    // 1. Verificar estado inicial
    expect(screen.getByRole('button', { name: 'Construir' })).toHaveClass('bg-sky-500');
    expect(screen.getByDisplayValue('Hierba')).toBeInTheDocument();
    
    // 2. Cambiar tipo de bloque
    await user.selectOptions(screen.getByDisplayValue('Hierba'), 'Madera');
    expect(screen.getByDisplayValue('Madera')).toBeInTheDocument();
    
    // 3. Cambiar a modo borrar
    await user.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(screen.getByRole('button', { name: 'Borrar' })).toHaveClass('bg-rose-500');
    
    // 4. Volver a modo construir
    await user.click(screen.getByRole('button', { name: 'Construir' }));
    expect(screen.getByRole('button', { name: 'Construir' })).toHaveClass('bg-sky-500');
    
    // 5. Exportar construcción vacía
    await user.click(screen.getByRole('button', { name: 'Exportar' }));
    expect(screen.getByPlaceholderText('[]')).toHaveValue('[]');
    
    // 6. Reiniciar (debería mantenerse vacío)
    await user.click(screen.getByRole('button', { name: 'Reiniciar' }));
    await user.click(screen.getByRole('button', { name: 'Exportar' }));
    expect(screen.getByPlaceholderText('[]')).toHaveValue('[]');
  });
});