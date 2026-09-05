import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import {
  ArrowDown,
  ArrowRight,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Search,
  X,
  PackageOpen,
  Sparkles,
  Flame,
  ShoppingCart,
  BatteryCharging,
  Zap,
  Clock,
  Eye,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Initial fetch for categories and products
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
      dispatch({ type: "SET_CATEGORIES", payload: data });
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  const loadProducts = async (catId = selectedCatId, query = search, featured = featuredOnly) => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        categoryId: catId,
        search: query,
        featured: featured,
      });
      dispatch({ type: "SET_PRODUCTS", payload: data });
    } catch (err) {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catId) => {
    const newCatId = selectedCatId === catId ? null : catId;
    setSelectedCatId(newCatId);
    loadProducts(newCatId, search, featuredOnly);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts(selectedCatId, search, featuredOnly);
  };

  const handleToggleFeatured = () => {
    const newFeatured = !featuredOnly;
    setFeaturedOnly(newFeatured);
    loadProducts(selectedCatId, search, newFeatured);
  };

  const handleResetFilters = () => {
    setSelectedCatId(null);
    setSearch("");
    setFeaturedOnly(false);
    loadProducts(null, "", false);
  };

  const handleAddHeroProduct = () => {
    const heroProduct = (store.products || []).find((p) => p.id === 4) || {
      id: 4,
      name: "Smartwatch ChronoFit Ultra",
      price: 189.0,
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      stock: 18,
      category_name: "Electrónica",
    };
    dispatch({
      type: "ADD_TO_CART",
      payload: { product: heroProduct, quantity: 1 },
    });
    toast.success("¡Smartwatch ChronoFit Ultra añadido al carrito!");
  };

  const products = store.products || [];

  return (
    <div className="flex-grow-1 pb-5">
      {/* PRO MAX HERO SECTION */}
      <section className="hero-flat py-5 px-3 mb-4">
        <div className="container py-2 py-lg-4">
          <div className="row align-items-center gy-5">
            {/* Left Editorial & Action Column */}
            <div className="col-12 col-lg-7">
              {/* Pulsing Live Badge */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                }}
              >
                <span className="pulse-dot"></span>
                <span
                  className="small fw-semibold text-light text-uppercase"
                  style={{ letterSpacing: "0.06em", fontSize: "0.75rem" }}
                >
                  Temporada Seleccionada 2026 • Envíos Rápidos
                </span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="hero-headline mb-3 text-white">
                Esenciales modernos.
                <br />
                <span style={{ color: "#94a3b8" }}>Calidad que perdura.</span>
              </h1>

              {/* Lead Paragraph */}
              <p className="hero-lead mb-4">
                Una cuidada selección de tecnología, audio, moda y hogar diseñada
                con estética atemporal, acabados duraderos y precios transparentes.
              </p>

              {/* Action Cluster */}
              <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-4">
                <a
                  href="#catalogo"
                  className="btn btn-flat-primary px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 fw-bold"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight size={18} />
                </a>

                <button
                  onClick={handleToggleFeatured}
                  className={`btn px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold ${featuredOnly
                      ? "btn-flat-success"
                      : "btn-flat-outline text-white border-secondary bg-transparent"
                    }`}
                >
                  <Sparkles size={18} className="text-warning" />
                  <span>{featuredOnly ? "Viendo Destacados" : "Ver Destacados"}</span>
                </button>
              </div>

              {/* Social Proof & Rating Strip */}
              <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary border-opacity-25 flex-wrap">
                <div className="d-flex gap-1 text-warning">
                  <Star size={15} fill="#f59e0b" strokeWidth={0} />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} />
                  <Star size={15} fill="#f59e0b" strokeWidth={0} />
                </div>
                <span className="small text-light text-opacity-75">
                  <strong className="text-white">4.9 / 5</strong> valoración promedio • +1,500 clientes satisfechos
                </span>
              </div>
            </div>

            {/* Right Spotlight Showcase Column: Premium Obsidian Showcase */}
            <div className="col-12 col-lg-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-3 p-4 position-relative text-start"
                style={{
                  background: "#111827",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Badges Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1"
                    style={{
                      background: "rgba(37, 99, 235, 0.2)",
                      color: "#93c5fd",
                      border: "1px solid rgba(147, 197, 253, 0.3)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <Sparkles size={12} />
                    <span>SELECCIÓN DEL MES</span>
                  </span>
                  <span
                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1"
                    style={{
                      background: "rgba(239, 68, 68, 0.2)",
                      color: "#fca5a5",
                      border: "1px solid rgba(252, 165, 165, 0.3)",
                      fontSize: "0.72rem",
                    }}
                  >
                    <Flame size={12} />
                    <span>-24% OFERTA</span>
                  </span>
                </div>

                {/* Product Image Frame */}
                <Link
                  to="/product/4"
                  className="text-decoration-none d-block overflow-hidden rounded-3 mb-3 position-relative"
                  style={{
                    aspectRatio: "16/10",
                    background: "#0b0f19",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                    alt="Smartwatch ChronoFit Ultra"
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.35s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                  {/* Floating Micro Badges inside image */}
                  <div
                    className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded small d-flex align-items-center gap-1"
                    style={{
                      background: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      fontSize: "0.72rem",
                      color: "#f8fafc",
                    }}
                  >
                    <Check size={12} className="text-success" />
                    <span>Envío Gratis</span>
                  </div>
                  <div
                    className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded small d-flex align-items-center gap-1"
                    style={{
                      background: "rgba(15, 23, 42, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      fontSize: "0.72rem",
                      color: "#f8fafc",
                    }}
                  >
                    <Clock size={12} className="text-warning" />
                    <span>Solo 4 unidades</span>
                  </div>
                </Link>

                {/* Info & Specs */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span
                      className="text-uppercase fw-semibold"
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.7rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Tecnología & Wearables
                    </span>
                    <div className="d-flex text-warning small align-items-center gap-1">
                      <Star size={13} fill="#f59e0b" strokeWidth={0} />
                      <span className="fw-bold text-white" style={{ fontSize: "0.75rem" }}>
                        4.9
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
                        (128)
                      </span>
                    </div>
                  </div>

                  <Link to="/product/4" className="text-decoration-none">
                    <h5 className="fw-bold text-white mb-2">Smartwatch ChronoFit Ultra</h5>
                  </Link>

                  {/* Feature Highlights Pills */}
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    <span
                      className="px-2 py-1 rounded small d-inline-flex align-items-center gap-1"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        fontSize: "0.75rem",
                      }}
                    >
                      <BatteryCharging size={13} className="text-primary" />
                      <span>7 días batería</span>
                    </span>
                    <span
                      className="px-2 py-1 rounded small d-inline-flex align-items-center gap-1"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        fontSize: "0.75rem",
                      }}
                    >
                      <ShieldCheck size={13} className="text-success" />
                      <span>Sumergible 50m</span>
                    </span>
                    <span
                      className="px-2 py-1 rounded small d-inline-flex align-items-center gap-1"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#cbd5e1",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Zap size={13} className="text-warning" />
                      <span>AMOLED SpO2</span>
                    </span>
                  </div>

                  {/* Price and CTA */}
                  <div
                    className="d-flex align-items-center justify-content-between pt-3"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <div>
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fs-3 fw-bold text-white">$189.00</span>
                        <span
                          className="small text-decoration-line-through"
                          style={{ color: "#64748b" }}
                        >
                          $249.00
                        </span>
                      </div>
                      <div
                        className="small fw-semibold text-success"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Ahorras $60.00 hoy
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        to="/product/4"
                        className="btn px-2 py-2 d-inline-flex align-items-center gap-1 fw-semibold text-light"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.16)",
                          fontSize: "0.8rem",
                        }}
                        title="Ver detalles"
                      >
                        <Eye size={15} />
                        <span className="d-none d-sm-inline">Detalles</span>
                      </Link>

                      <button
                        onClick={handleAddHeroProduct}
                        className="btn btn-flat-primary px-3 py-2 d-inline-flex align-items-center gap-2 fw-bold"
                        style={{ fontSize: "0.82rem" }}
                      >
                        <ShoppingCart size={15} />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE & TRUST PROPOSITION STRIP */}
      <div className="container mb-5">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="trust-tile d-flex align-items-center gap-3 h-100">
              <div className="trust-icon-box bg-light text-primary">
                <Truck size={20} />
              </div>
              <div>
                <div className="fw-bold text-dark small">Envío Garantizado</div>
                <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  Entregas seguras y rastreo activo
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="trust-tile d-flex align-items-center gap-3 h-100">
              <div className="trust-icon-box bg-light text-success">
                <RotateCcw size={20} />
              </div>
              <div>
                <div className="fw-bold text-dark small">Garantía de 30 Días</div>
                <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  Cambios o reembolso sin trabas
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="trust-tile d-flex align-items-center gap-3 h-100">
              <div className="trust-icon-box bg-light text-warning">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="fw-bold text-dark small">Pago 100% Protegido</div>
                <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  Transacciones seguras y protegidas
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="trust-tile d-flex align-items-center gap-3 h-100">
              <div className="trust-icon-box bg-light text-info">
                <Headphones size={20} />
              </div>
              <div>
                <div className="fw-bold text-dark small">Atención Dedicada</div>
                <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  Soporte continuo para tus compras
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CATALOG CONTAINER */}
      <div className="container" id="catalogo">
        {/* Search & Filter Bar */}
        <div className="card card-flat p-3 mb-4">
          <div className="row g-2 g-sm-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-6 col-lg-5">
              <form onSubmit={handleSearchSubmit} className="input-group">
                <input
                  type="text"
                  className="form-control form-control-flat"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-flat-primary px-3" type="submit" aria-label="Buscar">
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Quick Status / Reset */}
            <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-between justify-content-md-end align-items-center gap-2 flex-wrap">
              <button
                onClick={handleToggleFeatured}
                className={`btn btn-sm d-inline-flex align-items-center gap-1 ${featuredOnly ? "btn-flat-primary" : "btn-flat-outline"}`}
              >
                <Star size={14} className="text-warning" />
                <span>Destacados</span>
              </button>

              {(selectedCatId !== null || search !== "" || featuredOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-sm btn-flat-outline text-danger d-inline-flex align-items-center gap-1"
                >
                  <X size={14} />
                  <span>Limpiar Filtros</span>
                </button>
              )}
            </div>
          </div>

          {/* Swipeable Category Filter Pills on Mobile */}
          <div className="category-scroll-container mt-3 pt-3 border-top">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`category-pill ${selectedCatId === null ? "active" : ""}`}
            >
              Todas las Categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`category-pill ${selectedCatId === cat.id ? "active" : ""}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 text-dark fs-6 fs-sm-5">
            Productos Disponibles
          </h5>
          <span className="small text-muted">
            {products.length} {products.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {loading ? (
          <div className="row g-2 g-sm-3 g-md-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3 d-flex">
                <div className="card card-flat w-100 d-flex flex-column p-0 overflow-hidden">
                  <div className="skeleton-box w-100" style={{ aspectRatio: "1/1" }}></div>
                  <div className="p-3 d-flex flex-column gap-2">
                    <div className="skeleton-box" style={{ height: "16px", width: "75%" }}></div>
                    <div className="skeleton-box d-none d-sm-block" style={{ height: "12px", width: "95%" }}></div>
                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                      <div className="skeleton-box" style={{ height: "18px", width: "35%" }}></div>
                      <div className="skeleton-box" style={{ height: "26px", width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="row g-2 g-sm-3 g-md-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card card-flat text-center py-5 p-4">
            <div className="d-flex justify-content-center text-muted mb-3">
              <PackageOpen size={48} />
            </div>
            <h5>No se encontraron productos</h5>
            <p className="text-muted small">
              Intenta cambiar los términos de búsqueda o selecciona otra categoría.
            </p>
            <div className="mt-2">
              <button onClick={handleResetFilters} className="btn btn-flat-outline">
                Ver todos los productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
