// components/dashboards/shared/CardHeader.tsx
"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CardHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  border?: boolean;
}

export function CardHeader({ 
  title, 
  icon, 
  action, 
  className,
  border = true 
}: CardHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between",
      border && "pb-4 border-b border-slate-100",
      className
    )}>
      <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {action.label}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}