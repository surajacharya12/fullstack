"use client";

import React, { useState, useEffect } from "react";
import { getBlogs, createBlog } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Components
import Navbar from "../components/blog/Navbar";
import TabNav from "../components/blog/TabNav";
import BlogItem from "../components/blog/BlogItem";
import BlogEditor from "../components/blog/BlogEditor";

// Types/Constants
import { Blog } from "../components/blog/types";
import { TOPICS } from "../components/blog/constants";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState("For you");
  const [showEditor, setShowEditor] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", topic: "Technology", image: null as File | null });
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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('topic', newBlog.topic);
      if (newBlog.image) {
        formData.append('image', newBlog.image);
      }

      await createBlog(formData);
      setNewBlog({ title: "", content: "", topic: "Technology", image: null });
      setShowEditor(false);
      const topic = (activeTab === "For you" || activeTab === "Following") ? undefined : activeTab;
      fetchBlogs(topic);
    } catch (err) {
      setError("Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => setShowEditor(!showEditor)} 
        onLogout={logout} 
      />

      {/* Modern Hero for Logged-in Users */}
      <section className="bg-stone-900 text-white pt-24 pb-32 px-6 md:px-[12%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-white/5 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
              Welcome back, <br /> 
              <span className="text-stone-400 italic font-serif lowercase">{user?.username}.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-400 font-medium max-w-xl leading-relaxed">
              Your community is thriving. Catch up on the latest stories from the human side of the web.
            </p>
            <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowEditor(true)}
                  className="bg-white text-stone-900 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-stone-100 transition-all shadow-xl shadow-stone-950/20 active:scale-95"
                >
                  Write your story
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="border border-stone-700 text-stone-300 px-8 py-3.5 rounded-full font-bold text-sm hover:border-white hover:text-white transition-all active:scale-95"
                >
                  View your profile
                </button>
            </div>
        </div>
      </section>

      {/* Sticky Sub-Header with Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-16 z-40">
        <div className="max-w-[1600px] mx-auto">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 px-6 md:px-[12%] max-w-[1600px] mx-auto py-16 animate-in fade-in duration-700">
        <div className="relative z-20">
          {showEditor && (
             <div className="mb-16 bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/50 transition-all animate-in slide-in-from-top-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Collaborate with the world</h2>
                    <button onClick={() => setShowEditor(false)} className="text-stone-300 hover:text-stone-900 transition-colors text-xl">✕</button>
                </div>
                <BlogEditor 
                   newBlog={newBlog} 
                   setNewBlog={setNewBlog} 
                   onPublish={handlePublish} 
                   onCancel={() => setShowEditor(false)} 
                />
             </div>
          )}

          <div className="flex flex-col divide-y divide-stone-100">
            {loading ? (
              <div className="flex flex-col gap-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-stone-50 h-48 rounded-3xl"></div>
                ))}
              </div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="cursor-pointer py-4" onClick={() => navigate(`/blogs/${blog.id}`)}>
                    <BlogItem blog={blog} />
                </div>
              ))
            )}
            {!loading && blogs.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-stone-200">
                <p className="text-stone-400 font-serif italic text-2xl mb-8">Quiet in this corner of the hub...</p>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="bg-stone-900 text-white px-10 py-3 rounded-full font-bold shadow-lg"
                >
                  Write the first story →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Human-Centric Sidebar for Logged-In Users */}
        <aside className="hidden lg:block sticky top-32 h-fit">
            <div className="p-8 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm mb-12">
                <h3 className="font-black text-stone-900 text-sm mb-6 uppercase tracking-wider">Refine your lens</h3>
                <div className="flex flex-wrap gap-2.5">
                    {TOPICS.slice(2).map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => setActiveTab(topic)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                                activeTab === topic 
                                ? "bg-stone-900 text-white border-stone-900 shadow-lg" 
                                : "bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-100"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <button className="w-full mt-8 py-3.5 border border-stone-200 rounded-full text-stone-400 font-bold text-sm hover:border-stone-900 hover:text-stone-900 transition-all">
                   Manage your interests
                </button>
            </div>

            <div className="px-8 flex flex-col gap-10">
                <div className="p-8 bg-stone-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                   <h3 className="font-black text-stone-400 text-[10px] mb-6 uppercase tracking-[0.3em]">Your Voice</h3>
                   <div className="flex items-end justify-between">
                      <div>
                        <p className="font-black text-4xl mb-1 tabular-nums">{blogs.filter(b => b.author_name === user?.username).length}</p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Stories Shared</p>
                      </div>
                      <button 
                        onClick={() => setShowEditor(true)}
                        className="w-12 h-12 bg-white text-stone-900 rounded-full flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform active:scale-95 shadow-lg"
                      >
                         +
                      </button>
                   </div>
                </div>

                <footer className="pt-10 border-t border-stone-100">
                    <div className="flex flex-wrap gap-x-6 gap-y-4 text-[11px] font-black text-stone-400">
                        {["Library", "History", "About Stanza", "Settings", "Help Center"].map(link => (
                            <span key={link} className="hover:text-stone-900 cursor-pointer transition-colors uppercase tracking-[0.1em]">{link}</span>
                        ))}
                    </div>
                    <p className="mt-8 text-[10px] font-bold text-stone-300 uppercase tracking-widest">© 2026 Stanza Media Inc.</p>
                </footer>
            </div>
        </aside>
      </main>
    </div>
  );
}
