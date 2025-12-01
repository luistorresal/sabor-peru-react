// src/services/api.js
// Servicio para conectar con el backend Spring Boot

// URL del Backend en AWS EC2 (IP Elástica - FIJA)
const API_URL = 'http://3.224.46.132:8080/api';

// ==================== AUTENTICACIÓN ====================

// Login - Obtener token JWT
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || 'Credenciales inválidas');
  }
  
  return response.json();
};

// Registro - Crear nueva cuenta
export const registro = async (nombre, email, password) => {
  const response = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || 'Error al registrar');
  }
  
  return response.json();
};

// ==================== PRODUCTOS ====================

// Obtener todos los productos (público)
export const getProductos = async () => {
  const response = await fetch(`${API_URL}/productos`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
};

// Crear producto (solo ADMIN)
export const crearProducto = async (producto, token) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear producto. ¿Eres administrador?');
  }
  
  return response.json();
};

// Actualizar producto (solo ADMIN)
export const actualizarProducto = async (id, producto, token) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar producto. ¿Eres administrador?');
  }
  
  return response.json();
};

// Eliminar producto (solo ADMIN)
export const eliminarProducto = async (id, token) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar producto');
  }
  
  return true;
};

// ==================== CATEGORÍAS ====================

// Obtener todas las categorías (público)
export const getCategorias = async () => {
  const response = await fetch(`${API_URL}/categorias`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json();
};

// Crear categoría (solo ADMIN)
export const crearCategoria = async (categoria, token) => {
  const response = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoria),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear categoría. ¿Eres administrador?');
  }
  
  return response.json();
};

// Actualizar categoría (solo ADMIN)
export const actualizarCategoria = async (id, categoria, token) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoria),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar categoría. ¿Eres administrador?');
  }
  
  return response.json();
};

// Eliminar categoría (solo ADMIN)
export const eliminarCategoria = async (id, token) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar categoría. Puede tener productos asociados.');
  }
  
  return true;
};

// ==================== USUARIOS ====================

// Obtener todos los usuarios (requiere autenticación)
export const getUsuarios = async (token) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
};


