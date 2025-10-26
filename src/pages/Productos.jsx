// src/pages/Productos.jsx
import React from "react";
// 👇 Importa el hook del carrito
import { useCart } from "../context/CartContext";



// Imágenes (igual que antes)
// Snacks & Dulces
import imgAlfajores from "../assets/snacks-dulces/alfajores.jpeg";
import imgChifles from "../assets/snacks-dulces/chifles.jpeg";
import imgKingkong from "../assets/snacks-dulces/kingkong.jpeg";
import imgTurron from "../assets/snacks-dulces/turron.jpeg";

// Postres tradicionales
import imgMazamorra from "../assets/postres-tradicionales/mazamorra-morada.jpeg";
import imgSuspiro from "../assets/postres-tradicionales/suspiro-limeño.jpeg";
import imgCrema from "../assets/postres-tradicionales/crema-volteada.jpeg";

// Insumos / Superalimentos
import imgAjiAmarillo from "../assets/insumos/aji-amarillo.jpeg";
import imgAjiPanca from "../assets/insumos/aji-panca.jpeg";
import imgAjiLimo from "../assets/insumos/aji-limo.jpeg";
import imgQuinua from "../assets/insumos/quinua.jpeg";

// Formateador a CLP (igual que en Home)
const formatCLP = (n) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });

export default function Productos({ showToast = () => {} }) {
  // Tomamos la acción addItem del carrito
  const { addItem, openCart  } = useCart();

  // Helper: agrega un producto con qty=1 (el contexto se encarga de sumar si ya existe)
  const handleAdd = (p) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      img: p.img,
    });
    openCart();
    showToast(`Añadido: ${p.name}`);
  };

  // ==== DATA ====
  // Snacks & Dulces
  const snacks = [
    { id: 1, name: "Alfajores", price: 1990, img: imgAlfajores, subtitle: "Caja 6 unidades" },
    { id: 2, name: "Chifles", price: 1590, img: imgChifles, subtitle: "Bolsa 150 g" },
    { id: 3, name: "King Kong (porción)", price: 4490, img: imgKingkong, subtitle: "120 g" },
    { id: 4, name: "Turrón de Doña Pepa", price: 2290, img: imgTurron, subtitle: "500 g" },
  ];

  // Postres tradicionales
  const postres = [
    { id: 5, name: "Mazamorra morada", price: 3490, img: imgMazamorra, subtitle: "Porción 400 g" },
    { id: 6, name: "Suspiro limeño", price: 3990, img: imgSuspiro, subtitle: "Vaso 250 ml" },
    { id: 7, name: "Crema volteada", price: 3790, img: imgCrema, subtitle: "Porción 150 g" },
  ];

  // Insumos & Superalimentos
  const insumos = [
    { id: 8,  name: "Ají amarillo (pasta)", price: 2990, img: imgAjiAmarillo, subtitle: "Frasco 400 g" },
    { id: 9,  name: "Ají panca (pasta)",    price: 2990, img: imgAjiPanca,    subtitle: "Frasco 400 g" },
    { id: 10, name: "Ají limo (pasta)",      price: 3290, img: imgAjiLimo,     subtitle: "Frasco 400 g" },
    { id: 11, name: "Quinua andina",         price: 5990, img: imgQuinua,      subtitle: "Bolsa 1 kg"   },
  ];

  // Componente mini para no repetir markup
  const Grid = ({ title, data }) => (
    <>
      <h3 className="mt-4">{title}</h3>
      <div className="row g-4 mb-4">
        {data.map((p) => (
          <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img src={p.img} alt={p.name} className="card-img-top" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{p.name}</h5>
                {p.subtitle && <small className="text-muted">{p.subtitle}</small>}
                <p className="text-danger fw-bold mt-2">{formatCLP(p.price)}</p>

                {/* BOTÓN: aquí conectamos el carrito */}
                <button
                  type="button"
                  className="btn btn-danger mt-auto"
                  onClick={() => handleAdd(p)}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">Todos los productos</h1>

      <Grid title="Snacks & Dulces" data={snacks} />
      <Grid title="Postres tradicionales" data={postres} />
      <Grid title="Insumos & Superalimentos" data={insumos} />
    </div>
  );
}
