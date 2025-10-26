// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import "./App.css";
import React, { useState } from "react";
import ToastNotification from "./components/ToastNotification";


// Páginas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import QuienesSomos from "./pages/QuienesSomos";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";

export default function App() {
  // Estado global para el toast
  const [toast, setToast] = useState({ show: false, message: "" });

  // Función para mostrar el toast
  const showToast = (msg) => {
    setToast({ show: true, message: msg }); // mostrar
    setTimeout(() => {
      setToast({ show: false, message: "" }); // ocultar en 2 seg.
    }, 2000);
  };

  return (

    <CartProvider>
      <BrowserRouter>
        <Navbar />
        {/*Home SIN container para que el carrusel ocupe toda la pantalla */}
        <Routes>
          <Route path="/" element={<Home showToast={showToast}/>} />
        </Routes>
        {/*Otras páginas SÍ van con container para mantener márgenes */}
        <main className="container py-4">
          <Routes>
            <Route path="/productos" element={<Productos showToast={showToast}/>} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>
        </main>

        <Footer />
        <CartSidebar />
      </BrowserRouter>
      <ToastNotification show={toast.show} message={toast.message} />

    </CartProvider>
  );
}

