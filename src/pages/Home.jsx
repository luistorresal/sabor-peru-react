// src/pages/Home.jsx
import slide1 from "../assets/carrusel/carrusel1.jpeg";
import slide2 from "../assets/carrusel/carrusel2.jpeg";
import slide3 from "../assets/carrusel/carrusel3.jpeg";

export default function Home() {
  return (
    <>
      {/* HERO con carrusel */}
      <header className="position-relative">
        <div id="heroSp" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">

            <div className="carousel-item active">
              <img src={slide1} className="d-block w-100" alt="Sabor Perú - slide 1" />
              <div className="carousel-caption text-start">
                <span className="badge bg-warning text-dark mb-2">Hecho en nuestra tierra</span>
                <h1 className="display-5 fw-bold">Snacks que inspiran</h1>
                <p className="lead">Alfajores, chifles y dulces tradicionales.</p>
                <a className="btn btn-danger btn-lg" href="/productos">Ver snacks</a>
              </div>
            </div>

            <div className="carousel-item">
              <img src={slide2} className="d-block w-100" alt="Sabor Perú - slide 2" />
              <div className="carousel-caption">
                <h2 className="fw-bold">Postres tradicionales</h2>
                <p>Sabores que nos conectan con nuestras raíces.</p>
                <a className="btn btn-outline-light" href="/productos">Explorar postres</a>
              </div>
            </div>

            <div className="carousel-item">
              <img src={slide3} className="d-block w-100" alt="Sabor Perú - slide 3" />
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
    </>
  );
}
