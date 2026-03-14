"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

interface CommonTabContentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function CommonTabContent({
  title,
  description = "This section is currently under construction. Stay tuned for exciting updates!",
  icon = <Wrench className="w-12 h-12 text-slate-400" />
}: CommonTabContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-3 capitalize">
        {title.replace('-', ' ')}
      </h2>
      <p className="text-slate-500 max-w-md">
        {description}
      </p>
    </motion.div>
  );
}
