import React, { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert("Inicio de sesión simulado ✅");
    // Aquí luego integrarías tu backend o Firebase, etc.
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="mb-4">Ingresar</h1>
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
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-danger w-100">Ingresar</button>

        <p className="text-center mt-3 mb-0">
          ¿No tienes cuenta? <a href="/registro">Crear cuenta</a>
        </p>
      </form>
    </div>
  );
}
