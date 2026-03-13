"use client";

import React from "react";
import { TOPICS } from "./constants";

interface BlogEditorProps {
  newBlog: { title: string; content: string; topic: string };
  setNewBlog: (blog: any) => void;
  onPublish: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const BlogEditor = ({ newBlog, setNewBlog, onPublish, onCancel }: BlogEditorProps) => {
    return (
        <div className="flex flex-col gap-6 mb-8 pb-8 border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <input 
              className="text-4xl md:text-5xl font-bold border-none outline-none placeholder-gray-200 text-gray-900"
              style={{ fontFamily: "'Spectral', Georgia, serif" }}
              placeholder="Title" 
              value={newBlog.title}
              onChange={e => setNewBlog({...newBlog, title: e.target.value})}
            />
            <div className="flex items-center gap-4">
                <select 
                  className="px-3 py-1.5 rounded-md border border-gray-200 text-sm bg-white shadow-sm focus:ring-1 focus:ring-black outline-none transition-all"
                  value={newBlog.topic}
                  onChange={e => setNewBlog({...newBlog, topic: e.target.value})}
                >
                  {TOPICS.filter(t => t !== "For you" && t !== "Following").map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <textarea 
              className="text-lg md:text-xl border-none outline-none min-h-[300px] resize-none placeholder-gray-200 font-serif leading-relaxed text-gray-800"
              placeholder="Tell your story..." 
              value={newBlog.content}
              onChange={e => setNewBlog({...newBlog, content: e.target.value})}
            />
            <div className="flex gap-4">
               <button 
                 onClick={onPublish} 
                 className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95"
               >
                 Publish
               </button>
               <button 
                 onClick={onCancel} 
                 className="bg-white border border-gray-200 hover:border-black px-6 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
               >
                 Cancel
               </button>
            </div>
        </div>
    );
};

export default BlogEditor;
