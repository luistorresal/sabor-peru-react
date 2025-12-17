// src/tests/components/Navbar.spec.js
// Pruebas unitarias para el componente Navbar
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { CartContext } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';

// Helper para renderizar Navbar con todos los providers necesarios
const renderNavbar = (cartValue = {}) => {
  const defaultCart = {
    count: 0,
    toggleCart: jasmine.createSpy('toggleCart'),
    items: [],
    total: 0,
    formatCLP: (v) => `$${v}`,
    ...cartValue
  };

  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartContext.Provider value={defaultCart}>
          <Navbar />
        </CartContext.Provider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Navbar - Pruebas del componente de navegación', () => {

  // Limpiar localStorage antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------- RENDERIZADO BÁSICO --------------------
  describe('Renderizado básico', () => {
    it('debe renderizar el navbar sin errores', () => {
      const { container } = renderNavbar();
      const nav = container.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('debe mostrar la marca "Sabor Perú"', () => {
      renderNavbar();
      expect(screen.getByText(/Sabor Perú/i)).toBeTruthy();
    });

    it('debe tener clase navbar-dark', () => {
      const { container } = renderNavbar();
      const nav = container.querySelector('nav');
      expect(nav.classList.contains('navbar-dark')).toBeTrue();
    });

    it('debe tener clase sticky-top', () => {
      const { container } = renderNavbar();
      const nav = container.querySelector('nav');
      expect(nav.classList.contains('sticky-top')).toBeTrue();
    });

    it('debe tener contenedor interno', () => {
      const { container } = renderNavbar();
      const innerContainer = container.querySelector('.container');
      expect(innerContainer).toBeTruthy();
    });
  });

  // -------------------- ENLACES DE NAVEGACIÓN --------------------
  describe('Enlaces de navegación', () => {
    it('debe mostrar enlace a Inicio', () => {
      renderNavbar();
      expect(screen.getByText(/Inicio/i)).toBeTruthy();
    });

    it('debe mostrar enlace a Productos', () => {
      renderNavbar();
      expect(screen.getByText(/Productos/i)).toBeTruthy();
    });

    it('debe mostrar enlace a ¿Quiénes somos?', () => {
      renderNavbar();
      expect(screen.getByText(/¿Quiénes somos\?/i)).toBeTruthy();
    });

    it('enlace Inicio debe apuntar a "/"', () => {
      renderNavbar();
      const link = screen.getByRole('link', { name: /inicio/i });
      expect(link.getAttribute('href')).toBe('/');
    });

    it('enlace Productos debe apuntar a "/productos"', () => {
      renderNavbar();
      const link = screen.getByRole('link', { name: /productos/i });
      expect(link.getAttribute('href')).toBe('/productos');
    });

    it('enlace ¿Quiénes somos? debe apuntar a "/quienes-somos"', () => {
      renderNavbar();
      const link = screen.getByRole('link', { name: /quiénes somos/i });
      expect(link.getAttribute('href')).toBe('/quienes-somos');
    });
  });

  // -------------------- USUARIO NO AUTENTICADO --------------------
  describe('Usuario NO autenticado', () => {
    it('debe mostrar botón "Ingresar"', () => {
      renderNavbar();
      expect(screen.getByText(/Ingresar/i)).toBeTruthy();
    });

    it('debe mostrar botón "Crear cuenta"', () => {
      renderNavbar();
      expect(screen.getByText(/Crear cuenta/i)).toBeTruthy();
    });

    it('enlace Ingresar debe apuntar a "/login"', () => {
      renderNavbar();
      const link = screen.getByRole('link', { name: /ingresar/i });
      expect(link.getAttribute('href')).toBe('/login');
    });

    it('enlace Crear cuenta debe apuntar a "/registro"', () => {
      renderNavbar();
      const link = screen.getByRole('link', { name: /crear cuenta/i });
      expect(link.getAttribute('href')).toBe('/registro');
    });
  });

  // -------------------- INTEGRACIÓN CON CARRITO --------------------
  describe('Integración con el carrito', () => {
    it('debe mostrar contador del carrito en 0', () => {
      renderNavbar({ count: 0 });
      expect(screen.getByText('0')).toBeTruthy();
    });

    it('debe mostrar contador del carrito con 3 productos', () => {
      renderNavbar({ count: 3 });
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('debe mostrar contador con valores altos', () => {
      renderNavbar({ count: 99 });
      expect(screen.getByText('99')).toBeTruthy();
    });

    it('debe llamar a toggleCart cuando se hace click en Carrito', () => {
      const toggleCartSpy = jasmine.createSpy('toggleCart');
      renderNavbar({ count: 0, toggleCart: toggleCartSpy });

      const button = screen.getByRole('button', { name: /carrito/i });
      fireEvent.click(button);

      expect(toggleCartSpy).toHaveBeenCalled();
    });

    it('debe llamar a toggleCart múltiples veces', () => {
      const toggleCartSpy = jasmine.createSpy('toggleCart');
      renderNavbar({ count: 0, toggleCart: toggleCartSpy });

      const button = screen.getByRole('button', { name: /carrito/i });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(toggleCartSpy).toHaveBeenCalledTimes(3);
    });
  });

  // -------------------- MENÚ HAMBURGUESA --------------------
  describe('Menú hamburguesa (móvil)', () => {
    it('debe tener botón toggler para móvil', () => {
      const { container } = renderNavbar();
      const toggler = container.querySelector('.navbar-toggler');
      expect(toggler).toBeTruthy();
    });

    it('debe tener icono de hamburguesa', () => {
      const { container } = renderNavbar();
      const icon = container.querySelector('.navbar-toggler-icon');
      expect(icon).toBeTruthy();
    });

    it('botón toggler debe tener aria-label', () => {
      const { container } = renderNavbar();
      const toggler = container.querySelector('.navbar-toggler');
      expect(toggler.getAttribute('aria-label')).toBe('Toggle navigation');
    });

    it('click en toggler debe cambiar aria-expanded', () => {
      const { container } = renderNavbar();
      const toggler = container.querySelector('.navbar-toggler');
      
      expect(toggler.getAttribute('aria-expanded')).toBe('false');
      
      fireEvent.click(toggler);
      expect(toggler.getAttribute('aria-expanded')).toBe('true');
      
      fireEvent.click(toggler);
      expect(toggler.getAttribute('aria-expanded')).toBe('false');
    });

    it('click en toggler debe mostrar/ocultar menú', () => {
      const { container } = renderNavbar();
      const toggler = container.querySelector('.navbar-toggler');
      const navCollapse = container.querySelector('#navMain');
      
      expect(navCollapse.classList.contains('show')).toBeFalse();
      
      fireEvent.click(toggler);
      expect(navCollapse.classList.contains('show')).toBeTrue();
    });
  });

  // -------------------- ESTILOS BOOTSTRAP --------------------
  describe('Estilos Bootstrap', () => {
    it('debe tener clase navbar-expand-lg', () => {
      const { container } = renderNavbar();
      const nav = container.querySelector('nav');
      expect(nav.classList.contains('navbar-expand-lg')).toBeTrue();
    });

    it('debe tener color de fondo personalizado', () => {
      const { container } = renderNavbar();
      const nav = container.querySelector('nav');
      expect(nav.style.backgroundColor).toBeTruthy();
    });
  });

  // -------------------- ACCESIBILIDAD --------------------
  describe('Accesibilidad', () => {
    it('debe tener role="navigation" implícito', () => {
      renderNavbar();
      const nav = screen.getByRole('navigation');
      expect(nav).toBeTruthy();
    });

    it('enlaces deben ser navegables por teclado', () => {
      renderNavbar();
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.tabIndex).not.toBe(-1);
      });
    });
  });
});
