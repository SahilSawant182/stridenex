"use client";

import { useState } from "react";
import { BookOpen, Code, Clock, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LearningActivityGraphProps {
  data: any;
}

const zeroGraphData = [
  { name: "Week 1", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 2", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 3", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 4", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 5", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 6", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 7", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 8", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 9", hours: 0, lessons: 0, problems: 0 },
  { name: "Week 10", hours: 0, lessons: 0, problems: 0 }
];

const staticDemoGraphData = [
  { name: "Week 1", hours: 2.5, lessons: 1, problems: 3 },
  { name: "Week 2", hours: 4.0, lessons: 2, problems: 5 },
  { name: "Week 3", hours: 3.5, lessons: 1, problems: 4 },
  { name: "Week 4", hours: 6.0, lessons: 3, problems: 8 },
  { name: "Week 5", hours: 8.0, lessons: 4, problems: 10 },
  { name: "Week 6", hours: 5.5, lessons: 2, problems: 7 },
  { name: "Week 7", hours: 7.0, lessons: 3, problems: 9 },
  { name: "Week 8", hours: 9.5, lessons: 5, problems: 12 },
  { name: "Week 9", hours: 8.0, lessons: 4, problems: 10 },
  { name: "Week 10", hours: 11.0, lessons: 6, problems: 15 }
];

export default function LearningActivityGraph({ data }: LearningActivityGraphProps) {
  const [activeMetric, setActiveMetric] = useState<"hours" | "lessons" | "problems">("hours");

  // Parse dynamic data with fallbacks
  const totals = data?.totals || data?.message?.totals;
  const initialLessons = totals?.lessons ?? 0;
  const initialProblems = totals?.problems ?? 0;
  const initialStudyTime = totals?.study_hours ?? 0;
  const initialStreak = data?.streak ?? data?.streak_count ?? 0;

  const isDemoMode = initialLessons === 0 && initialProblems === 0 && initialStudyTime === 0;

  const lessons = isDemoMode ? 31 : initialLessons;
  const problems = isDemoMode ? 83 : initialProblems;
  const studyTime = isDemoMode ? 65 : initialStudyTime;
  const streak = isDemoMode ? 5 : initialStreak;

  const weeksData = data?.weeks || data?.message?.weeks;
  const chartData = isDemoMode
    ? staticDemoGraphData
    : (Array.isArray(weeksData) && weeksData.length > 0
        ? weeksData.map((weekObj: any, idx: number) => {
            const weekName = weekObj.week_start ? `W${idx + 1} (${weekObj.week_start.slice(5)})` : `Week ${idx + 1}`;
            let hours = 0;
            let weekLessons = 0;
            let weekProblems = 0;
            if (weekObj.days && Array.isArray(weekObj.days)) {
              weekObj.days.forEach((day: any) => {
                hours += (day.study_minutes || 0) / 60;
                weekLessons += day.lessons || 0;
                weekProblems += day.problems || 0;
              });
            }
            return {
              name: weekName,
              hours: Number(hours.toFixed(1)),
              lessons: weekLessons,
              problems: weekProblems
            };
          })
        : zeroGraphData);

  const metricColors = {
    hours: {
      stroke: "#f97316",
      fill: "url(#colorHours)",
      bgLight: "bg-orange-50/80",
      text: "text-orange-600",
      border: "border-orange-100"
    },
    lessons: {
      stroke: "#10b981",
      fill: "url(#colorLessons)",
      bgLight: "bg-emerald-50/80",
      text: "text-emerald-600",
      border: "border-emerald-100"
    },
    problems: {
      stroke: "#eab308",
      fill: "url(#colorProblems)",
      bgLight: "bg-yellow-50/80",
      text: "text-yellow-600",
      border: "border-yellow-100"
    }
  };

  // Custom styled tooltip for clean look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-[11px] flex flex-col gap-1.5 min-w-[150px]">
          <p className="font-extrabold text-slate-400 border-b border-slate-800 pb-1 mb-1">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-orange-400 font-semibold flex items-center gap-1">⚡ Study Time:</span>
            <span className="font-bold">{dataPoint.hours}h</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">📚 Lessons:</span>
            <span className="font-bold">{dataPoint.lessons}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-yellow-400 font-semibold flex items-center gap-1">💻 Problems:</span>
            <span className="font-bold">{dataPoint.problems}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/60 rounded-2xl border border-slate-200/70 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Subtle decorative glow element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10">
        <div>
          <h3 className="text-[15px] font-bold text-slate-850 flex items-center gap-2">
            <span className="group-hover:animate-pulse">📊</span> Learning Activity Graph
          </h3>
          {isDemoMode ? (
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
              Sample course activity data (join a course to track your progress)
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Weekly progress details of study hours, lessons, and problems
            </p>
          )}
        </div>
        
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Metric selector buttons */}
          <div className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/40 shrink-0">
            {(["hours", "lessons", "problems"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeMetric === m
                    ? `${metricColors[m].bgLight} ${metricColors[m].text} shadow-sm border ${metricColors[m].border}`
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {m === "hours" ? "Hours" : m === "lessons" ? "Lessons" : "Problems"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode && (
              <span className="text-[8px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                Preview Mode
              </span>
            )}
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50 shrink-0">
              🔥 {streak} Day Streak!
            </span>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 min-h-[220px] w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={activeMetric} 
              stroke={metricColors[activeMetric].stroke} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill={metricColors[activeMetric].fill} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 z-10">
        <div 
          onClick={() => setActiveMetric("lessons")} 
          className={`text-center flex flex-col items-center justify-center group/stat cursor-pointer p-2 rounded-xl transition-all duration-200 border ${
            activeMetric === "lessons" ? "bg-emerald-50/50 border-emerald-100/80 shadow-sm" : "bg-transparent border-transparent hover:bg-slate-50"
          }`}
        >
          <div className="p-2 rounded-xl bg-emerald-50 mb-2 group-hover/stat:bg-emerald-100/80 transition-colors">
            <BookOpen className="w-4 h-4 text-emerald-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-extrabold text-slate-800">{lessons}</span>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Lessons</p>
        </div>
        
        <div 
          onClick={() => setActiveMetric("problems")} 
          className={`text-center flex flex-col items-center justify-center group/stat cursor-pointer p-2 rounded-xl transition-all duration-200 border ${
            activeMetric === "problems" ? "bg-yellow-50/50 border-yellow-100/80 shadow-sm" : "bg-transparent border-transparent hover:bg-slate-50"
          }`}
        >
          <div className="p-2 rounded-xl bg-yellow-50 mb-2 group-hover/stat:bg-yellow-100/80 transition-colors">
            <Code className="w-4 h-4 text-yellow-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-extrabold text-slate-800">{problems}</span>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Problems</p>
        </div>
        
        <div 
          onClick={() => setActiveMetric("hours")} 
          className={`text-center flex flex-col items-center justify-center group/stat cursor-pointer p-2 rounded-xl transition-all duration-200 border ${
            activeMetric === "hours" ? "bg-orange-50/50 border-orange-100/80 shadow-sm" : "bg-transparent border-transparent hover:bg-slate-50"
          }`}
        >
          <div className="p-2 rounded-xl bg-orange-50 mb-2 group-hover/stat:bg-orange-100/80 transition-colors">
            <Clock className="w-4 h-4 text-orange-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-extrabold text-slate-800">{studyTime}h</span>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Time (h)</p>
        </div>
      </div>
    </div>
  );
}
