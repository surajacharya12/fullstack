"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogs, toggleLike, addComment, toggleFollow } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/blog/Navbar";
import { Blog } from "../components/blog/types";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      const found = data.find((b: any) => b.id === parseInt(id || "0"));
      setBlog(found || null);
    } catch (err) {
      console.error("Failed to fetch blog", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
        navigate("/login");
        return;
    }
    try {
        const res = await toggleLike(blog?.id!);
        setBlog(prev => prev ? { 
            ...prev, 
            is_liked: res.is_liked, 
            likes_count: res.is_liked ? (prev.likes_count || 0) + 1 : (prev.likes_count || 1) - 1 
        } : null);
    } catch (err) {
        console.error("Failed to like", err);
    }
  };

  const handleFollow = async () => {
    if (!user) {
        navigate("/login");
        return;
    }
    try {
        const res = await toggleFollow(blog?.author_name!);
        setBlog(prev => prev ? { ...prev, is_following: res.is_following } : null);
    } catch (err) {
        console.error("Failed to follow", err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigate("/login");
        return;
    }
    if (!commentText.trim()) return;

    try {
        setIsSubmitting(true);
        await addComment(blog?.id!, commentText);
        setCommentText("");
        fetchBlog(); // Refresh to show new comment
    } catch (err) {
        console.error("Failed to comment", err);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-stone-400">Pouring your story...</div>;
  if (!blog) return <div className="h-screen flex items-center justify-center font-serif text-stone-900">Story not found.</div>;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Navbar username={user?.username} onWriteClick={() => navigate("/blogs")} onLogout={logout} />

      <main className="max-w-[720px] mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Author Header */}
        <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 ring-4 ring-white shadow-lg overflow-hidden flex items-center justify-center text-xl font-black">
                    {blog.author_avatar ? <img src={blog.author_avatar} className="w-full h-full object-cover" /> : blog.author_name[0]}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <p className="font-black text-stone-900 text-lg uppercase tracking-tight">{blog.author_name}</p>
                      {user?.username !== blog.author_name && (
                        <button 
                            onClick={handleFollow}
                            className={`text-xs font-black uppercase tracking-widest transition-colors ${blog.is_following ? 'text-stone-400' : 'text-stone-900 hover:text-stone-600'}`}
                        >
                            {blog.is_following ? "Following" : "Follow"}
                        </button>
                      )}
                   </div>
                   <p className="text-stone-400 text-xs font-bold tracking-widest uppercase">
                      5 min read <span className="mx-2">·</span> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </p>
                </div>
            </div>
            <div className="flex gap-4">
                {["Share", "Save"].map(btn => (
                   <button key={btn} className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
                      <span className="sr-only">{btn}</span>
                      <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                   </button>
                ))}
            </div>
        </header>

        {/* Content */}
        <article>
            <h1 className="text-5xl md:text-6xl font-black text-stone-900 mb-8 tracking-tighter leading-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                {blog.title}
            </h1>
            
            {blog.image && (
                <div className="mb-12 rounded-4xl overflow-hidden shadow-2xl scale-[1.02]">
                    <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            <div className="prose prose-stone max-w-none">
                <p className="text-xl text-stone-800 leading-[1.8] font-serif whitespace-pre-wrap first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-stone-900 first-letter:mt-1">
                    {blog.content}
                </p>
            </div>
        </article>

        {/* Support Section */}
        <section className="mt-24 py-12 border-y border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${blog.is_liked ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 hover:bg-stone-50 border border-stone-100'}`}
                >
                    {blog.is_liked ? "❤️ Supported" : "🤍 Support Author"}
                    <span className="ml-1 opacity-60">{blog.likes_count || 0}</span>
                </button>
            </div>
            <div className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Your support fuels great stories
            </div>
        </section>

        {/* Comments Section */}
        <section className="mt-24">
            <h3 className="text-lg font-black text-stone-900 mb-10 uppercase tracking-widest flex items-center gap-4">
                Discussion <span className="text-stone-300 font-serif lowercase italic text-xl">({blog.comments?.length || 0})</span>
            </h3>

            {user ? (
                <form onSubmit={handleComment} className="mb-16 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50">
                    <textarea 
                        className="w-full bg-stone-50/50 rounded-2xl p-6 text-stone-900 font-serif leading-relaxed italic border border-stone-100 outline-none focus:bg-white transition-all"
                        placeholder="What are your thoughts on this story?"
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <button 
                            disabled={isSubmitting}
                            className="bg-stone-900 text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-stone-900/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? "Sending..." : "Respond"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-16 p-8 bg-stone-50 rounded-[2.5rem] text-center border border-dashed border-stone-200">
                    <p className="font-serif italic text-stone-400 mb-4 text-lg">Sign in to join the conversation.</p>
                    <button onClick={() => navigate("/login")} className="text-stone-900 font-black text-xs uppercase tracking-widest border-b-2 border-stone-900 pb-1">Sign In →</button>
                </div>
            )}

            <div className="space-y-12">
                {blog.comments?.map((comment: any) => (
                    <div key={comment.id} className="animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden flex items-center justify-center text-[10px] font-black ring-2 ring-white shadow-sm">
                                {comment.author_avatar ? <img src={comment.author_avatar} className="w-full h-full object-cover" /> : comment.author_name[0]}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-black text-stone-900 uppercase tracking-tight">{comment.author_name}</p>
                                <p className="text-[10px] font-bold text-stone-400 tracking-wider">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-stone-700 font-serif leading-[1.7] italic pl-11 text-lg">
                            "{comment.text}"
                        </p>
                    </div>
                ))}

                {(!blog.comments || blog.comments.length === 0) && (
                    <div className="text-center py-12 border-t border-stone-50 mt-12">
                        <p className="font-serif italic text-stone-300">No one has responded to this story yet. Be the first!</p>
                    </div>
                )}
            </div>
        </section>

        {/* Footer Navigation */}
        <footer className="mt-32 pt-16 border-t border-stone-100 flex flex-col items-center">
            <h4 className="font-serif italic text-stone-400 text-2xl mb-8">Thanks for reading.</h4>
            <button 
                onClick={() => navigate("/blogs")}
                className="bg-stone-50 text-stone-900 px-10 py-3 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-stone-900 hover:text-white transition-all shadow-md active:scale-95"
            >
                Back to Stories
            </button>
        </footer>
      </main>
    </div>
  );
}
