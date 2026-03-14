// components/dashboards/shared/SummaryList.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SummaryItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

interface SummaryListProps {
  items: SummaryItem[];
  footer?: React.ReactNode;
  className?: string;
}

export function SummaryList({ items, footer, className }: SummaryListProps) {
  return (
    <div className={cn("flex-1 flex flex-col", className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
        >
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className={cn("w-5 h-5 flex items-center justify-center rounded-full text-xs", item.bgColor, item.textColor)}>
              {item.icon}
            </span>
            {item.label}
          </div>
          <span className="font-bold text-slate-800">{item.value}</span>
        </motion.div>
      ))}
      {footer && (
        <div className="mt-auto pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}