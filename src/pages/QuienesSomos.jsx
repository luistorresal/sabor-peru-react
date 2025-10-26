// src/pages/QuienesSomos.jsx
import React from "react";

// Imágenes (ajusta las rutas si tu carpeta difiere)
import imgSuspiro from "../assets/postres-tradicionales/suspiro-limeño.jpeg";
import imgAlfajores from "../assets/snacks-dulces/alfajores.jpeg";

export default function QuienesSomos() {
  return (
    <div className="pb-5">

      {/* Sección: ¿Quiénes somos? */}
      <section className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h1 className="display-5 fw-bold mb-4">¿Quiénes somos?</h1>
            <p className="lead">
              En Sabor Perú creemos que la gastronomía es una forma de
              mantener viva nuestra identidad. Compartimos con orgullo
              productos peruanos auténticos que conectan con nuestras raíces
              y que hoy puedes disfrutar desde cualquier lugar.
            </p>
          </div>

          <div className="col-12 col-lg-6">
            <img
              src={imgSuspiro}
              alt="Suspiro limeño - Sabor Perú"
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Sección: Nuestra Historia */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4">Nuestra Historia</h2>
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <p className="fs-5">
              Sabor Perú nació con la idea de acercar la tradición culinaria de
              nuestro país a las mesas de quienes extrañan un pedacito de su
              tierra o desean descubrir los sabores que hacen única a nuestra
              cultura. Empezamos con un pequeño catálogo de dulces típicos y,
              gracias a la acogida, fuimos incorporando postres tradicionales e
              insumos básicos de la cocina peruana.
            </p>
          </div>

          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <img
              src={imgAlfajores}
              alt="Alfajores - Sabor Perú"
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Sección: Visión / Misión */}
      <section className="py-5" style={{ backgroundColor: "#fff3e9" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="p-4 p-lg-5 bg-white rounded-4 shadow-sm h-100">
                <h3 className="fw-bold mb-3">Visión</h3>
                <p className="mb-0">
                  Convertirnos en la tienda online referente de productos
                  peruanos en Chile, reconocida por su calidad, autenticidad y por
                  ser un puente cultural entre comunidades.
                </p>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="p-4 p-lg-5 bg-white rounded-4 shadow-sm h-100">
                <h3 className="fw-bold mb-3">Misión</h3>
                <p className="mb-0">
                  Ofrecer una experiencia de compra confiable y cercana,
                  brindando a nuestros clientes productos peruanos cuidadosamente
                  seleccionados que transmiten tradición y sabor en cada entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Alcance */}
      <section className="container py-5">
        <h2 className="fw-bold text-center mb-4">Alcance</h2>
        <p className="fs-5 text-center mx-auto" style={{ maxWidth: 920 }}>
          Nuestro alcance se centra en la comercialización online de snacks,
          dulces, postres tradicionales e insumos peruanos en Chile. Brindamos
          una plataforma intuitiva, segura y accesible, que permite realizar
          compras rápidas, con información clara y soporte continuo.
        </p>

        <div className="text-center mt-4">
          <a href="/productos" className="btn btn-danger btn-lg">
            Explorar catálogo
          </a>
        </div>
      </section>
    </div>
  );
}
