"use client";

import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};