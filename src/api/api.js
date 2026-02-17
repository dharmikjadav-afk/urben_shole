import axios from "axios";

// Base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// ================= ENDPOINTS =================
export const api = {
  // Auth
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  verifyOtp: `${API_URL}/api/auth/verify-otp`,
  resendOtp: `${API_URL}/api/auth/resend-otp`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,

  // Products
  products: `${API_URL}/api/products`,

  // Orders
  orders: `${API_URL}/api/orders`,

  // Cart
  cart: `${API_URL}/api/cart`,
  addToCart: `${API_URL}/api/cart/add`,
  removeFromCart: `${API_URL}/api/cart/remove`,

  // Wishlist
  wishlist: `${API_URL}/api/wishlist`,
  addToWishlist: `${API_URL}/api/wishlist/add`,
  removeFromWishlist: `${API_URL}/api/wishlist/remove`,
};

// ================= AUTH APIs =================

export const registerUser = (data) => {
  return axiosInstance.post(api.register, data);
};

export const loginUser = (data) => {
  return axiosInstance.post(api.login, data);
};

export const verifyOtp = (data) => {
  return axiosInstance.post(api.verifyOtp, data);
};

export const resendOtp = (data) => {
  return axiosInstance.post(api.resendOtp, data);
};

// ================= PRODUCTS =================

// Get all products
export const getProducts = () => {
  return axiosInstance.get(api.products);
};

// Get single product (for ProductDetail)
export const getProductById = (id) => {
  return axiosInstance.get(`${api.products}/${id}`);
};

// Get products by category (men / women / kids)
export const getProductsByCategory = (category) => {
  return axiosInstance.get(`${api.products}?category=${category}`);
};

// Search products
export const searchProducts = (keyword) => {
  return axiosInstance.get(`${api.products}?search=${keyword}`);
};

// ================= ORDERS =================

export const createOrder = (data, token) => {
  return axiosInstance.post(api.orders, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ================= CART =================

// Get Cart
export const getCart = (token) => {
  return axiosInstance.get(api.cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add to Cart
export const addToCart = (productId, token) => {
  return axiosInstance.post(
    api.addToCart,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// Remove from Cart
export const removeFromCart = (productId, token) => {
  return axiosInstance.post(
    api.removeFromCart,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// ================= WISHLIST =================

// Get Wishlist
export const getWishlist = (token) => {
  return axiosInstance.get(api.wishlist, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add to Wishlist
export const addToWishlist = (productId, token) => {
  return axiosInstance.post(
    api.addToWishlist,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// Remove from Wishlist
export const removeFromWishlist = (productId, token) => {
  return axiosInstance.post(
    api.removeFromWishlist,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default axiosInstance;
