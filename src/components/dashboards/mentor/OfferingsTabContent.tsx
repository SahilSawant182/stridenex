"use client";

import { motion } from "framer-motion";
import { Plus, Edit3, Star, Clock } from "lucide-react";

// Mock Data from screenshot 3
const myOfferings = [
  {
    title: "Career Roadmap Session",
    status: "Live",
    badges: [{ label: "1:1 Mentorship", style: "bg-blue-50 text-blue-600" }, { label: "60 min", icon: Clock, style: "text-slate-500" }, { label: "Career", style: "text-orange-500 font-medium" }],
    price: "₹1,200",
    bookings: 84,
    rating: 4.9
  },
  {
    title: "Technical Mock Interview",
    status: "Live",
    badges: [{ label: "1:1 Mentorship", style: "bg-blue-50 text-blue-600" }, { label: "90 min", icon: Clock, style: "text-slate-500" }, { label: "Interview Prep", style: "text-orange-500 font-medium" }],
    price: "₹1,800",
    bookings: 62,
    rating: 4.8
  },
  {
    title: "Resume & LinkedIn Overhaul",
    status: "Live",
    badges: [{ label: "Async Review", style: "bg-blue-50 text-blue-600" }, { label: "48hr turnaround", icon: Clock, style: "text-slate-500" }, { label: "Resume", style: "text-orange-500 font-medium" }],
    price: "₹800",
    bookings: 41,
    rating: 4.9
  },
  {
    title: "ML Project Review",
    status: "Live",
    badges: [{ label: "1:1 Mentorship", style: "bg-blue-50 text-blue-600" }, { label: "60 min", icon: Clock, style: "text-slate-500" }, { label: "Technical", style: "text-orange-500 font-medium" }],
    price: "₹1,200",
    bookings: 37,
    rating: 5.0
  },
  {
    title: "Startup Ideation Workshop",
    status: "Draft",
    badges: [{ label: "Group (4 max)", style: "bg-blue-50 text-blue-600" }, { label: "90 min", icon: Clock, style: "text-slate-500" }, { label: "Startup", style: "text-orange-500 font-medium" }],
    price: "₹600",
    bookings: 18,
    rating: 4.7
  },
  {
    title: "Monthly Mentorship Pack",
    status: "Live",
    badges: [{ label: "4 sessions/mo", style: "bg-blue-50 text-blue-600" }, { label: "4x60 min", icon: Clock, style: "text-slate-500" }, { label: "Career", style: "text-orange-500 font-medium" }],
    price: "₹4,000",
    bookings: 12,
    rating: 4.9
  }
];

export default function OfferingsTabContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Offerings</h2>
          <p className="text-sm text-slate-500 mt-1">Manage sessions, pricing, and availability of your mentorship packages</p>
        </div>
        <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Offering
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myOfferings.map((offering, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 text-lg leading-tight flex-1 pr-2">{offering.title}</h3>
              <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${offering.status === 'Live' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${offering.status === 'Live' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {offering.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {offering.badges.map((badge, j) => (
                <span key={j} className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${badge.style}`}>
                  {badge.icon && <badge.icon className="w-3.5 h-3.5" />}
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-end mt-auto mb-6">
              <div>
                <h4 className="text-2xl font-extrabold text-slate-800 leading-none">{offering.price}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Per Session</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-800 leading-none">{offering.bookings}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Bookings</p>
              </div>
              <div className="text-right">
                <h4 className="text-xl font-bold flex items-center gap-1 text-slate-800 leading-none justify-end">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" /> {offering.rating}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Rating</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button className="flex-1 py-2 text-slate-700 hover:bg-slate-50 border border-slate-200 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button className={`flex-1 py-2 border font-semibold text-sm rounded-lg transition-colors ${offering.status === 'Live' ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-transparent bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                {offering.status === 'Live' ? 'Pause' : 'Activate'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
