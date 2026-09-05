import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";

export const Register = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({ email, password, name });
      dispatch({
        type: "SET_AUTH",
        payload: { user: data.user, token: data.token },
      });

      toast.success("¡Cuenta creada exitosamente!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
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
          <span className="badge badge-flat badge-flat-success mb-2">
            Registro Rápido
          </span>
          <h3 className="fw-bold text-dark mb-1">Crear Nueva Cuenta</h3>
          <p className="text-muted small">
            Únete a MiniStore para comprar y rastrear tus pedidos en tiempo real.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Nombre Completo</label>
            <input
              type="text"
              className="form-control form-control-flat"
              placeholder="Tu nombre o apodo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control form-control-flat"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Contraseña (Mínimo 6 caracteres)</label>
            <input
              type="password"
              className="form-control form-control-flat"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control form-control-flat"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Crear Mi Cuenta</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="fw-bold text-primary text-decoration-none">
            Inicia sesión aquí
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
