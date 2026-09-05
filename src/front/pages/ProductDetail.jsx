import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, X, ShoppingCart, ArrowLeft, Store, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const ProductDetail = () => {
  const { theId } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
    setQuantity(1);
  }, [theId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProductById(theId);
      setProduct(data);
    } catch (err) {
      toast.error("No se pudo cargar el producto");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      toast.error("Producto no disponible");
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity },
    });

    toast.success(`${quantity} x "${product.name}" añadido al carrito`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center flex-grow-1">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container py-5 flex-grow-1">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card card-flat p-4"
      >
        <div className="row g-4 align-items-center">
          {/* Image */}
          <div className="col-12 col-md-6">
            <div
              className="border rounded overflow-hidden position-relative bg-light"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
              {product.is_featured && (
                <span className="badge badge-flat badge-flat-warning position-absolute top-0 end-0 m-3">
                  Destacado
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <div>
              <span className="badge badge-flat badge-flat-secondary mb-2">
                {product.category_name || "General"}
              </span>
              <h2 className="fw-bold text-dark mb-2">{product.name}</h2>
              <div className="fs-2 fw-bold text-dark mb-3">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <p className="text-muted mb-4 lead" style={{ fontSize: "1rem" }}>
              {product.description}
            </p>

            {/* Stock status */}
            <div className="mb-4">
              <span className="small text-muted d-block mb-1">DISPONIBILIDAD:</span>
              {product.stock > 0 ? (
                <span className="badge badge-flat badge-flat-success d-inline-flex align-items-center gap-1">
                  <Check size={14} />
                  <span>En stock ({product.stock} unidades disponibles)</span>
                </span>
              ) : (
                <span className="badge badge-flat badge-flat-secondary text-danger d-inline-flex align-items-center gap-1">
                  <X size={14} />
                  <span>Agotado</span>
                </span>
              )}
            </div>

            {/* Quantity Selector & Action */}
            {product.stock > 0 && (
              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 gap-sm-3 mb-4">
                <div className="input-group" style={{ maxWidth: "140px" }}>
                  <button
                    className="btn btn-flat-outline px-3"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center form-control-flat"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-flat-outline px-3"
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-flat-primary px-4 py-2 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <ShoppingCart size={16} />
                  <span>Añadir al Carrito</span>
                </button>
              </div>
            )}

            {/* Trust highlights */}
            <div className="row g-2 mb-4 p-3 rounded bg-light border">
              <div className="col-4 text-center">
                <Truck size={18} className="text-primary mb-1 d-block mx-auto" />
                <div className="small fw-bold" style={{ fontSize: "0.75rem" }}>Envío 24-48h</div>
                <div className="text-muted" style={{ fontSize: "0.7rem" }}>Rastreo activo</div>
              </div>
              <div className="col-4 text-center border-start border-end">
                <RotateCcw size={18} className="text-success mb-1 d-block mx-auto" />
                <div className="small fw-bold" style={{ fontSize: "0.75rem" }}>Garantía 30d</div>
                <div className="text-muted" style={{ fontSize: "0.7rem" }}>Devolución simple</div>
              </div>
              <div className="col-4 text-center">
                <ShieldCheck size={18} className="text-warning mb-1 d-block mx-auto" />
                <div className="small fw-bold" style={{ fontSize: "0.75rem" }}>Pago Seguro</div>
                <div className="text-muted" style={{ fontSize: "0.7rem" }}>100% Cifrado</div>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 mt-auto pt-3 border-top">
              <Link to="/cart" className="btn btn-flat-outline flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2 py-2">
                <ShoppingCart size={16} />
                <span>Ir al Carrito</span>
              </Link>
              <Link to="/" className="btn btn-flat-outline d-inline-flex align-items-center justify-content-center gap-2 py-2">
                <ArrowLeft size={16} />
                <span>Seguir Comprando</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
