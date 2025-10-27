import { render, screen, within } from '@testing-library/react';
import App from '../App';
import MockCartProvider from './utils/MockCartProvider';

describe('App (smoke test)', () => {
  it('renderiza la App y muestra la marca "Sabor Perú" en el navbar', () => {
    render(
      <MockCartProvider cartValue={{ count: 0, toggleCart: () => {} }}>
        <App />
      </MockCartProvider>
    );

    const navbar = screen.getByRole('navigation');
    const brandLink = within(navbar).getByRole('link', { name: /sabor perú/i });
    expect(brandLink).toBeTruthy();   // <- este matcher sí existe en Jasmine
  });
});
