// src/context/CartContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

// 1) Creamos el contexto
export const CartContext = createContext(null);

// 2) Hook de conveniencia para consumir el contexto desde cualquier componente
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
};

// 3) Proveedor del carrito (envuelve a toda la app)
export function CartProvider({ children }) {

  // items: [{ id, name, price, img, qty }]
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sp_cart_items'); // buscar en localStorage
    return saved ? JSON.parse(saved) : []; // si existe lo devuelve, si no carrito vacío
  });


  // Control del “drawer”/panel del carrito (lo usaremos luego)
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sp_cart_items', JSON.stringify(items));
  }, [items]);


  // Helpers para abrir/cerrar el panel del carrito
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);


  // --- Acciones básicas del carrito ---

  // Agrega 1 unidad. Si ya existe, aumenta qty.
  const addItem = (product) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i !== -1) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: clone[i].qty + 1 };
        return clone;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Aumenta en 1 la cantidad de un ítem
  const incQty = (id) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  };

  // Disminuye en 1 (si llega a 1 y restas, se elimina)
  const decQty = (id) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  // Quita por completo el ítem
  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  // Vacía el carrito
  const clear = () => setItems([]);

  // --- Derivados (totales, cantidad, etc.) ---
  const count = useMemo(
    () => items.reduce((acc, p) => acc + p.qty, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((acc, p) => acc + p.qty * p.price, 0),
    [items]
  );

  // Formateador a CLP (lo usaremos en el panel)
  const formatCLP = (value) =>
    value.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  // Exponemos todo lo necesario
  const value = {
    items,
    addItem,
    incQty,
    decQty,
    removeItem,
    clear,
    count,
    total,
    formatCLP,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    setIsOpen, // lo usaremos para abrir/cerrar el panel del carrito
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
