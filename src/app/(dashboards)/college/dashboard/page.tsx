// app/dashboards/college/page.tsx
"use client";

import { motion, Variants } from "framer-motion";
import {
  Users,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  BarChart3,
  GraduationCap,
  Building2,
  Target,
  Clock,
  Database,
  Code,
  MessageSquare,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import ProgressCard from "@/components/dashboards/shared/ProgressCard";
import ListCard from "@/components/dashboards/shared/ListCard";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

// College Dashboard Data - Neutral colors with minimal green accents
const collegeStats = [
  {
    id: 1,
    title: "ACTIVE STUDENTS",
    value: "2,847",
    change: 124,
    changeLabel: "this sem",
    icon: Users,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  },
  {
    id: 2,
    title: "AVG EMPLOYABILITY",
    value: "78",
    max: 100,
    change: 6,
    changeLabel: "vs last sem",
    icon: TrendingUp,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  },
  {
    id: 3,
    title: "AT-RISK STUDENTS",
    value: "143",
    change: 12,
    changeLabel: "need action",
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: "down"
  },
  {
    id: 4,
    title: "INDUSTRY PARTNERS",
    value: "38",
    change: 5,
    changeLabel: "this month",
    icon: Building2,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "up"
  }
];

// Employability data with neutral colors
const employabilityData = [
  { 
    label: "Excellent (85–100)", 
    value: 620, 
    percentage: 22, 
    color: "slate", 
    subtitle: "620 (22%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  { 
    label: "Good (70–84)", 
    value: 1140, 
    percentage: 40, 
    color: "slate", 
    subtitle: "1140 (40%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  { 
    label: "Average (55–69)", 
    value: 740, 
    percentage: 26, 
    color: "slate", 
    subtitle: "740 (26%)",
    bgColor: "bg-slate-100",
    progressColor: "bg-slate-500"
  },
  { 
    label: "At-Risk (<55)", 
    value: 347, 
    percentage: 12, 
    color: "amber", 
    subtitle: "347 (12%)",
    bgColor: "bg-amber-50",
    progressColor: "bg-amber-500"
  }
];

// Branch data with neutral colors
const branchData = [
  { label: "Computer Science", value: 420, percentage: 87, subtitle: "420 students", progressColor: "bg-slate-500" },
  { label: "Electronics", value: 380, percentage: 74, subtitle: "380 students", progressColor: "bg-slate-500" },
  { label: "Mechanical", value: 340, percentage: 62, subtitle: "340 students", progressColor: "bg-slate-500" },
  { label: "Civil", value: 290, percentage: 58, subtitle: "290 students", progressColor: "bg-amber-500", textColor: "text-amber-600" },
  { label: "MBA", value: 180, percentage: 79, subtitle: "180 students", progressColor: "bg-slate-500" },
  { label: "Chemical", value: 240, percentage: 65, subtitle: "240 students", progressColor: "bg-slate-500" }
];


// Action items with appropriate colors
const actionItems = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "red",
    title: "47 students with score <50",
    subtitle: "Graduation risk — immediate intervention"
  },
  {
    id: 2,
    icon: Target,
    iconColor: "amber",
    title: "NEP Internship: 68% (target 80%)",
    subtitle: "342 students need placement by April"
  },
  {
    id: 3,
    icon: Briefcase,
    iconColor: "slate",
    title: "38 new internships posted this week",
    subtitle: "TCS, Infosys, Razorpay, Zepto"
  },
  {
    id: 4,
    icon: Clock,
    iconColor: "red",
    title: "UGC Grievance Response Due",
    subtitle: "2 cases require 24hr committee meeting"
  }
];

// Skill gaps with neutral colors
const skillGaps = [
  {
    id: 1,
    name: "Data Analysis",
    percentage: 62,
    icon: Database,
    color: "slate",
    badge: "62% lack this"
  },
  {
    id: 2,
    name: "Cloud Computing",
    percentage: 74,
    icon: Code,
    color: "slate",
    badge: "74% lack this"
  },
  {
    id: 3,
    name: "Communication",
    percentage: 38,
    icon: MessageSquare,
    color: "amber",
    badge: "38% lack this"
  },
  {
    id: 4,
    name: "Project Management",
    percentage: 55,
    icon: Target,
    color: "slate",
    badge: "55% lack this"
  }
];

const monthlyData = [
  { month: "Apr", value: 45 },
  { month: "May", value: 52 },
  { month: "Jun", value: 58 },
  { month: "Jul", value: 65 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 68 },
  { month: "Oct", value: 72 },
  { month: "Nov", value: 78 },
  { month: "Dec", value: 82 },
  { month: "Jan", value: 85 },
  { month: "Feb", value: 88 },
  { month: "Mar", value: 92 }
];

export default function CollegeDashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid - Neutral slate backgrounds */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collegeStats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              max: stat.max,
              change: stat.change,
              changeLabel: stat.changeLabel,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor,
              trend: stat.trend
            }}
          />
        ))}
      </motion.div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Employability Distribution */}
        <motion.div variants={item}>
          <ProgressCard
            title="Employability Distribution"
            items={employabilityData}
            variant="detailed"
            className="h-full border-slate-200"
          />
        </motion.div>

        {/* Middle Column - Branch Performance */}
        <motion.div variants={item}>
          <ProgressCard
            title="Branch-wise Performance"
            items={branchData}
            variant="detailed"
            className="h-full border-slate-200"
          />
        </motion.div>

        {/* Right Column - Action Required */}
        <motion.div variants={item}>
          <ListCard
            title="Action Required"
            items={actionItems}
            variant="alerts"
            className="h-full border-slate-200"
          />
        </motion.div>
      </div>

      {/* Bottom 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student Onboarding Growth - Takes 2 columns */}
        <motion.div variants={item} className="lg:col-span-2">
          <BaseCard className="border-slate-200 p-5 h-full">
            <CardHeader 
              title="Student Onboarding Growth" 
              icon={<TrendingUp className="w-4 h-4 text-slate-600" />}
              action={{ label: "View Details" }}
            />
            <div className="h-40 flex items-end justify-between gap-1 mt-4">
              {monthlyData.map((data) => {
                const maxValue = Math.max(...monthlyData.map(d => d.value));
                const height = (data.value / maxValue) * 120;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-slate-400 rounded-t-lg hover:bg-slate-500 transition-all cursor-pointer relative group"
                      style={{ height: `${height}px` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.value}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </BaseCard>
        </motion.div>

        {/* Top Skill Gaps - Takes 1 column */}
        <motion.div variants={item}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <CardHeader 
              title="Top Skill Gaps" 
              icon={<Target className="w-4 h-4 text-slate-600" />}
              action={{ label: "View All" }}
            />
            <div className="space-y-4 mt-4">
              {skillGaps.map((skill) => (
                <div key={skill.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg ${skill.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                        <skill.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{skill.name}</span>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${skill.color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {skill.badge}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${skill.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Gap Notice - Subtle amber */}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Critical Gap:</span> Data Analysis skills impact 62% of placement opportunities
              </p>
            </div>
          </BaseCard>
        </motion.div>
      </div>

      {/* Additional Stats Row - Minimal design */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseCard className="border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Placement Rate</p>
              <p className="text-2xl font-bold text-slate-800">86%</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3 text-emerald-600" />
                <p className="text-xs text-emerald-600">5% vs last year</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard className="border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming Drives</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
              <p className="text-xs text-slate-600 mt-1">Next: TCS - Mar 15</p>
            </div>
          </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}