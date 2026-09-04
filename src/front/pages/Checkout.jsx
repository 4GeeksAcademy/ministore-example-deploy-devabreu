import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Check, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const Checkout = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const cart = store.cart || [];
  const token = store.token;
  const user = store.user;

  const [address, setAddress] = useState("Av. Principal 456, Piso 2, Ciudad");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center flex-grow-1">
        <div className="card card-flat p-5">
          <h4>No hay artículos para procesar</h4>
          <p className="text-muted">Añade productos a tu carrito antes de finalizar la compra.</p>
          <div>
            <Link to="/" className="btn btn-flat-primary">
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Debes iniciar sesión para completar tu pedido");
      navigate("/login?redirect=checkout");
      return;
    }

    if (!address.trim()) {
      toast.error("Por favor ingresa una dirección de entrega válida");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_address: `${address.trim()} ${notes ? `(Notas: ${notes.trim()})` : ""}`,
      };

      await api.createOrder(orderPayload, token);

      dispatch({ type: "CLEAR_CART" });
      toast.success("¡Pedido confirmado con éxito!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Error al procesar la orden");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 flex-grow-1">
      {/* 3-Step Checkout Progression Indicator */}
      <div className="d-flex align-items-center justify-content-center mb-4 pb-2">
        <div className="d-flex align-items-center gap-2 small fw-semibold text-muted">
          <span className="badge badge-flat badge-flat-success d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px", borderRadius: "50%" }}>✓</span>
          <span className="text-dark d-none d-sm-inline">1. Carrito</span>
        </div>
        <div className="border-top mx-2 mx-sm-3" style={{ width: "30px", borderColor: "#cbd5e1" }}></div>
        <div className="d-flex align-items-center gap-2 small fw-semibold text-primary">
          <span className="badge bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px", borderRadius: "50%" }}>2</span>
          <span>2. Envío y Pago</span>
        </div>
        <div className="border-top mx-2 mx-sm-3" style={{ width: "30px", borderColor: "#cbd5e1" }}></div>
        <div className="d-flex align-items-center gap-2 small fw-semibold text-muted">
          <span className="badge bg-light text-muted border d-inline-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px", borderRadius: "50%" }}>3</span>
          <span className="d-none d-sm-inline">3. Confirmación</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Finalizar Compra</h3>
        <p className="text-muted small">
          Completa tus datos de entrega para recibir tu pedido en tu domicilio.
        </p>
      </div>

      {!token && (
        <div className="alert alert-warning border d-flex justify-content-between align-items-center mb-4 p-3">
          <div className="d-flex align-items-center gap-2">
            <AlertTriangle size={18} />
            <span><strong>Sesión requerida:</strong> Necesitas una cuenta para asociar tu pedido.</span>
          </div>
          <Link to="/login?redirect=checkout" className="btn btn-sm btn-flat-primary">
            Iniciar Sesión Ahora
          </Link>
        </div>
      )}

      <div className="row g-4">
        {/* Shipping Form */}
        <div className="col-12 col-lg-7">
          <div className="card card-flat p-4 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span>Información de Envío</span>
            </h5>

            <form onSubmit={handlePlaceOrder}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold">Nombre del Destinatario</label>
                  <input
                    type="text"
                    className="form-control form-control-flat"
                    defaultValue={user?.name || "Carlos Demo"}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control form-control-flat"
                    defaultValue={user?.email || "demo@tienda.com"}
                    disabled={!!token}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Dirección de Entrega</label>
                <input
                  type="text"
                  className="form-control form-control-flat"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, colonia, código postal"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Instrucciones Especiales / Referencias</label>
                <textarea
                  rows="2"
                  className="form-control form-control-flat"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Timbre, dejar en recepción, etc."
                ></textarea>
              </div>

              <div className="p-3 border rounded bg-light mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <CreditCard size={18} className="text-success" />
                  <span className="fw-bold small">Método de Pago Simulado</span>
                </div>
                <p className="text-muted small mb-0">
                  Modo de demostración activado. Tu compra se procesará de forma segura y sin costo.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-flat-success w-100 py-3 fw-bold fs-6 d-inline-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Procesando tu pedido...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Confirmar y Pagar ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary on Checkout */}
        <div className="col-12 col-lg-5">
          <div className="card card-flat p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              Resumen ({cart.length} productos)
            </h5>

            <div className="divide-y max-h-60 overflow-auto mb-3" style={{ maxHeight: "300px" }}>
              {cart.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="rounded"
                      style={{ width: "45px", height: "45px", objectFit: "cover" }}
                    />
                    <div>
                      <div className="small fw-bold text-truncate" style={{ maxWidth: "180px" }}>
                        {item.name}
                      </div>
                      <div className="text-muted small">Cant: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="fw-bold small">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Subtotal:</span>
              <span className="text-dark fw-medium">${total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Costo de envío:</span>
              <span className="text-success fw-bold">Gratis</span>
            </div>
            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-5">Total a Pagar:</span>
              <span className="fw-bold fs-4 text-dark">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
