"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Trophy, Calendar, Briefcase, Plus, FileText } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const events = [
  {
    type: "Hackathon",
    title: "HackIndia 2025",
    date: "Mar 15-17",
    participants: "150+ colleges",
    prize: "₹5 Lakhs",
    prizeIcon: "🏆",
    daysLeft: 12,
    colorClass: "orange",
    bgAccent: "bg-orange-50",
    textAccent: "text-orange-600",
    borderAccent: "border-orange-500"
  },
  {
    type: "Competition",
    title: "DataFest National",
    date: "Apr 2-3",
    participants: "80+ colleges",
    prize: "₹2 Lakhs",
    prizeIcon: "🏆",
    daysLeft: 28,
    colorClass: "emerald",
    bgAccent: "bg-blue-50",
    textAccent: "text-blue-600",
    borderAccent: "border-blue-500"
  },
  {
    type: "Startup",
    title: "Startup Pitch Battle",
    date: "Mar 25",
    participants: "All colleges",
    prize: "₹10 Lakhs",
    prizeIcon: "🎖",
    daysLeft: 20,
    colorClass: "emerald",
    bgAccent: "bg-emerald-50",
    textAccent: "text-emerald-600",
    borderAccent: "border-emerald-500"
  },
  {
    type: "Case Study",
    title: "Case Study Champions",
    date: "Apr 10",
    participants: "60+ colleges",
    prize: "Internships",
    prizeIcon: "💼",
    daysLeft: 35,
    colorClass: "amber",
    bgAccent: "bg-amber-50",
    textAccent: "text-amber-600",
    borderAccent: "border-orange-400"
  }
];

const notices = [
  {
    category: "Placement",
    title: "VJTI-TCS iON Internship Drive — Applications Open",
    date: "Feb 24",
    urgent: true,
    colorClass: "text-orange-500 bg-orange-500",
    leftBorder: "border-l-orange-500"
  },
  {
    category: "Academic",
    title: "NEP 2020 Workshop: Credit Transfer & ABC Portal",
    date: "Feb 23",
    urgent: true,
    colorClass: "text-blue-500 bg-blue-500",
    leftBorder: "border-l-blue-500"
  },
  {
    category: "Events",
    title: "HackIndia 2025 — Team Formation Begins",
    date: "Feb 22",
    urgent: false,
    colorClass: "text-emerald-500 bg-emerald-500",
    leftBorder: "border-l-emerald-500"
  },
  {
    category: "Compliance",
    title: "UGC Equity Audit: Equal Opportunity Centre Open",
    date: "Feb 20",
    urgent: false,
    colorClass: "text-amber-500 bg-amber-500",
    leftBorder: "border-l-amber-500"
  }
];

export default function NoticeBoardTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Events & Competitions</h2>
          <p className="text-sm font-medium text-slate-500">Inter-college hackathons, pitch battles, and case studies</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          Submit Event
        </button>
      </motion.div>

      {/* Events Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, idx) => (
          <BaseCard key={idx} className={`p-6 border-slate-200 border-l-4 ${event.borderAccent} shadow-sm overflow-hidden flex flex-col justify-between`}>
             <div>
               <div className="flex justify-between items-start mb-2">
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${event.textAccent}`}>
                   {event.type}
                 </span>
                 <div className="text-right">
                   <h3 className="text-2xl font-black text-orange-500 leading-none">{event.daysLeft}</h3>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DAYS LEFT</span>
                 </div>
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-2 truncate">{event.title}</h3>
               
               <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 mb-4">
                 <div className="flex items-center gap-1.5 basis-1/2 min-w-0">
                    <Calendar className="w-4 h-4 shrink-0" /> <span className="truncate">{event.date}</span>
                 </div>
                 <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></div>
                 <div className="flex items-center gap-1.5 basis-1/2 min-w-0">
                    <span className="truncate">{event.participants}</span>
                 </div>
               </div>
               
               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${event.bgAccent} border border-orange-100/50`}>
                  <span className="text-base">{event.prizeIcon}</span>
                  <span className={`text-sm font-black ${event.textAccent}`}>{event.prize}</span>
               </div>
             </div>
             
             <div className="flex items-center gap-3 w-full">
               <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-all focus:ring-2 focus:ring-orange-500 focus:ring-offset-1">
                 Register Now
               </button>
               <button className="w-24 text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 font-bold py-2.5 rounded-lg text-sm transition-all text-center">
                 Details
               </button>
             </div>
          </BaseCard>
        ))}
      </motion.div>

      {/* Digital Notice Board */}
      <motion.div variants={itemVariants} className="pt-4">
        <BaseCard className="border-slate-200 p-0 overflow-hidden shadow-sm">
           <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 tracking-wide">
                <FileText className="w-4 h-4 text-slate-500" />
                Digital Notice Board
             </h3>
             <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider">
                <Plus className="w-3.5 h-3.5" /> Post Notice
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-4">
              {notices.map((notice, idx) => (
                <div key={idx} className={`p-4 border border-slate-200 rounded-xl relative overflow-hidden bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-colors`}>
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${notice.colorClass}`}></div>
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-slate-800 pr-8 line-clamp-2 leading-tight">
                        {notice.title}
                      </h4>
                      {notice.urgent && (
                        <div className="absolute top-4 right-4">
                           <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold opacity-80 ${notice.colorClass.split(' ')[0]}`}>{notice.category}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{notice.date}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}
