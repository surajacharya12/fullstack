"use client";

// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  // If not logged in → redirect to /login
  // If logged in → render the child route (<Outlet />)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
