"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentByEmail } from "@/services/student.services";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Code,
  Target,
  Video,
  Users,
  Briefcase,
  CheckSquare,
  UserCircle,
  Calendar,
  BookOpen,
  FileText,
  Compass,
  TrendingUp,
  Award,
  GraduationCap,
  Building2,
  MessageSquare,
  Mail,
  UserCheck,
  BarChart3,
  School,
  BarChart,
  Star,
  FolderGit2,
  Settings,
  HelpCircle
} from "lucide-react";

interface HorizontalTabsProps {
  role: "student" | "college" | "mentor" | "industry";
}

const tabConfig = {
  student: [
    { name: "Overview", icon: LayoutDashboard, path: "/student/dashboard" },
    { name: "Skill Ledger", icon: Code, path: "/student/dashboard/skills" },
    { name: "Skill Path", icon: Target, path: "/student/dashboard/path" },
    { name: "Habits", icon: CheckSquare, path: "/student/dashboard/habits" },
    { name: "Projects", icon: FolderGit2, path: "/student/dashboard/projects" },
    { name: "Internships", icon: Briefcase, path: "/student/dashboard/internships" },
    { name: "Jobs", icon: Award, path: "/student/dashboard/jobs" },
    { name: "Campus Drives", icon: Building2, path: "/student/dashboard/campus-drives" },
    { name: "Mentors", icon: UserCircle, path: "/student/dashboard/mentors" },
    { name: "Shorts", icon: Video, path: "/student/dashboard/shorts" },
    { name: "Community", icon: Users, path: "/student/dashboard/community" },
    { name: "Events", icon: Calendar, path: "/student/dashboard/events" },
    { name: "Stories", icon: BookOpen, path: "/student/dashboard/stories" },
  ],
  college: [
    { name: "Overview", path: "/college/dashboard", icon: LayoutDashboard },
    { name: "Student Analytics", path: "/college/dashboard/students", icon: GraduationCap },
    { name: "Campus Drives", path: "/college/dashboard/campus-drives", icon: Briefcase },
    { name: "Interventions", path: "/college/dashboard/interventions", icon: Building2 },
    { name: "Community", path: "/college/dashboard/community", icon: Users },
    { name: "Notice Board", path: "/college/dashboard/notice-board", icon: BarChart },
  ],
  mentor: [
    { name: "Overview", icon: LayoutDashboard, path: "/mentor/dashboard" },
    { name: "Schedule", icon: Calendar, path: "/mentor/dashboard/schedule" },
    { name: "Offerings", icon: Video, path: "/mentor/dashboard/offerings" },
    { name: "Community", icon: Users, path: "/mentor/dashboard/community" },
    { name: "Requests", icon: HelpCircle, path: "/mentor/dashboard/requests" },
    { name: "Session History", icon: BookOpen, path: "/mentor/dashboard/session-history" },
    { name: "Payouts & Commission", icon: MessageSquare, path: "/mentor/dashboard/payouts" },
    { name: "My Profile", icon: TrendingUp, path: "/mentor/dashboard/profile" },
  ],
  industry: [
    { name: "Overview", icon: LayoutDashboard, path: "/industry/dashboard" },
    { name: "Company Profile", icon: Building2, path: "/industry/dashboard/company-profile" },
    { name: "Application Pipeline", icon: Mail, path: "/industry/dashboard/pipeline" },
    { name: "Projects & R&D", icon: FolderGit2, path: "/industry/dashboard/projects" },
    { name: "Internship Posts", icon: UserCheck, path: "/industry/dashboard/internships" },
    { name: "Job Profiles", icon: Briefcase, path: "/industry/dashboard/jobs" },
    { name: "Community", icon: Users, path: "/industry/dashboard/community" },
    // { name: "Feedback", icon: Star, path: "/industry/dashboard/feedback" },
    // { name: "Analytics", icon: Calendar, path: "/industry/dashboard/analytics" },
    { name: "Settings", icon: Settings, path: "/industry/dashboard/settings" },
  ],
};

export default function HorizontalTabs({ role }: HorizontalTabsProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (role !== "student" || !currentUser) return;
    
    // 1. Try to read from localStorage first
    const cachedProfile = localStorage.getItem("studentProfile");
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
      } catch (_) {}
    }

    // 2. Fetch from API
    const fetchProfile = async () => {
      try {
        const studentRes = await getStudentByEmail(currentUser);
        const data = studentRes?.message?.data || studentRes?.data || {};
        if (data && Object.keys(data).length > 0) {
          setProfile(data);
          localStorage.setItem("studentProfile", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching student profile for horizontal tabs:", err);
      }
    };
    fetchProfile();
  }, [role, currentUser]);

  const isFirstOrSecondYear = () => {
    if (!profile) return false;
    const yearStr = String(profile.current_year || "").trim();
    if (yearStr) {
      const lowerYear = yearStr.toLowerCase();
      if (lowerYear.includes("first") || lowerYear.includes("second") || lowerYear.includes("1st") || lowerYear.includes("2nd")) {
        return true;
      }
      return false;
    }
    // Fallback to academic_year if current_year is empty
    const yearVal = profile.academic_year;
    if (yearVal !== undefined && yearVal !== null) {
      const num = Number(yearVal);
      if (num === 1 || num === 2) return true;
    }
    return false;
  };

  const tabs = tabConfig[role] || tabConfig.student;
  const filteredTabs = tabs.filter(tab => {
    if (role === "student" && isFirstOrSecondYear()) {
      if (tab.name === "Jobs" || tab.name === "Internships") {
        return false;
      }
    }
    return true;
  });

  const getActiveColor = () => {
    switch (role) {
      case "college": return "text-green-600";
      case "mentor": return "text-violet-600";
      case "industry": return "text-purple-600";
      case "student": default: return "text-orange-600";
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm mb-6">
      <div className="flex items-center justify-around w-full">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;

          // Exact match for base dashboard route to prevent it from being active on sub-routes
          const isBaseRoute = tab.path === `/student/dashboard` || tab.path === `/${role}/dashboard`;
          const isActive = isBaseRoute
            ? pathname === tab.path
            : (pathname === tab.path || pathname?.startsWith(`${tab.path}/`));

          return (
            <Link
              key={tab.path}
              href={tab.path}
              title={tab.name}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${isActive
                ? "text-slate-900 bg-slate-100 scale-105"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:scale-105"
                }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? getActiveColor() : 'text-slate-500'}`} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}