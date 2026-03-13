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
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => navigate("/blogs")} 
        onLogout={logout} 
      />

      {/* Modern Human Hero Section */}
      <section className="bg-[#FFC017] border-b border-stone-900 py-24 px-6 md:px-[12%] flex flex-col items-start gap-4">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-8xl md:text-9xl font-black text-stone-900 leading-[0.85] tracking-tighter" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
              Stay <br /> curious.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-stone-800 max-w-xl leading-relaxed mt-6">
              Discover stories, thinking, and expertise from writers on any topic. A human perspective on the world.
            </p>
            <button 
              onClick={() => navigate("/signup")}
              className="bg-stone-900 text-white px-12 py-4 rounded-full text-xl font-bold hover:bg-stone-800 transition-all mt-8 shadow-xl active:scale-95 hover:-translate-y-1"
            >
              Start reading
            </button>
        </div>
      </section>

      {/* Trending Section - The Human Pulse */}
      <section className="px-6 md:px-[12%] py-16 border-b border-stone-100 max-w-[1500px] mx-auto bg-white/50">
         <div className="flex items-center gap-3 mb-10 font-black text-xs uppercase tracking-[0.2em] text-stone-500">
            <span className="flex items-center justify-center w-6 h-6 border-2 border-stone-900 rounded-full text-[12px] text-stone-900">↑</span>
            Human Voices Trending
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
            {blogs.slice(0, 6).map((blog, idx) => (
               <div key={blog.id} className="flex gap-6 items-start cursor-pointer group" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <span className="text-4xl font-black text-stone-200 group-hover:text-stone-300 transition-colors tabular-nums">0{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 text-[12px] font-bold text-stone-800 tracking-tight">
                        <div className="w-6 h-6 rounded-full bg-stone-100 ring-2 ring-white flex items-center justify-center overflow-hidden shadow-sm">
                            {blog.author_avatar ? <img src={blog.author_avatar} className="w-full h-full object-cover" /> : blog.author_name[0]}
                        </div>
                        <span className="hover:text-stone-900 transition-colors uppercase tracking-wider">{blog.author_name}</span>
                    </div>
                    <p className="font-extrabold text-lg text-stone-900 leading-snug mb-2 line-clamp-2 decoration-stone-200 group-hover:underline underline-offset-4 decoration-2 transition-all" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                        {blog.title}
                    </p>
                    <div className="flex items-center gap-3 text-stone-400 text-[11px] font-bold tracking-wide">
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                        <span>5 MIN READ</span>
                    </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 px-6 md:px-[12%] max-w-[1600px] mx-auto py-16">
        <div className="relative z-20">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex flex-col mt-10 divide-y divide-stone-100">
            {loading ? (
              <div className="space-y-12">
                {[1, 2, 3].map(i => <div key={i} className="h-44 bg-stone-50 rounded-2xl animate-pulse"></div>)}
              </div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="cursor-pointer py-4" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <BlogItem blog={blog} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Human-Centric Sidebar */}
        <aside className="hidden lg:block sticky top-24 h-fit pt-4">
            <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-sm mb-12">
                <h3 className="font-black text-stone-900 text-sm mb-6 uppercase tracking-wider">Discover Human Stories</h3>
                <div className="flex flex-wrap gap-2.5 mb-8">
                    {TOPICS.slice(2).map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => setActiveTab(topic)}
                            className="bg-white hover:bg-stone-900 hover:text-white border border-stone-200 px-5 py-2.5 rounded-full text-xs font-bold transition-all text-stone-600 shadow-sm active:scale-95"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <button className="w-full py-3.5 border-2 border-stone-900 rounded-full text-stone-900 font-bold text-sm hover:bg-stone-900 hover:text-white transition-all shadow-md">
                   See all topics
                </button>
            </div>

            <div className="px-8 flex flex-col gap-10">
                <div>
                   <h3 className="font-black text-stone-900 text-[11px] mb-6 uppercase tracking-widest text-stone-400">Meet the voices</h3>
                   <div className="flex flex-col gap-6">
                      {blogs.slice(0, 3).map(blog => (
                         <div key={blog.id} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden ring-2 ring-white shadow-md group-hover:scale-110 transition-transform">
                                {blog.author_avatar ? <img src={blog.author_avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{blog.author_name[0]}</div>}
                            </div>
                            <div>
                               <p className="font-bold text-stone-900 text-sm">{blog.author_name}</p>
                               <p className="text-xs text-stone-400 line-clamp-1">{blog.topic} expert</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <footer className="pt-10 border-t border-stone-100">
                    <div className="flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-bold text-stone-400">
                        {["Help", "Status", "About", "Careers", "Privacy", "Terms", "Text to speech"].map(link => (
                            <span key={link} className="hover:text-stone-900 cursor-pointer transition-colors uppercase tracking-wider">{link}</span>
                        ))}
                    </div>
                </footer>
            </div>
        </aside>
      </main>
    </div>
  );
}
