"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  username?: string;
  onWriteClick: () => void;
  onLogout: () => void;
}

const Navbar = ({ username, onWriteClick, onLogout }: NavbarProps) => {
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

export default Navbar;
