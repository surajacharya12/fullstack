"use client";

import React from "react";
import { Blog } from "./types";

interface BlogItemProps {
  blog: Blog;
}

const BlogItem = ({ blog }: BlogItemProps) => {
  return (
    <div className="flex justify-between gap-10 py-10 transition-all hover:translate-x-1 group">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4 text-[12px] font-bold text-stone-900 tracking-tight uppercase">
          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] uppercase overflow-hidden ring-1 ring-stone-200">
            {blog.author_avatar ? (
              <img src={blog.author_avatar} alt={blog.author_name} className="w-full h-full object-cover" />
            ) : (
              blog.author_name[0]
            )}
          </div>
          <span className="hover:underline cursor-pointer">{blog.author_name}</span>
        </div>
        
        <h2 className="text-2xl md:text-[1.75rem] font-black mb-3 text-stone-900 leading-[1.2] group-hover:text-stone-700 transition-colors" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          {blog.title}
        </h2>
        
        <p className="text-stone-500 text-base md:text-lg line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed font-serif">
          {blog.content}
        </p>
        
        <div className="flex items-center gap-4 text-[11px] font-black text-stone-400 tracking-[0.1em] uppercase">
          <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
          <span>{Math.ceil(blog.content.length / 500)} min read</span>
          <span className="bg-stone-50 text-stone-500 px-3 py-1 rounded-full border border-stone-100">{blog.topic}</span>
          <span className="ml-auto opacity-0 group-hover:opacity-100 cursor-pointer transition-all hover:scale-125">🔖</span>
        </div>
      </div>
      
      <div className="hidden sm:block w-32 h-24 md:w-52 md:h-36 bg-linear-to-br from-stone-50 to-stone-100 rounded-[2rem] shrink-0 shadow-sm border border-stone-100 overflow-hidden group-hover:shadow-md transition-all">
        {blog.image ? (
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 italic text-[10px] uppercase font-bold tracking-widest">Memoir</div>
        )}
      </div>
    </div>
  );
};

export default BlogItem;
