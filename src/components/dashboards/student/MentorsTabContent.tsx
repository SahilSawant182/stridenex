// components/dashboards/student/MentorsTabContent.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle
} from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getMentorListings, getMentorSlotCalendar, bookMentorSlot, getMentorNextAvailableSlot, createGroupSessionBooking, getBookedSessions } from "@/services/student.services";

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

export default function MentorsTabContent() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Booking Modal States
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [slotCalendarData, setSlotCalendarData] = useState<{ [date: string]: any[] }>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<any | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleBookSession = async (mentor: Mentor) => {
    setSelectedMentorForBooking(mentor);
    setIsLoadingSlots(true);
    // Reset previous booking states
    setSelectedSlotForBooking(null);
    setBookingTopic("");
    try {
      const response = await getMentorSlotCalendar(mentor.email);
      if (response && response.message) {
        setSlotCalendarData(response.message);
        const dates = Object.keys(response.message);
        if (dates.length > 0) {
          // Sort dates to show earliest first
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
    if (!selectedMentorForBooking) return;
    
    setIsBooking(true);
    try {
      const studentEmail = localStorage.getItem("currentUser") || "";

      if (selectedMentorForBooking.offering_type === "Group Session") {
        const payload = {
          offering: selectedMentorForBooking.id,
          batch_name: selectedMentorForBooking.batch_name || "offering-gs-1",
          student: studentEmail
        };
        
        const response = await createGroupSessionBooking(payload);
        
        if (response && response.exc_type) {
          let errMsg = "Failed to book group session. Please try again.";
          if (response._server_messages) {
            try {
              const messages = JSON.parse(response._server_messages);
              const msgObj = JSON.parse(messages[0]);
              errMsg = msgObj.message || errMsg;
            } catch (e) {
              console.error("Error parsing server messages:", e);
            }
          }
          alert(errMsg);
          return;
        }

        // Close modal and reset
        setSelectedMentorForBooking(null);
        alert(`Group Session booked successfully! ID: ${response?.message?.session_name || ""}`);
        fetchMentors();
        fetchBookedSessions();
        return;
      }

      // 1:1 Mentorship Logic
      if (!selectedDate || !selectedSlotForBooking) return;

      const payload = {
        mentor: selectedMentorForBooking.email,
        student: studentEmail,
        offering: selectedMentorForBooking.id,
        session_date: selectedDate,
        from_time: selectedSlotForBooking.from_time,
        to_time: selectedSlotForBooking.to_time,
        topic: bookingTopic || "General Mentorship"
      };
      
      const response = await bookMentorSlot(payload);
      
      if (response && response.exc_type) {
        let errMsg = "Failed to book session. Please try again.";
        if (response._server_messages) {
          try {
            const messages = JSON.parse(response._server_messages);
            const msgObj = JSON.parse(messages[0]);
            errMsg = msgObj.message || errMsg;
          } catch (e) {
            console.error("Error parsing server messages:", e);
          }
        }
        alert(errMsg);
        return;
      }
      
      // Close modal and reset
      setSelectedMentorForBooking(null);
      setSelectedDate(null);
      setSelectedSlotForBooking(null);
      setBookingTopic("");
      setSlotCalendarData({});
      
      // Show success and refresh
      alert(`Session booked successfully! ID: ${response?.message?.session_name || ""}`);
      fetchMentors();
      fetchBookedSessions();
    } catch (err) {
      console.error("Error booking session:", err);
      alert("Failed to book session. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };



  useEffect(() => {
    fetchMentors();
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

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("currentUser") || "";

      const response = await getMentorListings();
      console.log(response, 'response')
      if (response && response.message && Array.isArray(response.message)) {
        const mappedMentors = response.message.map((m: any, index: number) => {
          const name = m.full_name || m.mentor || "Unknown Mentor";
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "M";

          return {
            id: m.offering_name || `mentor-${index}`,
            name: name,
            email: m.mentor || "unknown@example.com",
            initials,
            role: m.designation || "Mentor",
            company: m.company || "Independent",
            expertise: m.tags || [],
            rating: m.avg_rating || 0,
            sessions: m.total_sessions || 0,
            hourlyRate: m.price_per_hour ? `₹${m.price_per_hour}/hr` : "Free",
            availability: m.next_slot || "Contact for availability",
            tags: m.tags || [],
            avatarColor: COLORS[index % COLORS.length],
            profileImage: m.profile_image || "",
            offering_type: m.offering_type || "1:1 Mentorship",
            batch_name: m.batch_name || ""
          };
        });
        setMentors(mappedMentors);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-500">
        <div className="animate-pulse flex items-center gap-2">
          <BookOpen className="animate-spin w-5 h-5" />
          <span>Loading mentors...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

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
              placeholder="Search mentors..."
              className="pl-9 pr-4 py-2 w-full md:w-64 bg-white border-slate-200 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200 shrink-0">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </motion.div>

      {mentors.length === 0 ? (
        <motion.div variants={item} className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          No mentors available at the moment.
        </motion.div>
      ) : (
        /* Mentors Grid */
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                      className={`${
                        isSessionAlreadyBooked(mentor)
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
                            className={`${
                              session.priority === 'High' 
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
                          className={`${
                            session.status === 'Scheduled' 
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
              {selectedMentorForBooking.offering_type === "Group Session" ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Group Session Enrollment</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      You are about to join a group mentorship session. Group sessions follow a preset schedule managed by the mentor.
                    </p>
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offering ID</span>
                         <span className="text-sm font-bold text-slate-700">{selectedMentorForBooking.id}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Batch</span>
                         <span className="text-sm font-bold text-slate-700">{selectedMentorForBooking.batch_name || "N/A"}</span>
                       </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-bold shadow-xl shadow-orange-500/20"
                    onClick={handleConfirmBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? "Enrolling..." : "Confirm Enrollment"}
                  </Button>
                </div>
              ) : isLoadingSlots ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <BookOpen className="animate-spin w-8 h-8 mb-4 text-orange-500" />
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
                          className={`snap-start shrink-0 px-4 py-3 rounded-xl border transition-all ${
                            selectedDate === date
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
                              className={`p-3 rounded-xl border text-center transition-all ${
                                !isAvailable
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
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}