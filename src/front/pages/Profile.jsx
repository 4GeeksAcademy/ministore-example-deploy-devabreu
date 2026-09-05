import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  LogOut,
  RotateCw,
  ClipboardList,
  Truck,
  Store,
  ShieldCheck,
  PackageCheck,
  Layers,
  ShoppingBag,
  Sparkles,
  Plus,
  ExternalLink,
  Check,
  X,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const user = store.user;
  const token = store.token;
  const isAdmin = Boolean(user?.is_admin);

  // Tabs state (for admin: 'orders', 'products', 'my-orders')
  const [activeTab, setActiveTab] = useState(isAdmin ? "orders" : "my-orders");

  // Orders data
  const [myOrders, setMyOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Products data (for admin inventory)
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState("");

  // New product form modal/inline
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: 10,
    description: "",
    image_url: "",
    is_featured: false,
  });

  useEffect(() => {
    if (!token) {
      toast.error("Debes iniciar sesión para ver tu perfil");
      navigate("/login");
      return;
    }

    loadMyOrders();

    if (isAdmin) {
      loadAdminOrders();
      loadCatalog();
    }
  }, [token, isAdmin]);

  // Load customer's personal orders
  const loadMyOrders = async () => {
    try {
      const data = await api.getMyOrders(token);
      setMyOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load all store orders for Admin
  const loadAdminOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getAdminOrders(token);
      setAdminOrders(data);
    } catch (err) {
      toast.error(err.message || "Error al cargar pedidos de la tienda");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load products & categories for inventory
  const loadCatalog = async () => {
    setLoadingProducts(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProductsList(prods);
      setCategoriesList(cats);
      if (cats.length > 0 && !newProduct.category_id) {
        setNewProduct((prev) => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (err) {
      toast.error("Error al cargar inventario");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Sesión cerrada");
    navigate("/");
  };

  // Change order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      setAdminOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Pedido #${String(orderId).padStart(5, "0")} actualizado a "${newStatus}"`);
    } catch (err) {
      toast.error(err.message || "Error al actualizar estado");
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (product) => {
    try {
      const updatedStatus = !product.is_featured;
      await api.updateProduct(product.id, { is_featured: updatedStatus }, token);
      setProductsList((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_featured: updatedStatus } : p))
      );
      toast.success(
        `"${product.name}" ${updatedStatus ? "marcado como Destacado" : "removido de Destacados"}`
      );
    } catch (err) {
      toast.error(err.message || "Error al actualizar producto");
    }
  };

  // Save updated stock
  const handleSaveStock = async (productId) => {
    const stockNum = parseInt(tempStockValue, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Ingresa una cantidad de stock válida");
      return;
    }

    try {
      await api.updateProduct(productId, { stock: stockNum }, token);
      setProductsList((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: stockNum } : p))
      );
      setEditingStockId(null);
      toast.success("Stock actualizado exitosamente");
    } catch (err) {
      toast.error(err.message || "Error al actualizar stock");
    }
  };

  // Create new product
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category_id) {
      toast.error("Nombre, precio y categoría son requeridos");
      return;
    }

    try {
      const created = await api.createProduct(
        {
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10) || 0,
        },
        token
      );
      setProductsList((prev) => [created.product, ...prev]);
      setShowNewProductForm(false);
      setNewProduct({
        name: "",
        price: "",
        category_id: categoriesList[0]?.id || "",
        stock: 10,
        description: "",
        image_url: "",
        is_featured: false,
      });
      toast.success(`Producto "${created.product.name}" creado con éxito`);
    } catch (err) {
      toast.error(err.message || "Error al crear producto");
    }
  };

  if (!token) return null;

  const filteredAdminOrders = adminOrders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.status === orderFilter;
  });

  return (
    <div className="container py-5 flex-grow-1">
      {/* Header */}
      <div className="row g-4 mb-4 align-items-center">
        <div className="col-12 col-md-7">
          <div className="d-flex align-items-center gap-2 mb-2">
            {isAdmin ? (
              <span className="badge badge-flat badge-flat-warning d-inline-flex align-items-center gap-1">
                <ShieldCheck size={14} />
                <span>Panel de Administración</span>
              </span>
            ) : (
              <span className="badge badge-flat badge-flat-primary">
                Panel de Cliente
              </span>
            )}
          </div>
          <h2 className="fw-bold text-dark mb-1">
            Hola, {user?.name || user?.email?.split("@")[0]}
          </h2>
          <p className="text-muted small mb-0">
            {user?.email} • {isAdmin ? "Permisos de Administrador" : "Cliente Verificado"}
          </p>
        </div>

        <div className="col-12 col-md-5 d-flex gap-2 justify-content-md-end flex-wrap">
          {isAdmin && (
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-flat-outline bg-white d-inline-flex align-items-center gap-2 text-dark"
              title="Abrir interfaz de Flask-Admin en una nueva pestaña"
            >
              <ExternalLink size={15} />
              <span>Consola Flask-Admin</span>
            </a>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-flat-outline text-danger d-inline-flex align-items-center gap-2"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (if Admin) */}
      {isAdmin && (
        <ul className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("orders")}
              className={`btn d-inline-flex align-items-center gap-2 ${
                activeTab === "orders"
                  ? "btn-flat-primary"
                  : "btn-flat-outline bg-white"
              }`}
            >
              <PackageCheck size={16} />
              <span>Gestión de Pedidos</span>
              <span className="badge bg-secondary rounded-pill">
                {adminOrders.length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("products")}
              className={`btn d-inline-flex align-items-center gap-2 ${
                activeTab === "products"
                  ? "btn-flat-primary"
                  : "btn-flat-outline bg-white"
              }`}
            >
              <Layers size={16} />
              <span>Inventario de Productos</span>
              <span className="badge bg-secondary rounded-pill">
                {productsList.length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("my-orders")}
              className={`btn d-inline-flex align-items-center gap-2 ${
                activeTab === "my-orders"
                  ? "btn-flat-primary"
                  : "btn-flat-outline bg-white"
              }`}
            >
              <ShoppingBag size={16} />
              <span>Mis Compras Personales</span>
              <span className="badge bg-secondary rounded-pill">
                {myOrders.length}
              </span>
            </button>
          </li>
        </ul>
      )}

      {/* TAB 1: ADMIN - GESTIÓN DE PEDIDOS */}
      {isAdmin && activeTab === "orders" && (
        <div className="card card-flat p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-0">Pedidos Globales de la Tienda</h5>
              <span className="text-muted small">
                Monitorea compras y actualiza estados de entrega
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="shipped">Enviados</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>

              <button
                onClick={loadAdminOrders}
                className="btn btn-sm btn-flat-outline d-inline-flex align-items-center gap-1"
              >
                <RotateCw size={14} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {loadingOrders ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Cargando pedidos de la tienda...</p>
            </div>
          ) : filteredAdminOrders.length === 0 ? (
            <div className="text-center py-5">
              <ClipboardList size={48} className="text-muted mb-2 mx-auto" />
              <h5>No hay pedidos que coincidan con el filtro</h5>
              <p className="text-muted small">
                Los nuevos pedidos realizados por clientes aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredAdminOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded p-3 bg-white"
                  style={{ transition: "border-color 0.2s ease" }}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-2 mb-3 border-bottom">
                    <div>
                      <span className="fw-bold text-dark me-2">
                        Pedido #{String(order.id).padStart(5, "0")}
                      </span>
                      <span className="text-muted small">
                        Cliente: <strong>{order.customer_name}</strong> ({order.customer_email})
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted me-1">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>

                      {/* Status Selector Dropdown */}
                      <select
                        className="form-select form-select-sm fw-semibold"
                        style={{
                          width: "135px",
                          borderColor:
                            order.status === "completed"
                              ? "#10b981"
                              : order.status === "shipped"
                              ? "#3b82f6"
                              : order.status === "cancelled"
                              ? "#ef4444"
                              : "#f59e0b",
                        }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="shipped">Enviado</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  {order.shipping_address && (
                    <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                      <Truck size={14} className="text-primary" />
                      <span><strong>Dirección:</strong> {order.shipping_address}</span>
                    </div>
                  )}

                  {/* Order items pill summary */}
                  <div className="d-flex flex-wrap gap-2 pt-2">
                    {order.items?.map((item) => (
                      <span
                        key={item.id}
                        className="badge badge-flat badge-flat-secondary text-dark d-inline-flex align-items-center gap-1"
                      >
                        <span>{item.quantity}x</span>
                        <span>{item.product_name}</span>
                        <span className="text-muted">(${item.unit_price})</span>
                      </span>
                    ))}
                    <span className="ms-auto fw-bold text-dark small align-self-center">
                      Total: ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADMIN - INVENTARIO DE PRODUCTOS */}
      {isAdmin && activeTab === "products" && (
        <div className="card card-flat p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-0">Inventario y Catálogo de Productos</h5>
              <span className="text-muted small">
                Ajusta existencias, precios y artículos destacados del Hero
              </span>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowNewProductForm(!showNewProductForm)}
                className="btn btn-sm btn-flat-primary d-inline-flex align-items-center gap-1"
              >
                <Plus size={15} />
                <span>{showNewProductForm ? "Cerrar Formulario" : "Nuevo Producto"}</span>
              </button>

              <button
                onClick={loadCatalog}
                className="btn btn-sm btn-flat-outline d-inline-flex align-items-center gap-1"
              >
                <RotateCw size={14} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* New Product Form */}
          {showNewProductForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border rounded p-4 mb-4 bg-light"
            >
              <h6 className="fw-bold text-dark mb-3">Agregar Nuevo Producto</h6>
              <form onSubmit={handleCreateProductSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold">Nombre del Producto</label>
                    <input
                      type="text"
                      className="form-control form-control-flat"
                      placeholder="Ej: Auriculares Pro Max"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-3">
                    <label className="form-label small fw-bold">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control form-control-flat"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-3">
                    <label className="form-label small fw-bold">Stock Inicial</label>
                    <input
                      type="number"
                      className="form-control form-control-flat"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold">Categoría</label>
                    <select
                      className="form-select form-control-flat"
                      value={newProduct.category_id}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, category_id: e.target.value })
                      }
                      required
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold">URL de Imagen (Unsplash)</label>
                    <input
                      type="url"
                      className="form-control form-control-flat"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newProduct.image_url}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image_url: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Descripción Comercial</label>
                  <textarea
                    rows="2"
                    className="form-control form-control-flat"
                    placeholder="Detalles y características principales..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isFeaturedCheck"
                      checked={newProduct.is_featured}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, is_featured: e.target.checked })
                      }
                    />
                    <label className="form-check-label small fw-bold" htmlFor="isFeaturedCheck">
                      Marcar como Producto Destacado
                    </label>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewProductForm(false)}
                      className="btn btn-sm btn-flat-outline"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-sm btn-flat-success fw-bold">
                      Guardar Producto
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Products Table */}
          {loadingProducts ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Cargando catálogo de productos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th style={{ width: "170px" }}>Stock</th>
                    <th className="text-center">Destacado</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="rounded border"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-bold small text-dark">{p.name}</div>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              ID #{p.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-flat badge-flat-secondary">
                          {p.category_name || "General"}
                        </span>
                      </td>
                      <td className="fw-bold text-dark small">${p.price.toFixed(2)}</td>
                      <td>
                        {editingStockId === p.id ? (
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="number"
                              className="form-control form-control-sm form-control-flat"
                              style={{ width: "70px" }}
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(e.target.value)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="btn btn-sm btn-flat-success p-1"
                              title="Guardar"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="btn btn-sm btn-flat-outline p-1"
                              title="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingStockId(p.id);
                              setTempStockValue(String(p.stock));
                            }}
                            className="d-inline-flex align-items-center gap-1 cursor-pointer"
                            title="Haz clic para modificar stock"
                            style={{ cursor: "pointer" }}
                          >
                            <span
                              className={`badge ${
                                p.stock <= 5
                                  ? "bg-danger text-white"
                                  : "badge-flat badge-flat-secondary text-dark"
                              }`}
                            >
                              {p.stock} unidades
                            </span>
                            <span className="text-muted small ms-1" style={{ fontSize: "0.75rem" }}>
                              (editar)
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`btn btn-xs px-2 py-1 small rounded-pill d-inline-flex align-items-center gap-1 ${
                            p.is_featured
                              ? "btn-flat-warning"
                              : "btn-flat-outline text-muted border-0"
                          }`}
                          style={{ fontSize: "0.75rem" }}
                          title="Alternar estado destacado"
                        >
                          <Sparkles size={12} className={p.is_featured ? "text-dark" : "text-muted"} />
                          <span>{p.is_featured ? "Destacado" : "Normal"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORIAL DE PEDIDOS PERSONALES (o vista por defecto si no es admin) */}
      {(!isAdmin || activeTab === "my-orders") && (
        <div className="card card-flat p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h5 className="fw-bold mb-0">Historial de Mis Compras</h5>
              <span className="text-muted small">
                Compras registradas con esta cuenta
              </span>
            </div>
            <button
              onClick={loadMyOrders}
              className="btn btn-sm btn-flat-outline d-inline-flex align-items-center gap-1"
            >
              <RotateCw size={14} />
              <span>Actualizar</span>
            </button>
          </div>

          {loadingOrders ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Cargando pedidos...</p>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-5">
              <ClipboardList size={48} className="text-muted mb-2 mx-auto" />
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
              {myOrders.map((order) => (
                <div key={order.id} className="border rounded p-3 bg-light">
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

                  {order.shipping_address && (
                    <div className="small text-muted mb-3 d-flex align-items-center gap-1">
                      <Truck size={15} className="text-primary" />
                      <span><strong>Envío a:</strong> {order.shipping_address}</span>
                    </div>
                  )}

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

                  <div className="d-flex justify-content-end align-items-center gap-2 pt-3 mt-2 border-top">
                    <span className="fw-bold small text-muted">Total del Pedido:</span>
                    <span className="fw-bold fs-5 text-dark">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
