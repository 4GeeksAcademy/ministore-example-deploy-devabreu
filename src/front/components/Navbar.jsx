import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, ShoppingCart, User, Package, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const totalCartItems = store.cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Has cerrado sesión exitosamente");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-2">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark">
          <span className="bg-dark text-white p-1 rounded d-flex align-items-center justify-content-center">
            <Zap size={16} />
          </span>
          <span>MiniStore</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Navigation links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-secondary fw-medium px-2">
                Catálogo
              </Link>
            </li>
          </ul>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 flex-wrap">
            {/* Cart Button */}
            <Link to="/cart" className="btn btn-flat-outline position-relative px-3 py-1 d-inline-flex align-items-center gap-1">
              <ShoppingCart size={16} />
              <span className="d-none d-sm-inline">Carrito</span>
              {totalCartItems > 0 && (
                <span className="badge badge-flat badge-flat-primary ms-2">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Auth Section */}
            {store.token && store.user ? (
              <div className="dropdown">
                <button
                  className="btn btn-flat-outline dropdown-toggle px-3 py-1 d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={15} />
                  <span className="text-truncate" style={{ maxWidth: "120px" }}>
                    {store.user.name || store.user.email.split("@")[0]}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-none border mt-1">
                  <li>
                    <h6 className="dropdown-header small text-muted">
                      {store.user.email}
                    </h6>
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item py-2 d-flex align-items-center gap-2">
                      <Package size={15} className="text-muted" />
                      <span>Mis Pedidos</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                    >
                      <LogOut size={15} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-flat-outline px-3 py-1">
                  Ingresar
                </Link>
                <Link to="/register" className="btn btn-flat-primary px-3 py-1">
                  Crear Cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};