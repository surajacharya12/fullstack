"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogs } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/blog/Navbar";
import { Blog } from "../components/blog/types";
import api from "../api/axiosInstance";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blogs/${id}/`);
      setBlog(data);
    } catch (err) {
      console.error("Failed to fetch blog", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-stone-400">Loading your story...</div>;
  if (!blog) return <div className="h-screen flex items-center justify-center font-bold text-stone-900">Story not found</div>;

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-32">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => navigate("/blogs")} 
        onLogout={logout} 
      />

      <article className="max-w-[760px] mx-auto px-6 mt-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <button 
            onClick={() => navigate(-1)} 
            className="mb-12 flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-[0.2em]"
        >
            ← Back to feed
        </button>

        <h1 className="text-5xl md:text-6xl font-black text-stone-900 mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 mb-14 bg-white/50 p-6 rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-xl font-bold uppercase overflow-hidden ring-2 ring-white">
                {blog.author_avatar ? <img src={blog.author_avatar} className="w-full h-full object-cover" /> : blog.author_name[0]}
            </div>
            <div>
                <p className="font-black text-stone-900 text-lg uppercase tracking-tight">{blog.author_name}</p>
                <div className="flex items-center gap-3 text-[12px] font-bold text-stone-400 tracking-wide">
                    <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded uppercase">{blog.topic}</span>
                    <span className="w-1.5 h-1.5 bg-stone-200 rounded-full"></span>
                    <span>{Math.ceil(blog.content.length / 500)} MIN READ</span>
                    <span className="w-1.5 h-1.5 bg-stone-200 rounded-full"></span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-5 text-stone-300">
                <span className="cursor-pointer hover:text-stone-900 transition-colors text-2xl">🔖</span>
                <span className="cursor-pointer hover:text-stone-900 transition-colors text-2xl">📤</span>
                <span className="cursor-pointer hover:text-stone-900 transition-colors text-2xl">...</span>
            </div>
        </div>

        {blog.image && (
            <div className="relative mb-16 rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/50">
                <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-auto object-cover max-h-[500px]" 
                />
            </div>
        )}

        <div 
            className="prose prose-stone prose-xl max-w-none text-stone-800 leading-[1.8] font-serif"
            style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
          {blog.content.split('\n').map((para, i) => (
             <p key={i} className="mb-10 text-[1.35rem] first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-stone-900">
                {para}
             </p>
          ))}
        </div>

        <div className="mt-24 pt-16 border-t border-stone-100 text-center">
            <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Enjoyed this story?</p>
            <div className="flex justify-center gap-6">
                <button className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all">Support Author</button>
                <button className="border-2 border-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-900 hover:text-white transition-all">Follow {blog.author_name}</button>
            </div>
        </div>
      </article>
    </div>
  );
}
