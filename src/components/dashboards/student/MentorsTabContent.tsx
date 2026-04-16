// components/dashboards/student/MentorsTabContent.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getMentorListings } from "@/services/student.services";

// Types
interface Mentor {
  id: string;
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
  profileImage: string;
}

const COLORS = [
  "bg-purple-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-600", "bg-pink-600", "bg-indigo-600"
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
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("currentUser") || "";

      const response = await getMentorListings();
      console.log(response, 'response')
      if (response && response.message && Array.isArray(response.message)) {
        const mappedMentors = response.message.map((m: any, index: number) => {
          const name = m.full_name || m.mentor || "Unknown Mentor";
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "M";

          return {
            id: m.offering_name || `mentor-${index}`,
            name: name,
            initials,
            role: m.designation || "Mentor",
            company: m.company || "Independent",
            expertise: m.tags || [],
            rating: m.avg_rating || 0,
            sessions: m.total_sessions || 0,
            hourlyRate: m.price_per_hour ? `₹${m.price_per_hour}/hr` : "Free",
            availability: m.next_slot || "Contact for availability",
            tags: m.tags || [],
            avatarColor: COLORS[index % COLORS.length],
            profileImage: m.profile_image || ""
          };
        });
        setMentors(mappedMentors);
      } else {
        setMentors([]);
      }
    } catch (err) {
      console.error("Error loading mentors:", err);
      setError("Failed to load mentor listings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-500">
        <div className="animate-pulse flex items-center gap-2">
          <BookOpen className="animate-spin w-5 h-5" />
          <span>Loading mentors...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mentors</h1>
          <p className="text-slate-500 mt-1">Connect with industry experts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search mentors..."
              className="pl-9 pr-4 py-2 w-full md:w-64 bg-white border-slate-200 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-200 shrink-0">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </motion.div>

      {mentors.length === 0 ? (
        <motion.div variants={item} className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
          No mentors available at the moment.
        </motion.div>
      ) : (
        /* Mentors Grid */
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((mentor) => (
            <BaseCard key={mentor.id} className="overflow-hidden hover:shadow-lg transition-all group">
              <div className="p-5 flex flex-col h-full">
                <div className="flex-1">
                  {/* Header with Avatar and Company */}
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div className="flex gap-3 flex-1 min-w-0">
                      <Avatar className="w-11 h-11 shrink-0">
                        {mentor.profileImage ? (
                          <AvatarImage src={mentor.profileImage} alt={mentor.name} className="object-cover" />
                        ) : null}
                        <AvatarFallback className={`${mentor.avatarColor} text-white font-medium`}>
                          {mentor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 break-all text-sm leading-tight mt-0.5" title={mentor.name}>
                          {mentor.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-1" title={`${mentor.role} • ${mentor.company}`}>
                          <Briefcase className="w-3 h-3 shrink-0" />
                          <span className="truncate">{mentor.role} • {mentor.company}</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] px-1.5 py-0 shrink-0 h-fit mt-0.5">
                      Available
                    </Badge>
                  </div>

                  {/* Expertise Tags */}
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.expertise.map((exp, i) => (
                        <Badge key={i} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-slate-800">{mentor.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({mentor.sessions})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{mentor.hourlyRate}</span>
                    </div>
                  </div>

                  {/* Next Available */}
                  <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-600">Next available: </span>
                    <span className="text-xs font-medium text-slate-800 truncate">{mentor.availability}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-auto">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm">
                    Book Session
                  </Button>
                  <Button variant="outline" size="icon" className="border-slate-200 shrink-0">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
              </div>
            </BaseCard>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}