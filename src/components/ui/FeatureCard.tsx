"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon?: ReactNode;
  iconBgColor?: string;
  title: string;
  description?: string;
  badge?: string;
  badgePosition?: 'top-right' | 'top-left';
  features?: string[];
  featureIconColor?: string;
  cta?: {
    text: string;
    href: string;
  };
  className?: string;
  children?: ReactNode;
  hoverEffect?: 'glow' | 'lift' | 'none';
  onClick?: () => void;
}

export default function FeatureCard({
  icon,
  iconBgColor = "from-primary to-purple-600",
  title,
  description,
  badge,
  badgePosition = 'top-right',
  features,
  featureIconColor = "primary",
  cta,
  className = "",
  children,
  hoverEffect = 'lift',
  onClick
}: FeatureCardProps) {

  const getBadgePositionClass = () => {
    switch(badgePosition) {
      case 'top-left': return 'top-4 left-4';
      default: return 'top-4 right-4';
    }
  };

  const getHoverClass = () => {
    switch(hoverEffect) {
      case 'glow': return 'hover:shadow-2xl';
      case 'lift': return 'hover:-translate-y-2';
      default: return '';
    }
  };

  return (
    <motion.div
      whileHover={hoverEffect === 'lift' ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/5 h-full relative ${getHoverClass()} ${className}`}
      onClick={onClick}
    >
      {badge && (
        <div className={`absolute ${getBadgePositionClass()} z-20`}>
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
            {badge}
          </span>
        </div>
      )}

      {icon && (
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${iconBgColor} flex items-center justify-center mb-6 shadow-lg`}>
          {icon}
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        {description && <p className="text-slate-600 mb-4">{description}</p>}

        {features && features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <div className={`w-1.5 h-1.5 rounded-full bg-${featureIconColor}`} />
                <span className="text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {children}

        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 text-accent font-bold group/link mt-4"
          >
            <span className="text-sm text-accent group-hover:text-orange-600 transition-colors">
              {cta.text}
            </span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}