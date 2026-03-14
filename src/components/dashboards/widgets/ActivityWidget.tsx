// components/dashboard/widgets/ActivityWidget.tsx
"use client";

import { BookOpen, Code, Clock } from "lucide-react";

interface ActivityWidgetProps {
  data: any;
}

export default function ActivityWidget({ data }: ActivityWidgetProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs text-slate-600">Lessons</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{data.lessons}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-slate-600">Problems</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{data.problems}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-slate-600">Study Time</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{data.studyTime}h</span>
        </div>
      </div>
    </div>
  );
}