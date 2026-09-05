import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { User, Shield, LogIn, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(email, password);
      dispatch({
        type: "SET_AUTH",
        payload: { user: data.user, token: data.token },
      });

      toast.success(`¡Bienvenido de nuevo, ${data.user.name || data.user.email}!`);
      navigate(redirectTo === "checkout" ? "/checkout" : redirectTo);
    } catch (err) {
      toast.error(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (userType = "demo") => {
    if (userType === "demo") {
      setEmail("demo@tienda.com");
      setPassword("demo123");
    } else {
      setEmail("admin@tienda.com");
      setPassword("admin123");
    }
    toast.success("Credenciales demo rellenadas");
  };

  return (
    <div className="container py-5 flex-grow-1 d-flex align-items-center justify-content-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="card card-flat p-4 p-sm-5"
        style={{ maxWidth: "440px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <span className="badge badge-flat badge-flat-primary mb-2">
            Acceso a Clientes
          </span>
          <h3 className="fw-bold text-dark mb-1">Iniciar Sesión</h3>
          <p className="text-muted small">
            Ingresa tus credenciales para administrar tus compras y pedidos.
          </p>
        </div>

        {/* Quick Demo Fillers */}
        <div className="p-3 border rounded bg-light mb-4 text-center">
          <div className="small fw-bold text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
            <KeyRound size={14} />
            <span>ACCESO RÁPIDO DEMO</span>
          </div>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              onClick={() => handleFillDemo("demo")}
              className="btn btn-xs btn-flat-outline bg-white px-2 py-1 small d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.8rem" }}
            >
              <User size={13} className="text-primary" />
              <span>Usuario Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin")}
              className="btn btn-xs btn-flat-outline bg-white px-2 py-1 small d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.8rem" }}
            >
              <Shield size={13} className="text-warning" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control form-control-flat"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-flat"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-flat-primary w-100 py-2 fw-bold d-inline-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Ingresar a mi Cuenta</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="fw-bold text-primary text-decoration-none">
            Regístrate aquí
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
