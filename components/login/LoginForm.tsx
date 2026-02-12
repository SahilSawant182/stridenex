"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchBackgroundImage } from "@/services/api.services";
import DynamicForm from "../dynamic/DynamicForm";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchBackgroundImage()
      .then((path) => {
        const fullUrl = `${BASE_URL}${path}`;
        setBgImage(fullUrl);
      })
      .catch(console.error);
  }, []);

  const handleLogin = (data: {
    username: string;
    password: string;
  }) => {
    console.log("Login Data:", data);
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Image */}
      {bgImage && (
        <img
          src={bgImage}
          alt="Background"
          loading="lazy"
          onLoad={() => setBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            bgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/40 to-black/70" />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl 
        bg-white/10 backdrop-blur-2xl 
        border border-white/20 
        shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
        text-white transition-all duration-500">

        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Welcome Back
        </h1>

        <p className="text-center text-white/70 mb-8 text-sm">
          Sign in to continue
        </p>

        <DynamicForm
          onSubmit={handleLogin}
          buttonLabel="Sign In"
        />
      </div>
    </div>
  );
}