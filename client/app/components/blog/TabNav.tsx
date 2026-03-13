"use client";

import React from "react";
import { TOPICS } from "./constants";

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNav = ({ activeTab, onTabChange }: TabNavProps) => {
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

export default TabNav;
