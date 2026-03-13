"use client";

import React from "react";
import { Blog } from "./types";

interface BlogItemProps {
  blog: Blog;
}

const BlogItem = ({ blog }: BlogItemProps) => {
  return (
    <div className="flex justify-between gap-8 py-8 border-b border-gray-100 transition-all hover:bg-gray-50/30 group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-800">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] uppercase">
            {blog.author_name[0]}
          </div>
          <span>{blog.author_name}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 leading-tight group-hover:text-blue-900 transition-colors" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
          {blog.title}
        </h2>
        <p className="text-gray-500 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed font-serif">
          {blog.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span>·</span>
          <span>{Math.ceil(blog.content.length / 500)} min read</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-800">{blog.topic}</span>
          <span className="ml-auto opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">🔖</span>
        </div>
      </div>
      <div className="hidden sm:block w-32 h-24 md:w-40 md:h-28 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg flex-shrink-0 shadow-sm border border-gray-100"></div>
    </div>
  );
};

export default BlogItem;
