// src/tests/utils/MockAuthProvider.jsx
// Mock del AuthProvider que usa el mismo contexto que el real
import React from 'react';

// Importamos el contexto real para poder sobrescribir su Provider
// Esto es necesario porque Navbar importa useAuth directamente del AuthContext
const AuthContext = React.createContext();

// Recreamos useAuth para que funcione con nuestro mock
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * MockAuthProvider - Provider simulado que permite controlar el estado de auth
 */
const MockAuthProvider = ({ children, authValue }) => {
  const defaultValue = {
    user: null,
    token: null,
    loading: false,
    login: async () => ({ success: true }),
    logout: () => {},
    registro: async () => ({ success: true }),
    isAdmin: () => false,
    isAuthenticated: () => false,
    ...authValue,
  };

  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportar el contexto también para que pueda ser usado
export { AuthContext };
export default MockAuthProvider;
