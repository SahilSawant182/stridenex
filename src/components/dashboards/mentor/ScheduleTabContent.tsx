"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ChevronRight,
  Plus,
  Edit3,
  List
} from "lucide-react";

const bookedSessions = [
  { id: "PS", initials: "PS", name: "Priya Sharma", topic: "ML Project Milestone Review", date: "Feb 26 - 4:00 PM", duration: "60 min", color: "bg-orange-500", borderColor: "border-l-blue-500" },
  { id: "AN", initials: "AN", name: "Arjun Nair", topic: "FAANG Prep Check-In", date: "Feb 27 - 3:00 PM", duration: "45 min", color: "bg-blue-500", borderColor: "border-l-orange-500" },
  { id: "TG", initials: "TG", name: "Tanya Gupta", topic: "Data Science Roadmap", date: "Mar 1 - 2:00 PM", duration: "60 min", color: "bg-emerald-500", borderColor: "border-l-teal-500" },
  { id: "RV", initials: "RV", name: "Rohan Verma", topic: "DSA: Trees & Graphs", date: "Mar 2 - 5:00 PM", duration: "90 min", color: "bg-purple-500", borderColor: "border-l-purple-500" }
];

const availabilityGrid = [
  { day: "MONDAY", slots: [{ time: "10 AM", status: "booked" }, { time: "11 AM", status: "booked" }, { time: "4 PM", status: "available" }, { time: "5 PM", status: "available" }] },
  { day: "TUESDAY", slots: [{ time: "3 PM", status: "available" }, { time: "4 PM", status: "available" }, { time: "5 PM", status: "booked_locked" }, { time: "6 PM", status: "available" }] },
  { day: "WEDNESDAY", slots: [{ time: "10 AM", status: "available" }, { time: "11 AM", status: "available" }, { time: "2 PM", status: "available" }] },
  { day: "THURSDAY", slots: [{ time: "4 PM", status: "booked" }, { time: "5 PM", status: "booked" }, { time: "6 PM", status: "booked" }] },
  { day: "FRIDAY", slots: [{ time: "11 AM", status: "available" }, { time: "12 PM", status: "booked" }, { time: "4 PM", status: "available" }] },
  { day: "SATURDAY", slots: [{ time: "10 AM", status: "available" }, { time: "11 AM", status: "available" }, { time: "12 PM", status: "available" }] },
];

const upcomingBookings = [
  { id: "SES-2410", initials: "PS", name: "Priya Sharma", color: "bg-orange-500", topic: "ML Project Milestone Review", date: "Feb 26 • 4:00 PM", duration: "60 min", type: "Technical", typeColor: "text-blue-600 bg-blue-50", fee: "₹1,200" },
  { id: "SES-2411", initials: "AN", name: "Arjun Nair", color: "bg-blue-500", topic: "FAANG Prep Check-In", date: "Feb 27 • 3:00 PM", duration: "45 min", type: "Career", typeColor: "text-orange-600 bg-orange-50", fee: "₹1,200" },
  { id: "SES-2412", initials: "TG", name: "Tanya Gupta", color: "bg-emerald-500", topic: "Data Science Roadmap", date: "Mar 1 • 2:00 PM", duration: "60 min", type: "Career", typeColor: "text-orange-600 bg-orange-50", fee: "₹1,200" },
];

export default function ScheduleTabContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Schedule & Availability</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your bookings and block off time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 rounded-full p-1 flex">
            <button className="px-4 py-1.5 bg-slate-800 text-white rounded-full text-sm font-semibold shadow">Week</button>
            <button className="px-4 py-1.5 text-slate-600 hover:text-slate-900 rounded-full text-sm font-semibold transition-colors">Month</button>
          </div>
          <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Block Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booked Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" /> This Week — Booked Sessions
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {bookedSessions.map((session, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl border-slate-200 ${session.borderColor} border-l-[4px] shadow-sm`}>
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className={`w-10 h-10 rounded-full ${session.color} flex items-center justify-center text-white font-bold text-sm shrink-0 mt-1`}>
                    {session.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{session.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{session.topic}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5" /> {session.date} • {session.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors flex justify-center items-center gap-1.5">
                    Join
                  </button>
                  <button className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 bg-orange-50/50 border border-orange-100 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Prep Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Availability Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Weekly Availability Grid
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-5">
              {availabilityGrid.map((dayLine, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="w-28 text-xs font-bold text-slate-500 tracking-wider shrink-0">{dayLine.day}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {dayLine.slots.map((slot, j) => {
                      const isBooked = slot.status.includes('booked');
                      return (
                        <div key={j} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 ${isBooked ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {slot.time}
                          {slot.status === 'booked_locked' && <span className="opacity-70">🔒</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-center gap-6 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div> Booked
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <div className="w-3 h-3 rounded-full border border-slate-300 bg-white"></div> Available
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* All Upcoming Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <List className="w-4 h-4 text-slate-500" /> All Upcoming Bookings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-6 font-bold">Session ID</th>
                <th className="py-4 px-6 font-bold">Student</th>
                <th className="py-4 px-6 font-bold">Topic</th>
                <th className="py-4 px-6 font-bold">Date & Time</th>
                <th className="py-4 px-6 font-bold">Duration</th>
                <th className="py-4 px-6 font-bold">Type</th>
                <th className="py-4 px-6 font-bold">Fee</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {upcomingBookings.map((session, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">{session.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${session.color} flex items-center justify-center text-white font-bold text-[10px]`}>
                        {session.initials}
                      </div>
                      <span className="font-bold text-slate-800 whitespace-nowrap">{session.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 min-w-[200px]">{session.topic}</td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap font-medium">{session.date}</td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{session.duration}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap ${session.typeColor}`}>
                      {session.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{session.fee}</td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 focus:ring focus:ring-orange-500/20 text-white text-xs font-bold rounded-lg transition-colors">Join</button>
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Notes</button>
                      <button className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors">Reschedule</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}