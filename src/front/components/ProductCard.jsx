import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProductCard = ({ product }) => {
  const { dispatch } = useGlobalReducer();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error("Producto agotado temporalmente");
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity: 1 },
    });

    toast.success(`"${product.name}" añadido al carrito`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="col-6 col-md-4 col-lg-3 d-flex"
    >
      <div className="card card-flat w-100 d-flex flex-column">
        {/* Image & Badges */}
        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <div className="product-image-wrap">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}
              alt={product.name}
              loading="lazy"
            />
            <div className="position-absolute top-0 start-0 m-2">
              <span className="badge badge-flat badge-flat-secondary d-none d-sm-inline-block">
                {product.category_name || "General"}
              </span>
            </div>
            {product.is_featured && (
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge badge-flat badge-flat-warning">
                  Destacado
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Card Body */}
        <div className="card-body card-body-compact p-3 d-flex flex-column">
          <Link
            to={`/product/${product.id}`}
            className="text-decoration-none text-dark mb-1"
          >
            <h6 className="card-title product-title-mobile fw-bold text-truncate mb-1" title={product.name}>
              {product.name}
            </h6>
          </Link>

          <p
            className="card-text text-muted small flex-grow-1 d-none d-sm-block mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "0.825rem",
              lineHeight: "1.35",
            }}
          >
            {product.description}
          </p>

          <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
            <div>
              <span className="product-price-mobile fs-5 fw-bold text-dark d-block">
                ${product.price.toFixed(2)}
              </span>
              <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                {product.stock > 0 ? (
                  <span className="text-success">Stock: {product.stock}</span>
                ) : (
                  <span className="text-danger">Agotado</span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn-sm btn-flat-primary px-2 px-sm-3 py-1 d-inline-flex align-items-center gap-1"
              title="Añadir al carrito"
            >
              <ShoppingCart size={13} />
              <span className="d-none d-sm-inline">Añadir</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
