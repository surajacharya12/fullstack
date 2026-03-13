"use client";

import React, { useState, useEffect } from "react";
import { getBlogs } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/blog/Navbar";
import TabNav from "../components/blog/TabNav";
import BlogItem from "../components/blog/BlogItem";
import Sidebar from "../components/blog/Sidebar";
import { Blog } from "../components/blog/types";

export default function LandingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState("For you");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const topic = (activeTab === "For you" || activeTab === "Following") ? undefined : activeTab;
      const data = await getBlogs(topic);
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => navigate("/blogs")} 
        onLogout={logout} 
      />

      {/* Hero Section */}
      <section className="bg-[#FFC017] border-b border-black py-20 px-6 md:px-[12%] flex flex-col items-start gap-6">
        <h1 className="text-7xl md:text-8xl font-black text-black leading-tight tracking-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          Human <br /> stories & ideas
        </h1>
        <p className="text-xl md:text-2xl font-medium text-black max-w-lg leading-relaxed">
          A place to read, write, and deepen your understanding
        </p>
        <button 
          onClick={() => navigate("/signup")}
          className="bg-black text-white px-10 py-3 rounded-full text-xl font-medium hover:bg-gray-800 transition-all mt-4"
        >
          Start reading
        </button>
      </section>

      {/* Trending Section (Simulation) */}
      <section className="px-6 md:px-[12%] py-10 border-b border-gray-100">
         <div className="flex items-center gap-2 mb-6 font-bold text-sm uppercase tracking-wider">
            <span className="p-1 border border-black rounded-full text-[10px]">📈</span>
            Trending on Medium
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, idx) => (
               <div key={blog.id} className="flex gap-4 items-start cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <span className="text-3xl font-bold text-gray-200">0{idx + 1}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">{blog.author_name[0]}</div>
                        <span>{blog.author_name}</span>
                    </div>
                    <p className="font-extrabold text-sm mb-1">{blog.title}</p>
                    <span className="text-gray-500 text-[10px]">{new Date(blog.created_at).toLocaleDateString()} · 5 min read</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <div className="px-6 md:px-[12%] py-10">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 px-6 md:px-[12%] max-w-[1500px] mx-auto pb-20">
        <div>
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-xl animate-pulse"></div>)}
            </div>
          ) : (
            blogs.map(blog => (
              <div key={blog.id} className="cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                <BlogItem blog={blog} />
              </div>
            ))
          )}
        </div>
        <Sidebar />
      </main>
    </div>
  );
}
