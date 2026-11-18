"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Video,
  Users,
  HelpCircle,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Compass
} from "lucide-react";
import { createPortal } from "react-dom";

export interface MentorSidebarTourStep {
  id: string;
  name: string;
  title: string;
  icon: any;
  badge: string;
  description: string;
}

export const MENTOR_SIDEBAR_STEPS: MentorSidebarTourStep[] = [
  {
    id: "tour-sidebar-overview",
    name: "Overview",
    title: "Overview Dashboard",
    icon: LayoutDashboard,
    badge: "Mentor Hub",
    description: "Your central mentorship control center tracking upcoming sessions, total mentees guided, review ratings, and revenue."
  },
  {
    id: "tour-sidebar-schedule",
    name: "Schedule",
    title: "Availability Schedule",
    icon: Calendar,
    badge: "Availability",
    description: "Manage your weekly calendar, configure booking availability slots, and sync upcoming one-on-one sessions."
  },
  {
    id: "tour-sidebar-offerings",
    name: "Offerings",
    title: "Mentorship Offerings",
    icon: Video,
    badge: "Services",
    description: "Create and customize mentorship offerings such as mock technical interviews, resume audits, and portfolio reviews."
  },
  {
    id: "tour-sidebar-community",
    name: "Community",
    title: "Mentor Community",
    icon: Users,
    badge: "Discussions",
    description: "Participate in student discussions, answer questions, share industry tips, and establish your mentorship footprint."
  },
  {
    id: "tour-sidebar-requests",
    name: "Requests",
    title: "Mentee Booking Requests",
    icon: HelpCircle,
    badge: "Inquiries",
    description: "Review, accept, or reschedule incoming session booking requests and student guidance inquiry applications."
  },
  {
    id: "tour-sidebar-session-history",
    name: "Session History",
    title: "Session History & Logs",
    icon: BookOpen,
    badge: "Past Sessions",
    description: "View past completed mentorship sessions, attendee notes, provided guidance logs, and mentee ratings."
  },
  {
    id: "tour-sidebar-payouts---commission",
    name: "Payouts & Commission",
    title: "Payouts & Earnings",
    icon: MessageSquare,
    badge: "Finances",
    description: "Track your completed session earnings, pending platform transfers, revenue analytics, and bank payout history."
  },
  {
    id: "tour-sidebar-my-profile",
    name: "My Profile",
    title: "Mentor Public Profile",
    icon: TrendingUp,
    badge: "Public Brand",
    description: "Showcase your professional experience, domain expertise, verified credentials, and client testimonials to attract mentees."
  },
  {
    id: "tour-sidebar-lms-studio",
    name: "LMS Studio",
    title: "LMS Studio Courses",
    icon: BookOpen,
    badge: "Course Studio",
    description: "Browse learning courses, reference curriculum materials, and share relevant video courses with your mentees."
  }
];

interface MentorGuidelineTourProps {
  mentorEmail?: string;
  disabled?: boolean;
  isFirstLogin?: boolean;
}

export default function MentorGuidelineTour({
  mentorEmail,
  disabled,
  isFirstLogin = false
}: MentorGuidelineTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [activeSteps, setActiveSteps] = useState<MentorSidebarTourStep[]>(MENTOR_SIDEBAR_STEPS);
  const popupRef = useRef<HTMLDivElement>(null);

  const startTour = useCallback(() => {
    if (disabled) return;

    const presentSteps = MENTOR_SIDEBAR_STEPS.filter((step) => {
      const el =
        document.querySelector(`[data-tour-sidebar="${step.name}"]`) ||
        document.getElementById(step.id);
      return !!el;
    });

    const stepsToUse = presentSteps.length > 0 ? presentSteps : MENTOR_SIDEBAR_STEPS;
    setActiveSteps(stepsToUse);
    setCurrentIndex(0);
    setIsOpen(true);
  }, [disabled]);

  useEffect(() => {
    setMounted(true);

    if (disabled) {
      setIsOpen(false);
      return;
    }

    const userKey = mentorEmail ? `has_seen_mentor_tour_${mentorEmail}` : "has_seen_mentor_tour";
    const hasSeen = localStorage.getItem(userKey) === "true";

    const isFirstTimeUser = isFirstLogin;

    let timer: NodeJS.Timeout | null = null;
    // ONLY auto-launch if explicitly first-time login
    if (isFirstTimeUser && !hasSeen) {
      timer = setTimeout(() => {
        startTour();
      }, 800);
    }

    // Auto-launch when triggered from Support page or tour query param
    const shouldForceTour =
      typeof window !== "undefined" &&
      (sessionStorage.getItem("launch_tour_on_mount") === "true" ||
        new URLSearchParams(window.location.search).get("tour") === "true");

    if (shouldForceTour) {
      sessionStorage.removeItem("launch_tour_on_mount");
      timer = setTimeout(() => {
        startTour();
      }, 400);
    }

    const handleCustomTrigger = () => {
      startTour();
    };
    window.addEventListener("open-mentor-tour", handleCustomTrigger);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("open-mentor-tour", handleCustomTrigger);
    };
  }, [disabled, startTour, mentorEmail, isFirstLogin]);

  const updateTargetPosition = useCallback(() => {
    if (!isOpen || activeSteps.length === 0) return;
    const currentStep = activeSteps[currentIndex];
    if (!currentStep) return;

    const el =
      document.querySelector(`[data-tour-sidebar="${currentStep.name}"]`) ||
      document.getElementById(currentStep.id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentIndex, activeSteps]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(updateTargetPosition, 100);
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition, true);
    };
  }, [isOpen, currentIndex, updateTargetPosition]);

  const handleNext = () => {
    if (currentIndex < activeSteps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishTour = () => {
    setIsOpen(false);
    const userKey = mentorEmail ? `has_seen_mentor_tour_${mentorEmail}` : "has_seen_mentor_tour";
    localStorage.setItem(userKey, "true");
    if (mentorEmail && typeof window !== "undefined") {
      sessionStorage.setItem(`completed_mentor_tour_${mentorEmail}`, "true");
      localStorage.setItem(`is_first_login_${mentorEmail}`, "false");
      sessionStorage.removeItem(`is_first_login_${mentorEmail}`);
      sessionStorage.removeItem("just_signed_up");
    }
  };

  if (!mounted) return null;

  const currentStep = activeSteps[currentIndex] || activeSteps[0];
  const totalSteps = activeSteps.length;
  const StepIcon = currentStep.icon;

  let popupTop = 100;
  let popupLeft = 260;
  let arrowTop = 32;
  const popupWidth = typeof window !== "undefined" ? Math.min(360, window.innerWidth - 32) : 340;
  const popupHeight = 220;

  if (targetRect && typeof window !== "undefined") {
    const isSidebarOnLeft = targetRect.left < window.innerWidth / 2;

    if (isSidebarOnLeft && targetRect.left + targetRect.width + popupWidth + 24 < window.innerWidth) {
      popupLeft = targetRect.left + targetRect.width + 16;
      let computedTop = targetRect.top + targetRect.height / 2 - 50;
      if (computedTop < 16) computedTop = 16;
      if (computedTop + popupHeight > window.innerHeight - 16) {
        computedTop = window.innerHeight - popupHeight - 16;
      }
      popupTop = computedTop;
      const itemCenterY = targetRect.top + targetRect.height / 2;
      arrowTop = Math.max(16, Math.min(popupHeight - 20, itemCenterY - popupTop));
    } else {
      popupTop = targetRect.top + targetRect.height + 14;
      popupLeft = Math.max(16, Math.min(window.innerWidth - popupWidth - 16, targetRect.left));
      arrowTop = 0;
    }
  }

  const tourContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-none">
          <div
            onClick={finishTour}
            className="absolute inset-0 pointer-events-auto bg-transparent"
          />

          {targetRect && (
            <motion.div
              layoutId="tour-mentor-sidebar-highlight"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "fixed",
                top: targetRect.top - 3,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 6,
              }}
              className="rounded-xl border-2 border-violet-500 bg-violet-500/10 shadow-[0_0_18px_rgba(124,58,237,0.45)] ring-4 ring-violet-400/20 z-[100000] pointer-events-none flex items-center justify-end pr-2"
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            </motion.div>
          )}

          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, x: -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            style={{
              position: "fixed",
              top: popupTop,
              left: popupLeft,
              width: popupWidth,
            }}
            className="pointer-events-auto z-[100001] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-800"
          >
            <div
              style={{ top: arrowTop }}
              className="absolute -left-2 w-4 h-4 bg-white border-b border-l border-slate-200 transform rotate-45 z-10"
            />

            <div className="relative bg-gradient-to-r from-violet-50 via-purple-50 to-white px-5 pt-3.5 pb-2.5 border-b border-violet-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
                  <StepIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100/90 px-2 py-0.5 rounded-full">
                      {currentStep.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Tab {currentIndex + 1} of {totalSteps}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {currentStep.name}
                  </h4>
                </div>
              </div>

              <button
                onClick={finishTour}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                title="Skip tour"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-3">
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {currentStep.description}
              </p>
            </div>

            <div className="px-5 pb-3.5 pt-2 flex flex-col gap-2.5 border-t border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                {activeSteps.map((step, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentIndex(idx)}
                      title={`Go to ${step.name} (${idx + 1}/${totalSteps})`}
                      aria-label={`Go to ${step.name}`}
                      className={`h-2 transition-all duration-200 rounded-full ${
                        isActive
                          ? "w-6 bg-violet-600 shadow-sm"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    currentIndex === 0
                      ? "text-slate-300 bg-transparent cursor-not-allowed"
                      : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={finishTour}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors"
                  >
                    Skip
                  </button>

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-violet-200 active:scale-95 transition-all"
                  >
                    {currentIndex === totalSteps - 1 ? (
                      <>
                        Finish Tour
                        <Sparkles className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {!isOpen && !disabled && (
        <button
          onClick={startTour}
          className="fixed bottom-6 right-6 z-40 bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300 shadow-md hover:shadow-lg rounded-full p-2.5 transition-all duration-200 group flex items-center gap-2 pointer-events-auto"
          title="Explore Mentor Tabs Tour"
          aria-label="Explore Mentor Tabs Tour"
        >
          <Compass className="w-5 h-5 text-violet-600 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline">Tabs Guide</span>
        </button>
      )}

      {typeof document !== "undefined" && createPortal(tourContent, document.body)}
    </>
  );
}
