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
  BarChart
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
    { name: "Internships", icon: Briefcase, path: "/student/dashboard/internships" },
    { name: "Habits", icon: CheckSquare, path: "/student/dashboard/habits" },
    { name: "Mentors", icon: UserCircle, path: "/student/dashboard/mentors" },
    { name: "Events", icon: Calendar, path: "/student/dashboard/events" },
    { name: "Stories", icon: BookOpen, path: "/student/dashboard/stories" },
    { name: "Plans", icon: Compass, path: "/student/dashboard/plans" },
  ],
  college: [
    { name: "Overview", path: "/college/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/college/dashboard/students", icon: Users },
    { name: "Placement", path: "/college/dashboard/placement", icon: TrendingUp },
    { name: "NEP & UGC 2026", path: "/college/dashboard/nep-ugc", icon: Building2 },
    { name: "Interventions", path: "/college/dashboard/interventions", icon: Target },
    { name: "Notice Board", path: "/college/dashboard/notice-board", icon: BookOpen },
    { name: "Reports", path: "/college/dashboard/reports", icon: BarChart },
    { name: "Plans", path: "/college/dashboard/plans", icon: Award },
  ],
  mentor: [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard/mentor" },
    { name: "Mentees", icon: Users, path: "/dashboard/mentor/mentees" },
    { name: "Sessions", icon: Video, path: "/dashboard/mentor/sessions" },
    { name: "Schedule", icon: Calendar, path: "/dashboard/mentor/schedule" },
    { name: "Resources", icon: BookOpen, path: "/dashboard/mentor/resources" },
    { name: "Feedback", icon: MessageSquare, path: "/dashboard/mentor/feedback" },
    { name: "Analytics", icon: TrendingUp, path: "/dashboard/mentor/analytics" },
    { name: "Earnings", icon: Award, path: "/dashboard/mentor/earnings" },
  ],
  industry: [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard/industry" },
    { name: "Hiring", icon: Briefcase, path: "/dashboard/industry/hiring" },
    { name: "Applications", icon: Mail, path: "/dashboard/industry/applications" },
    { name: "Shortlisted", icon: UserCheck, path: "/dashboard/industry/shortlisted" },
    { name: "Interviews", icon: Calendar, path: "/dashboard/industry/interviews" },
    { name: "Partners", icon: School, path: "/dashboard/industry/partners" },
    { name: "Analytics", icon: BarChart3, path: "/dashboard/industry/analytics" },
    { name: "Messages", icon: MessageSquare, path: "/dashboard/industry/messages" },
  ],
};

export default function HorizontalTabs({ role }: HorizontalTabsProps) {
  const pathname = usePathname();
  const tabs = tabConfig[role] || tabConfig.student;

  return (
    <div className="w-full bg-white rounded-full border border-slate-200 p-2 shadow-sm overflow-x-auto hide-scrollbar mb-6">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          // Exact match for base dashboard route to prevent it from being active on sub-routes
          const isBaseRoute = tab.path === `/student/dashboard` || tab.path === `/dashboard/${role}`;
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}