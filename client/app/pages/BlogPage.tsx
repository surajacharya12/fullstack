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

      {/* Modern Human Sub-Header for Logged-In Users */}
      <div className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 px-6 md:px-[12%] max-w-[1600px] mx-auto py-12 animate-in fade-in duration-700">
        <div className="relative z-20">
          {showEditor && (
             <div className="mb-12 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm transition-all animate-in slide-in-from-top-4">
                <h2 className="text-xl font-black text-stone-900 mb-6 uppercase tracking-wider">Write your story</h2>
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
                  <div key={i} className="animate-pulse bg-stone-50 h-44 rounded-2xl"></div>
                ))}
              </div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                    <BlogItem blog={blog} />
                </div>
              ))
            )}
            {!loading && blogs.length === 0 && (
              <div className="text-center py-24 bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
                <p className="text-stone-400 font-serif italic text-2xl">Your garden of stories is empty for this topic.</p>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="mt-6 text-stone-900 font-bold hover:underline"
                >
                  Plant a new story →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Human-Centric Sidebar for Logged-In Users */}
        <aside className="hidden lg:block sticky top-28 h-fit">
            <div className="p-8 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm mb-12">
                <h3 className="font-black text-stone-900 text-sm mb-6 uppercase tracking-wider">Personalized Discovery</h3>
                <div className="flex flex-wrap gap-2.5 mb-8">
                    {TOPICS.slice(2).map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => setActiveTab(topic)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                                activeTab === topic 
                                ? "bg-stone-900 text-white border-stone-900" 
                                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8 flex flex-col gap-10">
                <div>
                   <h3 className="font-black text-stone-500 text-[11px] mb-6 uppercase tracking-[0.2em]">Writing Progress</h3>
                   <div className="p-6 bg-stone-900 rounded-[2rem] text-white shadow-xl">
                      <p className="font-black text-2xl mb-1">{blogs.filter(b => b.author_name === user?.username).length}</p>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Stories Published</p>
                      <button 
                        onClick={() => setShowEditor(true)}
                        className="w-full mt-6 py-3 bg-white text-stone-900 rounded-full font-black text-sm hover:bg-stone-100 transition-all shadow-md active:scale-95"
                      >
                         Write New Post
                      </button>
                   </div>
                </div>

                <footer className="pt-10 border-t border-stone-100">
                    <div className="flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-bold text-stone-400">
                        {["Your Library", "Reading List", "About", "Settings", "Privacy", "Refine Recommendations"].map(link => (
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
