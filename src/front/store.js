// Global Store for Mini E-Commerce
// Synchronized with localStorage for cart and auth state

const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const initialStore = () => {
  const token = localStorage.getItem("token") || null;
  const user = getStorageItem("user", null);
  const cart = getStorageItem("cart", []);

  return {
    token,
    user,
    cart,
    products: [],
    categories: [],
    selectedCategory: null,
    searchQuery: "",
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "SET_AUTH": {
      const { user, token } = action.payload;
      if (token) localStorage.setItem("token", token);
      if (user) setStorageItem("user", user);
      return {
        ...store,
        token: token || store.token,
        user: user || store.user,
      };
    }

    case "LOGOUT": {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
      };
    }

    case "SET_PRODUCTS":
      return {
        ...store,
        products: action.payload,
      };

    case "SET_CATEGORIES":
      return {
        ...store,
        categories: action.payload,
      };

    case "SET_SELECTED_CATEGORY":
      return {
        ...store,
        selectedCategory: action.payload,
      };

    case "SET_SEARCH":
      return {
        ...store,
        searchQuery: action.payload,
      };

    case "ADD_TO_CART": {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = store.cart.findIndex((item) => item.id === product.id);

      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = store.cart.map((item, index) => {
          if (index === existingIndex) {
            const newQty = Math.min(item.quantity + quantity, product.stock);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        const qty = Math.min(quantity, product.stock);
        updatedCart = [...store.cart, { ...product, quantity: qty }];
      }

      setStorageItem("cart", updatedCart);
      return {
        ...store,
        cart: updatedCart,
      };
    }

    case "UPDATE_CART_QTY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        const updatedCart = store.cart.filter((item) => item.id !== productId);
        setStorageItem("cart", updatedCart);
        return { ...store, cart: updatedCart };
      }

      const updatedCart = store.cart.map((item) => {
        if (item.id === productId) {
          const qty = Math.min(quantity, item.stock);
          return { ...item, quantity: qty };
        }
        return item;
      });

      setStorageItem("cart", updatedCart);
      return {
        ...store,
        cart: updatedCart,
      };
    }

    case "REMOVE_FROM_CART": {
      const updatedCart = store.cart.filter((item) => item.id !== action.payload);
      setStorageItem("cart", updatedCart);
      return {
        ...store,
        cart: updatedCart,
      };
    }

    case "CLEAR_CART": {
      localStorage.removeItem("cart");
      return {
        ...store,
        cart: [],
      };
    }

    default:
      return store;
  }
}
