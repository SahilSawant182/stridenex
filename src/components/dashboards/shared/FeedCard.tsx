// components/dashboards/shared/FeedCard.tsx
"use client";

import { Heart, Eye, Share2, MoreHorizontal } from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";

interface FeedCardProps {
  post: {
    id: string;
    author: {
      name: string;
      initials: string;
      community: string;
    };
    timestamp: string;
    content: string;
    likes: number;
    views: number;
  };
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export function FeedCard({ post, onLike, onShare, className = "" }: FeedCardProps) {
  return (
    <BaseCard className={className}>
      <div className="flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm">
              {post.author.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-800">{post.author.name}</h4>
                <span className="text-xs text-slate-400">in</span>
                <span className="text-xs font-medium text-primary">{post.author.community}</span>
              </div>
              <p className="text-xs text-slate-500">{post.timestamp}</p>
            </div>
          </div>
          <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <p className="text-sm text-slate-700 mb-4 leading-relaxed">{post.content}</p>

        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => onLike?.(post.id)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group"
          >
            <Heart className="w-4 h-4 group-hover:fill-red-500 group-hover:text-red-500" />
            <span className="text-xs">{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-xs">{post.views}</span>
          </button>
          <button
            onClick={() => onShare?.(post.id)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors ml-auto"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </BaseCard>
  );
}