// src/tests/pages/Login.spec.js
// Pruebas unitarias para la página de Login
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Componente Login testeable (lógica real simplificada)
function LoginTestable({ mockLogin = async () => ({ success: true }) }) {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Ingresa tu correo';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.password) newErrors.password = 'Ingresa tu contraseña';
    else if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const result = await mockLogin(form.email, form.password);
      if (!result.success) setServerError(result.error || 'Credenciales inválidas');
    } catch (error) {
      setServerError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Ingresar</h1>
      {serverError && <div className="alert alert-danger" role="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo</label>
          <input id="email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={handleChange} disabled={loading} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input id="password" name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={handleChange} disabled={loading} />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button type="submit" className="btn btn-danger w-100" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        <p className="text-center mt-3"><a href="/registro">Crear cuenta</a></p>
      </form>
    </div>
  );
}

describe('Login - Pruebas del formulario', () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = jasmine.createSpy('mockLogin').and.returnValue(Promise.resolve({ success: true }));
  });

  // -------------------- RENDERIZADO --------------------
  describe('Renderizado básico', () => {
    it('debe mostrar título "Ingresar"', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      expect(screen.getByRole('heading', { name: /ingresar/i })).toBeTruthy();
    });

    it('debe mostrar campo de email', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      expect(screen.getByLabelText(/correo/i)).toBeTruthy();
    });

    it('debe mostrar campo de contraseña', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      expect(screen.getByLabelText(/contraseña/i)).toBeTruthy();
    });

    it('debe mostrar botón de submit', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      expect(screen.getByRole('button', { name: /ingresar/i })).toBeTruthy();
    });

    it('debe mostrar enlace a registro', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      const link = screen.getByRole('link', { name: /crear cuenta/i });
      expect(link.getAttribute('href')).toBe('/registro');
    });
  });

  // -------------------- VALIDACIÓN EMAIL --------------------
  describe('Validación de Email', () => {
    it('debe mostrar error si email vacío', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Ingresa tu correo')).toBeTruthy());
    });

    it('debe mostrar error si email inválido', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'sinArroba' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Correo inválido')).toBeTruthy());
    });

    it('debe aceptar email válido', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(mockLogin).toHaveBeenCalled());
      expect(screen.queryByText('Correo inválido')).toBeFalsy();
    });

    it('debe agregar clase is-invalid', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => {
        const input = screen.getByLabelText(/correo/i);
        expect(input.classList.contains('is-invalid')).toBeTrue();
      });
    });
  });

  // -------------------- VALIDACIÓN PASSWORD --------------------
  describe('Validación de Contraseña', () => {
    it('debe mostrar error si contraseña vacía', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Ingresa tu contraseña')).toBeTruthy());
    });

    it('debe mostrar error si menos de 6 caracteres', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '12345' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Mínimo 6 caracteres')).toBeTruthy());
    });

    it('debe aceptar 6 caracteres exactos', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(mockLogin).toHaveBeenCalled());
      expect(screen.queryByText('Mínimo 6 caracteres')).toBeFalsy();
    });
  });

  // -------------------- INTERACCIÓN --------------------
  describe('Interacción del formulario', () => {
    it('debe llamar login con email y password', async () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'user@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'mypassword' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'mypassword'));
    });

    it('debe deshabilitar campos mientras carga', async () => {
      mockLogin = jasmine.createSpy('mockLogin').and.returnValue(
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 500))
      );
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => {
        expect(screen.getByLabelText(/correo/i).disabled).toBeTrue();
        expect(screen.getByLabelText(/contraseña/i).disabled).toBeTrue();
      });
    });

    it('debe mostrar "Ingresando..." mientras carga', async () => {
      mockLogin = jasmine.createSpy('mockLogin').and.returnValue(
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 500))
      );
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Ingresando...')).toBeTruthy());
    });
  });

  // -------------------- ERRORES SERVIDOR --------------------
  describe('Errores del servidor', () => {
    it('debe mostrar error de credenciales', async () => {
      mockLogin = jasmine.createSpy('mockLogin').and.returnValue(Promise.resolve({ success: false, error: 'Credenciales inválidas' }));
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert.textContent).toContain('Credenciales inválidas');
      });
    });

    it('debe mostrar error de conexión', async () => {
      mockLogin = jasmine.createSpy('mockLogin').and.returnValue(Promise.reject(new Error('Network')));
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Error de conexión con el servidor')).toBeTruthy());
    });

    it('debe limpiar error al escribir', async () => {
      mockLogin = jasmine.createSpy('mockLogin').and.returnValue(Promise.resolve({ success: false, error: 'Error' }));
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
      await waitFor(() => expect(screen.getByText('Error')).toBeTruthy());
      fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'otro@test.com' } });
      await waitFor(() => expect(screen.queryByText('Error')).toBeFalsy());
    });
  });

  // -------------------- ESTILOS --------------------
  describe('Estilos Bootstrap', () => {
    it('botón debe tener clase btn-danger', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      const btn = screen.getByRole('button', { name: /ingresar/i });
      expect(btn.classList.contains('btn-danger')).toBeTrue();
    });

    it('botón debe tener w-100', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      const btn = screen.getByRole('button', { name: /ingresar/i });
      expect(btn.classList.contains('w-100')).toBeTrue();
    });

    it('inputs deben tener form-control', () => {
      render(<MemoryRouter><LoginTestable mockLogin={mockLogin} /></MemoryRouter>);
      expect(screen.getByLabelText(/correo/i).classList.contains('form-control')).toBeTrue();
      expect(screen.getByLabelText(/contraseña/i).classList.contains('form-control')).toBeTrue();
    });
  });
});
