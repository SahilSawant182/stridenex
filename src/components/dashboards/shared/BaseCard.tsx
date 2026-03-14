// components/dashboards/shared/BaseCard.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingStyles = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6"
};

export function BaseCard({ 
  children, 
  className, 
  hoverEffect = true,
  padding = "md",
  onClick 
}: BaseCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4 } : {}}
      className={cn(
        "bg-white rounded-xl border border-slate-200/60 shadow-sm transition-all",
        hoverEffect && "hover:shadow-md",
        paddingStyles[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}