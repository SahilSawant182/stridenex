"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Trophy, Calendar, Briefcase, Plus, FileText, Pen, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getCollegeDetails,
  getCollegeEvents,
  createCollegeEvent,
  updateCollegeEvent,
  getCollegeNotices,
  createCollegeNotice,
  updateCollegeNotice,
  deleteCollegeNotice
} from "@/services/college.services";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { Pagination } from "@/components/ui/Pagination";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

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
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [collegeDetails, setCollegeDetails] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Notices States
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticeCurrentPage, setNoticeCurrentPage] = useState(1);
  const [noticeTotalPages, setNoticeTotalPages] = useState(1);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Event Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Notice Modal State
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [noticeModalLoading, setNoticeModalLoading] = useState(false);
  const [noticeModalError, setNoticeModalError] = useState<string | null>(null);

  // Load college details from localStorage or API
  useEffect(() => {
    const loadDetails = async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("collegeDetails") : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCollegeDetails(parsed);
          return;
        } catch (_) { }
      }

      if (currentUser) {
        try {
          setLoading(true);
          const res = await getCollegeDetails(currentUser);
          const data = res?.data || res?.message?.data || res?.message;
          if (data) {
            setCollegeDetails(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem("collegeDetails", JSON.stringify(data));
            }
          }
        } catch (err) {
          console.error("Failed to load college details in Notice Board:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (currentUser) {
      loadDetails();
    }
  }, [currentUser]);

  // Fetch events when collegeDetails are available
  const fetchEvents = async (page: number = 1) => {
    const collegeId = collegeDetails?.name;
    if (!collegeId) return;
    try {
      setEventsLoading(true);
      const res = await getCollegeEvents(collegeId, page, 6);
      const data = res?.data || res?.message?.data || res?.message || res;
      if (data && typeof data === 'object') {
        const eventsArray = Array.isArray(data.events) ? data.events : (Array.isArray(data) ? data : []);
        setEventsList(eventsArray);

        if (data.pagination) {
          setCurrentPage(data.pagination.page || page);
          setTotalPages(data.pagination.total_pages || 1);
        } else {
          setCurrentPage(page);
          setTotalPages(1);
        }
      } else {
        setEventsList([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setEventsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collegeDetails) {
      fetchEvents(1);
    }
  }, [collegeDetails]);

  // Listen for details-fetched event from banner
  useEffect(() => {
    const handleDetailsFetched = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("collegeDetails") : null;
      if (stored) {
        try {
          setCollegeDetails(JSON.parse(stored));
        } catch (_) { }
      }
    };
    window.addEventListener("college-details-fetched", handleDetailsFetched);
    return () => window.removeEventListener("college-details-fetched", handleDetailsFetched);
  }, []);

  // Fetch notices when collegeDetails are available
  const fetchNotices = async (page: number = 1) => {
    const collegeId = collegeDetails?.name;
    if (!collegeId) return;
    try {
      setNoticesLoading(true);
      const res = await getCollegeNotices(collegeId, page, 5);
      const data = res?.data || res?.message?.data || res?.message || res;
      if (data && typeof data === 'object') {
        const noticesArray = Array.isArray(data.notice)
          ? data.notice
          : (Array.isArray(data.notices)
            ? data.notices
            : (Array.isArray(data) ? data : []));
        setNoticesList(noticesArray);

        if (data.pagination) {
          setNoticeCurrentPage(data.pagination.page || page);
          setNoticeTotalPages(data.pagination.total_pages || 1);
        } else {
          setNoticeCurrentPage(page);
          setNoticeTotalPages(1);
        }
      } else {
        setNoticesList([]);
        setNoticeCurrentPage(1);
        setNoticeTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setNoticesLoading(false);
    }
  };

  useEffect(() => {
    if (collegeDetails) {
      fetchNotices(1);
    }
  }, [collegeDetails]);

  const handleNoticeModalSubmit = async (formData: any) => {
    setNoticeModalLoading(true);
    setNoticeModalError(null);
    try {
      const collegeId = collegeDetails?.name;
      if (!collegeId) {
        throw new Error("College details not loaded yet");
      }

      const payload = {
        college: collegeId,
        notice: formData.notice,
        date: formData.date,
        notice_type: formData.notice_type,
        company: formData.company || null
      };

      if (editingNotice) {
        await updateCollegeNotice(editingNotice.name, {
          name: editingNotice.name,
          ...payload
        });
        showToast("Notice updated successfully", "success");
      } else {
        await createCollegeNotice(payload);
        showToast("Notice created successfully", "success");
      }

      setIsNoticeModalOpen(false);
      fetchNotices(editingNotice ? noticeCurrentPage : 1);
    } catch (err: any) {
      setNoticeModalError(err?.message || "Failed to save notice");
      showToast(err?.message || "Failed to save notice", "error");
    } finally {
      setNoticeModalLoading(false);
    }
  };

  const handleDeleteNoticeClick = async (noticeName: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteCollegeNotice(noticeName);
        showToast("Notice deleted successfully", "success");
        fetchNotices(noticeCurrentPage);
      } catch (err: any) {
        showToast(err?.message || "Failed to delete notice", "error");
      }
    }
  };

  const handleModalSubmit = async (formData: any) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const collegeId = collegeDetails?.name;
      if (!collegeId) {
        throw new Error("College details not loaded yet");
      }

      const payload = {
        event: formData.event,
        college: collegeId,
        start_date: formData.start_date,
        end_date: formData.end_date,
        price: formData.price,
        event_type: formData.event_type,
        company: formData.company || null,
        participation_scope: formData.participation_scope
      };

      if (editingEvent) {
        await updateCollegeEvent(editingEvent.name, {
          name: editingEvent.name,
          ...payload
        });
        showToast("Event updated successfully", "success");
      } else {
        await createCollegeEvent(payload);
        showToast("Event created successfully", "success");
      }

      setIsModalOpen(false);
      fetchEvents(editingEvent ? currentPage : 1);
    } catch (err: any) {
      setModalError(err?.message || "Failed to save event");
      showToast(err?.message || "Failed to save event", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const eventFields: DynamicField[] = useMemo(() => [
    { name: "event", label: "Event Name", type: "text", required: true, colSpan: 2, placeholder: "e.g., Startup Pitch Battle" },
    {
      name: "event_type",
      label: "Event Type",
      type: "select",
      options: ["Competition", "Hackathon"],
      required: true
    },
    {
      name: "participation_scope",
      label: "Participation Scope",
      type: "select",
      options: ["Inter College", "Intra College"],
      required: true
    },
    { name: "start_date", label: "Start Date", type: "date", required: true, textTransform: "uppercase" },
    { name: "end_date", label: "End Date", type: "date", required: true, textTransform: "uppercase" },
    { name: "price", label: "Prize Pool / Reward", type: "text", required: true, placeholder: "e.g., 30 lakh or ₹5 Lakhs" },
    { name: "company", label: "Partnering Company", type: "text", required: false, colSpan: 2, placeholder: "e.g., Google, TCS (Optional)" }
  ], []);

  const initialValues = useMemo(() => {
    if (editingEvent) {
      return {
        event: editingEvent.event,
        event_type: editingEvent.event_type,
        participation_scope: editingEvent.participation_scope,
        start_date: editingEvent.start_date,
        end_date: editingEvent.end_date,
        price: editingEvent.price,
        company: editingEvent.company || ""
      };
    }
    return {};
  }, [editingEvent]);

  const getEventTheme = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("hackathon")) {
      return {
        prizeIcon: "🏆",
        bgAccent: "bg-orange-50",
        textAccent: "text-orange-600",
        borderAccent: "border-orange-500"
      };
    } else if (t.includes("competition") || t.includes("competation")) {
      return {
        prizeIcon: "🏆",
        bgAccent: "bg-blue-50",
        textAccent: "text-blue-600",
        borderAccent: "border-blue-500"
      };
    } else if (t.includes("startup") || t.includes("pitch")) {
      return {
        prizeIcon: "🎖",
        bgAccent: "bg-emerald-50",
        textAccent: "text-emerald-600",
        borderAccent: "border-emerald-500"
      };
    } else {
      return {
        prizeIcon: "💼",
        bgAccent: "bg-amber-50",
        textAccent: "text-amber-600",
        borderAccent: "border-amber-500"
      };
    }
  };

  const getDaysLeft = (startDateStr: string) => {
    if (!startDateStr) return 0;
    const start = new Date(startDateStr);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatEventDate = (startStr: string, endStr: string) => {
    if (!startStr) return "";
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(startStr);
    const startFormatted = start.toLocaleDateString('en-US', options);

    if (!endStr || startStr === endStr) {
      return startFormatted;
    }

    const end = new Date(endStr);
    const endFormatted = end.toLocaleDateString('en-US', options);

    if (start.getMonth() === end.getMonth()) {
      return `${startFormatted}-${end.getDate()}`;
    }

    return `${startFormatted} - ${endFormatted}`;
  };

  const noticeFields: DynamicField[] = useMemo(() => [
    { name: "notice", label: "Notice Content / Title", type: "text", required: true, colSpan: 2, placeholder: "e.g., VJTI–TCS iON Internship Drive — Applications Open" },
    {
      name: "notice_type",
      label: "Notice Type",
      type: "select",
      options: ["Placement", "Academic", "Event", "Compliance"],
      required: true
    },
    { name: "date", label: "Notice Date", type: "date", required: true },
    { name: "company", label: "Partnering Company", type: "text", required: false, colSpan: 2, placeholder: "e.g., TCS (Optional)" }
  ], []);

  const noticeInitialValues = useMemo(() => {
    if (editingNotice) {
      return {
        notice: editingNotice.notice,
        notice_type: editingNotice.notice_type,
        date: editingNotice.date,
        company: editingNotice.company || ""
      };
    }
    return {
      date: new Date().toISOString().split('T')[0]
    };
  }, [editingNotice]);

  const getNoticeColorClasses = (category: string) => {
    const c = (category || "").toLowerCase();
    if (c.includes("placement")) {
      return {
        bgClass: "bg-orange-500",
        textClass: "text-orange-500"
      };
    } else if (c.includes("academic")) {
      return {
        bgClass: "bg-blue-500",
        textClass: "text-blue-500"
      };
    } else if (c.includes("event")) {
      return {
        bgClass: "bg-emerald-500",
        textClass: "text-emerald-500"
      };
    } else {
      return {
        bgClass: "bg-amber-500",
        textClass: "text-amber-500"
      };
    }
  };

  const formatNoticeDate = (dateStr: string) => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handlePageChange = (page: number) => {
    fetchEvents(page);
  };

  if (loading && eventsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500 font-semibold">Loading Notice Board...</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Notice Board & Events</h2>
          <p className="text-sm font-medium text-slate-500">Manage internal announcements and student events</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Submit Event
        </button>
      </motion.div>

      {/* Main Grid: Left for Events, Right for Digital Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Events & Competitions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Events</h3>
          </div>

          {eventsList.length === 0 ? (
            <BaseCard className="p-8 border-slate-200 border-dashed border-2 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Trophy className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Events Published Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                Publish inter-college or intra-college events for students.
              </p>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Event
              </button>
            </BaseCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsList.map((event, idx) => {
                const theme = getEventTheme(event.event_type);
                const daysLeft = getDaysLeft(event.start_date);
                return (
                  <BaseCard key={event.name || idx} className={`p-5 border-slate-200 border-l-4 ${theme.borderAccent} bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.bgAccent} ${theme.textAccent}`}>
                          {event.event_type}
                        </span>
                        {daysLeft > 0 ? (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔥 {daysLeft} days left
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Ongoing/Ended
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mb-3 truncate" title={event.event}>{event.event}</h3>

                      <div className="space-y-2 text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{formatEventDate(event.start_date, event.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.participation_scope}</span>
                        </div>
                        {event.company && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Partner:</span>
                            <span className="font-semibold text-slate-600 truncate">{event.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{theme.prizeIcon}</span>
                        <span className="text-xs font-bold text-slate-700">{event.price}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-200 hover:border-orange-600 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Pen className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </BaseCard>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Right Column: Digital Notice Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Internal updates</h3>
          </div>

          <BaseCard className="border-slate-200 p-0 overflow-hidden shadow-sm flex flex-col bg-white">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 tracking-wide uppercase">
                <FileText className="w-4 h-4 text-slate-500" />
                Digital Notices
              </h3>
              <button
                onClick={() => {
                  setEditingNotice(null);
                  setIsNoticeModalOpen(true);
                }}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" /> Post Notice
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto max-h-[550px] custom-scrollbar">
              {noticesLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                  <p className="text-xs text-slate-500">Loading notices...</p>
                </div>
              ) : noticesList.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">No notices posted yet</p>
                </div>
              ) : (
                noticesList.map((notice, idx) => {
                  const theme = getNoticeColorClasses(notice.notice_type);
                  return (
                    <div key={notice.name || idx} className="p-3.5 border border-slate-100 rounded-xl relative overflow-hidden bg-white hover:border-slate-200 hover:shadow-sm transition-all group">
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${theme.bgClass}`}></div>
                      <div className="pl-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug pr-12">
                            {notice.notice}
                          </h4>
                          {/* Notice Actions */}
                          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-1">
                            <button
                              onClick={() => {
                                setEditingNotice(notice);
                                setIsNoticeModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-orange-600 transition-colors"
                              title="Edit Notice"
                            >
                              <Pen className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteNoticeClick(notice.name)}
                              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Notice"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${theme.bgClass} bg-opacity-10 ${theme.textClass}`}>
                            {notice.notice_type}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">{formatNoticeDate(notice.date)}</span>
                          {notice.company && (
                            <span className="text-[9px] text-slate-400 font-semibold bg-slate-50 px-1 py-0.5 rounded">
                              {notice.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {noticeTotalPages > 1 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                <Pagination
                  currentPage={noticeCurrentPage}
                  totalPages={noticeTotalPages}
                  onPageChange={(page) => fetchNotices(page)}
                  className="w-full shadow-none border-none p-0 bg-transparent"
                />
              </div>
            )}
          </BaseCard>
        </div>

      </div>

      {/* Edit/Create Event Modal */}
      <DashboardDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit College Event" : "Submit New Event"}
        subtitle={editingEvent ? "Update details for this event" : "Publish a new event on the notice board"}
        headerIcon={Trophy}
        iconBgColor="bg-orange-500"
        fields={eventFields}
        initialValues={initialValues}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
      />

      {/* Edit/Create Notice Modal */}
      <DashboardDynamicModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title={editingNotice ? "Edit Digital Notice" : "Post New Notice"}
        subtitle={editingNotice ? "Update details for this notice" : "Publish a new announcement on the notice board"}
        headerIcon={FileText}
        iconBgColor="bg-blue-600"
        fields={noticeFields}
        initialValues={noticeInitialValues}
        onSubmit={handleNoticeModalSubmit}
        loading={noticeModalLoading}
        error={noticeModalError}
      />
    </motion.div>
  );
}
