// src/pages/Productos.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { 
  getProductos, crearProducto, actualizarProducto, eliminarProducto, 
  getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria 
} from "../services/api";

// Importar imágenes locales
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
  'turrón de doña pepa': imgTurron,
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
  // Buscar coincidencia en el mapeo
  for (const [key, img] of Object.entries(imagenesLocales)) {
    if (nombreLower.includes(key) || key.includes(nombreLower)) {
      return img;
    }
  }
  // Si tiene imagen en BD, usarla
  if (producto.imagen && producto.imagen.startsWith('http')) {
    return producto.imagen;
  }
  // Imagen por defecto
  return "https://via.placeholder.com/300x200?text=Producto";
};

// Imagen por defecto para productos sin imagen
const defaultImg = "https://via.placeholder.com/300x200?text=Producto";

// Formateador a CLP
const formatCLP = (n) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 });

export default function Productos({ showToast = () => {} }) {
  const { addItem, openCart } = useCart();
  const { isAdmin, token } = useAuth();
  
  // Estado para productos del backend
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal de productos
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    precio: '', 
    descripcion: '',
    imagen: '',
    stock: 10,
    categoriaId: ''
  });
  const [saving, setSaving] = useState(false);

  // Estado para el modal de categorías
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catFormData, setCatFormData] = useState({ nombre: '', descripcion: '' });
  const [savingCat, setSavingCat] = useState(false);

  // Cargar productos y categorías del backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          getProductos(),
          getCategorias()
        ]);
        setProductos(prods);
        setCategorias(cats);
        setError(null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudieron cargar los productos del servidor');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Funciones de administración
  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', descripcion: '', imagen: '', stock: 10, categoriaId: '' });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      nombre: product.nombre, 
      precio: product.precio, 
      descripcion: product.descripcion || '',
      imagen: product.imagen || '',
      stock: product.stock || 10,
      categoriaId: product.categoria?.id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) {
      try {
        await eliminarProducto(product.id, token);
        setProductos(prev => prev.filter(p => p.id !== product.id));
        showToast(`✅ Producto "${product.nombre}" eliminado`);
      } catch (err) {
        showToast(`❌ Error: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio) {
      showToast('❌ Nombre y precio son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const productoData = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        imagen: formData.imagen || defaultImg,
        stock: parseInt(formData.stock) || 10,
        categoria: formData.categoriaId ? { id: parseInt(formData.categoriaId) } : null
      };

      if (editingProduct) {
        const updated = await actualizarProducto(editingProduct.id, productoData, token);
        setProductos(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        showToast(`✅ Producto "${formData.nombre}" actualizado`);
      } else {
        const nuevo = await crearProducto(productoData, token);
        setProductos(prev => [...prev, nuevo]);
        showToast(`✅ Producto "${formData.nombre}" creado`);
      }
      setShowModal(false);
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ========== FUNCIONES DE CATEGORÍAS ==========
  const handleCreateCat = () => {
    setEditingCat(null);
    setCatFormData({ nombre: '', descripcion: '' });
    setShowCatModal(true);
  };

  const handleEditCat = (cat) => {
    setEditingCat(cat);
    setCatFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setShowCatModal(true);
  };

  const handleDeleteCat = async (cat) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?\nLos productos asociados quedarán sin categoría.`)) {
      try {
        await eliminarCategoria(cat.id, token);
        setCategorias(prev => prev.filter(c => c.id !== cat.id));
        showToast(`✅ Categoría "${cat.nombre}" eliminada`);
      } catch (err) {
        showToast(`❌ Error: ${err.message}`);
      }
    }
  };

  const handleSaveCat = async () => {
    if (!catFormData.nombre) {
      showToast('❌ El nombre de la categoría es obligatorio');
      return;
    }

    setSavingCat(true);
    try {
      const catData = {
        nombre: catFormData.nombre,
        descripcion: catFormData.descripcion,
      };

      if (editingCat) {
        const updated = await actualizarCategoria(editingCat.id, catData, token);
        setCategorias(prev => prev.map(c => c.id === editingCat.id ? updated : c));
        showToast(`✅ Categoría "${catFormData.nombre}" actualizada`);
      } else {
        const nueva = await crearCategoria(catData, token);
        setCategorias(prev => [...prev, nueva]);
        showToast(`✅ Categoría "${catFormData.nombre}" creada`);
      }
      setShowCatModal(false);
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      setSavingCat(false);
    }
  };

  // Agregar al carrito
  const handleAdd = (p) => {
    addItem({
      id: p.id,
      name: p.nombre,
      price: Number(p.precio),
      img: getProductImage(p),
    });
    openCart();
    showToast(`Añadido: ${p.nombre}`);
  };

  // Agrupar productos por categoría
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoriaNombre = producto.categoria?.nombre || 'Sin categoría';
    if (!acc[categoriaNombre]) {
      acc[categoriaNombre] = [];
    }
    acc[categoriaNombre].push(producto);
    return acc;
  }, {});

  // Card de producto
  const ProductCard = ({ p }) => (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="card h-100 shadow-sm">
        <img 
          src={getProductImage(p)} 
          alt={p.nombre} 
          className="card-img-top" 
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-1">{p.nombre}</h5>
          {p.descripcion && <small className="text-muted">{p.descripcion}</small>}
          <p className="text-danger fw-bold mt-2">{formatCLP(Number(p.precio))}</p>
          
          <button type="button" className="btn btn-danger mt-auto" onClick={() => handleAdd(p)}>
            Añadir al carrito
          </button>

          {/* 🔐 BOTONES ADMIN */}
          {isAdmin() && (
            <div className="btn-group mt-2" role="group">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(p)}>
                ✏️ Editar
              </button>
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p)}>
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Todos los productos</h1>
        
        {/* 🔐 BOTONES ADMIN */}
        {isAdmin() && (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-lg" onClick={handleCreateCat}>
              📁 Categorías
            </button>
            <button className="btn btn-success btn-lg" onClick={handleCreate}>
              ➕ Crear Producto
            </button>
          </div>
        )}
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : productos.length === 0 ? (
        <div className="alert alert-info">
          No hay productos disponibles. {isAdmin() && '¡Crea uno con el botón verde!'}
        </div>
      ) : (
        /* Mostrar productos agrupados por categoría */
        Object.entries(productosPorCategoria).map(([categoria, prods]) => (
          <div key={categoria}>
            <h3 className="mt-4 mb-3">{categoria}</h3>
            <div className="row g-4 mb-4">
              {prods.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* 🔐 MODAL CREAR/EDITAR PRODUCTO */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? '✏️ Editar Producto' : '➕ Crear Producto'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre del producto *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Alfajores peruanos"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Precio (CLP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      placeholder="Ej: 1990"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Ej: Deliciosos alfajores de maicena con manjar"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">URL de imagen</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.imagen}
                      onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Categoría</label>
                    <select 
                      className="form-select"
                      value={formData.categoriaId}
                      onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                    >
                      <option value="">Sin categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? '⏳ Guardando...' : (editingProduct ? 'Guardar cambios' : 'Crear producto')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 MODAL GESTIONAR CATEGORÍAS */}
      {showCatModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">📁 Gestionar Categorías</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCatModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Lista de categorías existentes */}
                <h6 className="mb-3">Categorías existentes:</h6>
                {categorias.length === 0 ? (
                  <p className="text-muted">No hay categorías. ¡Crea una!</p>
                ) : (
                  <div className="list-group mb-4">
                    {categorias.map(cat => (
                      <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{cat.nombre}</strong>
                          {cat.descripcion && <small className="text-muted d-block">{cat.descripcion}</small>}
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => handleEditCat(cat)}>
                            ✏️
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleDeleteCat(cat)}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <hr />

                {/* Formulario crear/editar categoría */}
                <h6 className="mb-3">{editingCat ? '✏️ Editar categoría' : '➕ Nueva categoría'}</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={catFormData.nombre}
                      onChange={(e) => setCatFormData({...catFormData, nombre: e.target.value})}
                      placeholder="Ej: Bebidas"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                      type="text"
                      className="form-control"
                      value={catFormData.descripcion}
                      onChange={(e) => setCatFormData({...catFormData, descripcion: e.target.value})}
                      placeholder="Ej: Bebidas tradicionales peruanas"
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveCat}
                  disabled={savingCat}
                >
                  {savingCat ? '⏳ Guardando...' : (editingCat ? 'Actualizar categoría' : 'Crear categoría')}
                </button>
                {editingCat && (
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2" 
                    onClick={() => {
                      setEditingCat(null);
                      setCatFormData({ nombre: '', descripcion: '' });
                    }}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCatModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
