// components/dashboards/student/EventsTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee,
  Clock,
  Trophy,
  Bell,
  Megaphone,
  ChevronRight,
  Sparkles,
  Eye
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Types
interface Event {
  id: number;
  title: string;
  type: "Hackathon" | "Competition" | "Pitch Battle" | "Case Study" | "Workshop";
  daysLeft: number;
  date: string;
  participants: string;
  prize: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
}

interface Notice {
  id: number;
  title: string;
  category: "Placement" | "Events" | "Academic" | "Compliance";
  date: string;
  icon: any;
  color: string;
}

// Events data
const events: Event[] = [
  {
    id: 1,
    title: "Hackathon",
    type: "Hackathon",
    daysLeft: 12,
    date: "Mar 15–17",
    participants: "150+ colleges",
    prize: "5 Lakhs",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Trophy
  },
  {
    id: 2,
    title: "DataFest National",
    type: "Competition",
    daysLeft: 0,
    date: "Apr 2–3",
    participants: "80+ colleges",
    prize: "2 Lakhs",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Trophy
  },
  {
    id: 3,
    title: "Startup Pitch Battle",
    type: "Pitch Battle",
    daysLeft: 20,
    date: "Mar 25",
    participants: "All colleges",
    prize: "10 Lakhs",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Trophy
  },
  {
    id: 4,
    title: "Case Study Champions",
    type: "Case Study",
    daysLeft: 0,
    date: "Apr 10",
    participants: "60+ colleges",
    prize: "Internships",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: Trophy
  }
];

// Notice board data
const notices: Notice[] = [
  {
    id: 1,
    title: "VJTI-TCS iON Internship Drive – Applications Open",
    category: "Placement",
    date: "Feb 24",
    icon: Bell,
    color: "text-blue-600"
  },
  {
    id: 2,
    title: "HackIndia 2025 – Team Formation Begins",
    category: "Events",
    date: "Feb 22",
    icon: Megaphone,
    color: "text-orange-600"
  },
  {
    id: 3,
    title: "NEP 2020 Workshop: Credit Transfer & ABC Portal",
    category: "Academic",
    date: "Feb 23",
    icon: Calendar,
    color: "text-purple-600"
  },
  {
    id: 4,
    title: "UGC Equity Audit: Equal Opportunity Centre Open",
    category: "Compliance",
    date: "Feb 20",
    icon: Bell,
    color: "text-emerald-600"
  }
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

export default function EventsTabContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-800">Events & Competitions</h1>
        <p className="text-slate-500 mt-1">Inter-college hackathons, pitch battles, and case studies</p>
      </motion.div>

      {/* Events Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <BaseCard key={event.id} className="overflow-hidden hover:shadow-lg transition-all group">
              <div className="p-5">
                {/* Header with Type and Days Left */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg ${event.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${event.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{event.title}</h3>
                      <p className="text-xs text-slate-500">{event.type}</p>
                    </div>
                  </div>
                  {event.daysLeft > 0 && (
                    <Badge variant="outline" className={`${event.bgColor} ${event.color} border-${event.borderColor} font-medium`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {event.daysLeft} days left
                    </Badge>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{event.participants}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{event.prize}</span>
                  </div>
                </div>

                {/* Action Buttons - Register Now and Details */}
                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                    Register Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-4 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </BaseCard>
          );
        })}
      </motion.div>

      {/* Digital Notice Board */}
      <motion.div variants={item} className="mt-8">
        <CardHeader 
          title="Digital Notice Board" 
          icon={<Bell className="w-4 h-4 text-orange-500" />}
          action={{ label: "View All" }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {notices.map((notice) => {
            const Icon = notice.icon;
            return (
              <BaseCard key={notice.id} className="hover:shadow-md transition-all cursor-pointer group">
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${notice.color.replace('text', 'bg').replace('600', '50')} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${notice.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 group-hover:text-orange-600 transition-colors">{notice.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                        {notice.category}
                      </Badge>
                      <span className="text-xs text-slate-400">{notice.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </BaseCard>
            );
          })}
        </div>
      </motion.div>

      {/* Featured Event */}
      <motion.div variants={item} className="mt-6">
        <BaseCard className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
          <div className="p-5 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Tech Summit 2025</h3>
                <p className="text-sm text-slate-600 mt-1">India's largest student tech conference</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Apr 5-7</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    <span>500+ colleges</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300 transition-all"
              >
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Register
              </Button>
            </div>
          </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}