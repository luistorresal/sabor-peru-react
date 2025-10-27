// src/tests/components/Navbar.spec.js
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

import MockCartProvider from '../utils/MockCartProvider';


describe('Navbar con MockCartProvider', () => {

  it('debería mostrar enlaces principales', () => {
    render(
      <MemoryRouter>
        <MockCartProvider cartValue={{ count: 0, toggleCart: () => {} }}>
          <Navbar />
        </MockCartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Inicio/i)).toBeTruthy();
    expect(screen.getByText(/Productos/i)).toBeTruthy();
    expect(screen.getByText(/¿Quiénes somos/i)).toBeTruthy();
  });

  it('debería mostrar el contador del carrito usando el mock (count = 3)', () => {
    render(
      <MemoryRouter>
        <MockCartProvider cartValue={{ count: 3, toggleCart: () => {} }}>
          <Navbar />
        </MockCartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeTruthy();
  });

  it('debería llamar a toggleCart cuando se hace click en "Carrito"', () => {
    const toggleCartMock = jasmine.createSpy('toggleCartMock');

    render(
      <MemoryRouter>
        <MockCartProvider cartValue={{ count: 0, toggleCart: toggleCartMock }}>
          <Navbar />
        </MockCartProvider>
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /Carrito/i });
    fireEvent.click(button);

    expect(toggleCartMock).toHaveBeenCalled();
  });

});
