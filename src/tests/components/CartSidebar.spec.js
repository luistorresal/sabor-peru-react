// Test del componente CartSidebar (sidebar del carrito)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSidebar from '../../components/CartSidebar';
import MockCartProvider from '../utils/MockCartProvider';

// Helpers para encontrar elementos clave del componente
const getDrawer = (container) => container.querySelector('.cart-drawer'); // Panel lateral
const getOverlay = (container) => container.querySelector('.cart-overlay'); // Fondo oscuro

// Formateador simple de dinero (evita usar formatCLP real en pruebas)
const fmt = (n) => `$${n}`;

describe('CartSidebar - pruebas de interfaz y lógica', () => {
  // Caso 1: El carrito está cerrado (isOpen = false)
  it('no debe mostrarse cuando isOpen = false', () => {
    const { container } = render(
      <MockCartProvider cartValue={{ isOpen: false, items: [], formatCLP: fmt }}>
        <CartSidebar />
      </MockCartProvider>
    );

    // El panel no debe tener clase "open"
    expect(getDrawer(container).classList.contains('open')).toBeFalse();
    // El fondo (overlay) no debe estar visible
    expect(getOverlay(container).classList.contains('show')).toBeFalse();
  });

  // Caso 2: El carrito está abierto (isOpen = true)
  it('debe mostrarse cuando isOpen = true', () => {
    const { container } = render(
      <MockCartProvider cartValue={{ isOpen: true, items: [], formatCLP: fmt }}>
        <CartSidebar />
      </MockCartProvider>
    );

    expect(getDrawer(container).classList.contains('open')).toBeTrue();
    expect(getOverlay(container).classList.contains('show')).toBeTrue();
  });

  // Caso 3: Al hacer clic en el overlay, debe cerrarse
  it('clic en overlay llama a closeCart()', () => {
    const closeCart = jasmine.createSpy('closeCart');

    const { container } = render(
      <MockCartProvider cartValue={{ isOpen: true, items: [], formatCLP: fmt, closeCart }}>
        <CartSidebar />
      </MockCartProvider>
    );

    fireEvent.click(getOverlay(container)); // Se hace clic fuera del panel
    expect(closeCart).toHaveBeenCalled(); // Debe llamarse closeCart
  });

  // Caso 4: Carrito vacío
  it('muestra mensaje de vacío y botones deshabilitados', () => {
    render(
      <MockCartProvider cartValue={{ isOpen: true, items: [], total: 0, formatCLP: fmt }}>
        <CartSidebar />
      </MockCartProvider>
    );

    // Mensaje de carrito vacío
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
    // Botón Vaciar y Comprar deben estar deshabilitados
    expect(screen.getByRole('button', { name: /Vaciar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Comprar/i })).toBeDisabled();
  });

  // Caso 5: Carrito con productos
  it('renderiza productos, cantidades y total correctamente', () => {
    const items = [
      { id: '1', name: 'Ají de Gallina', price: 10, qty: 2, img: '' },
      { id: '2', name: 'Causa', price: 5, qty: 1, img: '' },
    ];

    const { container } = render(
      <MockCartProvider cartValue={{ isOpen: true, items, total: 25, formatCLP: fmt }}>
        <CartSidebar />
      </MockCartProvider>
    );

    expect(screen.getByText('Ají de Gallina')).toBeTruthy();
    expect(screen.getByText('Causa')).toBeTruthy();
    expect(container.textContent).toContain('$25'); // Total
  });
});
