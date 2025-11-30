// src/components/Navbar.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { count, toggleCart } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeAndNavigate = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

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

        {/* Menú colapsable */}
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

            {/* ===== SECCIÓN CONDICIONAL SEGÚN AUTENTICACIÓN ===== */}
            
            {isAuthenticated() ? (
              // Usuario LOGUEADO
              <>
                {/* Mostrar nombre y rol */}
                <li className="nav-item ms-lg-3">
                  <span className="nav-link text-warning fw-semibold">
                    👤 {user?.nombre}
                    {isAdmin() && (
                      <span className="badge bg-warning text-dark ms-2">ADMIN</span>
                    )}
                  </span>
                </li>

                {/* Botón cerrar sesión */}
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              // Usuario NO LOGUEADO
              <>
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
              </>
            )}

            {/* Carrito */}
            <li className="nav-item ms-2 position-relative">
              <button
                type="button"
                className="btn btn-outline-light btn-sm position-relative"
                onClick={() => {
                  setMenuOpen(false);
                  toggleCart();
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
