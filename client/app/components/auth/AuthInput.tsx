"use client";

import React from "react";

interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const AuthInput = ({ label, type, value, onChange, placeholder, className = "focus:ring-indigo-500" }: AuthInputProps) => (
  <div className="mb-4">
    <label className="block mb-1.5 text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 shadow-sm ${className}`}
    />
  </div>
);

export default AuthInput;
