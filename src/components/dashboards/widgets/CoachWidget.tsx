// components/dashboard/widgets/CoachWidget.tsx
"use client";

import { Bot, MessageCircle } from "lucide-react";

interface CoachWidgetProps {
  data: any;
}

export default function CoachWidget({ data }: CoachWidgetProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-900">AI Coach</span>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-4 mb-4 relative shadow-lg">
          <p className="text-sm font-medium leading-relaxed">
            {data.message}
          </p>
        </div>

        <div className="mb-4 text-sm">
          <span className="font-semibold text-slate-900">Today: </span>
          <span className="text-slate-600">{data.task}</span>
        </div>
      </div>

      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
        <MessageCircle className="w-4 h-4" />
        Open AI Coach
      </button>
    </div>
  );
}