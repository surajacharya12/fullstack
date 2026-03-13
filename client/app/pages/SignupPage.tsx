"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import AuthInput from "../components/auth/AuthInput";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/signup/", { username, email, password });
      login(data.tokens.access, data.tokens.refresh, data.user);
      navigate("/blogs", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Registration failed. Try a different username/email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-50">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-stone-900 mb-2 tracking-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>Stanza</h1>
          <p className="text-gray-500 text-sm font-medium">Join our community of stories today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Username"
            type="text"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            placeholder="Choose a unique username"
            className="focus:ring-emerald-500"
          />
          <AuthInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="focus:ring-emerald-500"
          />
          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-[0.98] mt-4 ${
              loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-bold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
