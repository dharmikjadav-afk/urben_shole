const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  products: `${API_URL}/api/products`,
  orders: `${API_URL}/api/orders`,
};
