// src/context/AuthContext.jsx
// Contexto para manejar autenticación, sesión y roles

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, registro as apiRegistro } from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificar si hay sesión guardada en localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      
      // Guardar en estado
      setToken(response.token);
      setUser({
        nombre: response.nombre,
        email: response.email,
        rol: response.rol,
      });
      
      // Guardar en localStorage (persistencia)
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        nombre: response.nombre,
        email: response.email,
        rol: response.rol,
      }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para registrar nuevo usuario
  const registro = async (nombre, email, password) => {
    try {
      await apiRegistro(nombre, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.rol === 'ADMIN';
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Valores que se comparten en el contexto
  const value = {
    user,
    token,
    loading,
    login,
    registro,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




