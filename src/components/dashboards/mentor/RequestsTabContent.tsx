"use client";

import { motion } from "framer-motion";
import { 
  UserPlus, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  X,
  Check
} from "lucide-react";

// Mock Data from screenshot 4
const summaryStats = [
  { label: "Unattended Student Requests", value: 4, icon: UserPlus, color: "bg-red-50", textColor: "text-red-500", borderColor: "border-red-100" },
  { label: "Skill Verification Pending", value: 4, icon: ShieldCheck, color: "bg-amber-50", textColor: "text-amber-500", borderColor: "border-amber-100" },
  { label: "Approved This Month", value: 31, icon: CheckCircle, color: "bg-emerald-50", textColor: "text-emerald-500", borderColor: "border-emerald-100" }
];

const actionRequiredRequests = [
  { 
    id: 1,
    initials: "AK", name: "Aisha Khan", topic: "Product Management Intro", date: "Mar 2, 2025 • 3:00 PM", 
    tag: "Career", priority: "high", 
    message: "\"Placement interview in 10 days, need urgent guidance on PM roles vs data roles.\"",
    color: "bg-pink-100 text-pink-700" 
  },
  { 
    id: 2,
    initials: "RM", name: "Rahul Mehta", topic: "DSA Mock Interview", date: "Mar 5, 2025 • 5:00 PM", 
    tag: "Technical", priority: "medium", 
    message: "\"Have Google interview scheduled. Need a 90-min mock session for arrays & graphs.\"",
    color: "bg-blue-100 text-blue-700" 
  },
  { 
    id: 3,
    initials: "TG", name: "Tanya Gupta", topic: "Career Switch Counselling", date: "Mar 8, 2025 • 2:00 PM", 
    tag: "Career", priority: "medium", 
    message: "\"Currently a Mech student, want to transition to data science. Need a roadmap session.\"",
    color: "bg-emerald-100 text-emerald-700" 
  }
];

const skillVerifyQueue = [
  { 
    id: "SVR-0091", name: "Priya Sharma", skill: "Machine Learning", submitted: "Feb 22", 
    priority: "normal", evidence: "3 projects + Kaggle rank 840" 
  },
  { 
    id: "SVR-0089", name: "Arjun Nair", skill: "System Design", submitted: "Feb 20", 
    priority: "high", evidence: "HLD document + peer review" 
  },
  { 
    id: "SVR-0084", name: "Sneha Patel", skill: "Product Strategy", submitted: "Feb 15", 
    priority: "normal", evidence: "Startup pitch deck + user research" 
  }
];

export default function RequestsTabContent() {
  return (
    <div className="space-y-6">
      {/* 3 Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl p-5 border ${stat.borderColor} ${stat.color} flex items-center gap-4`}
          >
            <div className={`p-3 rounded-xl bg-white/60 text-current`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</h3>
              <p className={`text-sm font-semibold ${stat.textColor} opacity-90 leading-tight`}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Booking Requests Column */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-2 px-1">
            <UserPlus className="w-4 h-4 text-orange-500" /> Session Booking Requests — Action Required
          </h3>
          
          <div className="space-y-4">
            {actionRequiredRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.1) }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${req.color} flex items-center justify-center font-bold text-sm tracking-wide`}>
                        {req.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{req.name}</h4>
                        <p className="text-sm font-semibold text-slate-500">{req.topic}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${req.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {req.priority} priority
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md px-2 py-1">
                      <Clock className="w-3.5 h-3.5" /> {req.date}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {req.tag}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3.5 mb-5 border border-slate-100">
                    <p className="text-sm text-slate-600 italic leading-relaxed flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      {req.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                      <Check className="w-4 h-4" /> Accept & Schedule
                    </button>
                    <button className="flex-none px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors">
                      <Clock className="w-4 h-4" /> Suggest Alt Time
                    </button>
                    <button className="flex-none px-4 py-2 hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-600 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors">
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skill Verification Queue Column */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-2 px-1">
            <ShieldCheck className="w-4 h-4 text-red-500" /> Skill Verification Queue
          </h3>
          
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-sm text-slate-700 leading-relaxed mb-4">
            You have been trusted by students and the platform to verify these skills. Your endorsement adds a <span className="font-bold text-blue-600">verified badge</span> visible on the student's public profile and ledger.
          </div>
          
          <div className="space-y-4">
            {skillVerifyQueue.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.skill}
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted: {item.submitted}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{item.id}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-5">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-500">Evidence:</span> {item.evidence}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Verify & Endorse
                    </button>
                    <button className="flex-1 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-lg transition-colors">
                      Review Evidence
                    </button>
                    <button className="px-4 py-2 hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-600 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
