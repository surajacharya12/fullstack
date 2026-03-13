"use client";

import React, { useState, useEffect } from "react";
import { getBlogs, createBlog, deleteBlog } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  content: string;
  topic: string;
  author_name: string;
  created_at: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", topic: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (topic?: string) => {
    try {
      setLoading(true);
      const data = await getBlogs(topic);
      setBlogs(data);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.topic) {
      setError("Please fill all fields");
      return;
    }
    try {
      await createBlog(newBlog);
      setNewBlog({ title: "", content: "", topic: "" });
      fetchBlogs();
    } catch (err: any) {
      setError("Failed to create blog");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (err: any) {
      setError("Failed to delete blog. Are you the author?");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ ...styles.title, cursor: 'pointer' }} onClick={() => navigate("/dashboard")}>
          Blog System
        </h1>
        <div style={styles.navActions}>
           <span style={styles.userInfo}>Hi, {user?.username}</span>
           <button onClick={() => navigate("/dashboard")} style={styles.dashBtn}>Dashboard</button>
           <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Write a New Blog</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Topic (e.g. Technology, Health, Travel)"
              value={newBlog.topic}
              onChange={(e) => setNewBlog({ ...newBlog, topic: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="What's on your mind?"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              style={styles.textarea}
            />
            <button type="submit" style={styles.submitBtn}>Post Blog</button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </section>

        <section style={styles.listSection}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>Recent Blogs</h2>
            <div style={styles.filterGroup}>
               <button onClick={() => fetchBlogs()} style={styles.filterBtn}>All</button>
               <button onClick={() => fetchBlogs('Technology')} style={styles.filterBtn}>Tech</button>
               <button onClick={() => fetchBlogs('Health')} style={styles.filterBtn}>Health</button>
            </div>
          </div>

          {loading ? (
            <p>Loading blogs...</p>
          ) : (
            <div style={styles.blogGrid}>
              {blogs.map((blog) => (
                <div key={blog.id} style={styles.blogCard}>
                  <div style={styles.blogTag}>{blog.topic}</div>
                  <h3 style={styles.blogTitle}>{blog.title}</h3>
                  <p style={styles.blogContent}>{blog.content}</p>
                  <div style={styles.blogFooter}>
                    <span>By {blog.author_name}</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                  {user?.username === blog.author_name && (
                    <button onClick={() => handleDelete(blog.id)} style={styles.deleteBtn}>Delete</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 5%", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  title: { fontSize: "1.5rem", fontWeight: "800", color: "#2563eb" },
  navActions: { display: "flex", alignItems: "center", gap: "1rem" },
  userInfo: { fontWeight: "500", color: "#64748b" },
  dashBtn: { padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: "6px", background: "none", cursor: "pointer" },
  logoutBtn: { padding: "0.5rem 1rem", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  main: { padding: "2rem 5%", maxWidth: "1200px", margin: "0 auto" },
  formSection: { background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "3rem" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1rem" },
  textarea: { padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1rem", minHeight: "150px", resize: "vertical" },
  submitBtn: { padding: "0.75rem", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" },
  error: { color: "#ef4444", marginTop: "1rem", fontWeight: "500" },
  listSection: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  filterGroup: { display: "flex", gap: "0.5rem" },
  filterBtn: { padding: "0.4rem 0.8rem", borderRadius: "20px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: "0.875rem" },
  blogGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  blogCard: { background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", position: "relative", display: "flex", flexDirection: "column" },
  blogTag: { background: "#dbeafe", color: "#2563eb", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "700", width: "fit-content", marginBottom: "1rem" },
  blogTitle: { fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.75rem" },
  blogContent: { color: "#475569", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "1.5rem", flexGrow: 1 },
  blogFooter: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#94a3b8" },
  deleteBtn: { marginTop: "1rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.875rem", width: "fit-content" }
};
