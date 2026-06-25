"use client";

import { BookOpen, Code, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LearningActivityGraphProps {
  data: any;
}

const mockGraphData = [
  { name: "Week 1", hours: 4, lessons: 1, problems: 2 },
  { name: "Week 2", hours: 8, lessons: 2, problems: 5 },
  { name: "Week 3", hours: 12, lessons: 4, problems: 10 },
  { name: "Week 4", hours: 10, lessons: 3, problems: 7 },
  { name: "Week 5", hours: 16, lessons: 5, problems: 15 },
  { name: "Week 6", hours: 14, lessons: 4, problems: 12 },
  { name: "Week 7", hours: 22, lessons: 6, problems: 18 },
  { name: "Week 8", hours: 18, lessons: 5, problems: 14 },
  { name: "Week 9", hours: 26, lessons: 8, problems: 22 },
  { name: "Week 10", hours: 20, lessons: 6, problems: 16 },
  { name: "Week 11", hours: 30, lessons: 9, problems: 28 },
  { name: "Week 12", hours: 28, lessons: 8, problems: 24 }
];

export default function LearningActivityGraph({ data }: LearningActivityGraphProps) {
  // Custom styled tooltip for clean look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-800 text-xs">
          <p className="font-bold mb-1.5">{label}</p>
          <p className="text-orange-400 font-semibold">⚡ Study Time: {payload[0].value} hours</p>
          <p className="text-emerald-400">📚 Lessons: {payload[0].payload.lessons}</p>
          <p className="text-yellow-400">💻 Problems: {payload[0].payload.problems}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <span className="group-hover:animate-bounce">📊</span> Learning Activity Graph
        </h3>
        <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50">
          🔥 12 Day Streak!
        </span>
      </div>

      {/* Graph Area */}
      <div className="flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockGraphData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
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
              dataKey="hours" 
              stroke="#f97316" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorHours)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-emerald-50 mb-3 group-hover/stat:bg-emerald-100 transition-colors">
            <BookOpen className="w-5 h-5 text-emerald-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data?.lessons || 42}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Lessons</p>
        </div>
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-yellow-50 mb-3 group-hover/stat:bg-yellow-100 transition-colors">
            <Code className="w-5 h-5 text-yellow-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data?.problems || 87}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Problems</p>
        </div>
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-blue-50 mb-3 group-hover/stat:bg-blue-100 transition-colors">
            <Clock className="w-5 h-5 text-blue-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data?.studyTime || 68}h</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Time (h)</p>
        </div>
      </div>
    </div>
  );
}
