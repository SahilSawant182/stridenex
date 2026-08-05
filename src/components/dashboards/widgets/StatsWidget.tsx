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
    trend?: "up" | "down" | string;
    [key: string]: any;
  };
  delay?: number;
}

export default function StatsWidget({ title, data, delay = 0 }: StatsWidgetProps) {
  const Icon = data.icon || TrendingUp;

  // Determine if trend is down based on trend prop or negative change
  const isTrendDown = data.trend === "down" || (data.change && data.change < 0);

  // Dynamic pastel themes based on stat titles (only color classes, no sizes)
  const getThemeColors = () => {
    const t = title.toLowerCase();
    if (t.includes("active students") || t.includes("total students")) {
      return {
        cardBg: "bg-blue-50/50 border-blue-100",
        iconBg: "bg-blue-100/60",
        iconColor: "text-blue-500",
        valColor: "text-slate-800",
        labelColor: "text-blue-600/80"
      };
    }
    if (t.includes("employability")) {
      return {
        cardBg: "bg-emerald-50/50 border-emerald-100",
        iconBg: "bg-emerald-100/60",
        iconColor: "text-emerald-500",
        valColor: "text-slate-800",
        labelColor: "text-emerald-600/80"
      };
    }
    if (t.includes("at-risk") || t.includes("risk")) {
      return {
        cardBg: "bg-rose-50/50 border-rose-100",
        iconBg: "bg-rose-100/60",
        iconColor: "text-rose-500",
        valColor: "text-slate-800",
        labelColor: "text-rose-600/80"
      };
    }
    if (t.includes("new this semester") || t.includes("recruiter") || t.includes("partners") || t.includes("package")) {
      return {
        cardBg: "bg-purple-50/50 border-purple-100",
        iconBg: "bg-purple-100/60",
        iconColor: "text-purple-500",
        valColor: "text-slate-800",
        labelColor: "text-purple-600/80"
      };
    }
    return {
      cardBg: "bg-white border-slate-200/60",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      valColor: "text-slate-800",
      labelColor: "text-slate-500"
    };
  };

  const theme = getThemeColors();

  const renderValue = () => {
    if (data.value !== undefined) {
      return (
        <p className={cn("text-2xl font-bold", theme.valColor)}>
          {data.value}
          {data.max && <span className="text-sm font-normal text-slate-400 ml-1">/{data.max}</span>}
        </p>
      );
    }

    if (data.sent !== undefined) {
      return (
        <>
          <p className={cn("text-2xl font-bold", theme.valColor)}>{data.sent} Sent</p>
          <p className="text-xs text-slate-500">{data.shortlisted} shortlisted</p>
        </>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "rounded-xl border p-5 hover:shadow-md transition-all hover:-translate-y-1",
        theme.cardBg
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={cn("text-xs font-medium mb-1 uppercase tracking-wider", theme.labelColor)}>
            {title}
          </p>
          {renderValue()}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", theme.iconBg)}>
            <Icon className={cn("w-5 h-5", theme.iconColor)} />
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