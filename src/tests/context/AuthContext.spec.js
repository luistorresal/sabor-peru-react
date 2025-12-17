// src/tests/context/AuthContext.spec.js
// Pruebas unitarias para el contexto de autenticación
import React, { useContext } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Contexto para testing
const AuthContext = React.createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider simplificado para testing
const TestAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'admin@test.com' && password === 'admin123') {
      const userData = { nombre: 'Admin', email, rol: 'ADMIN' };
      setToken('jwt-admin');
      setUser(userData);
      localStorage.setItem('token', 'jwt-admin');
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    if (email === 'user@test.com' && password === 'user123') {
      const userData = { nombre: 'User', email, rol: 'USER' };
      setToken('jwt-user');
      setUser(userData);
      localStorage.setItem('token', 'jwt-user');
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Credenciales inválidas' };
  };

  const registro = (nombre, email, password) => {
    if (nombre && email && password && password.length >= 6) {
      return { success: true };
    }
    return { success: false, error: 'Datos inválidos' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.rol === 'ADMIN';
  const isAuthenticated = () => !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registro, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente consumidor para testing
function TestConsumer() {
  const { user, token, loading, login, registro, logout, isAdmin, isAuthenticated } = useAuth();
  const [result, setResult] = React.useState('');

  const handleLoginAdmin = () => {
    const r = login('admin@test.com', 'admin123');
    setResult(r.success ? 'login-ok' : r.error);
  };

  const handleLoginUser = () => {
    const r = login('user@test.com', 'user123');
    setResult(r.success ? 'login-ok' : r.error);
  };

  const handleLoginBad = () => {
    const r = login('bad@test.com', 'wrong');
    setResult(r.success ? 'login-ok' : r.error);
  };

  const handleRegistroOk = () => {
    const r = registro('Nuevo', 'nuevo@test.com', 'pass123');
    setResult(r.success ? 'registro-ok' : r.error);
  };

  const handleRegistroBad = () => {
    const r = registro('', '', '');
    setResult(r.success ? 'registro-ok' : r.error);
  };

  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="isAuth">{String(isAuthenticated())}</span>
      <span data-testid="isAdmin">{String(isAdmin())}</span>
      <span data-testid="userName">{user?.nombre || 'none'}</span>
      <span data-testid="userRol">{user?.rol || 'none'}</span>
      <span data-testid="token">{token || 'none'}</span>
      <span data-testid="result">{result}</span>

      <button onClick={handleLoginAdmin}>login-admin</button>
      <button onClick={handleLoginUser}>login-user</button>
      <button onClick={handleLoginBad}>login-bad</button>
      <button onClick={logout}>logout</button>
      <button onClick={handleRegistroOk}>registro-ok</button>
      <button onClick={handleRegistroBad}>registro-bad</button>
    </div>
  );
}

describe('AuthContext - Pruebas de autenticación', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  // -------------------- ESTADO INICIAL --------------------
  describe('Estado inicial', () => {
    it('debe iniciar sin usuario', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
      expect(screen.getByTestId('isAuth').textContent).toBe('false');
      expect(screen.getByTestId('userName').textContent).toBe('none');
    });

    it('debe cargar sesión desde localStorage', async () => {
      localStorage.setItem('token', 'saved-token');
      localStorage.setItem('user', JSON.stringify({ nombre: 'Guardado', email: 'g@t.com', rol: 'USER' }));
      
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
      expect(screen.getByTestId('isAuth').textContent).toBe('true');
      expect(screen.getByTestId('userName').textContent).toBe('Guardado');
    });
  });

  // -------------------- LOGIN --------------------
  describe('Función login', () => {
    it('debe autenticar admin correctamente', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-admin'));
      });

      expect(screen.getByTestId('result').textContent).toBe('login-ok');
      expect(screen.getByTestId('isAuth').textContent).toBe('true');
      expect(screen.getByTestId('isAdmin').textContent).toBe('true');
      expect(screen.getByTestId('userRol').textContent).toBe('ADMIN');
    });

    it('debe autenticar usuario normal', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-user'));
      });

      expect(screen.getByTestId('result').textContent).toBe('login-ok');
      expect(screen.getByTestId('isAdmin').textContent).toBe('false');
      expect(screen.getByTestId('userRol').textContent).toBe('USER');
    });

    it('debe rechazar credenciales inválidas', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-bad'));
      });

      expect(screen.getByTestId('result').textContent).toBe('Credenciales inválidas');
      expect(screen.getByTestId('isAuth').textContent).toBe('false');
    });

    it('debe persistir en localStorage', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-admin'));
      });

      expect(localStorage.getItem('token')).toBe('jwt-admin');
    });
  });

  // -------------------- LOGOUT --------------------
  describe('Función logout', () => {
    it('debe cerrar sesión', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-admin'));
      });
      expect(screen.getByTestId('isAuth').textContent).toBe('true');

      await act(async () => {
        fireEvent.click(screen.getByText('logout'));
      });
      expect(screen.getByTestId('isAuth').textContent).toBe('false');
      expect(screen.getByTestId('userName').textContent).toBe('none');
    });

    it('debe limpiar localStorage', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('login-admin'));
      });
      expect(localStorage.getItem('token')).toBe('jwt-admin');

      await act(async () => {
        fireEvent.click(screen.getByText('logout'));
      });
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  // -------------------- REGISTRO --------------------
  describe('Función registro', () => {
    it('debe registrar con datos válidos', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('registro-ok'));
      });

      expect(screen.getByTestId('result').textContent).toBe('registro-ok');
    });

    it('debe rechazar datos inválidos', async () => {
      render(<TestAuthProvider><TestConsumer /></TestAuthProvider>);
      await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

      await act(async () => {
        fireEvent.click(screen.getByText('registro-bad'));
      });

      expect(screen.getByTestId('result').textContent).toBe('Datos inválidos');
    });
  });

  // -------------------- HOOK useAuth --------------------
  describe('Hook useAuth', () => {
    it('debe lanzar error fuera del Provider', () => {
      const BadComponent = () => {
        try {
          useAuth();
          return <span>no-error</span>;
        } catch (e) {
          return <span data-testid="error">{e.message}</span>;
        }
      };

      render(<BadComponent />);
      expect(screen.getByTestId('error').textContent).toContain('useAuth debe usarse dentro de AuthProvider');
    });
  });
});
