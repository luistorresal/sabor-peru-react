// src/tests/components/CartSidebar.spec.js
// Pruebas unitarias para el componente CartSidebar
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSidebar from '../../components/CartSidebar';
import MockCartProvider from '../utils/MockCartProvider';

// Helpers para encontrar elementos
const getDrawer = (container) => container.querySelector('.cart-drawer');
const getOverlay = (container) => container.querySelector('.cart-overlay');

// Formateador CLP igual al del contexto
const fmt = (n) => n?.toLocaleString("es-CL", { style: "currency", currency: "CLP" }) || '$0';

// Props por defecto para todas las pruebas
const defaultCartValue = {
  isOpen: false,
  items: [],
  total: 0,
  formatCLP: fmt,
  closeCart: () => {},
  clear: () => {},
  incQty: () => {},
  decQty: () => {},
  removeItem: () => {}
};

// Helper para renderizar con props personalizadas
const renderCartSidebar = (customProps = {}) => {
  const cartValue = { ...defaultCartValue, ...customProps };
  return render(
    <MockCartProvider cartValue={cartValue}>
      <CartSidebar />
    </MockCartProvider>
  );
};

describe('CartSidebar - Pruebas de interfaz y lógica', () => {

  // -------------------- ESTADO CERRADO --------------------
  describe('Estado cerrado (isOpen = false)', () => {
    it('no debe mostrar clase "open" cuando isOpen = false', () => {
      const { container } = renderCartSidebar({ isOpen: false });
      expect(getDrawer(container).classList.contains('open')).toBeFalse();
    });

    it('no debe mostrar clase "show" en overlay cuando cerrado', () => {
      const { container } = renderCartSidebar({ isOpen: false });
      expect(getOverlay(container).classList.contains('show')).toBeFalse();
    });

    it('debe tener aria-hidden="true" cuando cerrado', () => {
      const { container } = renderCartSidebar({ isOpen: false });
      expect(getDrawer(container).getAttribute('aria-hidden')).toBe('true');
    });
  });

  // -------------------- ESTADO ABIERTO --------------------
  describe('Estado abierto (isOpen = true)', () => {
    it('debe mostrar clase "open" cuando isOpen = true', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(getDrawer(container).classList.contains('open')).toBeTrue();
    });

    it('debe mostrar clase "show" en overlay cuando abierto', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(getOverlay(container).classList.contains('show')).toBeTrue();
    });

    it('debe tener aria-hidden="false" cuando abierto', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(getDrawer(container).getAttribute('aria-hidden')).toBe('false');
    });

    it('debe mostrar título "Tu Carrito"', () => {
      renderCartSidebar({ isOpen: true });
      expect(screen.getByText('Tu Carrito')).toBeTruthy();
    });
  });

  // -------------------- CERRAR CARRITO --------------------
  describe('Cerrar carrito', () => {
    it('clic en overlay llama a closeCart()', () => {
      const closeCart = jasmine.createSpy('closeCart');
      const { container } = renderCartSidebar({ isOpen: true, closeCart });
      fireEvent.click(getOverlay(container));
      expect(closeCart).toHaveBeenCalled();
    });

    it('clic en botón X llama a closeCart()', () => {
      const closeCart = jasmine.createSpy('closeCart');
      renderCartSidebar({ isOpen: true, closeCart });
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      fireEvent.click(closeBtn);
      expect(closeCart).toHaveBeenCalled();
    });
  });

  // -------------------- CARRITO VACÍO --------------------
  describe('Carrito vacío', () => {
    it('muestra mensaje "Tu carrito está vacío"', () => {
      renderCartSidebar({ isOpen: true, items: [], total: 0 });
      expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
    });

    it('botón Vaciar debe estar deshabilitado', () => {
      renderCartSidebar({ isOpen: true, items: [], total: 0 });
      expect(screen.getByRole('button', { name: /Vaciar/i }).disabled).toBeTrue();
    });

    it('botón Comprar debe estar deshabilitado', () => {
      renderCartSidebar({ isOpen: true, items: [], total: 0 });
      expect(screen.getByRole('button', { name: /Comprar/i }).disabled).toBeTrue();
    });

    it('debe mostrar total $0', () => {
      renderCartSidebar({ isOpen: true, items: [], total: 0 });
      expect(screen.getByText(fmt(0))).toBeTruthy();
    });
  });

  // -------------------- CARRITO CON PRODUCTOS --------------------
  describe('Carrito con productos', () => {
    const items = [
      { id: '1', name: 'Ají de Gallina', price: 5000, qty: 2, img: 'img1.jpg' },
      { id: '2', name: 'Causa Limeña', price: 4500, qty: 3, img: 'img2.jpg' },
    ];
    const total = 23500; // (5000*2) + (4500*3)

    it('debe renderizar nombres de productos', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByText('Ají de Gallina')).toBeTruthy();
      expect(screen.getByText('Causa Limeña')).toBeTruthy();
    });

    it('debe renderizar cantidades', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('debe renderizar precios unitarios', () => {
      renderCartSidebar({ isOpen: true, items, total });
      // Formato chileno usa punto: $5.000
      expect(screen.getByText(fmt(5000))).toBeTruthy();
      expect(screen.getByText(fmt(4500))).toBeTruthy();
    });

    it('debe renderizar total correctamente', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByText(fmt(23500))).toBeTruthy();
    });

    it('debe renderizar subtotales por producto', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByText(fmt(10000))).toBeTruthy(); // 5000 * 2
      expect(screen.getByText(fmt(13500))).toBeTruthy(); // 4500 * 3
    });

    it('botón Vaciar debe estar habilitado', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByRole('button', { name: /Vaciar/i }).disabled).toBeFalse();
    });

    it('botón Comprar debe estar habilitado', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.getByRole('button', { name: /Comprar/i }).disabled).toBeFalse();
    });

    it('NO debe mostrar mensaje de vacío', () => {
      renderCartSidebar({ isOpen: true, items, total });
      expect(screen.queryByText(/Tu carrito está vacío/i)).toBeFalsy();
    });
  });

  // -------------------- ACCIONES DEL CARRITO --------------------
  describe('Acciones del carrito', () => {
    const items = [
      { id: '1', name: 'Producto', price: 1000, qty: 2, img: 'img.jpg' },
    ];

    it('clic en + llama a incQty con el id', () => {
      const incQty = jasmine.createSpy('incQty');
      renderCartSidebar({ isOpen: true, items, total: 2000, incQty });
      const plusBtn = screen.getByRole('button', { name: /aumentar/i });
      fireEvent.click(plusBtn);
      expect(incQty).toHaveBeenCalledWith('1');
    });

    it('clic en − llama a decQty con el id', () => {
      const decQty = jasmine.createSpy('decQty');
      renderCartSidebar({ isOpen: true, items, total: 2000, decQty });
      const minusBtn = screen.getByRole('button', { name: /disminuir/i });
      fireEvent.click(minusBtn);
      expect(decQty).toHaveBeenCalledWith('1');
    });

    it('clic en × llama a removeItem con el id', () => {
      const removeItem = jasmine.createSpy('removeItem');
      renderCartSidebar({ isOpen: true, items, total: 2000, removeItem });
      const removeBtn = screen.getByRole('button', { name: /quitar/i });
      fireEvent.click(removeBtn);
      expect(removeItem).toHaveBeenCalledWith('1');
    });

    it('clic en Vaciar llama a clear()', () => {
      const clear = jasmine.createSpy('clear');
      renderCartSidebar({ isOpen: true, items, total: 2000, clear });
      const clearBtn = screen.getByRole('button', { name: /vaciar/i });
      fireEvent.click(clearBtn);
      expect(clear).toHaveBeenCalled();
    });

    it('clic en Comprar llama a clear() y closeCart()', () => {
      const clear = jasmine.createSpy('clear');
      const closeCart = jasmine.createSpy('closeCart');
      spyOn(window, 'alert');
      
      renderCartSidebar({ isOpen: true, items, total: 2000, clear, closeCart });
      const buyBtn = screen.getByRole('button', { name: /comprar/i });
      fireEvent.click(buyBtn);
      
      expect(window.alert).toHaveBeenCalledWith('¡Compra realizada!');
      expect(clear).toHaveBeenCalled();
      expect(closeCart).toHaveBeenCalled();
    });
  });

  // -------------------- ESTRUCTURA HTML --------------------
  describe('Estructura HTML', () => {
    it('debe tener elemento aside con clase cart-drawer', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(container.querySelector('aside.cart-drawer')).toBeTruthy();
    });

    it('debe tener cabecera con clase cart-header', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(container.querySelector('.cart-header')).toBeTruthy();
    });

    it('debe tener cuerpo con clase cart-body', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(container.querySelector('.cart-body')).toBeTruthy();
    });

    it('debe tener pie con clase cart-footer', () => {
      const { container } = renderCartSidebar({ isOpen: true });
      expect(container.querySelector('.cart-footer')).toBeTruthy();
    });
  });

  // -------------------- IMÁGENES --------------------
  describe('Imágenes de productos', () => {
    it('debe renderizar imagen del producto', () => {
      const items = [{ id: '1', name: 'Test', price: 100, qty: 1, img: 'test.jpg' }];
      renderCartSidebar({ isOpen: true, items, total: 100 });
      const img = screen.getByRole('img', { name: /test/i });
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('test.jpg');
    });

    it('imagen debe tener clase cart-thumb', () => {
      const items = [{ id: '1', name: 'Test', price: 100, qty: 1, img: 'test.jpg' }];
      const { container } = renderCartSidebar({ isOpen: true, items, total: 100 });
      const img = container.querySelector('img.cart-thumb');
      expect(img).toBeTruthy();
    });
  });
});
