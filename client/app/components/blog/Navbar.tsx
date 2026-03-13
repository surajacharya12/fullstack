"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  username?: string;
  onWriteClick: () => void;
  onLogout: () => void;
  onAvatarUpload?: (file: File) => void;
}

const Navbar = ({ username, onWriteClick, onLogout, onAvatarUpload }: NavbarProps) => {
  const navigate = useNavigate();
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="flex justify-between items-center px-8 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="flex items-center gap-6">
        <div 
          className="text-stone-900 font-black text-3xl cursor-pointer tracking-tighter" 
          onClick={() => navigate(username ? "/blogs" : "/")}
          style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
          Stanza
        </div>
        <div className="hidden md:flex items-center bg-stone-50 px-5 py-2.5 rounded-full gap-3 border border-stone-100 focus-within:ring-2 focus-within:ring-stone-200 transition-all">
          <span className="text-stone-400">🔍</span>
          <input type="text" placeholder="Search stories..." className="bg-transparent outline-none text-[13px] w-64 font-medium text-stone-900 placeholder:text-stone-300" />
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {username ? (
          <>
            <button 
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-all text-sm font-bold uppercase tracking-wider" 
              onClick={onWriteClick}
            >
              ✍️ <span className="hidden sm:inline">Write</span>
            </button>
            <div className="flex items-center gap-5">
               <div 
                 onClick={() => navigate("/profile")}
                 className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-sm font-black ring-2 ring-stone-200 uppercase cursor-pointer hover:ring-stone-900 transition-all shadow-sm overflow-hidden"
               >
                 {username[0]}
               </div>
               <input 
                 type="file" 
                 ref={avatarInputRef} 
                 hidden 
                 accept="image/*" 
                 onChange={e => {
                   const file = e.target.files?.[0];
                   if (file && onAvatarUpload) onAvatarUpload(file);
                 }}
               />
               <button onClick={onLogout} className="text-stone-400 hover:text-red-600 text-[11px] font-black uppercase tracking-widest transition-colors">
                 Logout
               </button>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-all text-sm font-bold uppercase tracking-widest"
            >
              ✍️ <span className="hidden sm:inline">Write</span>
            </button>
            <button onClick={() => navigate("/login")} className="text-stone-900 font-black text-sm hover:underline underline-offset-4 transition-all tracking-tight">Sign in</button>
            <button onClick={() => navigate("/signup")} className="bg-stone-900 text-white px-7 py-3 rounded-full text-sm font-black hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 active:scale-95">Get started</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
