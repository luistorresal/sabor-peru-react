
// Acceso al contexto del carrito
import { useCart } from "../context/CartContext";

//Imágenes del carrusel
import slide1 from "../assets/carrusel/carrusel1.jpeg";
import slide2 from "../assets/carrusel/carrusel2.jpeg";
import slide3 from "../assets/carrusel/carrusel3.jpeg";

//Imágenes de productos para la sección Productos Destacados
import imgAlfajores from "../assets/snacks-dulces/alfajores.jpeg";
import imgChifles from "../assets/snacks-dulces/chifles.jpeg";
import imgKingkong from "../assets/snacks-dulces/kingkong.jpeg";
import imgMazamorra from "../assets/postres-tradicionales/mazamorra-morada.jpeg";

export default function Home({ showToast = () => {} }) {
  // Tomamos la acción para agregar items al carrito
  const { addItem, openCart} = useCart();
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

          {/* Indicadores (opcional) */}
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#heroSp" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
        </div>
      </header>
      {/* ====== Productos destacados ====== */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <h2 className="mb-0">Productos destacados</h2>
            <a className="btn btn-outline-danger btn-sm" href="/productos">Ver todos</a>
          </div>

          {(() => {
            // Función para formatear en pesos chilenos
            const formatCurrency = (value) => {
              return new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0
              }).format(value);
            };

            const productos = [
              { id: 1, name: "Alfajores", price: 1990, img: imgAlfajores },
              { id: 2, name: "Chifles", price: 1590, img: imgChifles },
              { id: 3, name: "King Kong", price: 4490, img: imgKingkong },
              { id: 4, name: "Mazamorra morada", price: 2990, img: imgMazamorra },
            ];

            // Agrega un producto al carrito con cantidad 1
            const handleAdd = (p) => {
              // Estructura mínima esperada por el carrito
              addItem({
                id: p.id,
                name: p.name,
                price: p.price,
                img: p.img,
                qty: 1,
              });
              showToast(`Añadido: ${p.name}`);
            };

            return (
              <div className="row g-4">
                {productos.map((p) => (
                  <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
                    <div className="card h-100 shadow-sm">
                      <img src={p.img} alt={p.name} className="card-img-top" />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title mb-1">{p.name}</h5>
                        <p className="text-muted mb-3">{formatCurrency(p.price)}</p>
                        <button
                          className="btn btn-danger mt-auto"
                          onClick={() => {
                            handleAdd(p);  // ✅ ya agregabas al carrito
                            openCart();    // ✅ esto abrirá el panel automáticamente
                          }}
                        >
                          Agregar al carrito
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </>
  );
}
