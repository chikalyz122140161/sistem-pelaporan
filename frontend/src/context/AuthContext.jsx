import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("silapor_user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.clear();
        setUser(null);
        setToken(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: jwtToken, user: userData } = res.data;

      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("silapor_user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Login gagal. Periksa email dan password.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return { success: true, data: res.data };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Registrasi gagal. Silakan coba lagi.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("silapor_user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
