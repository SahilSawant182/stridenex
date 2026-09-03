// components/dashboards/shared/CommunityCard.tsx
"use client";

import { Lock, Globe, Check, Plus, Clock } from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CommunityCardProps {
  community: {
    id: string;
    nameParts: string[];
    category: string;
    icon?: string;
    description?: string;
    owner?: string;
    creation?: string;
    memberCount?: number;
    messageCount?: number;
    status?: string;
  };
  isJoined?: boolean;
  action?: string;
  onJoin?: (id: string) => void;
  className?: string;
}

const categoryStyles: Record<string, { badge: string; iconBg: string; text: string }> = {
  Open: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    iconBg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 border border-emerald-200/30",
    text: "text-emerald-600",
  },
  Public: {
    badge: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconBg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 border border-blue-200/30",
    text: "text-blue-600",
  },
  Private: {
    badge: "bg-purple-50 text-purple-700 border-purple-200/60",
    iconBg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600 border border-purple-200/30",
    text: "text-purple-600",
  },
  Technical: {
    badge: "bg-sky-50 text-sky-700 border-sky-200/60",
    iconBg: "bg-sky-100 text-sky-600",
    text: "text-sky-600",
  },
  Startup: {
    badge: "bg-orange-50 text-orange-700 border-orange-200/60",
    iconBg: "bg-orange-100 text-orange-600",
    text: "text-orange-600",
  },
  Research: {
    badge: "bg-violet-50 text-violet-700 border-violet-200/60",
    iconBg: "bg-violet-100 text-violet-600",
    text: "text-violet-600",
  },
  Business: {
    badge: "bg-teal-50 text-teal-700 border-teal-200/60",
    iconBg: "bg-teal-100 text-teal-600",
    text: "text-teal-600",
  },
  Design: {
    badge: "bg-pink-50 text-pink-700 border-pink-200/60",
    iconBg: "bg-pink-100 text-pink-600",
    text: "text-pink-600",
  },
  Placements: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    iconBg: "bg-amber-100 text-amber-600",
    text: "text-amber-600",
  },
};

export function CommunityCard({ community, isJoined = false, action, onJoin, className = "" }: CommunityCardProps) {
  const styles = categoryStyles[community.category] || {
    badge: "bg-slate-50 text-slate-700 border-slate-200/60",
    iconBg: "bg-slate-100 text-slate-600 border border-slate-200/20",
    text: "text-slate-600",
  };

  // Clean owner email for creator label
  const getCreatorLabel = (owner: string) => {
    if (!owner) return "";
    if (owner === "Administrator") return "Administrator";
    return owner.split("@")[0];
  };

  return (
    <BaseCard className={`${className} group flex flex-col justify-between overflow-hidden relative`}>
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col h-full pt-1">
        {/* Header Block */}
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${styles.iconBg}`}>
              {community.icon || (community.category === "Private" ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors duration-200">
                {community.nameParts.map((part, index) => (
                  <span key={index} className="block truncate pr-1">
                    {part}
                  </span>
                ))}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Badge variant="outline" className={`px-2 py-0 h-4 text-[10px] uppercase font-bold tracking-wider ${styles.badge}`}>
                  {community.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <p className="text-xs text-slate-500/90 leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem]">
          {community.description}
        </p>

        {/* Creator / Details */}
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400/80 mb-2">
          {community.owner && (
            <div className="flex items-center gap-1 min-w-0">
              <span>Created by:</span>
              <span className="text-slate-500 font-semibold truncate max-w-[100px]">
                {getCreatorLabel(community.owner)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 font-semibold">
            {community.memberCount !== undefined && (
              <span className="flex items-center gap-0.5">
                <span>👤</span>
                <span>{community.memberCount}</span>
              </span>
            )}
            {community.messageCount !== undefined && (
              <span className="flex items-center gap-0.5">
                <span>💬</span>
                <span>{community.messageCount}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Action Button */}
        <div className="mt-auto pt-4 border-t border-slate-100/60">
          {(action === "pending" || action === "Pending" || community.status === "Pending") ? (
            <Button
              disabled
              variant="outline"
              className="w-full h-10 border-amber-200 bg-amber-50/70 text-amber-700 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-not-allowed opacity-90"
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Approval
            </Button>
          ) : (isJoined || action === "leave") ? (
            <Button
              onClick={() => onJoin?.(community.id)}
              variant="outline"
              className="w-full h-10 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Joined
            </Button>
          ) : (
            <Button
              onClick={() => onJoin?.(community.id)}
              className="w-full h-10 border border-accent/25 hover:border-accent bg-accent/5 hover:bg-accent text-accent hover:text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              {community.category === "Private" ? "Request to Join" : "Join Community"}
            </Button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}