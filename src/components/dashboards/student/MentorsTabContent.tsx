// components/dashboards/student/MentorsTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Star, 
  Calendar, 
  Clock, 
  Briefcase, 
  MapPin, 
  Award,
  BookOpen,
  Code,
  Database,
  TrendingUp,
  MessageSquare,
  Target,
  Search,
  Filter,
  ChevronRight
} from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Types
interface Mentor {
  id: number;
  name: string;
  initials: string;
  role: string;
  company: string;
  expertise: string[];
  rating: number;
  sessions: number;
  hourlyRate: string;
  availability: string;
  nextSlot?: string;
  tags: string[];
  avatarColor: string;
}

// Mentors data
const mentors: Mentor[] = [
  {
    id: 1,
    name: "Kavya Reddy",
    initials: "KR",
    role: "Senior Data Scientist",
    company: "Amazon",
    expertise: ["ML", "Python", "Career"],
    rating: 4.9,
    sessions: 124,
    hourlyRate: "$85/hr",
    availability: "Feb 27, 4PM",
    tags: ["Deep Learning", "NLP"],
    avatarColor: "bg-purple-600"
  },
  {
    id: 2,
    name: "Siddharth Shah",
    initials: "SS",
    role: "Research Scientist",
    company: "Microsoft",
    expertise: ["Deep Learning", "Computer Vision", "Research"],
    rating: 4.9,
    sessions: 67,
    hourlyRate: "$95/hr",
    availability: "Mar 2, 11AM",
    tags: ["PyTorch", "TensorFlow"],
    avatarColor: "bg-blue-600"
  },
  {
    id: 3,
    name: "Rajan Mehta",
    initials: "RM",
    role: "Engineering Manager",
    company: "Google",
    expertise: ["Leadership", "Tech", "Resume"],
    rating: 4.8,
    sessions: 89,
    hourlyRate: "$120/hr",
    availability: "Mar 1, 2PM",
    tags: ["System Design", "Interviews"],
    avatarColor: "bg-emerald-600"
  },
  {
    id: 4,
    name: "Ananya Krishnan",
    initials: "AK",
    role: "Head of Analytics",
    company: "Razorpay",
    expertise: ["SQL", "Data Analytics", "Product"],
    rating: 4.6,
    sessions: 145,
    hourlyRate: "$75/hr",
    availability: "Mar 3, 10AM",
    tags: ["Business Intelligence", "Metrics"],
    avatarColor: "bg-orange-600"
  },
  {
    id: 5,
    name: "Pooja Iyer",
    initials: "PI",
    role: "Product Lead",
    company: "Swiggy",
    expertise: ["Product", "Startup", "MBA"],
    rating: 4.7,
    sessions: 98,
    hourlyRate: "$90/hr",
    availability: "Mar 1, 2PM",
    tags: ["Product Strategy", "Growth"],
    avatarColor: "bg-pink-600"
  },
  {
    id: 6,
    name: "Rahul Verma",
    initials: "RV",
    role: "Engineering Manager",
    company: "Microsoft",
    expertise: ["Cloud", "DevOps", "Architecture"],
    rating: 4.8,
    sessions: 112,
    hourlyRate: "$105/hr",
    availability: "Feb 28, 3PM",
    tags: ["Azure", "Kubernetes"],
    avatarColor: "bg-indigo-600"
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

export default function MentorsTabContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mentors</h1>
          <p className="text-slate-500 mt-1">Connect with industry experts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search mentors..."
              className="pl-9 pr-4 py-2 w-64 bg-white border-slate-200 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </motion.div>

      {/* Mentors Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentors.map((mentor) => (
          <BaseCard key={mentor.id} className="overflow-hidden hover:shadow-lg transition-all group">
            <div className="p-5">
              {/* Header with Avatar and Company */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${mentor.avatarColor} text-white font-medium`}>
                      {mentor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-800">{mentor.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      {mentor.role} • {mentor.company}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">
                  Available
                </Badge>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise.map((exp) => (
                  <Badge key={exp} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                    {exp}
                  </Badge>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">{mentor.rating}</span>
                  <span className="text-xs text-slate-400">({mentor.sessions})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{mentor.hourlyRate}</span>
                </div>
              </div>

              {/* Next Available */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">Next available: </span>
                <span className="text-xs font-medium text-slate-800">{mentor.availability}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm">
                  Book Session
                </Button>
                <Button variant="outline" size="icon" className="border-slate-200">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            </div>
          </BaseCard>
        ))}
      </motion.div>

      {/* Featured Mentor Section */}
      {/* <motion.div variants={item} className="mt-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xl">
              RM
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">Rajan Mehta</h3>
              <p className="text-sm text-slate-600">Engineering Manager @Google • Ex-Amazon</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.9</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">15+ years experience</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-white text-slate-700 border-slate-200">System Design</Badge>
                <Badge className="bg-white text-slate-700 border-slate-200">Leadership</Badge>
                <Badge className="bg-white text-slate-700 border-slate-200">Career Growth</Badge>
              </div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              View Profile
            </Button>
          </div>
        </div>
      </motion.div> */}
    </motion.div>
  );
}