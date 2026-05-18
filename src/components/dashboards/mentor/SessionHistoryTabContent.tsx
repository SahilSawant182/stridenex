"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSessionHistory } from "@/services/mentor.services";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Star,
  FileText,
  Copy,
  LayoutList
} from "lucide-react";

const summaryStats = [
  { label: "TOTAL SESSIONS", value: "247", icon: LayoutList, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
  { label: "TOTAL HOURS", value: "309h", icon: Clock, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
  { label: "NOTES SHARED", value: "186", icon: FileText, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-orange-400" },
  { label: "LIFETIME RATING", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-yellow-400" }
];

const sessionHistoryList = [
  { id: 1, initials: "PS", name: "Priya Sharma", title: "ML Career Roadmap", date: "Feb 20, 2025 • 4:00-5:00 PM", duration: "60 min", tag: "Career", tagColor: "text-orange-600 bg-orange-50", price: "₹1,200", rating: 5, color: "bg-red-500" },
  { id: 2, initials: "AN", name: "Arjun Nair", title: "Resume & FAANG Strategy", date: "Feb 15, 2025 • 3:00-4:00 PM", duration: "60 min", tag: "Resume", tagColor: "text-purple-600 bg-purple-50", price: "₹1,200", rating: 5, color: "bg-yellow-500" },
  { id: 3, initials: "RV", name: "Rohan Verma", title: "Python & DSA Deep Dive", date: "Feb 10, 2025 • 2:00-3:30 PM", duration: "90 min", tag: "Technical", tagColor: "text-blue-600 bg-blue-50", price: "₹1,800", rating: 5, color: "bg-green-500" },
  { id: 4, initials: "SP", name: "Sneha Patel", title: "Startup Ideation Workshop", date: "Feb 5, 2025 • 5:00-6:00 PM", duration: "60 min", tag: "Startup", tagColor: "text-emerald-600 bg-emerald-50", price: "₹1,200", rating: 5, color: "bg-emerald-400" },
  { id: 5, initials: "VS", name: "Vikram Singh", title: "Data Science Interview Prep", date: "Jan 28, 2025 • 11:00 AM-12:00 PM", duration: "60 min", tag: "Interview Prep", tagColor: "text-teal-600 bg-teal-50", price: "₹1,200", rating: 5, color: "bg-indigo-600" },
  { id: 6, initials: "KR", name: "Kiran Reddy", title: "ML Project Review", date: "Jan 20, 2025 • 4:00-5:00 PM", duration: "60 min", tag: "Technical", tagColor: "text-blue-600 bg-blue-50", price: "₹1,200", rating: 5, color: "bg-fuchsia-500" }
];

export default function SessionHistoryTabContent() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const email = currentUser || localStorage.getItem("userEmail") || "";
      if (!email) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await getSessionHistory(email);
        if (res?.message) {
          setSessions(res.message);
        }
      } catch (err) {
        console.error("Failed to fetch session history", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [currentUser]);

  // format time 13:00:00 -> 1:00 PM
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const mappedSessions = sessions.map((s, index) => {
    const studentName = s.student?.split('@')[0] || "Unknown";
    const initials = studentName.substring(0, 2).toUpperCase();
    const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500", "bg-emerald-400", "bg-indigo-600", "bg-fuchsia-500"];
    const color = colors[index % colors.length];
    
    const dateObj = new Date(s.session_date);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = `${formatTime(s.from_time)} - ${formatTime(s.to_time)}`;
    
    return {
      id: s.name || index,
      initials,
      name: studentName,
      title: s.topic || "Session",
      date: `${dateStr} • ${timeStr}`,
      duration: `${s.duration} min`,
      tag: s.status || "Completed",
      tagColor: "text-blue-600 bg-blue-50",
      price: "—",
      rating: 5,
      color
    };
  });

  const totalHours = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;
  
  const dynamicSummaryStats = [
    { label: "TOTAL SESSIONS", value: sessions.length.toString(), icon: LayoutList, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
    { label: "TOTAL HOURS", value: `${totalHours.toFixed(1)}h`, icon: Clock, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
    { label: "NOTES SHARED", value: "—", icon: FileText, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-orange-400" },
    { label: "LIFETIME RATING", value: "—", icon: Star, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-yellow-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicSummaryStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 border-t-[3px] ${stat.border} flex justify-between items-center`}
          >
            <div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color} ${stat.label === 'LIFETIME RATING' ? 'fill-current' : ''}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Session History List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-emerald-600" /> Session History
          </h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Export All →
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading history...</div>
          ) : mappedSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No session history found.</div>
          ) : mappedSessions.map((session, i) => (
            <div key={session.id} className="p-5 px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${session.color} flex items-center justify-center text-white font-bold text-sm shrink-0 mt-1`}>
                  {session.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    {session.name}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">{session.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> {session.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> {session.duration}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${session.tagColor}`}>
                      {session.tag}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-lg font-bold text-emerald-600">{session.price}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < session.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-1 transition-colors">
                  <FileText className="w-3 h-3" /> View notes
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
