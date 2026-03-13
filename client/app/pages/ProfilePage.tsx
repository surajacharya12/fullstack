"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/blog/Navbar";
import { getProfile, updateProfile, getBlogs } from "../api/blogApi";
import BlogItem from "../components/blog/BlogItem";
import { Blog } from "../components/blog/types";

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfileData();
    window.scrollTo(0, 0);
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setProfile(profileData);
      setNewBio(profileData.profile?.bio || "");

      const userBlogs = await getBlogs();
      setBlogs(userBlogs.filter((b: Blog) => b.author_name === profileData.username));
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    try {
      setUploading(true);
      const updated = await updateProfile({ bio: newBio });
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update bio", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.append('avatar', file);

      await updateProfile(data);
      fetchProfileData();
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-stone-400">Opening your profile...</div>;

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-32">
      <Navbar
        username={user?.username}
        onWriteClick={() => navigate("/blogs")}
        onLogout={logout}
      />

      <main className="max-w-[1000px] mx-auto px-6 mt-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Profile Header Card */}
        <section className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 p-10 md:p-16 mb-16 flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full bg-stone-100 ring-4 ring-white shadow-2xl overflow-hidden flex items-center justify-center text-4xl font-black text-stone-300">
              {profile.profile?.avatar ? (
                <img src={profile.profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                profile.username[0].toUpperCase()
              )}
            </div>
            <button
              onClick={() => document.getElementById('profile-avatar-input')?.click()}
              className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm backdrop-blur-sm"
            >
              Change Picture
            </button>
            <input
              id="profile-avatar-input"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-black text-stone-900 tracking-tight" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                {profile.username}
              </h1>
              <span className="bg-stone-100 text-stone-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest h-fit">
                Author
              </span>
            </div>

            <div className="mb-8">
              {editing ? (
                <div className="flex flex-col gap-4">
                  <textarea
                    className="w-full p-6 bg-stone-50 rounded-2xl border border-stone-200 outline-none text-stone-900 font-serif leading-relaxed"
                    rows={3}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="Share a little about yourself..."
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleUpdateBio}
                      className="bg-stone-900 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-stone-800 transition-all"
                    >
                      Save Bio
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="text-stone-400 font-bold text-sm hover:text-stone-900 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group cursor-pointer" onClick={() => setEditing(true)}>
                  <p className="text-stone-600 text-lg font-serif leading-relaxed mb-4">
                    {profile.profile?.bio || "No bio yet. Click to add a story about yourself."}
                  </p>
                  <span className="text-xs font-black text-stone-300 uppercase tracking-widest group-hover:text-stone-900 transition-colors">
                    Edit Bio →
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-8 border-t border-stone-100 pt-8">
              <div>
                <p className="text-2xl font-black text-stone-900">{blogs.length}</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Published</p>
              </div>
              <div>
                <p className="text-2xl font-black text-stone-900">1.2k</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Reads</p>
              </div>
              <div>
                <p className="text-2xl font-black text-stone-900">482</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Followers</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Stories Feed */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.3em]">Your Stories</h2>
            <div className="h-[1px] flex-1 bg-stone-100"></div>
          </div>

          <div className="flex flex-col gap-8">
            {blogs.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-stone-100 shadow-sm">
                <p className="text-stone-400 font-serif italic text-xl mb-4">You haven't written any stories yet.</p>
                <button
                  onClick={() => navigate("/blogs")}
                  className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                >
                  Start your first story
                </button>
              </div>
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                  <BlogItem blog={blog} />
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
