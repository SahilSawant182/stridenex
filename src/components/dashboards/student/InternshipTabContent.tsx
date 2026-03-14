// components/dashboards/student/InternshipTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Send, 
  CheckCircle, 
  Calendar,
  MapPin, 
  Clock, 
  IndianRupee,
  Building2,
  ChevronRight,
  Bookmark
} from "lucide-react";
import StatsWidget from "@/components/dashboards/widgets/StatsWidget";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Stats data
const statsData = [
  {
    id: 1,
    title: "APPLIED",
    value: 14,
    icon: Send,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    title: "SHORTLISTED",
    value: 3,
    icon: CheckCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    id: 3,
    title: "INTERVIEW SCHEDULED",
    value: 1,
    icon: Calendar,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    title: "MATCHING OPENINGS",
    value: 14,
    icon: Briefcase,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

// Internships data
const internships = [
  {
    id: 1,
    title: "Data Science Intern",
    company: "TCS iON",
    match: 91,
    location: "Pune/Hybrid",
    duration: "3 mo",
    stipend: "₹15k/mo",
    logo: "T",
    matchColor: "text-emerald-600",
    ringColor: "border-emerald-200",
    bgColor: "bg-emerald-50"
  },
  {
    id: 2,
    title: "ML Engineering Intern",
    company: "Razorpay",
    match: 76,
    location: "Bengaluru",
    duration: "6 mo",
    stipend: "₹40k/mo",
    logo: "R",
    matchColor: "text-orange-600",
    ringColor: "border-orange-200",
    bgColor: "bg-orange-50"
  },
  {
    id: 3,
    title: "Analytics Intern",
    company: "Zepto",
    match: 84,
    location: "Mumbai",
    duration: "4 mo",
    stipend: "₹20k/mo",
    logo: "Z",
    matchColor: "text-orange-600",
    ringColor: "border-orange-200",
    bgColor: "bg-orange-50"
  },
  {
    id: 4,
    title: "Data Engineering Intern",
    company: "Freshworks",
    match: 88,
    location: "Chennai",
    duration: "3 mo",
    stipend: "₹25k/mo",
    logo: "F",
    matchColor: "text-emerald-600",
    ringColor: "border-emerald-200",
    bgColor: "bg-emerald-50"
  },
  {
    id: 5,
    title: "Business Analytics Intern",
    company: "MakeMyTrip",
    match: 79,
    location: "Delhi",
    duration: "4 mo",
    stipend: "₹18k/mo",
    logo: "M",
    matchColor: "text-orange-600",
    ringColor: "border-orange-200",
    bgColor: "bg-orange-50"
  }
];

export default function InternshipTabContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid - Exactly as in the image */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            data={{
              value: stat.value,
              icon: stat.icon,
              iconBg: stat.iconBg,
              iconColor: stat.iconColor
            }}
          />
        ))}
      </motion.div>

      {/* Internships Grid - 3 columns as shown in the image */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {internships.map((internship) => (
          <BaseCard key={internship.id} className="p-0 overflow-hidden border-slate-200 hover:shadow-lg transition-all">
            <div className="p-5">
              {/* Header with Logo and Match */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${internship.bgColor} border ${internship.ringColor} flex items-center justify-center text-lg font-bold ${internship.matchColor}`}>
                    {internship.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{internship.title}</h3>
                    <p className="text-sm text-slate-500">{internship.company}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${internship.matchColor}`}>
                  {internship.match}%
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {internship.location}
                </Badge>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {internship.duration}
                </Badge>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {internship.stipend}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium">
                  Apply
                </Button>
                <Button variant="outline" className="px-4 border-slate-200 text-slate-600 hover:bg-slate-50">
                  Details
                </Button>
              </div>
            </div>
          </BaseCard>
        ))}
      </motion.div>
    </motion.div>
  );
}