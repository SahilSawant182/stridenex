"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  Briefcase,
  Rocket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSuccessStories } from "@/services/student.services";

export default function SuccessStoriesFooter() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoplayStopped, setIsAutoplayStopped] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await getSuccessStories();
      let fetchedStories: any[] = [];
      if (res) {
        if (Array.isArray(res)) {
          fetchedStories = res;
        } else if (res.message && Array.isArray(res.message.data)) {
          fetchedStories = res.message.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          fetchedStories = res.data.data;
        } else if (res.message && Array.isArray(res.message)) {
          fetchedStories = res.message;
        } else if (res.data && Array.isArray(res.data)) {
          fetchedStories = res.data;
        }
      }
      setStories(fetchedStories.filter(s => s && s.testimonial));
    } catch (error) {
      console.error("Error loading success stories in footer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Autoplay slide interval
  useEffect(() => {
    if (stories.length === 0 || isAutoplayStopped) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const cardWidth = clientWidth / 3 || 320;
          scrollContainerRef.current.scrollTo({ left: scrollLeft + cardWidth, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [stories, isAutoplayStopped]);

  const getStudentDisplayName = (story: any) => {
    if (!story.student) return "StrideNex Student";
    if (story.student.includes("@")) {
      const part = story.student.split("@")[0];
      return part
        .split(".")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return story.student;
  };

  const getInitials = (story: any) => {
    if (story.avatar_initials) return story.avatar_initials;
    const name = getStudentDisplayName(story);
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarStyle = (story: any) => {
    if (story.avatar_color && story.avatar_color.startsWith("#")) {
      return { backgroundColor: story.avatar_color };
    }
    const colors = ["#9333EA", "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
    const charCode = (story.student || "ST").charCodeAt(0);
    return { backgroundColor: colors[charCode % colors.length] };
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "placement":
        return Briefcase;
      case "internship":
        return Award;
      case "higher studies":
        return Rocket;
      case "startup":
      case "entrepreneurship":
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category?.toLowerCase()) {
      case "placement":
        return {
          border: "border-l-orange-500",
          badge: "bg-orange-50 text-orange-600 border-orange-100/80",
          iconBg: "bg-orange-100/50 text-orange-600"
        };
      case "internship":
        return {
          border: "border-l-emerald-500",
          badge: "bg-emerald-50 text-emerald-600 border-emerald-100/80",
          iconBg: "bg-emerald-100/50 text-emerald-600"
        };
      case "startup":
      case "entrepreneurship":
        return {
          border: "border-l-purple-500",
          badge: "bg-purple-50 text-purple-600 border-purple-100/80",
          iconBg: "bg-purple-100/50 text-purple-600"
        };
      default:
        return {
          border: "border-l-blue-500",
          badge: "bg-blue-50 text-blue-600 border-blue-100/80",
          iconBg: "bg-blue-100/50 text-blue-600"
        };
    }
  };

  const scroll = (direction: "left" | "right") => {
    setIsAutoplayStopped(true);
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading || stories.length === 0) return null;

  return (
    <div className="border-t border-slate-200/60 pt-8 mt-12 mb-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
            StrideNex Success Stories
          </h3>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Real outcomes achieved by StrideNex students</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all bg-white"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-lg border-slate-200 hover:bg-slate-50 shadow-sm active:scale-95 transition-all bg-white"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 snap-x snap-mandatory w-full"
        onMouseEnter={() => setIsAutoplayStopped(true)}
      >
        {stories.map((story, index) => {
          const Icon = getCategoryIcon(story.outcome_category);
          const displayName = getStudentDisplayName(story);
          const initials = getInitials(story);
          const avatarStyle = getAvatarStyle(story);
          const cardTheme = getCategoryColors(story.outcome_category);

          return (
            <div 
              key={story.id || index} 
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
            >
              <BaseCard className={`overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 border-slate-200 bg-white h-[180px] flex flex-col justify-between relative group rounded-xl border-l-[4px] ${cardTheme.border}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="p-4 flex flex-col justify-between h-full space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="w-7 h-7 border border-slate-100 shadow-sm shrink-0">
                        <AvatarFallback style={avatarStyle} className="text-white font-bold text-[9px]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-[11px] leading-tight truncate">{displayName}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold truncate" title={story.college}>{story.college || "StrideNex Student"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${cardTheme.badge} text-[8px] font-bold py-0.5 px-1.5 rounded-full uppercase tracking-wider shrink-0`}>
                      {story.outcome_category}
                    </Badge>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100/80 rounded-lg p-2 relative min-h-[48px] flex items-center group-hover:bg-slate-100/35 transition-colors duration-200">
                    <Quote className="w-6 h-6 text-slate-200/40 absolute right-1 top-0.5 pointer-events-none" />
                    <p className="text-[10px] text-slate-650 italic leading-relaxed line-clamp-2 pr-5">
                      "{story.testimonial}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1 rounded-lg shrink-0 ${cardTheme.iconBg}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[7px] text-slate-400 font-bold block uppercase tracking-wider leading-none mb-0.5">Outcome</span>
                        <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{story.outcome_title}</p>
                      </div>
                    </div>
                    {story.outcome_metric && (
                      <div className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black shadow-sm shrink-0 ml-2">
                        {story.outcome_metric}
                      </div>
                    )}
                  </div>
                </div>
              </BaseCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
