"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  bgColor?: 'white' | 'slate' | 'gradient' | 'primary-gradient' | 'hero-image';
  spacing?: 'default' | 'compact' | 'wide' | 'none';
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
      case 'hero-image': return 'bg-slate-50 relative overflow-hidden';
      default: return 'bg-white';
    }
  };

  const getSpacingClass = () => {
    switch(spacing) {
      case 'compact': return 'py-16 px-6';
      case 'wide': return 'py-32 px-6';
      case 'none': return '';
      default: return 'py-24 px-6';
    }
  };

  return (
    <section className={`${getBgClass()} ${getSpacingClass()} ${className}`}>
      {bgColor === 'hero-image' && (
        <div 
            className="absolute inset-0 z-0"
            style={{
                backgroundImage: `url('/images/hero-for-all.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>
      )}
      <div className={`max-w-7xl mx-auto ${bgColor === 'hero-image' ? 'relative z-10' : ''}`}>
        {children}
      </div>
    </section>
  );
}