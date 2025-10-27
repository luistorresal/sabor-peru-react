// src/tests/context/CartContext.spec.js
import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from '../../context/CartContext';

// Consumer mínimo: lee valores y dispara acciones del contexto
function TestConsumer() {
  const {
    items, count, total, isOpen,
    addItem, incQty, decQty, removeItem, clear,
    openCart, closeCart, toggleCart,
  } = useContext(CartContext);

  return (
    <div>
      {/* Valores actuales del contexto */}
      <span data-testid="items">{items.length}</span>
      <span data-testid="count">{count}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="isOpen">{String(isOpen)}</span>

      {/* Acciones del carrito para probar la lógica */}
      <button onClick={() => addItem({ id: 'p1', name: 'Prod 1', price: 10 })}>add p1</button>
      <button onClick={() => addItem({ id: 'p1', name: 'Prod 1', price: 10 })}>add p1 again</button>
      <button onClick={() => incQty('p1')}>inc p1</button>
      <button onClick={() => decQty('p1')}>dec p1</button>
      <button onClick={() => removeItem('p1')}>remove p1</button>
      <button onClick={() => clear()}>clear</button>

      {/* Control de apertura del panel */}
      <button onClick={() => openCart()}>open</button>
      <button onClick={() => closeCart()}>close</button>
      <button onClick={() => toggleCart()}>toggle</button>
    </div>
  );
}

// Helper para leer número desde el DOM
const num = (id) => Number(screen.getByTestId(id).textContent);

describe('CartProvider / CartContext', () => {
  // Mock de localStorage: el Provider lo usa en estado inicial y en useEffect
  beforeEach(() => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    spyOn(window.localStorage, 'setItem');
  });

  it('estado inicial: items=[], count=0, total=0, isOpen=false', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    expect(num('items')).toBe(0);
    expect(num('count')).toBe(0);
    expect(num('total')).toBe(0);
    expect(screen.getByTestId('isOpen').textContent).toBe('false');
  });

  it('addItem agrega producto nuevo y persiste', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    fireEvent.click(screen.getByText('add p1'));

    expect(num('items')).toBe(1);
    expect(num('count')).toBe(1);
    expect(num('total')).toBe(10);
    expect(window.localStorage.setItem).toHaveBeenCalled(); // persistencia
  });

  it('addItem sobre el mismo id acumula cantidad (branch)', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    fireEvent.click(screen.getByText('add p1'));       // qty 1
    fireEvent.click(screen.getByText('add p1 again')); // qty 2

    expect(num('items')).toBe(1); // no duplica fila
    expect(num('count')).toBe(2);
    expect(num('total')).toBe(20);
  });

  it('incQty/decQty ajusta cantidad y elimina al llegar a 0', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    fireEvent.click(screen.getByText('add p1')); // qty 1

    fireEvent.click(screen.getByText('inc p1')); // qty 2
    expect(num('count')).toBe(2);
    expect(num('total')).toBe(20);

    fireEvent.click(screen.getByText('dec p1')); // qty 1
    expect(num('count')).toBe(1);
    expect(num('total')).toBe(10);

    fireEvent.click(screen.getByText('dec p1')); // qty 0 => se elimina
    expect(num('items')).toBe(0);
    expect(num('count')).toBe(0);
    expect(num('total')).toBe(0);
  });

  it('removeItem elimina por id', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    fireEvent.click(screen.getByText('add p1'));
    fireEvent.click(screen.getByText('remove p1'));

    expect(num('items')).toBe(0);
    expect(num('count')).toBe(0);
    expect(num('total')).toBe(0);
  });

  it('clear vacía el carrito', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    fireEvent.click(screen.getByText('add p1'));
    fireEvent.click(screen.getByText('clear'));

    expect(num('items')).toBe(0);
    expect(num('count')).toBe(0);
    expect(num('total')).toBe(0);
  });

  it('open/close/toggle controlan isOpen', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    expect(screen.getByTestId('isOpen').textContent).toBe('false');

    fireEvent.click(screen.getByText('open'));
    expect(screen.getByTestId('isOpen').textContent).toBe('true');

    fireEvent.click(screen.getByText('close'));
    expect(screen.getByTestId('isOpen').textContent).toBe('false');

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('isOpen').textContent).toBe('true');
  });
});
