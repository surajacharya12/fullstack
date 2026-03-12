"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { saveTokens, clearTokens, getAccessToken } from "../utils/tokenStorage";
import api from "../api/axiosInstance";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (accessToken: string, refreshToken: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      // Fetch user profile to restore state on refresh
      api.get("/profile/")
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // If profile fetch fails (e.g. token expired), log out
          logout();
        });
    }
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: any) => {
    saveTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isMounted) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};