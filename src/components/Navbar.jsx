
// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: "#b80d2e" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Sabor Perú</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/quienes-somos">¿Quiénes somos?</NavLink>
            </li>

            <li className="nav-item ms-lg-3">
              <Link className="btn btn-warning btn-sm fw-semibold" to="/login">Ingresar</Link>
            </li>
            <li className="nav-item ms-2">
              <Link className="btn btn-outline-light btn-sm" to="/registro">Crear cuenta</Link>
            </li>
            <li className="nav-item ms-2 position-relative">
              <Link className="btn btn-outline-light btn-sm position-relative" to="/carrito">
                Carrito
                <span id="cart-count" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  0
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
