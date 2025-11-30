// src/pages/Home.jsx
import React, { useState, useEffect } from "react";

// Acceso al contexto del carrito y autenticación
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductos } from "../services/api";

// Imágenes del carrusel
import slide1 from "../assets/carrusel/carrusel1.jpeg";
import slide2 from "../assets/carrusel/carrusel2.jpeg";
import slide3 from "../assets/carrusel/carrusel3.jpeg";

// Imágenes locales para mapeo
import imgAlfajores from "../assets/snacks-dulces/alfajores.jpeg";
import imgChifles from "../assets/snacks-dulces/chifles.jpeg";
import imgKingkong from "../assets/snacks-dulces/kingkong.jpeg";
import imgTurron from "../assets/snacks-dulces/turron.jpeg";
import imgMazamorra from "../assets/postres-tradicionales/mazamorra-morada.jpeg";
import imgSuspiro from "../assets/postres-tradicionales/suspiro-limeño.jpeg";
import imgCrema from "../assets/postres-tradicionales/crema-volteada.jpeg";
import imgAjiAmarillo from "../assets/insumos/aji-amarillo.jpeg";
import imgAjiPanca from "../assets/insumos/aji-panca.jpeg";
import imgAjiLimo from "../assets/insumos/aji-limo.jpeg";
import imgQuinua from "../assets/insumos/quinua.jpeg";

// Mapeo de nombres de productos a imágenes locales
const imagenesLocales = {
  'alfajores': imgAlfajores,
  'chifles': imgChifles,
  'king kong': imgKingkong,
  'kingkong': imgKingkong,
  'turron': imgTurron,
  'turrón': imgTurron,
  'turron de dona pepa': imgTurron,
  'mazamorra': imgMazamorra,
  'mazamorra morada': imgMazamorra,
  'suspiro': imgSuspiro,
  'suspiro limeno': imgSuspiro,
  'suspiro limeño': imgSuspiro,
  'crema volteada': imgCrema,
  'crema': imgCrema,
  'aji amarillo': imgAjiAmarillo,
  'ají amarillo': imgAjiAmarillo,
  'aji amarillo (pasta)': imgAjiAmarillo,
  'aji panca': imgAjiPanca,
  'ají panca': imgAjiPanca,
  'aji panca (pasta)': imgAjiPanca,
  'aji limo': imgAjiLimo,
  'ají limo': imgAjiLimo,
  'aji limo (pasta)': imgAjiLimo,
  'quinua': imgQuinua,
  'quinua andina': imgQuinua,
};

// Función para obtener imagen del producto
const getProductImage = (producto) => {
  const nombreLower = producto.nombre?.toLowerCase() || '';
  for (const [key, img] of Object.entries(imagenesLocales)) {
    if (nombreLower.includes(key) || key.includes(nombreLower)) {
      return img;
    }
  }
  if (producto.imagen && producto.imagen.startsWith('http')) {
    return producto.imagen;
  }
  return imgAlfajores; // Default
};

// Función para formatear en pesos chilenos
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0
  }).format(value);
};

// Testimonios de clientes (se podrían cargar de BD en el futuro)
const testimonios = [
  {
    id: 1,
    nombre: "María García",
    avatar: "https://i.pravatar.cc/100?img=1",
    comentario: "¡Los alfajores son increíbles! Me transportaron directamente a Lima. El envío fue rápido y llegaron en perfecto estado.",
    rating: 5,
    fecha: "Hace 2 días",
    producto: "Alfajores"
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    avatar: "https://i.pravatar.cc/100?img=3",
    comentario: "La mazamorra morada estaba deliciosa, igual que la de mi abuela. Definitivamente volveré a comprar.",
    rating: 5,
    fecha: "Hace 1 semana",
    producto: "Mazamorra Morada"
  },
  {
    id: 3,
    nombre: "Ana Torres",
    avatar: "https://i.pravatar.cc/100?img=5",
    comentario: "Excelente calidad en los ajíes. El ají amarillo tiene el sabor auténtico que buscaba para mis recetas.",
    rating: 4,
    fecha: "Hace 2 semanas",
    producto: "Ají Amarillo"
  },
  {
    id: 4,
    nombre: "Roberto Sánchez",
    avatar: "https://i.pravatar.cc/100?img=8",
    comentario: "El suspiro limeño es espectacular. Lo pedí para un cumpleaños y todos quedaron encantados.",
    rating: 5,
    fecha: "Hace 3 semanas",
    producto: "Suspiro Limeño"
  }
];

export default function Home({ showToast = () => {} }) {
  const { addItem, openCart } = useCart();
  const { isAdmin } = useAuth();
  
  // Estado para productos destacados desde BD
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos destacados (primeros 4 de la BD)
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productos = await getProductos();
        // Tomar los primeros 4 productos como destacados
        setProductosDestacados(productos.slice(0, 4));
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Agregar al carrito
  const handleAdd = (p) => {
    addItem({
      id: p.id,
      name: p.nombre,
      price: Number(p.precio),
      img: getProductImage(p),
      qty: 1,
    });
    showToast(`Añadido: ${p.nombre}`);
    openCart();
  };

  // Componente de estrellas
  const Stars = ({ rating }) => (
    <div className="text-warning mb-2">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );

  return (
    <>
      {/* HERO con carrusel */}
      <header className="position-relative">
        <div id="heroSp" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={slide1} className="d-block w-100 hero-slide" alt="Sabor Perú - slide 1" />
              <div className="carousel-caption text-start">
                <span className="badge bg-warning text-dark mb-2">Hecho en nuestra tierra</span>
                <h1 className="display-5 fw-bold">Snacks que inspiran</h1>
                <p className="lead">Alfajores, chifles y dulces tradicionales.</p>
                <a className="btn btn-danger btn-lg" href="/productos">Ver snacks</a>
              </div>
            </div>

            <div className="carousel-item">
              <img src={slide2} className="d-block w-100 hero-slide" alt="Sabor Perú - slide 2" />
              <div className="carousel-caption">
                <h2 className="fw-bold">Postres tradicionales</h2>
                <p>Sabores que nos conectan con nuestras raíces.</p>
                <a className="btn btn-outline-light" href="/productos">Explorar postres</a>
              </div>
            </div>

            <div className="carousel-item">
              <img src={slide3} className="d-block w-100 hero-slide" alt="Sabor Perú - slide 3" />
              <div className="carousel-caption text-end">
                <h2 className="fw-bold">Dulces para compartir</h2>
                <p>Lleva lo mejor de Sabor Perú a tu mesa.</p>
                <a className="btn btn-warning" href="/productos">Comprar ahora</a>
              </div>
            </div>
          </div>

          {/* Controles */}
          <button className="carousel-control-prev" type="button" data-bs-target="#heroSp" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroSp" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>

          {/* Indicadores */}
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
        </div>
      </header>

      {/* ====== PRODUCTOS DESTACADOS ====== */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="mb-1">🌟 Productos destacados</h2>
              <p className="text-muted mb-0">Los favoritos de nuestros clientes</p>
            </div>
            <a className="btn btn-outline-danger" href="/productos">Ver todos →</a>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : productosDestacados.length === 0 ? (
            <div className="alert alert-info">
              No hay productos destacados disponibles.
              {isAdmin() && ' ¡Ve a Productos para agregar algunos!'}
            </div>
          ) : (
            <div className="row g-4">
              {productosDestacados.map((p) => (
                <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                  <div className="card h-100 shadow-sm border-0 overflow-hidden">
                    <div className="position-relative">
                      <img 
                        src={getProductImage(p)} 
                        alt={p.nombre} 
                        className="card-img-top" 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        ⭐ Destacado
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title mb-1">{p.nombre}</h5>
                      {p.descripcion && <small className="text-muted">{p.descripcion}</small>}
                      <p className="text-danger fw-bold fs-5 mt-2 mb-3">{formatCurrency(Number(p.precio))}</p>
                      <button
                        className="btn btn-danger mt-auto"
                        onClick={() => handleAdd(p)}
                      >
                        🛒 Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje para admin */}
          {isAdmin() && (
            <div className="alert alert-info mt-4 d-flex align-items-center">
              <span className="me-2">💡</span>
              <span>
                <strong>Tip de Admin:</strong> Los productos destacados son los primeros 4 de tu catálogo. 
                Ve a <a href="/productos" className="alert-link">Productos</a> para agregar, editar o reorganizar.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ====== TESTIMONIOS DE CLIENTES ====== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-2">💬 Lo que dicen nuestros clientes</h2>
            <p className="text-muted">Opiniones reales de personas que probaron nuestros productos</p>
          </div>

          <div className="row g-4">
            {testimonios.map((t) => (
              <div className="col-12 col-md-6 col-lg-3" key={t.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={t.avatar} 
                        alt={t.nombre}
                        className="rounded-circle me-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-0">{t.nombre}</h6>
                        <small className="text-muted">{t.fecha}</small>
                      </div>
                    </div>
                    <Stars rating={t.rating} />
                    <p className="card-text text-muted" style={{ fontSize: '0.95rem' }}>
                      "{t.comentario}"
                    </p>
                    <span className="badge bg-secondary">{t.producto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-5">
            <p className="text-muted mb-3">¿Ya probaste nuestros productos?</p>
            <a href="/productos" className="btn btn-danger btn-lg">
              🛍️ ¡Haz tu pedido ahora!
            </a>
          </div>
        </div>
      </section>

      {/* ====== BENEFICIOS ====== */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4">
                <div className="display-4 mb-3">🚚</div>
                <h5>Envío rápido</h5>
                <p className="text-muted mb-0">Entrega en 24-48 horas en Santiago</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="display-4 mb-3">✅</div>
                <h5>Calidad garantizada</h5>
                <p className="text-muted mb-0">Productos frescos y auténticos</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="display-4 mb-3">💳</div>
                <h5>Pago seguro</h5>
                <p className="text-muted mb-0">Múltiples métodos de pago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
