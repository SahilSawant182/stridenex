"use client";

import { ReactNode, ElementType } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

interface ComparisonItem {
  icon?: ElementType; // Change from ReactNode to ElementType
  text: string;
}

interface ComparisonCardProps {
  type: 'conventional' | 'skillbridge';
  title: string;
  items: ComparisonItem[];
  delay?: number;
}

export default function ComparisonCard({ type, title, items, delay = 0 }: ComparisonCardProps) {
  const isConventional = type === 'conventional';

  return (
    <motion.div
      initial={{ opacity: 0, x: isConventional ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`bg-white p-8 rounded-2xl shadow-lg ${isConventional ? 'border border-red-100' : 'border border-primary/10 relative overflow-hidden'}`}
    >
      {!isConventional && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -mr-16 -mt-16"></div>
      )}
      
      <div className="flex items-center gap-3 mb-6 relative">
        <div className={`w-10 h-10 rounded-full ${isConventional ? 'bg-red-100' : 'bg-gradient-to-r from-primary to-accent'} flex items-center justify-center`}>
          {isConventional ? <X className="w-5 h-5 text-red-500" /> : <Check className="w-5 h-5 text-white" />}
        </div>
        <h3 className={`text-xl font-bold ${isConventional ? 'text-slate-900' : 'text-gradient-mixed'}`}>
          {title}
        </h3>
      </div>

      <div className="space-y-4 relative">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isConventional ? 'bg-red-50' : 'bg-gradient-to-r from-primary/5 to-accent/5'
              }`}
            >
              {IconComponent ? (
                <IconComponent className={`w-4 h-4 ${isConventional ? 'text-red-500' : 'text-primary'} shrink-0`} />
              ) : (
                isConventional ? (
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )
              )}
              <span className={`text-sm ${isConventional ? 'text-slate-700' : 'text-slate-700 font-medium'}`}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}