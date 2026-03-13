"use client";

import React, { useState, useEffect } from "react";
import { getBlogs, createBlog } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";

// Components
import Navbar from "../components/blog/Navbar";
import TabNav from "../components/blog/TabNav";
import BlogItem from "../components/blog/BlogItem";
import BlogEditor from "../components/blog/BlogEditor";
import Sidebar from "../components/blog/Sidebar";

// Types/Constants
import { Blog } from "../components/blog/types";

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
                <p className="text-gray-400 font-serif italic text-xl">No stories found in this topic yet.</p>
              </div>
            )}
          </div>
        </div>

        <Sidebar />
      </main>
    </div>
  );
}
