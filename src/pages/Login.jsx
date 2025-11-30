// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Si ya está logueado, redirigir a inicio
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setServerError(""); // Limpiar error del servidor al escribir
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Ingresa tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Correo inválido";
    if (!form.password) newErrors.password = "Ingresa tu contraseña";
    else if (form.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setServerError("");
    
    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Redirigir a la página principal
        navigate("/");
      } else {
        setServerError(result.error || "Credenciales inválidas");
      }
    } catch (error) {
      setServerError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="mb-4">Ingresar</h1>
      
      {/* Mostrar error del servidor */}
      {serverError && (
        <div className="alert alert-danger" role="alert">
          {serverError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-danger w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>

        <p className="text-center mt-3 mb-0">
          ¿No tienes cuenta? <a href="/registro">Crear cuenta</a>
        </p>
      </form>
    </div>
  );
}
