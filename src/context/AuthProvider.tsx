"use client";

import React, { useState } from "react";
import { AuthContext, AuthState, User } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      return {
        token: storedToken || null,
        user: storedUser ? JSON.parse(storedUser) : null,
        loading: false,
      };
    }
    return { token: null, user: null, loading: true };
  });

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null, loading: false });
  };

  const refreshUser = async () => {
    if (!auth.token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setAuth((prev) => ({ ...prev, user: data.user }));
      }
    } catch (err) {
      console.error("Failed to refresh user context:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}