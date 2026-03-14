// components/dashboards/shared/CommunityCard.tsx
"use client";

import { Users } from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    members: number;
    online: number;
    category: string;
    icon?: string;
  };
  onJoin?: (id: string) => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Technical: "bg-blue-100 text-blue-700 border-blue-200",
  Startup: "bg-orange-100 text-orange-700 border-orange-200",
  Research: "bg-purple-100 text-purple-700 border-purple-200",
  Business: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Design: "bg-pink-100 text-pink-700 border-pink-200",
  Placements: "bg-amber-100 text-amber-700 border-amber-200",
};

export function CommunityCard({ community, onJoin, className = "" }: CommunityCardProps) {
  const colorClass = categoryColors[community.category] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <BaseCard className={className}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center text-xl font-bold`}>
              {community.icon || community.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{community.name}</h3>
              <Badge variant="outline" className={`mt-1 ${colorClass}`}>
                {community.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{community.members.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">{community.online} online</span>
          </div>
        </div>

        <Button
          onClick={() => onJoin?.(community.id)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
        >
          Join Community
        </Button>
      </div>
    </BaseCard>
  );
}