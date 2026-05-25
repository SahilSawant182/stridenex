"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSessionHistory, updateMentorStats, getSessionNote, saveSessionNotes, emailSessionNoteToStudent } from "@/services/mentor.services";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Star,
  FileText,
  Copy,
  LayoutList,
  ChevronDown,
  ChevronUp,
  User,
  Lock,
  Edit2,
  FileDown,
  Mail
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";

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
  const [stats, setStats] = useState({ total_sessions: 0, total_hours: 0, total_earnings: 0, avg_rating: 0 });
  const [loading, setLoading] = useState(true);

  const [historyPage, setHistoryPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 3;
  const [expandedNotes, setExpandedNotes] = useState<Record<string | number, boolean>>({});
  const [sessionNotes, setSessionNotes] = useState<Record<string, { notes: string, shared_with_student: string }>>({});
  const [editingNotes, setEditingNotes] = useState<Record<string, boolean>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, { notes: string, shared_with_student: string }>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});
  const [loadingNotes, setLoadingNotes] = useState<Record<string, boolean>>({});
  const [emailingNotes, setEmailingNotes] = useState<Record<string, boolean>>({});

  const handleEmailStudent = async (id: string, studentEmail: string) => {
    const currentNotes = sessionNotes[id] || { shared_with_student: "" };
    if (!currentNotes.shared_with_student) {
      alert("No notes available to share. Please add and save notes for the student first.");
      return;
    }

    setEmailingNotes(prev => ({ ...prev, [id]: true }));
    try {
      const res = await emailSessionNoteToStudent({
        session_name: id,
        student: studentEmail,
        subject: "Session note updated successfully",
        message: currentNotes.shared_with_student
      });
      if (res?.message?.status === "success" || res?.message?.message) {
        alert(res.message.message || "Email sent successfully.");
      } else {
        alert("Email sent successfully!");
      }
    } catch (err: any) {
      console.error("Failed to email notes", err);
      let errorMessage = "Failed to email notes. Please try again.";
      
      const errorData = err.data || err.response?.data;
      if (errorData) {
        if (errorData._server_messages) {
          try {
            const messages = JSON.parse(errorData._server_messages);
            if (messages.length > 0) {
              const msgObj = JSON.parse(messages[0]);
              errorMessage = msgObj.message || errorMessage;
            }
          } catch (e) {}
        } else if (errorData.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.exception) {
          errorMessage = errorData.exception.split(":").slice(1).join(":").trim() || errorData.exception;
        }
      } else if (err.message && !err.message.includes("Traceback")) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setEmailingNotes(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleNotes = async (id: string, studentEmail: string) => {
    const isExpanding = !expandedNotes[id];
    setExpandedNotes(prev => ({ ...prev, [id]: isExpanding }));

    if (isExpanding && !sessionNotes[id]) {
      setLoadingNotes(prev => ({ ...prev, [id]: true }));
      try {
        const res = await getSessionNote(id, studentEmail);
        if (res?.message?.data) {
          setSessionNotes(prev => ({ 
            ...prev, 
            [id]: {
              notes: res.message.data.notes || "",
              shared_with_student: res.message.data.shared_with_student || ""
            } 
          }));
        } else {
          setSessionNotes(prev => ({ ...prev, [id]: { notes: "", shared_with_student: "" } }));
        }
      } catch (err) {
        console.error("Failed to fetch notes", err);
        setSessionNotes(prev => ({ ...prev, [id]: { notes: "", shared_with_student: "" } }));
      } finally {
        setLoadingNotes(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleEditNotes = (id: string) => {
    const currentNotes = sessionNotes[id] || { notes: "", shared_with_student: "" };
    setDraftNotes(prev => ({ ...prev, [id]: currentNotes }));
    setEditingNotes(prev => ({ ...prev, [id]: true }));
  };

  const handleCancelEdit = (id: string) => {
    setEditingNotes(prev => ({ ...prev, [id]: false }));
  };

  const handleSaveNotes = async (id: string, studentEmail: string) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      const payload = {
        session_name: id,
        student: studentEmail,
        notes: draftNotes[id]?.notes || "",
        shared_with_student: draftNotes[id]?.shared_with_student || ""
      };
      await saveSessionNotes(payload);
      setSessionNotes(prev => ({ ...prev, [id]: draftNotes[id] }));
      setEditingNotes(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setSavingNotes(prev => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const email = currentUser || localStorage.getItem("userEmail") || "";
      if (!email) {
        setLoading(false);
        return;
      }
      
      try {
        const [res, statsRes] = await Promise.all([
          getSessionHistory(email),
          updateMentorStats(email)
        ]);
        if (res?.message && Array.isArray(res.message)) {
          setSessions(res.message);
        } else {
          setSessions([]);
        }
        if (statsRes?.message) {
          setStats({
            total_sessions: statsRes.message.total_sessions || 0,
            total_hours: statsRes.message.total_hours || 0,
            total_earnings: statsRes.message.total_earnings || 0,
            avg_rating: statsRes.message.avg_rating || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch session history or stats", err);
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

  const mappedSessions = (Array.isArray(sessions) ? sessions : []).map((s, index) => {
    const studentName = s.student?.split('@')[0] || "Unknown";
    const initials = studentName.substring(0, 2).toUpperCase();
    const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500", "bg-emerald-400", "bg-indigo-600", "bg-fuchsia-500"];
    const color = colors[index % colors.length];
    
    const dateObj = new Date(s.session_date);
    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = `${formatTime(s.from_time)} - ${formatTime(s.to_time)}`;
    
    return {
      id: s.name || index.toString(),
      initials,
      name: studentName,
      studentEmail: s.student || "",
      title: s.topic || "Session",
      date: `${dateStr} • ${timeStr}`,
      duration: `${s.duration} min`,
      tag: s.status || "Completed",
      tagColor: "text-blue-600 bg-blue-50",
      price: s.price ? `₹${s.price}` : "₹1,200",
      rating: 5,
      color,
      sharedNote: s.shared_note || "",
      internalNote: s.internal_note || ""
    };
  });

  const totalHistoryPages = Math.ceil(mappedSessions.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (mappedSessions.length > 0) {
      const maxPage = Math.ceil(mappedSessions.length / ITEMS_PER_PAGE);
      if (historyPage > maxPage) {
        setHistoryPage(maxPage);
      }
    } else {
      setHistoryPage(1);
    }
  }, [mappedSessions.length, historyPage]);

  const paginatedHistorySessions = useMemo(() => {
    const startIndex = (historyPage - 1) * ITEMS_PER_PAGE;
    return mappedSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [mappedSessions, historyPage]);

  const dynamicSummaryStats = [
    { label: "TOTAL SESSIONS", value: stats.total_sessions.toString(), icon: LayoutList, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
    { label: "TOTAL HOURS", value: `${stats.total_hours.toFixed(1)}h`, icon: Clock, color: "text-slate-400", bg: "bg-slate-50", border: "border-t-blue-500" },
    { label: "NOTES SHARED", value: "—", icon: FileText, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-orange-400" },
    { label: "LIFETIME RATING", value: stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : "—", icon: Star, color: "text-amber-500", bg: "bg-amber-50", border: "border-t-yellow-400" }
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
          {/* <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Export All →
          </button> */}
        </div>
        
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading history...</div>
          ) : mappedSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No session history found.</div>
          ) : (
            <>
              {paginatedHistorySessions.map((session, i) => (
                <div key={session.id} className="p-5 px-6 hover:bg-slate-50 transition-colors flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      <button 
                        onClick={() => toggleNotes(session.id, session.studentEmail)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-1 transition-colors"
                      >
                        {expandedNotes[session.id] ? (
                          <><ChevronUp className="w-3 h-3" /> Hide notes</>
                        ) : (
                          <><ChevronDown className="w-3 h-3" /> View notes</>
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedNotes[session.id] && (
                    <div className="mt-2 pl-14">
                      {loadingNotes[session.id] ? (
                        <div className="p-4 text-center text-sm text-slate-500">Loading notes...</div>
                      ) : editingNotes[session.id] ? (
                        <div className="space-y-3">
                          {/* Shared Note Edit */}
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                <User className="w-3 h-3" /> Shared with Student
                              </div>
                              <span className="text-xs text-slate-400">Visible on student's profile</span>
                            </div>
                            <textarea
                              className="w-full text-sm text-slate-700 bg-white border border-emerald-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              rows={3}
                              value={draftNotes[session.id]?.shared_with_student || ""}
                              onChange={(e) => setDraftNotes(prev => ({ ...prev, [session.id]: { ...prev[session.id], shared_with_student: e.target.value } }))}
                              placeholder="Enter notes to share with student..."
                            />
                          </div>

                          {/* Internal Note Edit */}
                          <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-orange-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 bg-orange-100/50">
                                <Lock className="w-3 h-3" /> Internal Note Only
                              </div>
                              <span className="text-xs text-slate-400">Not visible to student</span>
                            </div>
                            <textarea
                              className="w-full text-sm text-slate-700 bg-white border border-orange-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              rows={3}
                              value={draftNotes[session.id]?.notes || ""}
                              onChange={(e) => setDraftNotes(prev => ({ ...prev, [session.id]: { ...prev[session.id], notes: e.target.value } }))}
                              placeholder="Enter internal notes..."
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button 
                              onClick={() => handleSaveNotes(session.id, session.studentEmail)}
                              disabled={savingNotes[session.id]}
                              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
                            >
                              {savingNotes[session.id] ? "Saving..." : "Save Notes"}
                            </button>
                            <button 
                              onClick={() => handleCancelEdit(session.id)}
                              disabled={savingNotes[session.id]}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Shared Note View */}
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                <User className="w-3 h-3" /> Shared with Student
                              </div>
                              <span className="text-xs text-slate-400">Visible on student's profile</span>
                            </div>
                            <p className={`text-sm whitespace-pre-wrap ${sessionNotes[session.id]?.shared_with_student || session.sharedNote ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                              {sessionNotes[session.id]?.shared_with_student || session.sharedNote || "No notes shared with student yet. Click 'Edit Notes' to add."}
                            </p>
                          </div>

                          {/* Internal Note View */}
                          <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-orange-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 bg-orange-100/50">
                                <Lock className="w-3 h-3" /> Internal Note Only
                              </div>
                              <span className="text-xs text-slate-400">Not visible to student</span>
                            </div>
                            <p className={`text-sm whitespace-pre-wrap ${sessionNotes[session.id]?.notes || session.internalNote ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                              {sessionNotes[session.id]?.notes || session.internalNote || "No internal notes added yet. Click 'Edit Notes' to add."}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button 
                              onClick={() => handleEditNotes(session.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit Notes
                            </button>
                            {/* <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors">
                              <FileDown className="w-3.5 h-3.5" /> Download PDF
                            </button> */}
                            <button 
                              onClick={() => handleEmailStudent(session.id, session.studentEmail)}
                              disabled={emailingNotes[session.id]}
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                            >
                              <Mail className="w-3.5 h-3.5" /> 
                              {emailingNotes[session.id] ? "Emailing..." : "Email to Student"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <Pagination
                currentPage={historyPage}
                totalPages={totalHistoryPages}
                onPageChange={setHistoryPage}
                className="border-0 border-t border-slate-100 rounded-none shadow-none p-4"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
