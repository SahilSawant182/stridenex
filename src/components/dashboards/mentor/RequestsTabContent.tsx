"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Clock,
  MessageSquare,
  Link as LinkIcon,
  X,
  Check,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPendingRequests, suggestAltTime, acceptRequest, declineRequest, getMentorPendingVerifications, verifyAndEndorseSkill, rejectSkillEvidence } from "@/services/mentor.services";
import { BASE_DOMAIN } from "@/services/api.services";


export default function RequestsTabContent() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [verifyQueue, setVerifyQueue] = useState<any[]>([]);
  const [totalPendingCount, setTotalPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingEvidenceName, setProcessingEvidenceName] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject' | null>(null);

  const [altTimeModal, setAltTimeModal] = useState<{ isOpen: boolean; req: any | null }>({ isOpen: false, req: null });
  const [altDate, setAltDate] = useState("");
  const [altTime, setAltTime] = useState("");
  const [submittingAlt, setSubmittingAlt] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const openAltTimeModal = (req: any) => {
    setAltTimeModal({ isOpen: true, req });
    setAltDate("");
    setAltTime("");
  };

  const handleSuggestAltTime = async () => {
    if (!altDate || !altTime || !altTimeModal.req) return;
    try {
      setSubmittingAlt(true);
      await suggestAltTime({
        booking_name: altTimeModal.req.name,
        alt_date: altDate,
        alt_time: altTime
      });
      setAltTimeModal({ isOpen: false, req: null });
      fetchRequests();
    } catch (err) {
      console.error("Failed to suggest alternate time", err);
    } finally {
      setSubmittingAlt(false);
    }
  };

  const handleAcceptRequest = async (req: any) => {
    try {
      setAcceptingId(req.name);
      const res = await acceptRequest({
        booking_name: req.name,
        from_time: req.from_time,
        to_time: req.to_time
      });
      setFeedback({
        type: 'success',
        message: typeof res.message === 'object' ? JSON.stringify(res.message) : res.message || "Request accepted successfully."
      });
      fetchRequests();
    } catch (err: any) {
      console.error("Failed to accept request", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Failed to accept request."
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDeclineRequest = async (req: any) => {
    try {
      setDecliningId(req.name);
      const res = await declineRequest({
        booking_name: req.name
      });
      setFeedback({
        type: 'success',
        message: typeof res.message === 'object' ? JSON.stringify(res.message) : res.message || "Request declined successfully."
      });
      fetchRequests();
    } catch (err: any) {
      console.error("Failed to decline request", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Failed to decline request."
      });
    } finally {
      setDecliningId(null);
    }
  };

  const fetchRequests = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const response = await getPendingRequests(currentUser);
      if (response?.message?.records && Array.isArray(response.message.records)) {
        setRequests(response.message.records);
      } else if (Array.isArray(response?.message)) {
        setRequests(response.message);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifyQueue = async () => {
    if (!currentUser) return;
    try {
      setLoadingVerify(true);
      const response = await getMentorPendingVerifications(currentUser, 0);
      if (response?.message) {
        setVerifyQueue(response.message.records || []);
        setTotalPendingCount(response.message.total_pending_count || 0);
      } else {
        setVerifyQueue([]);
        setTotalPendingCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch verification queue", err);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleVerifyAndEndorse = async (evidenceName: string) => {
    try {
      setProcessingEvidenceName(evidenceName);
      setActionType('verify');
      const res = await verifyAndEndorseSkill(evidenceName);
      setFeedback({
        type: 'success',
        message: typeof res.message === 'object' ? JSON.stringify(res.message) : res.message || "Skill verified and endorsed successfully."
      });
      fetchVerifyQueue();
    } catch (err: any) {
      console.error("Failed to verify skill:", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Failed to verify and endorse skill."
      });
    } finally {
      setProcessingEvidenceName(null);
      setActionType(null);
    }
  };

  const handleRejectEvidence = async (evidenceName: string) => {
    try {
      setProcessingEvidenceName(evidenceName);
      setActionType('reject');
      const res = await rejectSkillEvidence(evidenceName);
      setFeedback({
        type: 'success',
        message: typeof res.message === 'object' ? JSON.stringify(res.message) : res.message || "Skill evidence rejected."
      });
      fetchVerifyQueue();
    } catch (err: any) {
      console.error("Failed to reject skill evidence:", err);
      setFeedback({
        type: 'error',
        message: err?.message || "Failed to reject skill evidence."
      });
    } finally {
      setProcessingEvidenceName(null);
      setActionType(null);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchVerifyQueue();
  }, [currentUser]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const getBadgeColor = (type?: string) => {
    if (type === 'Course') return 'bg-blue-50 text-blue-600';
    if (type === 'Project') return 'bg-emerald-50 text-emerald-600';
    return 'bg-amber-50 text-amber-600';
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatDateTime = (dateString?: string, timeString?: string) => {
    if (!dateString) return 'Flexible / TBD';
    
    const dateObj = new Date(dateString);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    let formattedTime = '';
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      if (hours && minutes) {
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        formattedTime = ` · ${hour12}:${minutes} ${ampm}`;
      }
    }
    
    return `📅 ${formattedDate}${formattedTime}`;
  };

  const getRandomColorClass = (name: string) => {
    const colors = [
      "bg-pink-100 text-pink-700",
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-indigo-100 text-indigo-700",
      "bg-amber-100 text-amber-700"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const summaryStats = useMemo(() => [
    { label: "Unattended Student Requests", value: requests.length, icon: UserPlus, color: "bg-red-50", textColor: "text-red-500", borderColor: "border-red-100" },
    { label: "Skill Verification Pending", value: totalPendingCount, icon: ShieldCheck, color: "bg-amber-50", textColor: "text-amber-500", borderColor: "border-amber-100" },
    { label: "Approved This Month", value: 31, icon: CheckCircle, color: "bg-emerald-50", textColor: "text-emerald-500", borderColor: "border-emerald-100" }
  ], [requests.length, totalPendingCount]);
  return (
    <div className="space-y-6">
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } text-sm font-medium flex items-center justify-between shadow-sm`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-4 opacity-50 hover:opacity-100 font-bold">×</button>
        </motion.div>
      )}
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <p className="text-sm text-slate-500 font-medium">Fetching booking requests...</p>
              </div>
            ) : requests.length > 0 ? (
              requests.map((req, i) => (
                <motion.div
                  key={req.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.1) }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getRandomColorClass(req.student_name || "Student")} flex items-center justify-center font-bold text-sm tracking-wide`}>
                          {getInitials(req.student_name || "Student")}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 leading-tight">{req.student_name}</h4>
                          <p className="text-sm font-semibold text-slate-500">{req.topic}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${req.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {req.priority || 'Normal'} priority
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-blue-100 rounded-md px-2 py-1">
                        {formatDateTime(req.session_date, req.from_time)}
                      </span>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        {req.session_type}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3.5 mb-5 border border-slate-100">
                      <p className="text-sm text-slate-600 italic leading-relaxed flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        {req.student_message || "No message provided by the student."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        disabled={acceptingId === req.name}
                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {acceptingId === req.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}{" "}
                        Accept & Schedule
                      </button>
                      <button
                        onClick={() => openAltTimeModal(req)}
                        className="flex-none px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-4 h-4" /> Suggest Alt Time
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req)}
                        disabled={decliningId === req.name}
                        className="flex-none px-4 py-2 hover:bg-red-50 disabled:opacity-50 border border-slate-200 text-slate-500 hover:text-red-600 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        {decliningId === req.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}{" "}
                        Decline
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl">
                <UserPlus className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No Pending Requests</h3>
                <p className="text-sm text-slate-500">You're all caught up! Student requests will appear here.</p>
              </div>
            )}
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
            {loadingVerify ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-slate-500 font-medium">Fetching verification requests...</p>
              </div>
            ) : verifyQueue.length > 0 ? (
              verifyQueue.map((item, i) => (
                <motion.div
                  key={item.evidence_name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.student_name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.skill}
                          </span>
                          <span className="text-xs text-slate-500">
                            Submitted: {formatDate(item.creation)}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getBadgeColor(item.evidence_type)}`}>
                            {item.evidence_type}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{item.evidence_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-5">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-500">Evidence:</span> {item.description || "No description provided."}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleVerifyAndEndorse(item.evidence_name)}
                        disabled={processingEvidenceName !== null}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {processingEvidenceName === item.evidence_name && actionType === 'verify' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}{" "}
                        Verify & Endorse
                      </button>
                      <button 
                        onClick={() => {
                          if (item.document_url) {
                            const url = item.document_url.startsWith('http') 
                              ? item.document_url 
                              : `${BASE_DOMAIN}${item.document_url}`;
                            window.open(url, '_blank');
                          }
                        }}
                        disabled={!item.document_url}
                        className="flex-1 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold text-sm rounded-lg transition-colors"
                      >
                        Review Evidence
                      </button>
                      <button 
                        onClick={() => handleRejectEvidence(item.evidence_name)}
                        disabled={processingEvidenceName !== null}
                        className="px-4 py-2 hover:bg-red-50 disabled:opacity-50 border border-slate-200 text-slate-500 hover:text-red-600 font-bold text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        {processingEvidenceName === item.evidence_name && actionType === 'reject' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}{" "}
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl">
                <ShieldCheck className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No Pending Verifications</h3>
                <p className="text-sm text-slate-500">All student skill verification requests have been handled.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggest Alt Time Modal */}
      {altTimeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Suggest Alternate Time</h3>
              <button onClick={() => setAltTimeModal({ isOpen: false, req: null })} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Date</label>
                <input
                  type="date"
                  value={altDate}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => setAltDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Time</label>
                <input
                  type="time"
                  value={altTime}
                  onChange={(e) => setAltTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setAltTimeModal({ isOpen: false, req: null })}
                className="flex-1 px-4 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors"
                disabled={submittingAlt}
              >
                Cancel
              </button>
              <button
                onClick={handleSuggestAltTime}
                disabled={!altDate || !altTime || submittingAlt}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-colors flex justify-center items-center gap-2"
              >
                {submittingAlt ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
