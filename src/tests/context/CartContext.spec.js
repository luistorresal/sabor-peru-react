// src/tests/context/CartContext.spec.js
// Pruebas unitarias completas para CartContext
import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from '../../context/CartContext';

// Componente consumidor para testing
function TestConsumer() {
  const {
    items, count, total, isOpen,
    addItem, incQty, decQty, removeItem, clear,
    openCart, closeCart, toggleCart, formatCLP
  } = useContext(CartContext);

  return (
    <div>
      {/* Valores del contexto */}
      <span data-testid="items">{items.length}</span>
      <span data-testid="count">{count}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="isOpen">{String(isOpen)}</span>
      <span data-testid="formatted">{formatCLP(1000)}</span>

      {/* Nombres de productos */}
      <span data-testid="itemNames">{items.map(i => i.name).join(',')}</span>
      <span data-testid="itemQtys">{items.map(i => i.qty).join(',')}</span>

      {/* Acciones */}
      <button onClick={() => addItem({ id: 'p1', name: 'Prod 1', price: 100 })}>add p1</button>
      <button onClick={() => addItem({ id: 'p1', name: 'Prod 1', price: 100 })}>add p1 again</button>
      <button onClick={() => addItem({ id: 'p2', name: 'Prod 2', price: 200 })}>add p2</button>
      <button onClick={() => incQty('p1')}>inc p1</button>
      <button onClick={() => incQty('p2')}>inc p2</button>
      <button onClick={() => decQty('p1')}>dec p1</button>
      <button onClick={() => decQty('p2')}>dec p2</button>
      <button onClick={() => removeItem('p1')}>remove p1</button>
      <button onClick={() => removeItem('p2')}>remove p2</button>
      <button onClick={() => clear()}>clear</button>

      {/* Control de panel */}
      <button onClick={() => openCart()}>open</button>
      <button onClick={() => closeCart()}>close</button>
      <button onClick={() => toggleCart()}>toggle</button>
    </div>
  );
}

// Helper para leer número desde el DOM
const num = (id) => Number(screen.getByTestId(id).textContent);
const str = (id) => screen.getByTestId(id).textContent;

describe('CartContext - Pruebas completas del contexto del carrito', () => {
  
  beforeEach(() => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    spyOn(window.localStorage, 'setItem');
  });

  // -------------------- ESTADO INICIAL --------------------
  describe('Estado inicial', () => {
    it('items debe ser array vacío', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(num('items')).toBe(0);
    });

    it('count debe ser 0', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(num('count')).toBe(0);
    });

    it('total debe ser 0', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(num('total')).toBe(0);
    });

    it('isOpen debe ser false', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(str('isOpen')).toBe('false');
    });

    it('formatCLP debe formatear a pesos chilenos', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(str('formatted')).toContain('1');
    });
  });

  // -------------------- AGREGAR PRODUCTOS --------------------
  describe('addItem - Agregar productos', () => {
    it('agrega producto nuevo', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      expect(num('items')).toBe(1);
      expect(num('count')).toBe(1);
      expect(num('total')).toBe(100);
    });

    it('agrega segundo producto diferente', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p2'));
      expect(num('items')).toBe(2);
      expect(num('count')).toBe(2);
      expect(num('total')).toBe(300); // 100 + 200
    });

    it('mismo producto acumula cantidad', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p1 again'));
      expect(num('items')).toBe(1); // Un solo item
      expect(num('count')).toBe(2); // Qty = 2
      expect(num('total')).toBe(200); // 100 * 2
    });

    it('persiste en localStorage', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });

  // -------------------- INCREMENTAR CANTIDAD --------------------
  describe('incQty - Incrementar cantidad', () => {
    it('incrementa cantidad de producto existente', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('inc p1'));
      expect(num('count')).toBe(2);
      expect(num('total')).toBe(200);
    });

    it('incrementa múltiples veces', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('inc p1'));
      fireEvent.click(screen.getByText('inc p1'));
      fireEvent.click(screen.getByText('inc p1'));
      expect(num('count')).toBe(4);
    });

    it('incrementa producto específico sin afectar otros', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p2'));
      fireEvent.click(screen.getByText('inc p1'));
      expect(str('itemQtys')).toBe('2,1');
    });
  });

  // -------------------- DECREMENTAR CANTIDAD --------------------
  describe('decQty - Decrementar cantidad', () => {
    it('decrementa cantidad', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p1 again'));
      expect(num('count')).toBe(2);
      fireEvent.click(screen.getByText('dec p1'));
      expect(num('count')).toBe(1);
    });

    it('elimina producto al llegar a 0', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      expect(num('items')).toBe(1);
      fireEvent.click(screen.getByText('dec p1'));
      expect(num('items')).toBe(0);
    });

    it('decrementa producto específico sin afectar otros', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p1 again'));
      fireEvent.click(screen.getByText('add p2'));
      fireEvent.click(screen.getByText('dec p1'));
      expect(str('itemQtys')).toBe('1,1');
    });
  });

  // -------------------- REMOVER PRODUCTO --------------------
  describe('removeItem - Remover producto', () => {
    it('remueve producto por id', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      expect(num('items')).toBe(1);
      fireEvent.click(screen.getByText('remove p1'));
      expect(num('items')).toBe(0);
    });

    it('remueve solo el producto indicado', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p2'));
      fireEvent.click(screen.getByText('remove p1'));
      expect(num('items')).toBe(1);
      expect(str('itemNames')).toBe('Prod 2');
    });

    it('actualiza total al remover', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p2'));
      expect(num('total')).toBe(300);
      fireEvent.click(screen.getByText('remove p2'));
      expect(num('total')).toBe(100);
    });
  });

  // -------------------- VACIAR CARRITO --------------------
  describe('clear - Vaciar carrito', () => {
    it('vacía todos los productos', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p2'));
      expect(num('items')).toBe(2);
      fireEvent.click(screen.getByText('clear'));
      expect(num('items')).toBe(0);
      expect(num('count')).toBe(0);
      expect(num('total')).toBe(0);
    });
  });

  // -------------------- CONTROL DEL PANEL --------------------
  describe('Control del panel (isOpen)', () => {
    it('openCart abre el panel', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(str('isOpen')).toBe('false');
      fireEvent.click(screen.getByText('open'));
      expect(str('isOpen')).toBe('true');
    });

    it('closeCart cierra el panel', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('open'));
      expect(str('isOpen')).toBe('true');
      fireEvent.click(screen.getByText('close'));
      expect(str('isOpen')).toBe('false');
    });

    it('toggleCart alterna el estado', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      expect(str('isOpen')).toBe('false');
      fireEvent.click(screen.getByText('toggle'));
      expect(str('isOpen')).toBe('true');
      fireEvent.click(screen.getByText('toggle'));
      expect(str('isOpen')).toBe('false');
    });

    it('toggle múltiples veces funciona', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('toggle'));
      fireEvent.click(screen.getByText('toggle'));
      fireEvent.click(screen.getByText('toggle'));
      expect(str('isOpen')).toBe('true');
    });
  });

  // -------------------- CÁLCULOS --------------------
  describe('Cálculos de totales', () => {
    it('count suma todas las cantidades', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      fireEvent.click(screen.getByText('add p1 again'));
      fireEvent.click(screen.getByText('add p2'));
      expect(num('count')).toBe(3); // 2 + 1
    });

    it('total suma precio * cantidad', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1')); // 100 * 1
      fireEvent.click(screen.getByText('add p1 again')); // 100 * 2
      fireEvent.click(screen.getByText('add p2')); // + 200 * 1
      expect(num('total')).toBe(400); // 200 + 200
    });
  });

  // -------------------- PERSISTENCIA --------------------
  describe('Persistencia en localStorage', () => {
    it('guarda items al agregar', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'sp_cart_items',
        jasmine.any(String)
      );
    });

    it('guarda items al incrementar', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      window.localStorage.setItem.calls.reset();
      fireEvent.click(screen.getByText('inc p1'));
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('guarda items al vaciar', () => {
      render(<CartProvider><TestConsumer /></CartProvider>);
      fireEvent.click(screen.getByText('add p1'));
      window.localStorage.setItem.calls.reset();
      fireEvent.click(screen.getByText('clear'));
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });
});
