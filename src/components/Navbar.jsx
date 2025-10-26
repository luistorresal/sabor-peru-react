// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Estado/acciones del carrito (contador y abrir panel)
import { useCart } from "../context/CartContext";

export default function Navbar() {
  // ▸ Carrito: contador y acción para abrir el panel lateral
  const { count, toggleCart } = useCart();

  // ▸ Control del menú (collapse) en móviles
  const [menuOpen, setMenuOpen] = useState(false);

  // Evita que el body haga scroll cuando el menú está abierto (móvil)
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Limpieza por seguridad
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Cierra el menú automáticamente si ampliamos la pantalla (>=992px)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cerrar menú al navegar
  const closeAndNavigate = () => setMenuOpen(false);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{ backgroundColor: "#b80d2e" }}
    >
      <div className="container">
        {/* Marca */}
        <Link className="navbar-brand fw-bold" to="/" onClick={closeAndNavigate}>
          Sabor Perú
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navMain"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable controlado por estado (sin JS de Bootstrap) */}
        <div
          id="navMain"
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" end to="/" onClick={closeAndNavigate}>
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/productos" onClick={closeAndNavigate}>
                Productos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/quienes-somos" onClick={closeAndNavigate}>
                ¿Quiénes somos?
              </NavLink>
            </li>

            {/* Botones lado derecho */}
            <li className="nav-item ms-lg-3">
              <Link
                className="btn btn-warning btn-sm fw-semibold"
                to="/login"
                onClick={closeAndNavigate}
              >
                Ingresar
              </Link>
            </li>

            <li className="nav-item ms-2">
              <Link
                className="btn btn-outline-light btn-sm"
                to="/registro"
                onClick={closeAndNavigate}
              >
                Crear cuenta
              </Link>
            </li>

            {/* Carrito: abre el sidebar y muestra contador (useCart) */}
            <li className="nav-item ms-2 position-relative">
              <button
                type="button"
                className="btn btn-outline-light btn-sm position-relative"
                onClick={() => {
                  setMenuOpen(false); // por si estamos en móvil, cerramos el menú
                  toggleCart();       // abrimos/cerramos el panel del carrito
                }}
              >
                Carrito
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
