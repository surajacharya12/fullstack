"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (accessToken: string, refreshToken: string, userData: any) => {
    saveTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/profile/")
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

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
