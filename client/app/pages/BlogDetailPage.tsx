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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Story...</div>;
  if (!blog) return <div className="h-screen flex items-center justify-center">Story not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => navigate("/blogs")} 
        onLogout={logout} 
      />

      <article className="max-w-[700px] mx-auto px-6 pt-12">
        <button 
            onClick={() => navigate(-1)} 
            className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
            ← Back
        </button>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold uppercase">
                {blog.author_name[0]}
            </div>
            <div>
                <p className="font-bold text-gray-900">{blog.author_name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{Math.ceil(blog.content.length / 500)} min read</span>
                    <span>·</span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-gray-400">
                <span className="cursor-pointer hover:text-black transition-colors text-xl">🔖</span>
                <span className="cursor-pointer hover:text-black transition-colors text-xl">📤</span>
                <span className="cursor-pointer hover:text-black transition-colors text-xl">...</span>
            </div>
        </div>

        {blog.image && (
            <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-auto rounded-lg mb-10 shadow-sm" 
            />
        )}
        {!blog.image && (
             <div className="w-full aspect-video bg-gray-50 rounded-lg mb-10 flex items-center justify-center italic text-gray-300">
                No image provided for this story
             </div>
        )}

        <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif text-xl"
            style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
          {blog.content.split('\n').map((para, i) => (
             <p key={i} className="mb-6">{para}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
