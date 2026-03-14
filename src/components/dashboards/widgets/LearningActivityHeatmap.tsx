"use client";

import { BookOpen, Code, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface LearningActivityHeatmapProps {
  data: any;
}

export default function LearningActivityHeatmap({ data }: LearningActivityHeatmapProps) {
  // Generate slightly longer horizontal blocks to match the design
  const weeks = 22;
  const days = 5;
  const heatmapData = Array.from({ length: days }).map(() => 
    Array.from({ length: weeks }).map(() => Math.floor(Math.random() * 5))
  );

  const getColor = (value: number) => {
    switch(value) {
      case 0: return "bg-orange-50/50 border border-orange-100/50";
      case 1: return "bg-orange-200 border border-orange-300";
      case 2: return "bg-orange-300 border border-orange-400";
      case 3: return "bg-orange-400 border border-orange-500 text-white";
      case 4: return "bg-orange-500 border border-orange-600 text-white";
      default: return "bg-orange-50/50 border border-orange-100/50";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <span className="group-hover:animate-bounce">📅</span> Learning Activity
        </h3>
        <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50">
          🔥 12 Day Streak!
        </span>
      </div>
      
      <div className="flex-1 min-h-[160px] overflow-x-auto hide-scrollbar pb-2">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-[4px] min-w-max"
        >
          {heatmapData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[4px]">
              {row.map((val, colIndex) => (
                <motion.div 
                  key={colIndex}
                  variants={item}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  className={`relative w-9 h-[16px] rounded-[4px] ${getColor(val)} cursor-pointer transition-colors duration-200`}
                  title={`Activity level: ${val === 0 ? 'None' : val * 2 + ' hrs'}`}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-2 max-w-full">
         <div className="text-[11px] font-medium text-slate-400 hidden sm:block">Past 5 Months</div>
         <div className="flex justify-end items-center gap-[4px] text-[10px] text-slate-400 font-medium ml-auto">
          <span className="mr-1">Less</span>
          <div className="w-5 h-[10px] rounded-[2px] bg-orange-50/50 border border-orange-100/50" />
          <div className="w-5 h-[10px] rounded-[2px] bg-orange-200 border border-orange-300" />
          <div className="w-5 h-[10px] rounded-[2px] bg-orange-300 border border-orange-400" />
          <div className="w-5 h-[10px] rounded-[2px] bg-orange-400 border border-orange-500" />
          <div className="w-5 h-[10px] rounded-[2px] bg-orange-500 border border-orange-600" />
          <span className="ml-1">More</span>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-emerald-50 mb-3 group-hover/stat:bg-emerald-100 transition-colors">
            <BookOpen className="w-5 h-5 text-emerald-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data.lessons || 42}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Lessons</p>
        </div>
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-yellow-50 mb-3 group-hover/stat:bg-yellow-100 transition-colors">
            <Code className="w-5 h-5 text-yellow-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data.problems || 87}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Problems</p>
        </div>
        <div className="text-center flex flex-col items-center justify-center group/stat cursor-default">
          <div className="p-2.5 rounded-xl bg-blue-50 mb-3 group-hover/stat:bg-blue-100 transition-colors">
            <Clock className="w-5 h-5 text-blue-600 drop-shadow-sm group-hover/stat:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800">{data.studyTime || 68}h</span>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Time (h)</p>
        </div>
      </div>
    </div>
  );
}
