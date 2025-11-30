// src/pages/Registro.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { registro, isAuthenticated } = useAuth();

  // Si ya está logueado, redirigir a inicio
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "Ingresa tu nombre";
    if (!form.email.trim()) newErrors.email = "Ingresa tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Correo inválido";
    if (!form.password) newErrors.password = "Ingresa una contraseña";
    else if (form.password.length < 6) newErrors.password = "Debe tener al menos 6 caracteres";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const result = await registro(form.nombre, form.email, form.password);

      if (result.success) {
        setSuccess(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(result.error || "Error al registrar");
      }
    } catch (error) {
      setServerError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "550px" }}>
      <h1 className="mb-4">Crear cuenta</h1>

      {/* Mensaje de éxito */}
      {success && (
        <div className="alert alert-success" role="alert">
          ✅ ¡Cuenta creada exitosamente! Redirigiendo al login...
        </div>
      )}

      {/* Mensaje de error */}
      {serverError && (
        <div className="alert alert-danger" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            placeholder="Ejemplo: Juan Pérez"
            value={form.nombre}
            onChange={handleChange}
            disabled={loading || success}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading || success}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            disabled={loading || success}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="******"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading || success}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>

        {/* Botón */}
        <button 
          type="submit" 
          className="btn btn-danger w-100"
          disabled={loading || success}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registrando...
            </>
          ) : (
            "Registrarme"
          )}
        </button>

        {/* Enlace a Login */}
        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
