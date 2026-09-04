// API Client helper for Mini E-Commerce

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

const getHeaders = (token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Catalog
  async getCategories() {
    const res = await fetch(`${BASE_URL}/api/categories`);
    if (!res.ok) throw new Error("Error fetching categories");
    return res.json();
  },

  async getProducts({ categoryId, search, featured } = {}) {
    const params = new URLSearchParams();
    if (categoryId) params.append("category_id", categoryId);
    if (search) params.append("search", search);
    if (featured) params.append("featured", "true");

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${BASE_URL}/api/products${queryStr}`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to login");
    return data;
  },

  async register({ email, password, name }) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to register");
    return data;
  },

  async getProfile(token) {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    return data;
  },

  // Orders
  async createOrder(orderPayload, token) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to place order");
    return data;
  },

  async getMyOrders(token) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
    return data;
  },
};
