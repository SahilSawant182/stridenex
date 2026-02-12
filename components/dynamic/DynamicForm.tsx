"use client";

import { useState } from "react";

interface Props {
  onSubmit: (data: { username: string; password: string }) => void;
  buttonLabel?: string;
}

export default function DynamicForm({
  onSubmit,
  buttonLabel = "Sign In",
}: Props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-5"
    >
      {/* Username */}
      <div>
        <label className="block mb-2 text-sm text-white/80 font-medium">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className="w-full px-4 py-3 rounded-xl 
          bg-white/20 border border-white/30 
          text-white placeholder-white/60 
          outline-none focus:ring-2 focus:ring-blue-400 
          focus:border-blue-400 transition duration-300"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2 text-sm text-white/80 font-medium">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="w-full px-4 py-3 rounded-xl 
          bg-white/20 border border-white/30 
          text-white placeholder-white/60 
          outline-none focus:ring-2 focus:ring-blue-400 
          focus:border-blue-400 transition duration-300"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold 
        bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
        hover:from-purple-600 hover:to-blue-500
        transition-all duration-300 
        shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      >
        {buttonLabel}
      </button>
    </form>
  );
}