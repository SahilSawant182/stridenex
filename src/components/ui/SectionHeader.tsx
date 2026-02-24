"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  badgeColor?: 'primary' | 'accent' | 'white';
  title: string | ReactNode;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  titleClassName?: string;
}

export default function SectionHeader({ 
  badge, 
  badgeColor = 'primary',
  title, 
  subtitle, 
  alignment = 'center',
  titleClassName = ""
}: SectionHeaderProps) {
  
  const getBadgeColorClass = () => {
    switch(badgeColor) {
      case 'accent': return 'text-accent bg-accent/10';
      case 'white': return 'text-white bg-white/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getAlignmentClass = () => {
    switch(alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`${getAlignmentClass()} mb-12 md:mb-16`}
    >
      {badge && (
        <span className={`inline-block font-bold text-sm uppercase tracking-[0.3em] ${getBadgeColorClass()} px-4 py-2 rounded-full mb-4`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 ${titleClassName}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}