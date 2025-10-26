// src/pages/Registro.jsx
import React, { useState } from "react";

export default function Registro() {
  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estado de errores
  const [errors, setErrors] = useState({});

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validar que los campos sean correctos
  const validate = () => {
    const newErrors = {};

    // Validar nombre
    if (!form.nombre.trim()) newErrors.nombre = "Ingresa tu nombre";

    // Validar email
    if (!form.email.trim()) newErrors.email = "Ingresa tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Correo inválido";

    // Validar contraseña
    if (!form.password) newErrors.password = "Ingresa una contraseña";
    else if (form.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres";

    // Validar confirmar contraseña
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    // Guardar errores (si existen)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert("Cuenta registrada (simulado) ✅");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "550px" }}>
      <h1 className="mb-4">Crear cuenta</h1>

      {/* Formulario de registro */}
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
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>

        {/* Botón */}
        <button type="submit" className="btn btn-danger w-100">
          Registrarme
        </button>

        {/* Enlace a Login */}
        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
