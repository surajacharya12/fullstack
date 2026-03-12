"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/login/", { username, password });

      login(data.tokens.access, data.tokens.refresh, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.h2}>Sign In</h2>
        {error && <div style={s.err}>{error}</div>}
        <label style={s.lbl}>Username or Email</label>
        <input
          style={s.inp}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname or you@example.com"
        />
        <label style={s.lbl}>Password</label>
        <input
          style={s.inp}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <button
          style={loading ? s.btnOff : s.btn}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p
          style={{
            marginTop: 15,
            fontSize: 14,
            textAlign: "center",
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#6366f1", fontWeight: "600" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#0f172a",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: 12,
    width: 360,
    boxShadow: "0 4px 20px rgba(0,0,0,.12)",
  },
  h2: {
    margin: "0 0 1.5rem",
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  err: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  lbl: {
    display: "block",
    marginBottom: 4,
    fontWeight: "600",
    color: "#374151",
    fontSize: 13,
  },
  inp: {
    width: "100%",
    padding: "12px",
    marginBottom: 16,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    boxSizing: "border-box",
    color: "#0f172a",
    background: "#fff",
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnOff: {
    width: "100%",
    padding: 12,
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "bold",
    cursor: "not-allowed",
  },
};
