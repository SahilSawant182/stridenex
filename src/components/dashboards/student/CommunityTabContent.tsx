// components/dashboards/student/CommunityTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { CommunityCard } from "@/components/dashboards/shared/CommunityCard";
import { FeedCard } from "@/components/dashboards/shared/FeedCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";

// Community data
const communities = [
  {
    id: "1",
    name: "DSA & Competitive Coding",
    members: 4820,
    online: 312,
    category: "Technical",
    icon: "💻"
  },
  {
    id: "2",
    name: "Startup Founders India",
    members: 2140,
    online: 178,
    category: "Startup",
    icon: "🚀"
  },
  {
    id: "3",
    name: "ML/AI Research Hub",
    members: 3620,
    online: 247,
    category: "Research",
    icon: "🧠"
  },
  {
    id: "4",
    name: "MBA & Business Strategy",
    members: 1890,
    online: 134,
    category: "Business",
    icon: "📊"
  },
  {
    id: "5",
    name: "Design & UX Circle",
    members: 1240,
    online: 98,
    category: "Design",
    icon: "🎨"
  },
  {
    id: "6",
    name: "Campus Placements 2025",
    members: 8940,
    online: 560,
    category: "Placements",
    icon: "💼"
  }
];

// Feed posts data
const feedPosts = [
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
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CommunityTabContent() {
  const handleJoinCommunity = (communityId: string) => {
    console.log("Joining community:", communityId);
    // Handle join logic
  };

  const handleLike = (postId: string) => {
    console.log("Liking post:", postId);
    // Handle like logic
  };

  const handleShare = (postId: string) => {
    console.log("Sharing post:", postId);
    // Handle share logic
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-800">Student Communities</h1>
        <p className="text-slate-500 mt-1">Join peer groups, share knowledge, and grow together</p>
      </motion.div>

      {/* Communities Grid */}
      <motion.div variants={item}>
        <CardHeader 
          title="Popular Communities" 
          icon={<span>🌟</span>}
          action={{ label: "Browse All" }}
          border={false}
          className="pb-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={handleJoinCommunity}
            />
          ))}
        </div>
      </motion.div>

      {/* Community Feed Section */}
      <motion.div variants={item} className="mt-8">
        <CardHeader 
          title="Community Feed" 
          icon={<span>📰</span>}
          action={{ label: "View All" }}
          border={false}
          className="pb-2"
        />
        <div className="grid grid-cols-1 gap-4 mt-4">
          {feedPosts.map((post) => (
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