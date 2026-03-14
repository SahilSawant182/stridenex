// components/dashboards/shared/StatsCard.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StatsCard({ title, value, icon, children, className, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm",
        className
      )}
    >
      <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
      {value && <p className="text-3xl font-bold text-slate-800">{value}</p>}
      {children}
    </motion.div>
  );
}