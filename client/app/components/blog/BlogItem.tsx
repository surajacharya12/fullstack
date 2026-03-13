"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Blog } from "./types";

interface BlogItemProps {
  blog: Blog;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row gap-8 py-10 group transition-all duration-500 hover:bg-white/40 px-4 rounded-3xl -mx-4">
      {/* Article Info */}
      <div className="flex-1 order-2 md:order-1">
        <div 
          className="flex items-center gap-2.5 mb-4 group/author cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${blog.author_name}`);
          }}
        >
          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-black ring-2 ring-white shadow-sm overflow-hidden transition-transform group-hover/author:scale-110">
            {blog.author_avatar ? (
              <img src={blog.author_avatar} alt={blog.author_name} className="w-full h-full object-cover" />
            ) : (
              blog.author_name[0]
            )}
          </div>
          <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest hover:text-stone-500 transition-colors">{blog.author_name}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-stone-900 mb-3 leading-snug tracking-tighter group-hover:text-stone-600 transition-colors" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          {blog.title}
        </h2>

        <p className="text-stone-500 font-serif leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 text-lg italic">
          {blog.content}
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                <span>5 min read</span>
                <span className="px-3 py-1 bg-stone-50 text-stone-500 rounded-full text-[9px]">
                    {blog.topic}
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                {blog.likes_count! > 0 && (
                    <div className="flex items-center gap-1.5 text-stone-400">
                        <span className="text-xs">❤️</span>
                        <span className="text-[10px] font-black tabular-nums">{blog.likes_count}</span>
                    </div>
                )}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-stone-300 hover:text-stone-900 transition-colors">
                        🔖
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Article Image Container */}
      <div className="w-full md:w-[200px] lg:w-[240px] aspect-[4/3] md:aspect-square order-1 md:order-2">
        <div className="w-full h-full bg-stone-50 rounded-4xl overflow-hidden border border-stone-100 shadow-xl shadow-stone-200/40 relative group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
          {blog.image ? (
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
               <span className="text-stone-200 font-serif italic text-sm mb-1 uppercase tracking-widest">Memoir</span>
               <div className="w-8 h-px bg-stone-100"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
