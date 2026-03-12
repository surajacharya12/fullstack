"use client";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>
      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={{ color: "#0f172a" }}>Welcome, {user?.username ?? "User"}</h2>
          <p style={{ color: "#475569" }}>Email: {user?.email ?? "N/A"}</p>
          <p style={styles.badge}>
            <span style={{ marginRight: 8 }}>●</span>
            Authenticated
          </p>
        </div>
        <p style={styles.hint}>
          Only authenticated users can see this page.
        </p>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { 
    minHeight: "100vh", 
    background: "#f1f5f9",
    color: "#0f172a" 
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center", 
    padding: "1rem 2rem",
    background: "#0f172a", 
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  title: { margin: 0, fontSize: "1.5rem", fontWeight: "700" },
  logoutBtn: { 
    padding: "0.6rem 1.2rem", 
    background: "#ef4444",
    color: "#fff", 
    border: "none", 
    borderRadius: 8,
    cursor: "pointer", 
    fontWeight: "600",
    transition: "background 0.2s"
  },
  main: { padding: "2rem", maxWidth: "800px", margin: "0 auto" },
  welcomeCard: { 
    background: "#fff", 
    padding: "2rem", 
    borderRadius: 16,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", 
    marginBottom: "1.5rem" 
  },
  badge: { 
    color: "#16a34a", 
    fontWeight: "700", 
    fontSize: "0.875rem",
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
    background: "#f0fdf4",
    padding: "4px 12px",
    borderRadius: "100px",
    width: "fit-content"
  },
  hint: { 
    color: "#64748b", 
    fontStyle: "italic",
    textAlign: "center"
  },
};