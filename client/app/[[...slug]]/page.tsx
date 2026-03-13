"use client";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import BlogPage from "../pages/BlogPage";
import LandingPage from "../pages/LandingPage";
import BlogDetailPage from "../pages/BlogDetailPage";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />

          {/* Protected — wrapped by PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="/blogs" element={<BlogPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}