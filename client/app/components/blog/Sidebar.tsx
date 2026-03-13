"use client";

import React from "react";
import { TOPICS } from "./constants";

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

export default Sidebar;
