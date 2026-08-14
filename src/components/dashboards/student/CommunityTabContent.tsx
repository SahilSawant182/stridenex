// components/dashboards/student/CommunityTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CommunityCard } from "@/components/dashboards/shared/CommunityCard";
import { FeedCard } from "@/components/dashboards/shared/FeedCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { apiService, getCommunities, joinCommunity, leaveCommunity } from "@/services/api.services";
import { useToast } from "@/context/ToastContext";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

// Email and Name Formatting Helper (returns name parts for line breaks)
const formatChannelName = (name: string): string[] => {
  if (!name) return [];
  // Check if it's a DM / Private channel with email_email format
  if (name.includes(" _ ")) {
    return name
      .split(" _ ")
      .map((part) => {
        const username = part.split("@")[0];
        return username
          .split(/[._-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      });
  }
  // Otherwise, split by dashes/underscores and capitalize
  return [
    name
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  ];
};

// Description Fallback Helper
const getFallbackDescription = (type: string, name: string) => {
  if (type === "Open" || type === "Public") {
    return `Welcome to the ${name} community. A public space to collaborate, ask questions, share resources, and grow with peers.`;
  }
  return `A private channel for direct communications and close collaboration between members.`;
};

// Icon Fallback Helper
const getFallbackIcon = (name: string, type: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("code") || lower.includes("python") || lower.includes("dsa") || lower.includes("dev")) return "💻";
  if (lower.includes("design") || lower.includes("ux") || lower.includes("ui") || lower.includes("art")) return "🎨";
  if (lower.includes("startup") || lower.includes("founder") || lower.includes("entrepreneur")) return "🚀";
  if (lower.includes("research") || lower.includes("ml") || lower.includes("ai")) return "🧠";
  if (lower.includes("placement") || lower.includes("job") || lower.includes("career")) return "💼";
  if (lower.includes("general")) return "💬";

  if (type === "Private") return "🔒";
  return "🌐";
};

// Feed posts data (Static mockup for context)
const initialFeedPosts = [
  {
    id: "1",
    author: {
      name: "Riya S.",
      initials: "RS",
      community: "DSA & Competitive Coding"
    },
    timestamp: "2h ago",
    content: "Just cracked my first LeetCode Hard — Binary Search on Answer pattern. Sharing approach 🎉",
    likes: 48,
    views: 12
  },
  {
    id: "2",
    author: {
      name: "Arjun M.",
      initials: "AM",
      community: "Startup Founders India"
    },
    timestamp: "5h ago",
    content: "We just closed our seed round! Key lesson: build with users, not for users.",
    likes: 124,
    views: 34
  },
  {
    id: "3",
    author: {
      name: "Priya K.",
      initials: "PK",
      community: "ML/AI Research Hub"
    },
    timestamp: "1d ago",
    content: "RAG vs fine-tuning for domain-specific tasks — traditional FT still wins in my experiments. Thoughts?",
    likes: 67,
    views: 21
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

// Skeleton Card component (adjusted - removed members skeleton)
const CommunityCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-slate-200" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-2 pt-1">
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
    </div>
    <div className="h-10 bg-slate-200 rounded-lg w-full pt-1" />
  </div>
);

export default function CommunityTabContent() {
  const router = useRouter();
  const [communities, setCommunities] = useState<any[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchChannels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      const response = await getCommunities({
        user: email
      });
      
      let communitiesArray = response?.message?.data || response?.data?.data || response?.data || response?.message || [];
      if (!Array.isArray(communitiesArray)) {
        if (Array.isArray(response?.message?.communities)) communitiesArray = response.message.communities;
        else if (Array.isArray(response?.data?.communities)) communitiesArray = response.data.communities;
        else communitiesArray = [];
      }

      if (Array.isArray(communitiesArray)) {
        const mappedChannels = communitiesArray.map((channel: any) => {
          const prettyName = [channel.community_name || channel.name];
          const prettyNameStr = prettyName.join(" ");
          return {
            id: channel.name,
            nameParts: prettyName,
            rawName: channel.community_name,
            category: channel.community_type || "Public",
            description: channel.description || getFallbackDescription(channel.community_type, prettyNameStr),
            icon: getFallbackIcon(channel.community_name, channel.community_type),
            owner: channel.owner,
            creation: channel.created_on,
            memberCount: channel.member_count,
            messageCount: 0,
            isMember: channel.is_member === 1,
            action: channel.action
          };
        });
        setCommunities(mappedChannels);
      } else {
        throw new Error("Invalid response format received from server.");
      }
    } catch (err: any) {
      console.error("Error fetching channels:", err);
      setError(err?.message || "Failed to load communities. Please try again.");
      showToast(err?.message || "Failed to load communities", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleJoinCommunity = async (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    
    if (community?.action === 'leave' || joinedCommunities.includes(communityId) || community?.isMember) {
      router.push(`/student/community/${communityId}`);
      return;
    }

    const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";

    try {
      // Join
      const response = await joinCommunity({
        community: communityId,
        student: email
      });
      
      if (response?.message?.success || response?.message === "Success" || response?.data) {
        setJoinedCommunities((prev) => [...prev, communityId]);
        showToast("Successfully joined!", "success");
        fetchChannels(); // Refresh the list
      } else {
        throw new Error("Failed to join community");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Operation failed", "error");
    }
  };

  const handleLike = (postId: string) => {
    console.log("Liking post:", postId);
  };

  const handleShare = (postId: string) => {
    console.log("Sharing post:", postId);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto px-4 py-2"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Communities</h1>
          <p className="text-slate-500 mt-1">Join peer groups, share knowledge, and grow together</p>
        </div>
        {error && (
          <button
            onClick={fetchChannels}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </motion.div>

      {/* Communities Grid */}
      <motion.div variants={item}>
        <CardHeader
          title="Popular Communities"
          icon={<span className="text-xl">🌟</span>}
          action={{ label: "Browse All" }}
          border={false}
          className="pb-2"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            <CommunityCardSkeleton />
            <CommunityCardSkeleton />
            <CommunityCardSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3 animate-pulse" />
            <h3 className="font-semibold text-slate-800 text-lg">Unable to load communities</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md">{error}</p>
            <button
              onClick={fetchChannels}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              Try Again
            </button>
          </div>
        ) : communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4 text-center">
            <span className="text-4xl mb-2">🏘️</span>
            <h3 className="font-semibold text-slate-800 text-lg">No communities found</h3>
            <p className="text-slate-500 text-sm mt-1">There are no channels available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                isJoined={joinedCommunities.includes(community.id) || community.isMember || community.action === 'leave'}
                action={community.action}
                onJoin={handleJoinCommunity}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Community Feed Section */}
      <motion.div variants={item} className="mt-8">
        <CardHeader
          title="Community Feed"
          icon={<span className="text-xl">📰</span>}
          action={{ label: "View All" }}
          border={false}
          className="pb-2"
        />
        <div className="grid grid-cols-1 gap-4 mt-4">
          {initialFeedPosts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onShare={handleShare}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}