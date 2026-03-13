"use client";

import React from "react";
import { TOPICS } from "./constants";

interface BlogEditorProps {
  newBlog: { title: string; content: string; topic: string; image?: File | null };
  setNewBlog: (blog: any) => void;
  onPublish: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const BlogEditor = ({ newBlog, setNewBlog, onPublish, onCancel }: BlogEditorProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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

                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                >
                  🖼️ {newBlog.image ? "Change Image" : "Add Image"}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setNewBlog({...newBlog, image: file});
                  }}
                />
            </div>

            {newBlog.image && (
                <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden group">
                    <img 
                      src={URL.createObjectURL(newBlog.image)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                       onClick={() => setNewBlog({...newBlog, image: null})}
                       className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                </div>
            )}

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
