import axios from "axios";

// Base URL from .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

// Register
export const registerUser = (data) => {
  return axiosInstance.post(api.register, data);
};

// Login
export const loginUser = (data) => {
  return axiosInstance.post(api.login, data);
};

// Verify OTP
export const verifyOtp = (data) => {
  return axiosInstance.post(api.verifyOtp, data);
};

// Resend OTP
export const resendOtp = (data) => {
  return axiosInstance.post(api.resendOtp, data);
};

// ================= PASSWORD RESET (ADDED) =================

// Forgot Password (send email)
export const forgotPassword = (email) => {
  return axiosInstance.post(api.forgotPassword, { email });
};

// Reset Password
export const resetPassword = (token, password) => {
  return axiosInstance.post(`${api.resetPassword}/${token}`, {
    password,
  });
};

// ================= PRODUCTS =================

// Get all products
export const getProducts = () => {
  return axiosInstance.get(api.products);
};

// Get single product
export const getProductById = (id) => {
  return axiosInstance.get(`${api.products}/${id}`);
};

// Get by category
export const getProductsByCategory = (category) => {
  return axiosInstance.get(`${api.products}?category=${category}`);
};

// Search
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

export const getCart = (token) => {
  return axiosInstance.get(api.cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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

export const getWishlist = (token) => {
  return axiosInstance.get(api.wishlist, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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
