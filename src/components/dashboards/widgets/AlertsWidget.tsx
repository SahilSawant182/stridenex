// components/dashboard/widgets/AlertsWidget.tsx
"use client";

import { AlertTriangle, CheckSquare, Flame, GraduationCap, Phone, PenTool } from "lucide-react";

interface AlertsWidgetProps {
  data: any;
}

const getAlertStyles = (type: string) => {
  switch (type) {
    case "warning":
      return {
        bg: "bg-orange-50",
        border: "border-orange-100",
        iconText: "text-amber-600",
        titleText: "text-slate-800",
        descText: "text-slate-500",
        icon: AlertTriangle
      };
    case "success":
      return {
        bg: "bg-emerald-100/50",
        border: "border-emerald-200",
        iconText: "text-emerald-600",
        titleText: "text-slate-800",
        descText: "text-slate-500",
        icon: CheckSquare
      };
    case "danger":
      return {
        bg: "bg-red-50",
        border: "border-red-100",
        iconText: "text-red-500",
        titleText: "text-slate-800",
        descText: "text-red-400/80",
        icon: Flame
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-100",
        iconText: "text-slate-400",
        titleText: "text-slate-800",
        descText: "text-slate-500",
        icon: AlertTriangle
      };
  }
};

const bottomIcons: Record<string, any> = {
  education: GraduationCap,
  call: Phone,
  write: PenTool
};

export default function AlertsWidget({ data }: AlertsWidgetProps) {
  // Extract block alerts and simple agenda items if provided, or fallback
  const blockAlerts = data?.blocks !== undefined ? data.blocks : [
    { type: "warning", message: "Razorpay deadline in 3 days", detail: "Your match: 76% — apply now" },
    { type: "success", message: "Shortlisted at TCS iON!", detail: "Interview: Feb 28, 3:00 PM" },
    { type: "danger", message: "Habit Risk: LinkedIn", detail: "2 consecutive misses — streak at risk!" }
  ];

  const agendaItems = data?.agenda || [
    { icon: "education", text: "ML Module Ch.2 — due Feb 25" },
    { icon: "call", text: "Mentor: Kavya Reddy — Feb 27 4PM" },
    { icon: "write", text: "AI Assessment: ML — Feb 28" }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-[15px] font-bold text-slate-800 mb-5 flex items-center gap-2">
        <span>⚡</span> Alerts
      </h3>
      
      <div className="space-y-3 mb-6">
        {blockAlerts.length > 0 ? (
          blockAlerts.map((alert: any, i: number) => {
            const styles = getAlertStyles(alert.type);
            const Icon = styles.icon;
            return (
              <div key={i} className={`${styles.bg} border ${styles.border} rounded-lg p-3.5 flex items-start gap-3`}>
                <Icon className={`w-[18px] h-[18px] ${styles.iconText} shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-[13px] font-bold ${styles.titleText}`}>{alert.message}</p>
                  <p className={`text-[12px] font-medium leading-relaxed ${styles.descText}`}>{alert.detail}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <span className="text-slate-400 text-[13px] font-semibold">No new opportunity alerts today</span>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 flex-1">
        {agendaItems.map((item: any, i: number) => {
          const Icon = bottomIcons[item.icon] || GraduationCap;
          return (
            <div key={i} className="flex items-center gap-3">
              <Icon className="w-[15px] h-[15px] text-slate-600 shrink-0" />
              <p className="text-[13px] font-medium text-slate-700">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}