// src/components/CartSidebar.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function CartSidebar() {
  // Tomamos todo lo que necesitamos del contexto
  const {
    items,           // [{id, name, price, img, qty}]
    incQty,          // +1
    decQty,          // -1 (si llega a 0, se elimina)
    removeItem,      // quita el ítem
    clear,           // vaciar carrito
    total,           // total en número
    formatCLP,       // formateador a CLP
    isOpen,          // ¿panel abierto?
    closeCart,       // cerrar panel
  } = useCart();

  // Cierra si se hace clic en el fondo oscuro
  const handleBackdrop = (e) => {
    if (e.target.classList.contains("cart-overlay")) closeCart();
  };

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={handleBackdrop}
      />

      {/* Drawer derecho */}
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        {/* Cabecera */}
        <div className="cart-header">
          <h5 className="mb-0">Tu Carrito</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={closeCart}
          />
        </div>

        {/* Contenido */}
        <div className="cart-body">
          {items.length === 0 ? (
            <p className="text-muted text-center my-4">Tu carrito está vacío</p>
          ) : (
            <ul className="list-unstyled m-0">
              {items.map((it) => (
                <li key={it.id} className="cart-item">
                  <img src={it.img} alt={it.name} className="cart-thumb" />

                  <div className="cart-info">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">{it.name}</div>
                        <small className="text-muted">{formatCLP(it.price)}</small>
                      </div>

                      {/* Quitar ítem */}
                      <button
                        className="btn btn-sm btn-link text-danger p-0 ms-2"
                        onClick={() => removeItem(it.id)}
                        aria-label="Quitar"
                        title="Quitar"
                      >
                        ×
                      </button>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="d-flex align-items-center mt-2 gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decQty(it.id)}
                        aria-label="Disminuir"
                      >
                        −
                      </button>

                      <span className="px-2">{it.qty}</span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => incQty(it.id)}
                        aria-label="Aumentar"
                      >
                        +
                      </button>

                      {/* Subtotal al lado derecho */}
                      <div className="ms-auto fw-semibold">
                        {formatCLP(it.qty * it.price)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pie con total y acciones */}
        <div className="cart-footer">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">Total:</span>
            <span className="fs-5 fw-bold">{formatCLP(total)}</span>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary flex-fill"
              onClick={clear}
              disabled={items.length === 0}
            >
              Vaciar
            </button>
            <button
              className="btn btn-danger flex-fill"
              onClick={() => {
                if (items.length === 0) return;
                alert("¡Compra realizada!");
                clear();
                closeCart();
              }}
              disabled={items.length === 0}
            >
              Comprar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

