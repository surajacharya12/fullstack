"use client";

import React, { useState, useEffect } from "react";
import { getBlogs, createBlog } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  content: string;
  topic: string;
  author_name: string;
  created_at: string;
}

const TOPICS = ["For you", "Following", "Design", "Technology", "Writing", "Programming", "Data Science", "Politics"];

// Sub-component: Navbar
const Navbar = ({ username, onWriteClick, onLogout }: { username?: string, onWriteClick: () => void, onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center px-6 py-2 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div 
          className="text-black font-extrabold text-2xl cursor-pointer tracking-tighter" 
          onClick={() => navigate("/blogs")}
          style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
          Simple Story Hub
        </div>
        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full gap-2 border border-transparent focus-within:border-gray-200 transition-all">
          <span className="text-gray-400">🔍</span>
          <input type="text" placeholder="Search" className="bg-transparent outline-none text-sm w-40 md:w-64" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button 
          className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors text-sm" 
          onClick={onWriteClick}
        >
          ✍️ Write
        </button>
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold ring-1 ring-gray-100 uppercase">
             {username?.[0] || 'U'}
           </div>
           <button onClick={onLogout} className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
             Logout
           </button>
        </div>
      </div>
    </header>
  );
};

// Sub-component: Tab Navigation
const TabNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  return (
    <div className="flex gap-6 px-[12%] py-4 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar">
      {TOPICS.map(topic => (
        <button 
          key={topic} 
          onClick={() => onTabChange(topic)}
          className={`whitespace-nowrap pb-2 text-sm transition-all border-b ${
            activeTab === topic 
            ? "text-black border-black font-medium" 
            : "text-gray-500 border-transparent hover:text-black"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

// Sub-component: Blog Item
const BlogItem = ({ blog }: { blog: Blog }) => {
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

// Sub-component: Blog Editor
const BlogEditor = ({ newBlog, setNewBlog, onPublish, onCancel }: any) => {
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

// Sub-component: Sidebar
const Sidebar = () => {
    return (
        <aside className="hidden lg:block sticky top-24 h-fit border-l border-gray-50 pl-12">
            <div className="mb-10">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-900">Staff Picks</h3>
                <div className="flex flex-col gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase text-gray-600">
                                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">M</div>
                                <span>Medium Staff</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 leading-snug group-hover:underline">Making the web faster with Next.js 15 and React 19</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-10">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-900">Recommended topics</h3>
                <div className="flex flex-wrap gap-2">
                    {TOPICS.slice(2).map(topic => (
                        <button key={topic} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-xs font-medium transition-colors text-gray-800">
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
            
            <footer className="flex flex-wrap gap-x-4 gap-y-2 pt-6 border-t border-gray-50">
                {["Help", "Status", "About", "Careers", "Privacy", "Terms"].map(link => (
                    <span key={link} className="text-xs text-gray-400 hover:text-black cursor-pointer transition-colors">{link}</span>
                ))}
            </footer>
        </aside>
    );
};

// Main Page Component
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState("For you");
  const [showEditor, setShowEditor] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", topic: "Technology" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

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
      await createBlog(newBlog);
      setNewBlog({ title: "", content: "", topic: "Technology" });
      setShowEditor(false);
      const topic = (activeTab === "For you" || activeTab === "Following") ? undefined : activeTab;
      fetchBlogs(topic);
    } catch (err) {
      setError("Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        username={user?.username} 
        onWriteClick={() => setShowEditor(!showEditor)} 
        onLogout={logout} 
      />

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 px-6 md:px-[12%] max-w-[1500px] mx-auto py-10">
        <div className="relative z-20">
          {showEditor && (
             <BlogEditor 
                newBlog={newBlog} 
                setNewBlog={setNewBlog} 
                onPublish={handlePublish} 
                onCancel={() => setShowEditor(false)} 
             />
          )}

          <div className="flex flex-col">
            {loading ? (
              <div className="flex flex-col gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-gray-50 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : (
              blogs.map(blog => <BlogItem key={blog.id} blog={blog} />)
            )}
            {!loading && blogs.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif italic italic text-xl">No stories found in this topic yet.</p>
              </div>
            )}
          </div>
        </div>

        <Sidebar />
      </main>
    </div>
  );
}
