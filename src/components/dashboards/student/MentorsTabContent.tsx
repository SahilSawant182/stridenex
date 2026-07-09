// components/dashboards/student/MentorsTabContent.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  Award,
  BookOpen,
  Code,
  Database,
  TrendingUp,
  MessageSquare,
  Target,
  Search,
  Filter,
  ChevronRight,
  X,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/Pagination";
import { getMentorList, getMentorSlotCalendar, bookMentorSlot, getMentorNextAvailableSlot, getBookedSessions, getMentorOfferings, initiateSessionBooking, verifySessionPayment } from "@/services/student.services";

// Types
interface Mentor {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  company: string;
  expertise: string[];
  rating: number;
  sessions: number;
  hourlyRate: string;
  availability: string;
  nextSlot?: string;
  tags: string[];
  avatarColor: string;
  profileImage: string;
  nextAvailableSlot?: string;
  offering_type?: string;
  batch_name?: string;
}

interface BookedSession {
  name: string;
  mentor: string;
  offering_type: string;
  session_date: string;
  session_type: string;
  status: string;
  priority: string;
  topic: string;
  from_time: string;
  to_time: string;
  duration: string;
}

const COLORS = [
  "bg-purple-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-600", "bg-pink-600", "bg-indigo-600"
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: new (options: Record<string, any>) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

// Loads the Razorpay checkout.js SDK dynamically (idempotent).
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function MentorsTabContent() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const PAGE_SIZE = 20;

  // Search states
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 1000);
  };

  const handleSearchSubmit = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSearchQuery(searchVal);
    setCurrentPage(1);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && searchVal && document.activeElement !== searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, [loading, searchVal]);

  // Booking Modal States
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [mentorOfferings, setMentorOfferings] = useState<any[]>([]);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [selectedOfferingForBooking, setSelectedOfferingForBooking] = useState<any | null>(null);
  const [slotCalendarData, setSlotCalendarData] = useState<{ [date: string]: any[] }>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<any | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleBookSession = async (mentor: Mentor) => {
    setSelectedMentorForBooking(mentor);
    setSelectedOfferingForBooking(null);
    setSelectedSlotForBooking(null);
    setSelectedDate(null);
    setBookingTopic("");
    setSlotCalendarData({});
    setIsLoadingOfferings(true);
    try {
      const response = await getMentorOfferings(mentor.email);
      const data = response?.message?.data || response?.message || response?.data || [];
      setMentorOfferings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading mentor offerings:", err);
      setMentorOfferings([]);
    } finally {
      setIsLoadingOfferings(false);
    }
  };

  const handleSelectOffering = async (offering: any) => {
    setSelectedOfferingForBooking(offering);
    if (!selectedMentorForBooking) return;
    setIsLoadingSlots(true);
    setSelectedSlotForBooking(null);
    setSelectedDate(null);
    setBookingTopic("");
    try {
      const response = await getMentorSlotCalendar(selectedMentorForBooking.email);
      if (response && response.message) {
        setSlotCalendarData(response.message);
        const dates = Object.keys(response.message);
        if (dates.length > 0) {
          dates.sort();
          setSelectedDate(dates[0]);
        } else {
          setSelectedDate(null);
        }
      } else {
        setSlotCalendarData({});
        setSelectedDate(null);
      }
    } catch (err) {
      console.error("Error loading slot calendar:", err);
      setSlotCalendarData({});
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedMentorForBooking || !selectedOfferingForBooking) return;
    if (!selectedDate || !selectedSlotForBooking) return;

    setIsBooking(true);

    try {
      const studentEmail = localStorage.getItem("currentUser") || "";

      const sessionPayload = {
        mentor: selectedMentorForBooking.email,
        student: studentEmail,
        offering: selectedOfferingForBooking.name,
        session_date: selectedDate,
        from_time: selectedSlotForBooking.from_time,
        to_time: selectedSlotForBooking.to_time,
        topic: bookingTopic || selectedOfferingForBooking.title || "General Mentorship",
        amount: selectedOfferingForBooking.price_per_session ?? 0,
      };

      // Phase 1: Create booking / Razorpay order on the backend
      const initResponse = await initiateSessionBooking(sessionPayload);
      const initData = initResponse?.message ?? initResponse;

      // Debug: log what the backend actually returned
      console.log("[initiateSessionBooking] initData:", initData);

      // Free-session fast path
      if (initData?.payment_required === false) {
        setSelectedMentorForBooking(null);
        setSelectedOfferingForBooking(null);
        setMentorOfferings([]);
        setSelectedDate(null);
        setSelectedSlotForBooking(null);
        setBookingTopic("");
        setSlotCalendarData({});
        alert(`Session booked successfully! ID: ${initData?.booking_id ?? ""}`);
        fetchMentors();
        fetchBookedSessions();
        return;
      }

      // Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert("Failed to load payment gateway. Please check your internet connection and try again.");
        setIsBooking(false);
        return;
      }

      const { order_id, api_key, booking_id } = initData as {
        order_id: string;
        api_key: string;
        booking_id: string;
      };

      if (!api_key || !order_id || !booking_id) {
        throw new Error(
          `Backend did not return the required payment fields. ` +
          `Received → api_key: "${api_key}", order_id: "${order_id}", booking_id: "${booking_id}". ` +
          `Check the server logs for the 500 error details.`
        );
      }

      // Phase 2: Open Razorpay checkout
      const options: Record<string, any> = {
        key: api_key,
        order_id: order_id,
        name: "StrideNex Mentorship",
        description: sessionPayload.topic,
        prefill: {
          email: studentEmail,
        },
        theme: { color: "#f97316" },

        // Payment success
        handler: async (razorpayResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifySessionPayment({
              booking_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            // Reset UI and refresh lists
            setSelectedMentorForBooking(null);
            setSelectedOfferingForBooking(null);
            setMentorOfferings([]);
            setSelectedDate(null);
            setSelectedSlotForBooking(null);
            setBookingTopic("");
            setSlotCalendarData({});
            alert("Payment successful! Your session has been confirmed.");
            fetchMentors();
            fetchBookedSessions();
          } catch (verifyErr) {
            console.error("Payment verification failed:", verifyErr);
            alert("Payment received but verification failed. Please contact support.");
          } finally {
            setIsBooking(false);
          }
        },

        // Payment failure
        modal: {
          ondismiss: () => {
            // User closed the popup without paying
            setIsBooking(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure events
      rzp.on("payment.failed", (failResponse: any) => {
        console.error("Razorpay payment failed:", failResponse);
        alert(
          `Payment failed: ${failResponse?.error?.description ?? "Unknown error"}. Please try again.`
        );
        setIsBooking(false);
      });

      rzp.open();

    } catch (err) {
      console.error("Error during booking flow:", err);
      alert(err instanceof Error ? err.message : "Failed to initiate booking. Please try again.");
      setIsBooking(false);
    }
  };



  useEffect(() => {
    fetchMentors(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchBookedSessions();
  }, []);

  const fetchBookedSessions = async () => {
    try {
      setLoadingSessions(true);
      const studentEmail = localStorage.getItem("currentUser") || "";
      const response = await getBookedSessions(studentEmail);

      if (response && response.message && Array.isArray(response.message)) {
        setBookedSessions(response.message);
      } else {
        setBookedSessions([]);
      }
    } catch (err) {
      console.error("Error loading booked sessions:", err);
      setBookedSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Helper function to check if a session is already booked
  const isSessionAlreadyBooked = (mentor: Mentor) => {
    return bookedSessions.some(session =>
      session.mentor === mentor.email &&
      session.offering_type === mentor.offering_type &&
      (session.status === 'Scheduled' || session.status === 'Accepted')
    );
  };

  const fetchMentors = async (page: number = currentPage, search: string = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMentorList(page, PAGE_SIZE, search);
      console.log(response, 'response');

      const dataObj = response?.data || {};
      const mentorList = dataObj.Mentor || [];
      const paginationData = dataObj.pagination || {
        total: mentorList.length,
        page: page,
        page_size: PAGE_SIZE,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      };

      if (Array.isArray(mentorList)) {
        const mappedMentors = mentorList.map((m: any, index: number) => {
          const name = `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.name || "Unknown Mentor";
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "M";

          const expertise = m.domain
            ? [m.domain, m.other_domain].filter(Boolean)
            : (m.type && m.type !== "RAW" ? [m.type] : []);

          return {
            id: m.name || `mentor-${index}`,
            name: name,
            email: m.email_id || m.name || "unknown@example.com",
            initials,
            role: m.role || m.type || "Mentor",
            company: m.company || "Independent",
            expertise: expertise,
            rating: m.avg_rating || 0,
            sessions: m.total_sessions || 0,
            hourlyRate: "Free",
            availability: "Contact for availability",
            tags: expertise,
            avatarColor: COLORS[index % COLORS.length],
            profileImage: m.profile_image || "",
            offering_type: "1:1 Mentorship",
            batch_name: ""
          };
        });
        setMentors(mappedMentors);
        setPagination(paginationData);
      } else {
        setMentors([]);
      }
    } catch (err) {
      console.error("Error loading mentors:", err);
      setError("Failed to load mentor listings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch next available slots in background
  useEffect(() => {
    if (mentors.length > 0 && mentors.some(m => !m.nextAvailableSlot)) {
      const fetchSlots = async () => {
        const updateMentorSlot = async (mentorEmail: string) => {
          try {
            const response = await getMentorNextAvailableSlot(mentorEmail);
            if (response && response.message) {
              setMentors(currentMentors =>
                currentMentors.map(m =>
                  m.email === mentorEmail
                    ? { ...m, nextAvailableSlot: response.message }
                    : m
                )
              );
            }
          } catch (err) {
            console.error(`Error fetching slot for ${mentorEmail}:`, err);
          }
        };

        // Fetch concurrently for all mentors
        await Promise.all(mentors.map(m => updateMentorSlot(m.email)));
      };

      fetchSlots();
    }
  }, [mentors.length]);



  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mentors</h1>
          <p className="text-slate-500 mt-1">Connect with industry experts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={searchInputRef}
              placeholder="search for email"
              className="pl-9 pr-4 py-2 w-full md:w-64 bg-white border-slate-200 text-sm"
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200 shrink-0">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="animate-pulse flex items-center gap-2">
            <Loader2 className="animate-spin w-5 h-5 text-orange-500" />
            <span>Loading mentors...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 bg-white rounded-xl border border-slate-200 border-dashed">
          {error}
        </div>
      ) : mentors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed"
        >
          {searchQuery ? "No mentors found matching your search." : "No mentors available at the moment."}
        </motion.div>
      ) : (
        <>
          {/* Mentors Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {mentors.map((mentor) => (
              <BaseCard key={mentor.id} className="overflow-hidden hover:shadow-lg transition-all group">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex-1">
                    {/* Header with Avatar and Company */}
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <Avatar className="w-11 h-11 shrink-0">
                          {mentor.profileImage ? (
                            <AvatarImage src={mentor.profileImage} alt={mentor.name} className="object-cover" />
                          ) : null}
                          <AvatarFallback className={`${mentor.avatarColor} text-white font-medium`}>
                            {mentor.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 break-all text-sm leading-tight mt-0.5" title={mentor.name}>
                            {mentor.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-1" title={`${mentor.role} • ${mentor.company}`}>
                            <Briefcase className="w-3 h-3 shrink-0" />
                            <span className="truncate">{mentor.role} • {mentor.company}</span>
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${isSessionAlreadyBooked(mentor)
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          } text-[10px] px-1.5 py-0 shrink-0 h-fit mt-0.5`}
                      >
                        {isSessionAlreadyBooked(mentor) ? 'Booked' : 'Available'}
                      </Badge>
                    </div>

                    {/* Expertise Tags */}
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {mentor.expertise.map((exp, i) => (
                          <Badge key={i} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-slate-800">{mentor.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({mentor.sessions})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{mentor.hourlyRate}</span>
                      </div>
                    </div>

                    {/* Next Available */}
                    <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600">Next available: </span>
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {mentor.nextAvailableSlot || mentor.availability}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    {isSessionAlreadyBooked(mentor) ? (
                      <Button
                        className="flex-1 bg-slate-400 text-white text-sm cursor-not-allowed"
                        disabled
                      >
                        Booked
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                        onClick={() => handleBookSession(mentor)}
                      >
                        Book Session
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="border-slate-200 shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>
              </BaseCard>
            ))}
          </motion.div>
          {pagination.total_pages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Booked Sessions Section */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Your Booked Sessions</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            {bookedSessions.length} Sessions
          </Badge>
        </div>

        {loadingSessions ? (
          <div className="flex justify-center items-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            <div className="animate-pulse flex items-center gap-2">
              <Clock className="animate-spin w-5 h-5" />
              <span>Loading your sessions...</span>
            </div>
          </div>
        ) : bookedSessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No booked sessions found.</p>
            <p className="text-sm mt-1">Book a session with a mentor to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookedSessions.map((session, index) => (
              <BaseCard key={index} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Session Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 truncate">{session.name}</h3>
                          <Badge
                            variant="outline"
                            className={`${session.priority === 'High'
                                ? 'bg-red-50 text-red-600 border-red-200 font-medium'
                                : session.priority === 'Medium'
                                  ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                  : 'bg-green-50 text-green-600 border-green-200'
                              }`}
                          >
                            {session.priority} Priority
                          </Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${session.status === 'Scheduled'
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : session.status === 'Completed'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : session.status === 'Cancelled'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                        >
                          {session.status}
                        </Badge>
                      </div>

                      {/* Session Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="truncate">Mentor: {session.mentor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(session.session_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{session.from_time} - {session.to_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Target className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{session.topic}</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <span>Type: {session.session_type}</span>
                        <span>Duration: {session.duration}</span>
                        <span>Offering: {session.offering_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseCard>
            ))}
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
      {selectedMentorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Book Session</h2>
                <p className="text-sm text-slate-500 mt-1">with {selectedMentorForBooking.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedMentorForBooking(null);
                  setSelectedOfferingForBooking(null);
                  setMentorOfferings([]);
                  setSelectedDate(null);
                  setSelectedSlotForBooking(null);
                  setBookingTopic("");
                  setSlotCalendarData({});
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {!selectedOfferingForBooking ? (
                // Step 1: Offerings Selection Screen
                isLoadingOfferings ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Loader2 className="animate-spin w-8 h-8 mb-4 text-orange-500" />
                    <span>Loading mentor offerings...</span>
                  </div>
                ) : mentorOfferings.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                    No offerings available for this mentor.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Select an Offering</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {mentorOfferings.map((offering) => (
                        <div
                          key={offering.name}
                          onClick={() => handleSelectOffering(offering)}
                          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-slate-800 text-sm">{offering.title}</h4>
                              <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[10px] px-2 py-0">
                                {offering.offering_type}
                              </Badge>
                              <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] px-2 py-0">
                                {offering.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{offering.description}</p>
                            <div className="flex gap-4 text-[11px] font-semibold text-slate-400">
                              <span>Duration: {offering.duration_minutes} mins</span>
                              {offering.max_group_size > 1 && <span>Max Size: {offering.max_group_size}</span>}
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-lg font-extrabold text-slate-800">
                              {offering.price_per_session ? `₹${offering.price_per_session}` : "Free"}
                            </div>
                            <div className="text-xs text-slate-400">Per Session</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                // Step 2: Slot/Booking Screen
                <div className="space-y-6">
                  {/* Selected Offering Summary */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Selected Offering</span>
                      <h4 className="font-bold text-slate-800 text-sm">{selectedOfferingForBooking.title}</h4>
                      <span className="text-xs text-slate-500">{selectedOfferingForBooking.offering_type} • {selectedOfferingForBooking.price_per_session ? `₹${selectedOfferingForBooking.price_per_session}` : "Free"}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOfferingForBooking(null);
                        setSelectedSlotForBooking(null);
                        setSelectedDate(null);
                        setBookingTopic("");
                        setSlotCalendarData({});
                      }}
                      className="border-slate-200 text-xs font-semibold hover:bg-slate-50 shrink-0"
                    >
                      Change
                    </Button>
                  </div>

                  {isLoadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <Loader2 className="animate-spin w-8 h-8 mb-4 text-orange-500" />
                      <span>Loading available slots...</span>
                    </div>
                  ) : Object.keys(slotCalendarData).length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                      No slots available for this mentor.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Date Selector */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          Select Date
                        </h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                          {Object.keys(slotCalendarData).map((date) => (
                            <button
                              key={date}
                              onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlotForBooking(null);
                              }}
                              className={`snap-start shrink-0 px-4 py-3 rounded-xl border transition-all ${selectedDate === date
                                  ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50/50"
                                }`}
                            >
                              <div className="text-xs font-medium uppercase opacity-70 mb-1">
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="font-semibold whitespace-nowrap">
                                {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Slots Grid */}
                      {selectedDate && slotCalendarData[selectedDate] && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            Available Slots
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                            {slotCalendarData[selectedDate].map((slot: any, idx: number) => {
                              const isAvailable = slot.status === "available";
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (isAvailable) setSelectedSlotForBooking(slot);
                                  }}
                                  className={`p-3 rounded-xl border text-center transition-all ${!isAvailable
                                      ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                                      : selectedSlotForBooking === slot
                                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 cursor-pointer"
                                        : "bg-white border-emerald-200 hover:border-emerald-500 hover:shadow-md cursor-pointer group"
                                    }`}
                                >
                                  <div className={`text-sm font-semibold ${isAvailable ? (selectedSlotForBooking === slot ? "text-emerald-800" : "text-slate-800 group-hover:text-emerald-700") : "text-slate-500"}`}>
                                    {slot.from_time.slice(0, 5)} - {slot.to_time.slice(0, 5)}
                                  </div>
                                  <div className={`text-[10px] mt-1 font-medium ${isAvailable ? "text-emerald-600" : "text-slate-400"}`}>
                                    {isAvailable ? "Available" : "Booked"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Topic and Confirm */}
                      {selectedSlotForBooking && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4"
                        >
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Session Topic / Description (Optional)</label>
                            <Input
                              placeholder="e.g. Mock Interview Prep"
                              className="bg-white border-slate-200 text-sm"
                              value={bookingTopic}
                              onChange={(e) => setBookingTopic(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-bold shadow-xl shadow-emerald-500/10"
                            onClick={handleConfirmBooking}
                            disabled={isBooking}
                          >
                            {isBooking ? "Booking..." : "Confirm Booking"}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}