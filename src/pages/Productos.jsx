// src/pages/Productos.jsx
import React from "react";

//Snacks & Dulces
import imgAlfajores from "../assets/snacks-dulces/alfajores.jpeg";
import imgChifles from "../assets/snacks-dulces/chifles.jpeg";
import imgKingkong from "../assets/snacks-dulces/kingkong.jpeg";
import imgTurron from "../assets/snacks-dulces/turron.jpeg";

//Postres tradicionales
import imgMazamorra from "../assets/postres-tradicionales/mazamorra-morada.jpeg";
import imgSuspiro from "../assets/postres-tradicionales/suspiro-limeño.jpeg";
import imgCrema from "../assets/postres-tradicionales/crema-volteada.jpeg";

//Insumos / Superalimentos
import imgAjiAmarillo from "../assets/insumos/aji-amarillo.jpeg";
import imgAjiPanca from "../assets/insumos/aji-panca.jpeg";
import imgAjiLimo from "../assets/insumos/aji-limo.jpeg";
import imgQuinua from "../assets/insumos/quinua.jpeg";

//Función para formatear en pesos chilenos
const formatCLP = (price) => {
  return price.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
};

export default function Productos() {
  // Snacks & Dulces
  const snacks = [
    { id: 1, name: "Alfajores", price: 1990, img: imgAlfajores },
    { id: 2, name: "Chifles", price: 1590, img: imgChifles },
    { id: 3, name: "King Kong (porción)", price: 4490, img: imgKingkong },
    { id: 4, name: "Turrón de Doña Pepa", price: 2290, img: imgTurron },
  ];

  //Postres tradicionales
  const postres = [
    { id: 5, name: "Mazamorra morada", price: 3490, img: imgMazamorra },
    { id: 6, name: "Suspiro limeño", price: 3990, img: imgSuspiro },
    { id: 7, name: "Crema volteada", price: 3790, img: imgCrema },
  ];

  //Insumos & Superalimentos
  const insumos = [
    { id: 8, name: "Ají amarillo (pasta)", price: 2990, img: imgAjiAmarillo },
    { id: 9, name: "Ají panca (pasta)", price: 2990, img: imgAjiPanca },
    { id: 10, name: "Ají limo (pasta)", price: 3290, img: imgAjiLimo },
    { id: 11, name: "Quinua andina", price: 5990, img: imgQuinua },
  ];

  return (
    <div className="container py-5">
      <h1 className="mb-4">Todos los productos</h1>

      {/*Snacks & Dulces */}
      <h3>Snacks & Dulces</h3>
      <div className="row g-4 mb-5">
        {snacks.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.img} alt={p.name} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5>{p.name}</h5>
                <p className="text-danger fw-bold">{formatCLP(p.price)}</p>
                <button className="btn btn-danger mt-auto">Añadir al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*Postres */}
      <h3>Postres tradicionales</h3>
      <div className="row g-4 mb-5">
        {postres.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.img} alt={p.name} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5>{p.name}</h5>
                <p className="text-danger fw-bold">{formatCLP(p.price)}</p>
                <button className="btn btn-danger mt-auto">Añadir al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*Insumos */}
      <h3>Insumos & Superalimentos</h3>
      <div className="row g-4">
        {insumos.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.img} alt={p.name} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5>{p.name}</h5>
                <p className="text-danger fw-bold">{formatCLP(p.price)}</p>
                <button className="btn btn-danger mt-auto">Añadir al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
