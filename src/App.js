// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";



// Páginas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import QuienesSomos from "./pages/QuienesSomos";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
