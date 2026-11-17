"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Code,
  Target,
  CheckSquare,
  FolderGit2,
  Briefcase,
  Award,
  Building2,
  UserCircle,
  Video,
  Users,
  Calendar,
  Compass,
  CreditCard
} from "lucide-react";
import { createPortal } from "react-dom";

export interface StudentSidebarTourStep {
  id: string;
  name: string;
  title: string;
  icon: any;
  badge: string;
  description: string;
}

export const STUDENT_SIDEBAR_STEPS: StudentSidebarTourStep[] = [
  {
    id: "tour-sidebar-overview",
    name: "Overview",
    title: "Overview Dashboard",
    icon: LayoutDashboard,
    badge: "Home Base",
    description: "Your central hub tracking skill readiness scores, habit consistency heatmaps, opportunity alerts, and quick profile actions."
  },
  {
    id: "tour-sidebar-courses",
    name: "Courses",
    title: "Learning Courses",
    icon: BookOpen,
    badge: "LMS Studio",
    description: "Explore interactive learning modules, track your enrolled video courses, and complete exercises to level up your skillset."
  },
  {
    id: "tour-sidebar-skill-ledger",
    name: "Skill Ledger",
    title: "Verified Skill Ledger",
    icon: Code,
    badge: "Competencies",
    description: "Your digital competency passport. Track and verify your technical, problem-solving, and soft skills with verified badges."
  },
  {
    id: "tour-sidebar-skill-path",
    name: "Skill Path",
    title: "Personalized Skill Path",
    icon: Target,
    badge: "Roadmaps",
    description: "Step-by-step career roadmaps designed to help you bridge your learning gaps and reach your target job roles."
  },
  {
    id: "tour-sidebar-habits",
    name: "Habits",
    title: "Learning Habits & Streaks",
    icon: CheckSquare,
    badge: "Consistency",
    description: "Build daily study discipline. Monitor coding practice streaks, problem-solving goals, and weekly activity consistency."
  },
  {
    id: "tour-sidebar-projects",
    name: "Projects",
    title: "Project Portfolio",
    icon: FolderGit2,
    badge: "Proof of Work",
    description: "Showcase capstone, academic, and open-source projects with live demo URLs, GitHub repositories, and tech stacks for recruiters."
  },
  {
    id: "tour-sidebar-internships",
    name: "Internships",
    title: "Industry Internships",
    icon: Briefcase,
    badge: "Hands-on",
    description: "Discover and apply for verified corporate internships tailored to your branch, academic year, and verified skill set."
  },
  {
    id: "tour-sidebar-jobs",
    name: "Jobs",
    title: "Full-Time Jobs",
    icon: Award,
    badge: "Placements",
    description: "Explore entry-level jobs and placement opportunities from verified hiring partners, with direct application tracking."
  },
  {
    id: "tour-sidebar-campus-drives",
    name: "Campus Drives",
    title: "On-Campus Drives",
    icon: Building2,
    badge: "Recruitment",
    description: "Stay informed about on-campus recruitment events, company eligibility requirements, interview schedules, and drive updates."
  },
  {
    id: "tour-sidebar-mentors",
    name: "Mentors",
    title: "1-on-1 Mentorship",
    icon: UserCircle,
    badge: "Expert Guidance",
    description: "Book one-on-one sessions with industry mentors and alumni for career advice, resume reviews, and mock technical interviews."
  },
  {
    id: "tour-sidebar-shorts",
    name: "Shorts",
    title: "Quick Learning Shorts",
    icon: Video,
    badge: "Video Tips",
    description: "Watch bite-sized educational video reels highlighting interview preparation, technical tips, and real-world career advice."
  },
  {
    id: "tour-sidebar-community",
    name: "Community",
    title: "Student Community",
    icon: Users,
    badge: "Discussions",
    description: "Connect with peers, join topic-specific channels, discuss technical problems, and collaborate on shared challenges."
  },
  {
    id: "tour-sidebar-events",
    name: "Events",
    title: "Hackathons & Events",
    icon: Calendar,
    badge: "Workshops",
    description: "Register for live webinars, coding competitions, hackathons, and campus tech symposiums to elevate your profile."
  },
  {
    id: "tour-sidebar-plans",
    name: "Plans",
    title: "Subscription Plans",
    icon: CreditCard,
    badge: "Membership",
    description: "Select and activate your subscription plan to unlock all verified learning pathways, recruiter drives, and career tools."
  }
];

interface StudentGuidelineTourProps {
  studentEmail?: string;
  disabled?: boolean;
  isFirstLogin?: boolean;
  onTourClose?: () => void;
}

export default function StudentGuidelineTour({
  studentEmail,
  disabled,
  isFirstLogin = false,
  onTourClose
}: StudentGuidelineTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [activeSteps, setActiveSteps] = useState<StudentSidebarTourStep[]>(STUDENT_SIDEBAR_STEPS);
  const popupRef = useRef<HTMLDivElement>(null);

  const startTour = useCallback(() => {
    if (disabled) return;

    // Query elements in sidebar first, with fallback to horizontal tabs if needed
    const presentSteps = STUDENT_SIDEBAR_STEPS.filter((step) => {
      const el =
        document.querySelector(`[data-tour-sidebar="${step.name}"]`) ||
        document.getElementById(step.id) ||
        document.querySelector(`[data-tour-tab="${step.name}"]`);
      return !!el;
    });

    const stepsToUse = presentSteps.length > 0 ? presentSteps : STUDENT_SIDEBAR_STEPS;
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

    const userKey = studentEmail ? `has_seen_student_tour_${studentEmail}` : "has_seen_student_tour";
    const hasCompletedTour = typeof window !== "undefined" && (
      sessionStorage.getItem(`completed_student_tour_${studentEmail}`) === "true" ||
      localStorage.getItem(userKey) === "true"
    );

    let timer: NodeJS.Timeout | null = null;
    // Auto-launch for NEW users (isFirstLogin === true) who haven't completed the tour
    if (isFirstLogin && !hasCompletedTour) {
      timer = setTimeout(() => {
        startTour();
      }, 500);
    }

    const handleCustomTrigger = () => {
      startTour();
    };
    window.addEventListener("open-student-tour", handleCustomTrigger);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("open-student-tour", handleCustomTrigger);
    };
  }, [disabled, startTour, studentEmail, isFirstLogin]);

  // Update target rect when currentIndex changes or on window resize
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || activeSteps.length === 0) return;
    const currentStep = activeSteps[currentIndex];
    if (!currentStep) return;

    // Search in sidebar first, then by ID, then in horizontal tabs
    const el =
      document.querySelector(`[data-tour-sidebar="${currentStep.name}"]`) ||
      document.getElementById(currentStep.id) ||
      document.querySelector(`[data-tour-tab="${currentStep.name}"]`);

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
    const userKey = studentEmail ? `has_seen_student_tour_${studentEmail}` : "has_seen_student_tour";
    localStorage.setItem(userKey, "true");
    if (studentEmail && typeof window !== "undefined") {
      sessionStorage.setItem(`completed_student_tour_${studentEmail}`, "true");
    }
    if (onTourClose) {
      onTourClose();
    }
  };

  if (!mounted) return null;

  const currentStep = activeSteps[currentIndex] || activeSteps[0];
  const totalSteps = activeSteps.length;
  const StepIcon = currentStep.icon;

  // Calculate popup position anchored to the right of the sidebar item
  let popupTop = 100;
  let popupLeft = 260;
  let arrowTop = 32; // px from top of popup
  const popupWidth = typeof window !== "undefined" ? Math.min(360, window.innerWidth - 32) : 340;
  const popupHeight = 220;

  if (targetRect && typeof window !== "undefined") {
    const isSidebarOnLeft = targetRect.left < window.innerWidth / 2;

    if (isSidebarOnLeft && targetRect.left + targetRect.width + popupWidth + 24 < window.innerWidth) {
      // Place to the right of the sidebar item
      popupLeft = targetRect.left + targetRect.width + 16;
      // Align vertically with the item
      let computedTop = targetRect.top + targetRect.height / 2 - 50;
      // Keep within screen bounds
      if (computedTop < 16) computedTop = 16;
      if (computedTop + popupHeight > window.innerHeight - 16) {
        computedTop = window.innerHeight - popupHeight - 16;
      }
      popupTop = computedTop;
      // Arrow pointing left towards sidebar item
      const itemCenterY = targetRect.top + targetRect.height / 2;
      arrowTop = Math.max(16, Math.min(popupHeight - 20, itemCenterY - popupTop));
    } else {
      // Fallback below item
      popupTop = targetRect.top + targetRect.height + 14;
      popupLeft = Math.max(16, Math.min(window.innerWidth - popupWidth - 16, targetRect.left));
      arrowTop = 0;
    }
  }

  const tourContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-none">
          {/* Transparent click catcher to allow closing on outside click without blurring or darkening the background */}
          <div
            onClick={finishTour}
            className="absolute inset-0 pointer-events-auto bg-transparent"
          />

          {/* Highlight ring/spotlight directly over the active sidebar item */}
          {targetRect && (
            <motion.div
              layoutId="tour-sidebar-highlight"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "fixed",
                top: targetRect.top - 3,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 6,
              }}
              className="rounded-xl border-2 border-orange-500 bg-orange-500/10 shadow-[0_0_18px_rgba(249,115,22,0.45)] ring-4 ring-orange-400/20 z-[100000] pointer-events-none flex items-center justify-end pr-2"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </motion.div>
          )}

          {/* Tethered Tour Popup Card (pointer-events-auto so buttons are interactive) */}
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
            {/* Left-pointing caret arrow pointing directly to the sidebar item */}
            <div
              style={{ top: arrowTop }}
              className="absolute -left-2 w-4 h-4 bg-white border-b border-l border-slate-200 transform rotate-45 z-10"
            />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-50 via-amber-50 to-white px-5 pt-3.5 pb-2.5 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <StepIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/90 px-2 py-0.5 rounded-full">
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

            {/* Description Body */}
            <div className="px-5 py-3">
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {currentStep.description}
              </p>
            </div>

            {/* Carousel Dots & Navigation Controls */}
            <div className="px-5 pb-3.5 pt-2 flex flex-col gap-2.5 border-t border-slate-100 bg-slate-50/60">
              {/* Carousel Indicator Dots */}
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
                          ? "w-6 bg-orange-600 shadow-sm"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Action Buttons */}
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
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-orange-200 active:scale-95 transition-all"
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
      {/* Floating Tour Restart Button (discreet at bottom right) */}
      {!isOpen && !disabled && (
        <button
          onClick={startTour}
          className="fixed bottom-6 right-6 z-40 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 shadow-md hover:shadow-lg rounded-full p-2.5 transition-all duration-200 group flex items-center gap-2 pointer-events-auto"
          title="Explore Student Tabs Tour"
          aria-label="Explore Student Tabs Tour"
        >
          <Compass className="w-5 h-5 text-orange-500 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline">Tabs Guide</span>
        </button>
      )}

      {/* Portal Tour Overlay */}
      {typeof document !== "undefined" && createPortal(tourContent, document.body)}
    </>
  );
}
