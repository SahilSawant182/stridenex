"use client";

import { useState } from "react";
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
  Settings
} from "lucide-react";

interface HorizontalTabsProps {
  role: "student" | "college" | "mentor" | "industry";
}

const tabConfig = {
  student: [
    { name: "Overview", icon: LayoutDashboard, path: "/student/dashboard" },
    { name: "Skills", icon: Code, path: "/student/dashboard/skills" },
    { name: "Path", icon: Target, path: "/student/dashboard/path" },
    { name: "Shorts", icon: Video, path: "/student/dashboard/shorts" },
    { name: "Community", icon: Users, path: "/student/dashboard/community" },
    { name: "Projects", icon: FolderGit2, path: "/student/dashboard/projects" },
    { name: "Internships", icon: Briefcase, path: "/student/dashboard/internships" },
    { name: "Habits", icon: CheckSquare, path: "/student/dashboard/habits" },
    { name: "Mentors", icon: UserCircle, path: "/student/dashboard/mentors" },
    { name: "Events", icon: Calendar, path: "/student/dashboard/events" },
    { name: "Stories", icon: BookOpen, path: "/student/dashboard/stories" },
  ],
  college: [
    { name: "Overview", path: "/college/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/college/dashboard/students", icon: Users },
    { name: "Placement", path: "/college/dashboard/placement", icon: TrendingUp },
    { name: "NEP & UGC 2026", path: "/college/dashboard/nep-ugc", icon: Building2 },
    { name: "Interventions", path: "/college/dashboard/interventions", icon: Target },
    { name: "Notice Board", path: "/college/dashboard/notice-board", icon: BookOpen },
    { name: "Reports", path: "/college/dashboard/reports", icon: BarChart },
  ],
  mentor: [
    { name: "Overview", icon: LayoutDashboard, path: "/mentor/dashboard" },
    { name: "Schedule", icon: Calendar, path: "/mentor/dashboard/schedule" },
    { name: "Offerings", icon: Video, path: "/mentor/dashboard/offerings" },
    { name: "Requests", icon: Calendar, path: "/mentor/dashboard/requests" },
    { name: "Session History", icon: BookOpen, path: "/mentor/dashboard/session-history" },
    { name: "Payouts & Commission", icon: MessageSquare, path: "/mentor/dashboard/payouts" },
    { name: "My Profile", icon: TrendingUp, path: "/mentor/dashboard/profile" },
  ],
  industry: [
    { name: "Overview", icon: LayoutDashboard, path: "/industry/dashboard" },
    { name: "Company Profile", icon: Building2, path: "/industry/dashboard/company-profile" },
    { name: "Find Talent", icon: Briefcase, path: "/industry/dashboard/find-talent" },
    { name: "Pipeline", icon: Mail, path: "/industry/dashboard/pipeline" },
    { name: "Projects", icon: FolderGit2, path: "/industry/dashboard/projects" },
    { name: "Internships", icon: UserCheck, path: "/industry/dashboard/internships" },
    // { name: "Feedback", icon: Star, path: "/industry/dashboard/feedback" },
    // { name: "Analytics", icon: Calendar, path: "/industry/dashboard/analytics" },
    { name: "Settings", icon: Settings, path: "/industry/dashboard/settings" },
  ],
};

export default function HorizontalTabs({ role }: HorizontalTabsProps) {
  const pathname = usePathname();
  const tabs = tabConfig[role] || tabConfig.student;

  const getActiveColor = () => {
    switch (role) {
      case "college": return "text-green-600";
      case "mentor": return "text-violet-600";
      case "industry": return "text-purple-600";
      case "student": default: return "text-orange-600";
    }
  };

  return (
    <div className="w-full bg-white rounded-full border border-slate-200 p-2 shadow-sm overflow-x-auto hide-scrollbar mb-6">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
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
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${isActive
                ? "text-slate-900 bg-slate-100"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? getActiveColor() : 'text-slate-500'}`} />
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}