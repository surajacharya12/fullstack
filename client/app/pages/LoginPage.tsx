"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

// Sub-component: Form Input
const AuthInput = ({ label, type, value, onChange, placeholder }: any) => (
  <div className="mb-4">
    <label className="block mb-1.5 text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
    />
  </div>
);

// Main Page Component
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/blogs", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/login/", { username, password });
      login(data.tokens.access, data.tokens.refresh, data.user);
      navigate("/blogs", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-50">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
            Simple Story Hub
          </h1>
          <p className="text-gray-500 text-sm font-medium">Welcome back! Please sign in to continue.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Username or Email"
            type="text"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            placeholder="yourname or you@example.com"
          />
          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-4 ${
              loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
            }`}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline ml-1">
              Sign Up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
