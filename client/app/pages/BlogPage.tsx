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

const TOPICS = ["For you", "Following", "Design", "Technology", "Writing", "Programming", "Data Science", "Politics"];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState("For you");
  const [showEditor, setShowEditor] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", topic: "Technology" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const topic = (activeTab === "For you" || activeTab === "Following") ? undefined : activeTab;
    fetchBlogs(topic);
  }, [activeTab]);

  const fetchBlogs = async (topic?: string) => {
    try {
      setLoading(true);
      const data = await getBlogs(topic);
      setBlogs(data);
    } catch (err: any) {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlog(newBlog);
      setNewBlog({ title: "", content: "", topic: "Technology" });
      setShowEditor(false);
      // Refresh current tab view
      const topic = (activeTab === "For you" || activeTab === "Following") ? undefined : activeTab;
      fetchBlogs(topic);
    } catch (err) {
      setError("Failed to create blog");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.navHeader}>
        <div style={styles.navLeft}>
          <div style={styles.logo} onClick={() => navigate("/dashboard")}>S</div>
          <div style={styles.searchBar}>
            <span>🔍</span>
            <input type="text" placeholder="Search" style={styles.searchInput} />
          </div>
        </div>
        <div style={styles.navRight}>
          <button style={styles.writeLink} onClick={() => setShowEditor(!showEditor)}>
            ✍️ Write
          </button>
          <div style={styles.avatar}>{user?.username?.[0].toUpperCase()}</div>
          <button onClick={logout} style={styles.logoutSm}>Logout</button>
        </div>
      </header>

      <div style={styles.tabNav}>
        {TOPICS.map(topic => (
          <button 
            key={topic} 
            style={{...styles.tabBtn, ...(activeTab === topic ? styles.activeTab : {})}}
            onClick={() => setActiveTab(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <main style={styles.mainLayout}>
        <div style={styles.contentCol}>
          {showEditor && (
             <div style={styles.editorCard}>
                <input 
                  style={styles.editorTitle} 
                  placeholder="Title" 
                  value={newBlog.title}
                  onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                />
                <select 
                  style={styles.topicSelect}
                  value={newBlog.topic}
                  onChange={e => setNewBlog({...newBlog, topic: e.target.value})}
                >
                  {TOPICS.filter(t => t !== "For you" && t !== "Following").map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <textarea 
                  style={styles.editorBody} 
                  placeholder="Tell your story..." 
                  value={newBlog.content}
                  onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                />
                <div style={styles.editorActions}>
                   <button onClick={handleSubmit} style={styles.publishBtn}>Publish</button>
                   <button onClick={() => setShowEditor(false)} style={styles.cancelBtn}>Cancel</button>
                </div>
             </div>
          )}

          {loading ? <p>Loading...</p> : (
            blogs.map(blog => (
              <div key={blog.id} style={styles.blogItem}>
                <div style={styles.blogText}>
                  <div style={styles.itemAuthor}>
                    <div style={styles.miniAvatar}>{blog.author_name[0].toUpperCase()}</div>
                    <span>{blog.author_name}</span>
                  </div>
                  <h2 style={styles.itemTitle}>{blog.title}</h2>
                  <p style={styles.itemSnippet}>{blog.content.substring(0, 150)}...</p>
                  <div style={styles.itemMeta}>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span style={styles.dot}>·</span>
                    <span>{Math.ceil(blog.content.length / 500)} min read</span>
                    <span style={styles.topicBadge}>{blog.topic}</span>
                    <span style={styles.icon}>🔖</span>
                  </div>
                </div>
                <div style={styles.blogImg}>
                  {/* Mock image generator placeholder */}
                  <div style={styles.mockImg}></div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Staff Picks</h3>
            <div style={styles.staffPick}>
               <div style={styles.miniAuthor}>
                  <div style={styles.microAvatar}>J</div>
                  <span>Jordan Moore</span>
               </div>
               <p style={styles.pickTitle}>The evolution of AI in 2024</p>
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Recommended topics</h3>
            <div style={styles.topicCloud}>
              {TOPICS.slice(1).map(topic => (
                <button key={topic} style={styles.cloudTag} onClick={() => setActiveTab(topic)}>{topic}</button>
              ))}
            </div>
          </div>
          
          <footer style={styles.miniFooter}>
            <span style={styles.footerLink}>Help</span>
            <span style={styles.footerLink}>Status</span>
            <span style={styles.footerLink}>About</span>
            <span style={styles.footerLink}>Careers</span>
            <span style={styles.footerLink}>Blog</span>
            <span style={styles.footerLink}>Privacy</span>
            <span style={styles.footerLink}>Terms</span>
          </footer>
        </aside>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: "white", minHeight: "100vh", fontFamily: "Spectral, Georgia, serif" },
  navHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1.5rem", borderBottom: "1px solid #f2f2f2" },
  navLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  logo: { width: 40, height: 40, background: "black", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: "pointer", fontSize: 24, paddingBottom: 4 },
  searchBar: { display: "flex", alignItems: "center", background: "#f9f9f9", padding: "0.5rem 1rem", borderRadius: "100px", gap: "0.5rem" },
  searchInput: { border: "none", background: "none", outline: "none", fontSize: "0.9rem" },
  navRight: { display: "flex", alignItems: "center", gap: "1.5rem" },
  writeLink: { background: "none", border: "none", cursor: "pointer", color: "#757575", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 4 },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" },
  logoutSm: { border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" },

  tabNav: { display: "flex", gap: "1.5rem", padding: "1rem 12%", borderBottom: "1px solid #f2f2f2", overflowX: "auto" },
  tabBtn: { background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "transparent", color: "#757575", cursor: "pointer", padding: "0.5rem 0", fontSize: "0.9rem" },
  activeTab: { color: "black", borderBottomColor: "black" },

  mainLayout: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "4rem", padding: "2rem 12%", maxWidth: 1400, margin: "0 auto" },
  contentCol: { display: "flex", flexDirection: "column" },
  
  editorCard: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #f2f2f2", paddingBottom: "2rem" },
  editorTitle: { fontSize: "2.5rem", border: "none", outline: "none", fontWeight: "bold", fontFamily: "inherit" },
  topicSelect: { width: "fit-content", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ddd" },
  editorBody: { fontSize: "1.2rem", border: "none", outline: "none", minHeight: "200px", resize: "none", fontFamily: "inherit" },
  editorActions: { display: "flex", gap: "1rem" },
  publishBtn: { background: "#1a8917", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "100px", cursor: "pointer", fontSize: "0.9rem" },
  cancelBtn: { background: "none", border: "1px solid #ddd", padding: "0.5rem 1rem", borderRadius: "100px", cursor: "pointer", fontSize: "0.9rem" },

  blogItem: { display: "flex", justifyContent: "space-between", gap: "2rem", padding: "1.5rem 0", borderBottom: "1px solid #f2f2f2", alignItems: "center" },
  blogText: { flex: 1 },
  itemAuthor: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: 500 },
  miniAvatar: { width: 20, height: 20, borderRadius: "50%", background: "#ddd", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  itemTitle: { fontSize: "1.4rem", fontWeight: "bold", marginBottom: "0.4rem", color: "#292929" },
  itemSnippet: { color: "#757575", fontSize: "1rem", lineHeight: "1.4", marginBottom: "1rem" },
  itemMeta: { display: "flex", alignItems: "center", gap: "0.5rem", color: "#757575", fontSize: "0.8rem" },
  dot: { fontSize: 12 },
  topicBadge: { background: "#f2f2f2", padding: "2px 8px", borderRadius: "100px", color: "#292929" },
  icon: { marginLeft: "auto", cursor: "pointer" },
  
  blogImg: { width: 160, height: 110, flexShrink: 0 },
  mockImg: { width: "100%", height: "100%", background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)", borderRadius: "4px" },

  sidebar: { position: "sticky", top: "2rem", height: "fit-content" },
  sidebarSection: { marginBottom: "2.5rem" },
  sidebarTitle: { fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" },
  staffPick: { marginBottom: "1rem" },
  miniAuthor: { display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", marginBottom: "0.25rem" },
  microAvatar: { width: 14, height: 14, borderRadius: "50%", background: "#ddd", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  pickTitle: { fontSize: "0.9rem", fontWeight: "bold", color: "#292929" },

  topicCloud: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  cloudTag: { background: "#f2f2f2", border: "none", padding: "0.5rem 1rem", borderRadius: "100px", fontSize: "0.85rem", cursor: "pointer" },
  
  miniFooter: { display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "2rem", borderTop: "1px solid #f2f2f2", paddingTop: "1rem" },
  footerLink: { fontSize: "0.8rem", color: "#757575", cursor: "pointer" }
};
