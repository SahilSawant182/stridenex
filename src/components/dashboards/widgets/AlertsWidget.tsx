// components/dashboard/widgets/AlertsWidget.tsx
"use client";

import { Flame, Clock, Sparkles, Briefcase, Calendar, ChevronRight } from "lucide-react";

interface AlertsWidgetProps {
  data?: {
    newPostings?: any[];
    deadlineAlerts?: any[];
  };
}

export default function AlertsWidget({ data }: AlertsWidgetProps) {
  // Use data or fall back to empty array
  const newPostings = data?.newPostings || [];
  const deadlineAlerts = data?.deadlineAlerts || [];

  const hasAnyAlerts = newPostings.length > 0 || deadlineAlerts.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <span className="text-amber-500">⚡</span> Opportunity Alerts
        </h3>
        {hasAnyAlerts && (
          <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
            {newPostings.length + deadlineAlerts.length} Active
          </span>
        )}
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-start">
        {!hasAnyAlerts ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[220px]">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <span className="text-slate-700 text-sm font-bold">All caught up!</span>
            <span className="text-slate-400 text-xs text-center mt-1">No new opportunity alerts or deadlines today.</span>
          </div>
        ) : (
          <>
            {/* 1. URGENT DEADLINES SECTION */}
            {deadlineAlerts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 tracking-wide uppercase">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Urgent Deadlines</span>
                </div>
                <div className="space-y-2">
                  {deadlineAlerts.slice(0, 3).map((alert: any, idx: number) => {
                    const isToday = alert.days_left === 0;
                    return (
                      <div
                        key={idx}
                        className={`group border rounded-xl p-3 flex items-start gap-3 transition-colors ${
                          isToday
                            ? "bg-red-50/60 border-red-100 hover:bg-red-50"
                            : "bg-amber-50/40 border-amber-100/60 hover:bg-amber-50/70"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isToday ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-bold text-slate-800 truncate">{alert.title || alert.name}</p>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                                isToday ? "bg-red-200 text-red-700 animate-pulse" : "bg-amber-200 text-amber-800"
                              }`}
                            >
                              {isToday ? "Today" : `${alert.days_left}d left`}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                            {alert.type} • Deadline: {alert.deadline}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. NEW OPPORTUNITIES SECTION */}
            {newPostings.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Opportunities</span>
                </div>
                <div className="space-y-2">
                  {newPostings.slice(0, 3).map((posting: any, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="group border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-3 flex items-start gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-bold text-slate-800 truncate">{posting.title || posting.name}</p>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">
                              {posting.date}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                            {posting.type}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}