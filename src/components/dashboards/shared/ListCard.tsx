// components/dashboards/shared/ListCard.tsx
"use client";

import { cn } from "@/lib/utils";

interface ListItem {
    id: number;
    icon?: any;
    iconColor?: string;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
}

interface ListCardProps {
    title: string;
    items: ListItem[];
    variant?: "default" | "alerts";
    className?: string;
}

const iconColorMap = {
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600"
};

export default function ListCard({ title, items, variant = "default", className }: ListCardProps) {
    return (
        <div className={cn("bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm", className)}>
            <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        {item.icon && (
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                iconColorMap[item.iconColor as keyof typeof iconColorMap] || "bg-slate-100 text-slate-600"
                            )}>
                                <item.icon className="w-4 h-4" />
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{item.title}</p>
                            {item.subtitle && (
                                <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}