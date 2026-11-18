"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  Building2,
  Mail,
  FolderGit2,
  UserCheck,
  Briefcase,
  Users,
  BookOpen,
  Settings,
  Compass
} from "lucide-react";
import { createPortal } from "react-dom";

export interface IndustrySidebarTourStep {
  id: string;
  name: string;
  title: string;
  icon: any;
  badge: string;
  description: string;
}

export const INDUSTRY_SIDEBAR_STEPS: IndustrySidebarTourStep[] = [
  {
    id: "tour-sidebar-overview",
    name: "Overview",
    title: "Overview Dashboard",
    icon: LayoutDashboard,
    badge: "Talent Hub",
    description: "Corporate recruitment control center tracking applicant volume, active candidate shortlists, live projects, and placement updates."
  },
  {
    id: "tour-sidebar-company-profile",
    name: "Company Profile",
    title: "Company Profile",
    icon: Building2,
    badge: "Brand Identity",
    description: "Manage your company overview, workplace culture, industry domain, office locations, and social presence for potential candidates."
  },
  {
    id: "tour-sidebar-application-pipeline",
    name: "Application Pipeline",
    title: "Applicant Pipeline",
    icon: Mail,
    badge: "Recruitment Flow",
    description: "Track candidate applications across stages: Review, Shortlisted, Technical Assessment, Interview, and Final Offer."
  },
  {
    id: "tour-sidebar-projects---r-d",
    name: "Projects & R&D",
    title: "Projects & R&D Challenges",
    icon: FolderGit2,
    badge: "Live Projects",
    description: "Post real-world industry capstone projects and technical challenges for students to solve, assessing candidates through hands-on work."
  },
  {
    id: "tour-sidebar-internship-posts",
    name: "Internship Posts",
    title: "Corporate Internships",
    icon: UserCheck,
    badge: "Internships",
    description: "Create, publish, and manage corporate internship openings with tailored skill requirements, locations, and stipends."
  },
  {
    id: "tour-sidebar-job-profiles",
    name: "Job Profiles",
    title: "Full-Time Job Roles",
    icon: Briefcase,
    badge: "Full-Time Hiring",
    description: "Publish full-time graduate opportunities, configure applicant criteria, and connect directly with partnering college placement cells."
  },
  {
    id: "tour-sidebar-community",
    name: "Community",
    title: "Industry Network",
    icon: Users,
    badge: "Network",
    description: "Engage with academic institutes, faculty coordinators, mentors, and student talent in open discussions."
  },
  {
    id: "tour-sidebar-lms-studio",
    name: "LMS Studio",
    title: "LMS Studio Courses",
    icon: BookOpen,
    badge: "Learning Studio",
    description: "Review industry training courses, align learning pathways with your company tech stack, and upskill interns."
  },
  {
    id: "tour-sidebar-settings",
    name: "Settings",
    title: "Industry Settings",
    icon: Settings,
    badge: "Administration",
    description: "Configure organization settings, team member access permissions, notification preferences, and account credentials."
  }
];

interface IndustryGuidelineTourProps {
  industryEmail?: string;
  disabled?: boolean;
  isFirstLogin?: boolean;
}

export default function IndustryGuidelineTour({
  industryEmail,
  disabled,
  isFirstLogin = false
}: IndustryGuidelineTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const [activeSteps, setActiveSteps] = useState<IndustrySidebarTourStep[]>(INDUSTRY_SIDEBAR_STEPS);
  const popupRef = useRef<HTMLDivElement>(null);

  const startTour = useCallback(() => {
    if (disabled) return;

    const presentSteps = INDUSTRY_SIDEBAR_STEPS.filter((step) => {
      const el =
        document.querySelector(`[data-tour-sidebar="${step.name}"]`) ||
        document.getElementById(step.id);
      return !!el;
    });

    const stepsToUse = presentSteps.length > 0 ? presentSteps : INDUSTRY_SIDEBAR_STEPS;
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

    const userKey = industryEmail ? `has_seen_industry_tour_${industryEmail}` : "has_seen_industry_tour";
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
    window.addEventListener("open-industry-tour", handleCustomTrigger);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("open-industry-tour", handleCustomTrigger);
    };
  }, [disabled, startTour, industryEmail, isFirstLogin]);

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
    const userKey = industryEmail ? `has_seen_industry_tour_${industryEmail}` : "has_seen_industry_tour";
    localStorage.setItem(userKey, "true");
    if (industryEmail && typeof window !== "undefined") {
      sessionStorage.setItem(`completed_industry_tour_${industryEmail}`, "true");
      localStorage.setItem(`is_first_login_${industryEmail}`, "false");
      sessionStorage.removeItem(`is_first_login_${industryEmail}`);
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
              layoutId="tour-industry-sidebar-highlight"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "fixed",
                top: targetRect.top - 3,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 6,
              }}
              className="rounded-xl border-2 border-purple-500 bg-purple-500/10 shadow-[0_0_18px_rgba(147,51,234,0.45)] ring-4 ring-purple-400/20 z-[100000] pointer-events-none flex items-center justify-end pr-2"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
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

            <div className="relative bg-gradient-to-r from-purple-50 via-fuchsia-50 to-white px-5 pt-3.5 pb-2.5 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                  <StepIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full">
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
                          ? "w-6 bg-purple-600 shadow-sm"
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
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-200 active:scale-95 transition-all"
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
          className="fixed bottom-6 right-6 z-40 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 shadow-md hover:shadow-lg rounded-full p-2.5 transition-all duration-200 group flex items-center gap-2 pointer-events-auto"
          title="Explore Industry Tabs Tour"
          aria-label="Explore Industry Tabs Tour"
        >
          <Compass className="w-5 h-5 text-purple-600 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline">Tabs Guide</span>
        </button>
      )}

      {typeof document !== "undefined" && createPortal(tourContent, document.body)}
    </>
  );
}
