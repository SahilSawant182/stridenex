"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  bgColor?: 'white' | 'slate' | 'gradient' | 'primary-gradient';
  spacing?: 'default' | 'compact' | 'wide';
}

export default function SectionWrapper({ 
  children, 
  className = "", 
  bgColor = 'white',
  spacing = 'default'
}: SectionWrapperProps) {
  
  const getBgClass = () => {
    switch(bgColor) {
      case 'slate': return 'bg-slate-50';
      case 'gradient': return 'bg-gradient-to-b from-white to-slate-50';
      case 'primary-gradient': return 'bg-gradient-to-br from-primary via-purple-600 to-accent';
      default: return 'bg-white';
    }
  };

  const getSpacingClass = () => {
    switch(spacing) {
      case 'compact': return 'py-16 px-6';
      case 'wide': return 'py-32 px-6';
      default: return 'py-24 px-6';
    }
  };

  return (
    <section className={`${getBgClass()} ${getSpacingClass()} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}