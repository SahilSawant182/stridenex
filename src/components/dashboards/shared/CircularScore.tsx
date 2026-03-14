// components/dashboards/shared/CircularScore.tsx
"use client";

import { motion } from "framer-motion";

interface CircularScoreProps {
  score: number;
  label: string;
  subtitle?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function CircularScore({ score, label, subtitle, color = "text-orange-500", size = "md" }: CircularScoreProps) {
  const dimensions = {
    sm: { w: 24, h: 24, fontSize: "text-xl" },
    md: { w: 32, h: 32, fontSize: "text-3xl" },
    lg: { w: 40, h: 40, fontSize: "text-4xl" }
  };

  return (
    <div className="relative w-32 h-32 mt-4 hover:scale-105 transition-transform duration-300">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
        <motion.circle
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 * (1 - score / 100) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="50" cy="50" r="40"
          className={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="251.2"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-800">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
      </div>
      {subtitle && (
        <p className="text-[11px] font-medium text-slate-500 mt-6 group-hover:text-slate-700 transition-colors">
          {subtitle}
        </p>
      )}
    </div>
  );
}