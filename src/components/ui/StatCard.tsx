"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  iconBgColor: string;
  value: string;
  label: string;
  delay?: number;
}

export default function StatCard({ icon, iconBgColor, value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all`}
      >
        {icon}
      </motion.div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </motion.div>
  );
}