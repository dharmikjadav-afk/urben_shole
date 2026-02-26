import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // NEW
  const [loading, setLoading] = useState(true);

  // ===============================
  // Load user on app start
  // ===============================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      // If JSON corrupted, clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  // ===============================
  // Login
  // ===============================
  const login = (userData, tokenData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    if (tokenData) {
      localStorage.setItem("token", tokenData);
      setToken(tokenData);
    }

    localStorage.setItem("isLoggedIn", "true");
  };

  // ===============================
  // Logout
  // ===============================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
