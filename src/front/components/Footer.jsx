import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-dark text-white mt-auto border-top py-4">
    <div className="container">
      <div className="row gy-3 align-items-center">
        <div className="col-12 col-md-6">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-light text-dark fw-bold">MiniStore</span>
            <span className="text-secondary small">Tu tienda de confianza</span>
          </div>
          <p className="text-secondary small mb-0">
            Productos de calidad, envíos rápidos y compras seguras para tu vida diaria.
          </p>
        </div>

        <div className="col-12 col-md-6 text-md-end">
          <div className="text-secondary small">
            © {new Date().getFullYear()} MiniStore Inc. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  </footer>
);
