// src/tests/components/Footer.spec.js
// Pruebas unitarias para el componente Footer REAL
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer - Pruebas del componente', () => {
  
  // -------------------- RENDERIZADO --------------------
  describe('Renderizado básico', () => {
    it('debe renderizarse sin errores', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    it('debe mostrar "Sabor Perú"', () => {
      render(<Footer />);
      expect(screen.getByText('Sabor Perú')).toBeTruthy();
    });

    it('debe usar elemento semántico <footer>', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer.tagName.toLowerCase()).toBe('footer');
    });
  });

  // -------------------- ESTILOS --------------------
  describe('Estilos Bootstrap', () => {
    it('debe tener clase bg-dark', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer.classList.contains('bg-dark')).toBeTrue();
    });

    it('debe tener clase text-light', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer.classList.contains('text-light')).toBeTrue();
    });

    it('debe tener clase mt-5', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer.classList.contains('mt-5')).toBeTrue();
    });

    it('debe tener contenedor interno', () => {
      const { container } = render(<Footer />);
      expect(container.querySelector('.container')).toBeTruthy();
    });

    it('debe tener clases flexbox', () => {
      const { container } = render(<Footer />);
      expect(container.querySelector('.d-flex')).toBeTruthy();
    });
  });

  // -------------------- COPYRIGHT --------------------
  describe('Texto de Copyright', () => {
    it('debe mostrar el año actual', () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear().toString();
      expect(document.body.textContent).toContain(currentYear);
    });

    it('debe contener símbolo ©', () => {
      const { container } = render(<Footer />);
      expect(container.textContent).toContain('©');
    });

    it('debe mostrar "Todos los derechos reservados"', () => {
      render(<Footer />);
      expect(screen.getByText(/Todos los derechos reservados/i)).toBeTruthy();
    });

    it('copyright debe estar en <small>', () => {
      const { container } = render(<Footer />);
      const small = container.querySelector('small');
      expect(small).toBeTruthy();
      expect(small.textContent).toContain('©');
    });
  });

  // -------------------- ENLACES --------------------
  describe('Enlaces de navegación', () => {
    it('debe tener enlace a ¿Quiénes somos?', () => {
      render(<Footer />);
      const link = screen.getByRole('link', { name: /quiénes somos/i });
      expect(link.getAttribute('href')).toBe('/quienes-somos');
    });

    it('debe tener enlace a Productos', () => {
      render(<Footer />);
      const link = screen.getByRole('link', { name: /productos/i });
      expect(link.getAttribute('href')).toBe('/productos');
    });

    it('debe tener enlace a Ingresar', () => {
      render(<Footer />);
      const link = screen.getByRole('link', { name: /ingresar/i });
      expect(link.getAttribute('href')).toBe('/login');
    });

    it('debe tener 3 enlaces en la lista', () => {
      const { container } = render(<Footer />);
      const links = container.querySelectorAll('ul a');
      expect(links.length).toBe(3);
    });

    it('enlaces deben tener clase link-light', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.classList.contains('link-light')).toBeTrue();
      });
    });

    it('enlaces deben tener text-decoration-none', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.classList.contains('text-decoration-none')).toBeTrue();
      });
    });
  });

  // -------------------- ESTRUCTURA HTML --------------------
  describe('Estructura HTML', () => {
    it('debe usar lista no ordenada', () => {
      const { container } = render(<Footer />);
      const ul = container.querySelector('ul');
      expect(ul).toBeTruthy();
    });

    it('lista debe tener clase list-unstyled', () => {
      const { container } = render(<Footer />);
      const ul = container.querySelector('ul');
      expect(ul.classList.contains('list-unstyled')).toBeTrue();
    });

    it('cada enlace debe estar en <li>', () => {
      const { container } = render(<Footer />);
      const listItems = container.querySelectorAll('ul li');
      expect(listItems.length).toBe(3);
      listItems.forEach(li => {
        expect(li.querySelector('a')).toBeTruthy();
      });
    });

    it('debe tener h5 con la marca', () => {
      const { container } = render(<Footer />);
      const h5 = container.querySelector('h5');
      expect(h5).toBeTruthy();
      expect(h5.textContent).toBe('Sabor Perú');
    });
  });

  // -------------------- ACCESIBILIDAD --------------------
  describe('Accesibilidad', () => {
    it('enlaces deben ser navegables', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.tabIndex).not.toBe(-1);
      });
    });

    it('enlaces deben tener texto', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
