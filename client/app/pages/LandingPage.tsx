"use client";

import React, { useState, useEffect } from "react";
import { getBlogs } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/blog/Navbar";
import TabNav from "../components/blog/TabNav";
import BlogItem from "../components/blog/BlogItem";
import { Blog } from "../components/blog/types";
import { TOPICS } from "../components/blog/constants";

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
      <section className="bg-[#FFC017] border-b border-black py-20 px-6 md:px-[12%] flex flex-col items-start gap-4">
        <h1 className="text-8xl md:text-9xl font-black text-black leading-[0.9] tracking-tighter" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          Human <br /> stories & ideas
        </h1>
        <p className="text-xl md:text-2xl font-medium text-black max-w-lg leading-relaxed mt-4">
          A place to read, write, and deepen your understanding
        </p>
        <button 
          onClick={() => navigate("/signup")}
          className="bg-black text-white px-12 py-3.5 rounded-full text-xl font-medium hover:bg-gray-800 transition-all mt-6 shadow-md active:scale-95"
        >
          Start reading
        </button>
      </section>

      {/* Trending Section */}
      <section className="px-6 md:px-[12%] py-12 border-b border-gray-100 max-w-[1500px] mx-auto">
         <div className="flex items-center gap-2 mb-8 font-bold text-xs uppercase tracking-widest text-gray-900">
            <span className="flex items-center justify-center w-5 h-5 border border-black rounded-full text-[10px]">📈</span>
            Trending on Medium
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
            {blogs.slice(0, 6).map((blog, idx) => (
               <div key={blog.id} className="flex gap-4 items-start cursor-pointer group" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <span className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">0{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-tight text-gray-900">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            {blog.author_avatar ? <img src={blog.author_avatar} className="w-full h-full object-cover" /> : blog.author_name[0]}
                        </div>
                        <span className="hover:underline">{blog.author_name}</span>
                    </div>
                    <p className="font-black text-base text-gray-900 leading-tight mb-2 line-clamp-2">{blog.title}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] font-medium">
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>·</span>
                        <span>5 min read</span>
                    </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 px-6 md:px-[12%] max-w-[1500px] mx-auto py-10">
        <div className="relative z-20">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex flex-col mt-6">
            {loading ? (
              <div className="space-y-10">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 rounded-xl animate-pulse"></div>)}
              </div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <BlogItem blog={blog} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-24 h-fit pt-4 section">
            <div className="mb-10">
                <h3 className="font-bold text-sm mb-4 text-gray-900">Discover more of what matters to you</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                    {TOPICS.slice(2).map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => setActiveTab(topic)}
                            className="bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-2.5 rounded-full text-xs font-medium transition-all text-gray-800"
                        >
                            {topic}
                        </button>
                    ))}
                    <button className="bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-2.5 rounded-full text-xs font-medium transition-all text-gray-800">
                      Self Improvement
                    </button>
                    <button className="bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-2.5 rounded-full text-xs font-medium transition-all text-gray-800">
                      Relationships
                    </button>
                </div>
                <div className="pt-8 border-t border-gray-100">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-500">
                        {["Help", "Status", "About", "Careers", "Privacy", "Terms", "Text to speech"].map(link => (
                            <span key={link} className="hover:text-black cursor-pointer transition-colors">{link}</span>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
      </main>
    </div>
  );
}
