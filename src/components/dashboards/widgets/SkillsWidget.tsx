// components/dashboard/widgets/SkillsWidget.tsx
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface SkillsWidgetProps {
  data: any;
}

export default function SkillsWidget({ data }: SkillsWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const skills = Array.isArray(data) ? data : [];
  const mainSkills = expanded ? skills : skills.slice(0, 6);

  if (skills.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/60 p-6 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">Skill Snapshot</h3>
        <div className="text-center py-4 text-xs text-slate-500">
          No skills data available
        </div>
      </div>
    );
  }

  // Predefined matching colors from the image
  const getSkillColor = (index: number) => {
    const colors = [
      "bg-orange-500", // Python
      "bg-blue-600",   // Machine Learning
      "bg-emerald-500", // SQL
      "bg-amber-500",  // Data Viz
      "bg-purple-500", // Communication
      "bg-teal-500",   // Problem Solving
    ];
    return colors[index % colors.length];
  };

  const getSkillTextColor = (index: number) => {
    const textColors = [
      "text-orange-500", 
      "text-blue-600",   
      "text-emerald-500", 
      "text-amber-500",  
      "text-purple-500", 
      "text-teal-500",   
    ];
    return textColors[index % textColors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-[15px] font-bold text-slate-900">Skill Snapshot</h3>
        <button className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
          Full Ledger <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      <div className="space-y-[18px] flex-1">
        {mainSkills.map((skill: any, index: number) => {
          return (
            <div key={skill.name || index}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-bold text-slate-800">{skill.name || 'Unknown'}</span>
                <span className={`text-[13px] font-semibold ${getSkillTextColor(index)}`}>{skill.percentage || 0}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
                <div 
                  className={`h-full ${getSkillColor(index)} rounded-full`}
                  style={{ width: `${skill.percentage || 0}%` }}
                />
              </div>
            </div>
          );
        })}

        {skills.length > 6 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-full gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors mt-6"
          >
            <span>{expanded ? "Show less" : "View all skills"}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}