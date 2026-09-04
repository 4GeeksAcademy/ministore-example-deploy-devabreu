import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogOut, RotateCw, ClipboardList, Truck, Store } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const user = store.user;
  const token = store.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Debes iniciar sesión para ver tu perfil");
      navigate("/login");
      return;
    }
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMyOrders(token);
      setOrders(data);
    } catch (err) {
      toast.error("No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (!token) return null;

  return (
    <div className="container py-5 flex-grow-1">
      {/* Header */}
      <div className="row g-4 mb-4 align-items-center">
        <div className="col-12 col-md-8">
          <span className="badge badge-flat badge-flat-primary mb-2">Panel de Usuario</span>
          <h2 className="fw-bold text-dark mb-1">
            Hola, {user?.name || user?.email?.split("@")[0]}
          </h2>
          <p className="text-muted small mb-0">
            {user?.email}
          </p>
        </div>
        <div className="col-12 col-md-4 text-md-end">
          <button onClick={handleLogout} className="btn btn-flat-outline text-danger d-inline-flex align-items-center gap-2">
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="card card-flat p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h5 className="fw-bold mb-0">Historial de Pedidos</h5>
            <span className="text-muted small">
              Compras registradas en tu cuenta
            </span>
          </div>
          <button onClick={loadOrders} className="btn btn-sm btn-flat-outline d-inline-flex align-items-center gap-1">
            <RotateCw size={14} />
            <span>Actualizar</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Cargando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <div className="d-flex justify-content-center text-muted mb-2">
              <ClipboardList size={48} />
            </div>
            <h5>Aún no tienes pedidos registrados</h5>
            <p className="text-muted small mb-3">
              Explora nuestro catálogo y realiza tu primera compra.
            </p>
            <Link to="/" className="btn btn-flat-primary d-inline-flex align-items-center gap-2">
              <Store size={16} />
              <span>Ir al Catálogo</span>
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded p-3 bg-light"
              >
                {/* Order Top Bar */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-2 mb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark">
                      Pedido #{String(order.id).padStart(5, "0")}
                    </span>
                    <span className="badge badge-flat badge-flat-success">
                      {order.status}
                    </span>
                  </div>
                  <div className="small text-muted">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Fecha reciente"}
                  </div>
                </div>

                {/* Shipping info */}
                {order.shipping_address && (
                  <div className="small text-muted mb-3 d-flex align-items-center gap-1">
                    <Truck size={15} className="text-primary" />
                    <span><strong>Envío a:</strong> {order.shipping_address}</span>
                  </div>
                )}

                {/* Items Table */}
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0 align-middle">
                    <thead>
                      <tr className="text-muted small border-bottom">
                        <th>Producto</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-end">P. Unitario</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="rounded"
                                  style={{
                                    width: "35px",
                                    height: "35px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <span className="fw-medium small text-dark">
                                {item.product_name}
                              </span>
                            </div>
                          </td>
                          <td className="text-center small">{item.quantity}</td>
                          <td className="text-end small">
                            ${item.unit_price.toFixed(2)}
                          </td>
                          <td className="text-end fw-bold small text-dark">
                            ${item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="d-flex justify-content-end align-items-center gap-2 pt-3 mt-2 border-top">
                  <span className="fw-bold small text-muted">Total del Pedido:</span>
                  <span className="fw-bold fs-5 text-dark">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
