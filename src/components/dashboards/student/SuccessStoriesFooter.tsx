"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Briefcase,
  Rocket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  X
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getSuccessStories, createSuccessStory, getStudentByEmail } from "@/services/student.services";

export default function SuccessStoriesFooter({ 
  collegeName, 
  collegeDetailsName,
  hideShareButton = false
}: { 
  collegeName?: string; 
  collegeDetailsName?: string;
  hideShareButton?: boolean;
}) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields state
  const [outcomeCategory, setOutcomeCategory] = useState("Placement");
  const [outcomeTitle, setOutcomeTitle] = useState("");
  const [outcomeMetric, setOutcomeMetric] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [status, setStatus] = useState("Published");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoplayStopped, setIsAutoplayStopped] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getSuccessStories();
      let fetchedStories: any[] = [];
      if (res) {
        if (Array.isArray(res)) {
          fetchedStories = res;
        } else if (res.message && Array.isArray(res.message.data)) {
          fetchedStories = res.message.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          fetchedStories = res.data.data;
        } else if (res.message && Array.isArray(res.message)) {
          fetchedStories = res.message;
        } else if (res.data && Array.isArray(res.data)) {
          fetchedStories = res.data;
        }
      }
      
      let filtered = fetchedStories.filter(s => s && s.testimonial);
      if (collegeName || collegeDetailsName) {
        const cName = (collegeName || "").toLowerCase().trim();
        const cdName = (collegeDetailsName || "").toLowerCase().trim();
        filtered = filtered.filter(story => {
          if (!story.college) return false;
          const storyColl = story.college.toLowerCase().trim();
          return (cName && storyColl === cName) || (cdName && storyColl === cdName);
        });
      }
      setStories(filtered);
    } catch (error) {
      console.error("Error loading success stories in footer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [collegeName, collegeDetailsName]);

  useEffect(() => {
    const loadStudentProfile = async () => {
      if (!currentUser) return;
      try {
        const stored = localStorage.getItem("studentDetails");
        if (stored) {
          setStudentProfile(JSON.parse(stored));
          return;
        }
        const res = await getStudentByEmail(currentUser);
        const data = res?.data || res?.message?.data || res?.message;
        if (data && typeof data === "object") {
          setStudentProfile(data);
          localStorage.setItem("studentDetails", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error loading student profile in footer:", error);
      }
    };
    loadStudentProfile();
  }, [currentUser]);

  // Autoplay slide interval
  useEffect(() => {
    if (stories.length === 0 || isAutoplayStopped) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const cardWidth = clientWidth / 3 || 320;
          scrollContainerRef.current.scrollTo({ left: scrollLeft + cardWidth, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [stories, isAutoplayStopped]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Authentication required. Please log in.", "error");
      return;
    }
    if (!outcomeTitle.trim()) {
      showToast("Outcome Title is required.", "warning");
      return;
    }
    if (!testimonial.trim()) {
      showToast("Testimonial is required.", "warning");
      return;
    }
    
    try {
      setSubmitting(true);
      const payload = {
        student: studentProfile?.name || currentUser,
        outcome_category: outcomeCategory,
        outcome_title: outcomeTitle,
        outcome_metric: outcomeMetric || null,
        testimonial: testimonial,
        status: status
      };
      
      const res = await createSuccessStory(payload);
      if (res) {
        showToast("Success story published successfully!", "success");
        setIsOpen(false);
        setOutcomeTitle("");
        setOutcomeMetric("");
        setTestimonial("");
        setStatus("Published");
        fetchStories();
      }
    } catch (error: any) {
      console.error("Error creating success story in footer:", error);
      showToast(error.message || "Failed to create success story", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStudentDisplayName = (story: any) => {
    if (!story.student) return "StrideNex Student";
    if (story.student.includes("@")) {
      const part = story.student.split("@")[0];
      return part
        .split(".")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return story.student;
  };

  const getInitials = (story: any) => {
    if (story.avatar_initials) return story.avatar_initials;
    const name = getStudentDisplayName(story);
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarStyle = (story: any) => {
    if (story.avatar_color && story.avatar_color.startsWith("#")) {
      return { backgroundColor: story.avatar_color };
    }
    const colors = ["#9333EA", "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
    const charCode = (story.student || "ST").charCodeAt(0);
    return { backgroundColor: colors[charCode % colors.length] };
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "placement":
        return Briefcase;
      case "internship":
        return Award;
      case "higher studies":
        return Rocket;
      case "startup":
      case "entrepreneurship":
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category?.toLowerCase()) {
      case "placement":
        return {
          border: "border-l-orange-500",
          badge: "bg-orange-50 text-orange-600 border-orange-100/80",
          iconBg: "bg-orange-100/50 text-orange-600"
        };
      case "internship":
        return {
          border: "border-l-emerald-500",
          badge: "bg-emerald-50 text-emerald-600 border-emerald-100/80",
          iconBg: "bg-emerald-100/50 text-emerald-600"
        };
      case "startup":
      case "entrepreneurship":
        return {
          border: "border-l-purple-500",
          badge: "bg-purple-50 text-purple-600 border-purple-100/80",
          iconBg: "bg-purple-100/50 text-purple-600"
        };
      default:
        return {
          border: "border-l-blue-500",
          badge: "bg-blue-50 text-blue-600 border-blue-100/80",
          iconBg: "bg-blue-100/50 text-blue-600"
        };
    }
  };

  const scroll = (direction: "left" | "right") => {
    setIsAutoplayStopped(true);
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return null;

  const isCollege = !!(collegeName || collegeDetailsName);

  return (
    <div className="border-t border-slate-200/60 pt-8 mt-12 mb-6 w-full bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
            {isCollege ? "Our Students' Success Stories" : "StrideNex Success Stories"}
          </h3>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            {isCollege ? "Real outcomes achieved by students from our institution" : "Real outcomes achieved by StrideNex students"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!hideShareButton && (
            <Button 
              onClick={() => setIsOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 px-4 py-2 rounded-xl text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Share Your Story
            </Button>
          )}

          {stories.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all bg-white"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
          <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-slate-500 mb-2 font-semibold text-xs">No success stories shared yet.</p>
          {!hideShareButton && (
            <Button onClick={() => setIsOpen(true)} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50/50 text-xs px-3 h-8 rounded-lg">
              Be the first to share!
            </Button>
          )}
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 snap-x snap-mandatory w-full"
          onMouseEnter={() => setIsAutoplayStopped(true)}
          onMouseLeave={() => setIsAutoplayStopped(false)}
        >
          {stories.map((story, index) => {
            const Icon = getCategoryIcon(story.outcome_category);
            const displayName = getStudentDisplayName(story);
            const initials = getInitials(story);
            const avatarStyle = getAvatarStyle(story);
            const cardTheme = getCategoryColors(story.outcome_category);

            return (
              <div 
                key={story.id || index} 
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
              >
                <BaseCard className={`overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 border-slate-200 bg-white h-[180px] flex flex-col justify-between relative group rounded-xl border-l-[4px] ${cardTheme.border}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="p-4 flex flex-col justify-between h-full space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="w-7 h-7 border border-slate-100 shadow-sm shrink-0">
                          <AvatarFallback style={avatarStyle} className="text-white font-bold text-[9px]">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-[11px] leading-tight truncate">{displayName}</h4>
                          <p className="text-[9px] text-slate-400 font-semibold truncate" title={story.college}>{story.college || "StrideNex Student"}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${cardTheme.badge} text-[8px] font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wider shrink-0`}>
                        {story.outcome_category}
                      </Badge>
                    </div>

                    <div className="bg-slate-50/70 border border-slate-100/80 rounded-lg p-2 relative min-h-[48px] flex items-center group-hover:bg-slate-100/35 transition-colors duration-200">
                      <Quote className="w-6 h-6 text-slate-200/40 absolute right-1 top-0.5 pointer-events-none" />
                      <p className="text-[10px] text-slate-650 italic leading-relaxed line-clamp-2 pr-5">
                        "{story.testimonial}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1 rounded-lg shrink-0 ${cardTheme.iconBg}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[7px] text-slate-400 font-bold block uppercase tracking-wider leading-none mb-0.5">Outcome</span>
                          <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{story.outcome_title}</p>
                        </div>
                      </div>
                      {story.outcome_metric && (
                        <div className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black shadow-sm shrink-0 ml-2">
                          {story.outcome_metric}
                        </div>
                      )}
                    </div>
                  </div>
                </BaseCard>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Dialog Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999]"
            />
            
            {/* Modal Center Wrapper */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] pointer-events-none">
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 relative text-white flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Share Your Success Story</h2>
                      <p className="text-white/80 text-sm mt-0.5">Inspire the StrideNex community with your achievement</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Category</label>
                    <select
                      value={outcomeCategory}
                      onChange={(e) => setOutcomeCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="Placement">Placement</option>
                      <option value="Startup">Startup</option>
                      <option value="Internship">Internship</option>
                      <option value="Higher Studies">Higher Studies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SDE @ Google, ML Engineer @ Microsoft"
                      value={outcomeTitle}
                      onChange={(e) => setOutcomeTitle(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Metric / Package (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹42 LPA, ₹12 LPA"
                      value={outcomeMetric}
                      onChange={(e) => setOutcomeMetric(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Testimonial</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your experience and how StrideNex helped you achieve your goals..."
                      value={testimonial}
                      onChange={(e) => setTestimonial(e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none bg-white text-slate-800"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-sm font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="px-6 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Publishing...
                        </>
                      ) : (
                        "Publish Story"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
