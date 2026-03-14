// components/dashboards/widgets/StatsWidget.tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsWidgetProps {
  title: string;
  data: {
    value?: string | number;
    max?: number;
    change?: number;
    changeLabel?: string;
    sent?: number;
    shortlisted?: number;
    icon?: any;
    iconBg?: string;
    iconColor?: string;
    trend?: "up" | "down" | string;  // This is optional
    [key: string]: any;
  };
  delay?: number;
}

export default function StatsWidget({ title, data, delay = 0 }: StatsWidgetProps) {
  const Icon = data.icon || TrendingUp;

  const renderValue = () => {
    if (data.value !== undefined) {
      return (
        <p className="text-2xl font-bold text-slate-800">
          {data.value}
          {data.max && <span className="text-sm font-normal text-slate-400 ml-1">/{data.max}</span>}
        </p>
      );
    }

    if (data.sent !== undefined) {
      return (
        <>
          <p className="text-2xl font-bold text-slate-800">{data.sent} Sent</p>
          <p className="text-xs text-slate-500">{data.shortlisted} shortlisted</p>
        </>
      );
    }

    return null;
  };

  // Determine if trend is down based on trend prop or negative change
  const isTrendDown = data.trend === "down" || (data.change && data.change < 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition-all hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{title}</p>
          {renderValue()}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", data.iconBg || 'bg-slate-100')}>
            <Icon className={cn("w-5 h-5", data.iconColor || 'text-slate-600')} />
          </div>
        )}
      </div>

      {data.change !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          {isTrendDown ? (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-600 font-medium">
                {typeof data.change === 'number' && data.change < 0 ? data.change : `-${data.change}`}
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">
                +{Math.abs(data.change)}
              </span>
            </>
          )}
          <span className="text-slate-400 ml-1">{data.changeLabel}</span>
        </div>
      )}
    </motion.div>
  );
}