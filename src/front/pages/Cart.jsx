import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Trash2, Store, X, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Cart = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const cart = store.cart || [];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0; // Envío gratis
  const total = subtotal + shipping;

  const handleUpdateQty = (productId, newQty) => {
    dispatch({
      type: "UPDATE_CART_QTY",
      payload: { productId, quantity: newQty },
    });
  };

  const handleRemove = (productId, name) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productId,
    });
    toast.success(`"${name}" eliminado del carrito`);
  };

  const handleClearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Carrito vaciado");
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 flex-grow-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="card card-flat text-center py-5 px-3"
        >
          <div className="d-flex justify-content-center text-muted mb-3">
            <ShoppingCart size={54} />
          </div>
          <h3 className="fw-bold mb-2">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            Explora nuestro catálogo y agrega los mejores productos a tu pedido.
          </p>
          <div>
            <Link to="/" className="btn btn-flat-primary px-4 py-2 d-inline-flex align-items-center gap-2">
              <Store size={18} />
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="container py-5 flex-grow-1"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Carrito de Compras</h3>
        <button
          onClick={handleClearCart}
          className="btn btn-sm btn-flat-outline text-danger d-inline-flex align-items-center gap-1"
        >
          <Trash2 size={15} />
          <span>Vaciar Carrito</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-12 col-lg-8">
          <div className="card card-flat divide-y">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 border-bottom d-flex align-items-center gap-3 flex-wrap flex-sm-nowrap"
                >
                  {/* Thumbnail */}
                  <div
                    className="rounded overflow-hidden bg-light flex-shrink-0"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-decoration-none text-dark fw-bold"
                    >
                      {item.name}
                    </Link>
                    <div className="text-muted small">
                      Precio unitario: ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Qty controls & Subtotal */}
                  <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-2 w-100 w-sm-auto mt-2 mt-sm-0">
                    <div className="input-group" style={{ width: "105px" }}>
                      <button
                        className="btn btn-sm btn-flat-outline"
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control form-control-sm text-center form-control-flat"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-sm btn-flat-outline"
                        type="button"
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-end" style={{ minWidth: "90px" }}>
                      <div className="fw-bold text-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="btn btn-sm btn-flat-outline text-muted border-0 p-1"
                      title="Eliminar producto"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-3">
            <Link to="/" className="btn btn-flat-outline d-inline-flex align-items-center gap-2">
              <ArrowLeft size={16} />
              <span>Continuar Comprando</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-12 col-lg-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="card card-flat p-4"
          >
            <h5 className="fw-bold mb-3 border-bottom pb-2">Resumen de Compra</h5>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} artículos):</span>
              <span className="text-dark fw-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Envío estándar:</span>
              <span className="text-success fw-bold">GRATIS</span>
            </div>

            <div className="border-top pt-3 mb-4 d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-5">Total:</span>
              <span className="fw-bold fs-4 text-dark">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-flat-primary w-100 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-2"
            >
              <span>Proceder al Pago</span>
              <ArrowRight size={16} />
            </button>

            <div className="mt-3 text-center small text-muted d-flex align-items-center justify-content-center gap-1">
              <ShieldCheck size={16} className="text-success" />
              <span>Compra segura protegida</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
