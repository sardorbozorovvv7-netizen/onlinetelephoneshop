import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_BASE = (import.meta.env?.VITE_API_URL || 'https://backendrep-9gdr.onrender.com/api').replace(/\/$/, '');

// Fetch with retry — handles Render.com cold start delays (30-60s)
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout per try
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`[Fetch retry ${i + 1}/${retries}] ${url} — waiting ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
};

// Load guest cart from localStorage
const loadGuestCart = () => {
  try {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save guest cart to localStorage
const saveGuestCart = (cart) => {
  localStorage.setItem('guestCart', JSON.stringify(cart));
};

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('activeRole') || 'user';
  });
  
  // Custom logged in customer details
  const [loggedUser, setLoggedUser] = useState(() => {
    try {
      const saved = localStorage.getItem('loggedUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(loadGuestCart); // Guest cart by default
  const [likes, setLikes] = useState([]); // List of product IDs liked by user
  const [orders, setOrders] = useState([]);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common headers based on role and active login state
  const getHeaders = () => {
    let userId = '1';
    if (activeRole === 'user') {
      userId = loggedUser ? loggedUser.id.toString() : 'guest';
    }
    return {
      'Content-Type': 'application/json',
      'x-user-role': activeRole,
      'x-user-id': userId,
    };
  };

  const fetchAuth = async () => {
    if (activeRole === 'user' && !loggedUser) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/current`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/products`);
      if (res && res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/categories`);
      if (res && res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCart = async () => {
    // If logged in user, fetch from server
    if (loggedUser && activeRole === 'user') {
      try {
        const res = await fetch(`${API_BASE}/cart`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          setCart(data);
          saveGuestCart(data);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    }
    // For guests, cart is already in local state (localStorage)
  };

  const fetchLikes = async () => {
    if (activeRole === 'user' && !loggedUser) {
      setLikes([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/likes`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLikes(data);
      }
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  const fetchOrders = async () => {
    if (activeRole === 'user' && !loggedUser) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchAdminData = async () => {
    if (activeRole === 'superadmin') {
      try {
        const [resManagers, resUsers] = await Promise.all([
          fetch(`${API_BASE}/managers`, { headers: getHeaders() }),
          fetch(`${API_BASE}/users`, { headers: getHeaders() })
        ]);
        if (resManagers.ok) setManagers(await resManagers.json());
        if (resUsers.ok) setUsers(await resUsers.json());
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    // Wake up Render backend first if it's sleeping
    try {
      await fetchWithRetry(`${API_BASE}/products`, {}, 5, 4000);
    } catch (e) {
      console.warn('Backend wake-up ping failed, proceeding anyway...');
    }
    await Promise.all([
      fetchAuth(),
      fetchProducts(),
      fetchCategories(),
      fetchCart(),
      fetchLikes(),
      fetchOrders(),
      fetchAdminData()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem('activeRole', activeRole);
    refreshAll();
  }, [activeRole, loggedUser]);

  const changeRole = (role) => {
    setActiveRole(role);
  };

  // Auth Operations
  const registerUser = async ({ name, surname, phone }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, phone }),
      });
      if (res.ok) {
        const data = await res.json();
        setLoggedUser(data.user);
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error registering user:', err);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('loggedUser');
    setLoggedUser(null);
    setCurrentUser(null);
    setCart([]);
    saveGuestCart([]);
    setLikes([]);
    setOrders([]);
  };

  // =============================================
  // CART OPERATIONS (works for both guest & user)
  // =============================================

  const addToCart = async (productId, quantity = 1) => {
    // If logged in user, add to server
    if (loggedUser && activeRole === 'user') {
      try {
        const res = await fetch(`${API_BASE}/cart`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ ProductId: productId, quantity }),
        });
        if (res.ok) {
          await fetchCart();
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error adding to cart:', err);
        return false;
      }
    }

    // For guests — use local cart
    const currentCart = [...cart];
    const existingIndex = currentCart.findIndex(item => parseInt(item.ProductId, 10) === parseInt(productId, 10));
    
    if (existingIndex >= 0) {
      currentCart[existingIndex] = {
        ...currentCart[existingIndex],
        quantity: currentCart[existingIndex].quantity + quantity
      };
    } else {
      currentCart.push({
        id: `guest-${productId}-${Date.now()}`,
        ProductId: productId.toString(),
        quantity,
        updatedAt: new Date().toISOString(),
      });
    }
    
    setCart(currentCart);
    saveGuestCart(currentCart);
    return true;
  };

  const updateCartQty = async (cartItemId, quantity, isGuest = false) => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId, isGuest);
    }

    // Guest cart update
    if (!loggedUser || isGuest) {
      const updatedCart = cart.map(item => {
        if ((item.id || item.ProductId) === cartItemId) {
          return { ...item, quantity };
        }
        return item;
      });
      setCart(updatedCart);
      saveGuestCart(updatedCart);
      return;
    }

    // Logged in user
    try {
      const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const removeFromCart = async (cartItemId, isGuest = false) => {
    // Guest cart remove
    if (!loggedUser || isGuest) {
      const updatedCart = cart.filter(item => (item.id || item.ProductId) !== cartItemId);
      setCart(updatedCart);
      saveGuestCart(updatedCart);
      return;
    }

    // Logged in user
    try {
      const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  // Guest checkout — sends name, phone with order
  const guestCheckout = async ({ name, surname, phone }) => {
    try {
      const cartItems = cart.map(item => ({
        ProductId: item.ProductId,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE}/orders/guest-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, phone, cartItems }),
      });

      if (res.ok) {
        // Clear cart after successful order
        setCart([]);
        saveGuestCart([]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error guest checkout:', err);
      return false;
    }
  };

  const checkout = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (res.ok) {
        await Promise.all([fetchCart(), fetchOrders(), fetchProducts()]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checkout:', err);
      return false;
    }
  };

  // Likes operations
  const toggleLike = async (productId) => {
    if (!loggedUser && activeRole === 'user') {
      return false; // Action requires login
    }
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/like`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (res.ok) {
        await Promise.all([fetchLikes(), fetchProducts()]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error toggling like:', err);
      return false;
    }
  };

  // Product CRUD (Manager/Superadmin)
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding product:', err);
      return false;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating product:', err);
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  // Category CRUD
  const addCategory = async (categoryData) => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding category:', err);
      return false;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting category:', err);
      return false;
    }
  };

  // Manager CRUD (Superadmin only)
  const addManager = async (managerData) => {
    try {
      const res = await fetch(`${API_BASE}/managers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(managerData),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding manager:', err);
      return false;
    }
  };

  const deleteManager = async (managerId) => {
    try {
      const res = await fetch(`${API_BASE}/managers/${managerId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting manager:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        loggedUser,
        currentUser,
        products,
        categories,
        cart,
        likes,
        orders,
        managers,
        users,
        loading,
        changeRole,
        registerUser,
        logoutUser,
        addToCart,
        updateCartQty,
        removeFromCart,
        checkout,
        guestCheckout,
        toggleLike,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addManager,
        deleteManager,
        refreshAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
