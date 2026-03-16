// components/dashboards/shared/ProgressCard.tsx
"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressItem {
    label: string;
    value: number;
    percentage?: number;
    color?: string;
    subtitle?: string;
    icon?: any;
    progressColor?: string; // Added for custom progress bar color
    textColor?: string; // Added for custom text color
}

interface ProgressCardProps {
    title: string;
    items: ProgressItem[];
    variant?: "default" | "detailed";
    className?: string;
}

// Default color maps as fallback
const colorMap = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    slate: "bg-slate-500"
};

const textColorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
    red: "text-red-600",
    slate: "text-slate-800"
};

export default function ProgressCard({ title, items, variant = "default", className }: ProgressCardProps) {
    return (
        <div className={cn("bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm", className)}>
            <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => {
                    // Determine progress bar color - use custom if provided, otherwise fallback to color map
                    const progressBarColor = item.progressColor || colorMap[item.color as keyof typeof colorMap] || "bg-emerald-500";
                    
                    // Determine text color - use custom if provided, otherwise fallback to text color map
                    const textColorClass = item.textColor || textColorMap[item.color as keyof typeof textColorMap] || "text-slate-800";
                    
                    return (
                        <div key={item.label}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-600">{item.label}</span>
                                <span className={cn("text-xs font-semibold", textColorClass)}>
                                    {item.subtitle || item.value}
                                </span>
                            </div>
                            <Progress
                                value={item.percentage || item.value}
                                className={cn("h-1.5 bg-slate-100", progressBarColor)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}