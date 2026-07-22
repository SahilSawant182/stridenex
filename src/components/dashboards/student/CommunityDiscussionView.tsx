// components/dashboards/student/CommunityDiscussionView.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  Folder, 
  Tag, 
  Plus, 
  Heart, 
  Send, 
  Sparkles,
  TrendingUp,
  MessageCircle,
  Hash,
  Filter,
  Check,
  Image as ImageIcon,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService, BASE_DOMAIN } from "@/services/api.services";
import { getTags, createTag } from "@/services/student.services";
import { useToast } from "@/context/ToastContext";


interface Post {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  likes: number;
  comments: number;
  replies: Array<{ author: string; content: string; time: string; image?: string }>;
  content: string;
  category?: string;
  image?: string;
  tags?: string[];
  contributors?: string[];
}

interface CategoryData {
  name: string;
  description: string;
  color: string;
  subtags: string[];
  topicsPerMonth: string;
  posts: Post[];
}

interface CommunityDiscussionViewProps {
  community: {
    id: string;
    name: string;
    category: string;
    description: string;
  };
  onBack: () => void;
}

const generateQuestionsForCategory = (categoryName: string, count: number = 100): Post[] => {
  const topics: Record<string, { titles: string[], contents: string[] }> = {
    Community: {
      titles: [
        "Welcome to the community! Introduce yourself here",
        "Upcoming StrideNex Virtual Hackathon - July 2026",
        "How can we improve peer-to-peer collaboration in the dashboard?",
        "Study Group matching for Data Structures & Algorithms",
        "Sharing my experience with the recent Google placement drive",
        "Best resources for learning Full-Stack Web Development",
        "How to prepare for coding interviews in 3 months",
        "Tips for balancing college projects and internship prep",
        "Looking for a partner for the UI/UX design challenge",
        "What programming languages are you focusing on in 2026?",
      ],
      contents: [
        "Hello everyone! Post your name, interests, and what you are learning to connect with others.",
        "Get ready for our virtual hackathon next weekend. Registration is open to all students.",
        "We're looking for feedback on how to make the discussion forums more collaborative.",
        "Looking to form a study group of 4-5 people to solve LeetCode daily problems together.",
        "I recently went through the recruitment process and wanted to share the type of questions asked.",
        "Here is a curated list of free tutorials, docs, and courses that helped me master React and Node.",
        "What are your strategies for revising DSA concepts and system design under tight schedules?",
        "It's hard to manage academic courses alongside professional skill building. Let's discuss ideas.",
        "I need a frontend collaborator for the upcoming Design challenge. Let me know if interested!",
        "I'm debating between mastering Go or Rust for backend engineering. What's your take?",
      ]
    },
    "Site Operators": {
      titles: [
        "Trouble setting up Tutor on Ubuntu 22.04",
        "Docker container out of memory on production deployment",
        "Best practices for SSL certificate auto-renewal using Let's Encrypt",
        "How to migrate user databases from local PostgreSQL to Cloud SQL",
        "Integrating custom OAuth provider with the StrideNex API",
        "Configuring horizontal pod autoscaling in Kubernetes for peak loads",
        "Optimizing Redis caching configurations for faster page rendering",
        "Troubleshooting websocket disconnects on Nginx reverse proxy",
        "Setting up custom SMTP server settings for automated user mailers",
        "Securing public-facing endpoints with Cloudflare WAF rules",
      ],
      contents: [
        "I keep getting connection timeouts when running tutor local quickstart. Here is my configuration file.",
        "Our Docker containers crash during high concurrent traffic. Is there a way to limit memory dynamically?",
        "A step-by-step walkthrough of automated SSL setup using certbot and systemd timers.",
        "Has anyone migrated high volumes of user records between postgres versions without downtime?",
        "We need to allow students to log in using their college email credentials. Any docs on SSO config?",
        "Our traffic spikes during exams. How can we set CPU thresholds for scaling up replicas?",
        "Redis memory utilization is at 90%. What eviction policies are you using in production?",
        "Websocket connections drop exactly after 60 seconds of inactivity. Nginx proxy read timeout is set.",
        "Emails are landing in spam. Do we need to update SPF, DKIM, and DMARC DNS records?",
        "We are seeing a high volume of scrapers on the API endpoints. Let's discuss blocking rules.",
      ]
    },
    Educators: {
      titles: [
        "Flipped classroom models in engineering courses: Does it work?",
        "Designing interactive quizzes that test conceptual understanding",
        "How to prevent AI plagiarism in computer science assignments?",
        "Creating effective autograders for programming tasks",
        "Student engagement metrics: What numbers should we care about?",
        "Best tools for recording high-quality lecture videos at home",
        "How to structure a 12-week intro to machine learning course",
        "Strategies for grading open-ended design portfolios fairly",
        "Using peer evaluation in group projects: Pros and cons",
        "How to support students struggling with coding anxiety?",
      ],
      contents: [
        "I'm thinking of moving lectures online and using class hours for problem-solving. Thoughts?",
        "Traditional multiple choice questions are easy to guess. How can we write deeper questions?",
        "With LLMs, students can easily generate code. What strategies are you using to assess real understanding?",
        "We are building custom grading scripts to run student code against test cases automatically.",
        "Is tracking page views and video completion rates enough to measure student success?",
        "Looking for recommendations for microphones and screen recorders that don't lag.",
        "We are updating our AI curriculum. Should we start with classical ML or deep learning directly?",
        "Rubrics help, but grading creative design tasks is inherently subjective. Share your rubrics!",
        "Peer grading sometimes leads to bias. How do you normalize scores assigned by classmates?",
        "Many students get blocked by compiler errors and lose confidence. How can we encourage them?",
      ]
    },
    Development: {
      titles: [
        "Refactoring the authentication middleware for faster API responses",
        "Migrating React components to Next.js server components",
        "How to implement real-time push notifications using WebSockets?",
        "Optimizing SQL queries with complex joins and indexes",
        "Writing robust integration tests with Cypress or Playwright",
        "State management in 2026: Zustand vs Redux Toolkit vs Signals",
        "How to handle file uploads securely directly to AWS S3?",
        "Structuring a monorepo with Turborepo and npm workspaces",
        "Best practices for API versioning and handling breaking changes",
        "Handling race conditions in database transaction locks",
      ],
      contents: [
        "Our auth check adds 150ms to every request. Let's cache session states in Redis.",
        "We want to leverage React Server Components (RSC) to reduce bundle size on the client.",
        "Looking for a robust way to broadcast notifications when a user replies to a student's question.",
        "A query on our analytics dashboard takes 5 seconds to load. Here is the query plan.",
        "We need to write end-to-end tests for the onboarding flow to catch UI regressions.",
        "Zustand seems simpler, but do we lose the developer tools of Redux? Let's analyze.",
        "We shouldn't proxy large video files through our backend. Let's use S3 presigned URLs.",
        "Setting up a monorepo for our mobile app and web portal. What are the common pitfalls?",
        "Should we use header-based versioning (Accept: application/vnd.company.v2) or URL versioning (/v2)?",
        "When two users update the same counter, the database value is incorrect. We need optimistic locking.",
      ]
    }
  };

  const pool = topics[categoryName] || topics["Community"];
  const questions: Post[] = [];

  const authors = [
    "Aarav Sharma", "Neha Patel", "Kabir Singh", "Ananya Rao", "Rohan Gupta",
    "Priya Nair", "Aditya Verma", "Shruti Iyer", "Vikram Malhotra", "Diya Joshi",
    "Amit Trivedi", "Kirti Das", "Rahul Sen", "Meera Krishnan", "Sanjay Dutt",
    "Pooja Hegde", "Devendra Jha", "Sneha Reddy", "Rajesh Koothrapali", "Aishwarya Rai"
  ];

  const times = [
    "2h", "5h", "1d", "2d", "3d", "5d", "1w", "2w", "3w", "1m", "2m", "3m"
  ];

  const repliesTemplates = [
    [
      { author: "Sarah Jenkins", content: "I had a similar issue and solved it by updating the configuration parameters. Check out line 45.", time: "1h ago" },
      { author: "Vikram Shah", content: "Thanks for the advice! It worked perfectly for me.", time: "30m ago" }
    ],
    [
      { author: "Tutor Bot", content: "Please run the diagnostic script in the console to identify missing modules.", time: "3h ago" }
    ],
    [
      { author: "Prof. Clara", content: "Excellent question. I recommend reviewing chapter 4 of the guide.", time: "1d ago" },
      { author: "Rohan Gupta", content: "Is there an online version of that guide?", time: "12h ago" },
      { author: "Prof. Clara", content: "Yes, it is pinned in the resources tab of the dashboard.", time: "10h ago" }
    ],
    []
  ];

  const tagsPool = ["help", "feature", "bug", "question", "discussion", "update"];

  for (let i = 0; i < count; i++) {
    const titleIndex = i % pool.titles.length;
    const contentIndex = i % pool.contents.length;
    const author = authors[i % authors.length];
    const timeAgo = times[i % times.length];
    const likes = Math.floor(Math.random() * 50) + 1;
    const comments = Math.floor(Math.random() * 8);
    const replies = repliesTemplates[i % repliesTemplates.length];
    const contributors = Array.from(new Set([author, ...replies.map(r => r.author)])).slice(0, 4);

    const postTags = [categoryName.toLowerCase().replace(" ", "-")];
    if (i % 3 === 0) postTags.push(tagsPool[i % tagsPool.length]);
    if (i % 5 === 0) postTags.push(tagsPool[(i + 1) % tagsPool.length]);

    questions.push({
      id: `${categoryName.toLowerCase().replace(/[^a-z0-9]/g, "")}_q_${i}`,
      title: `${pool.titles[titleIndex]} (Question #${i + 1})`,
      author,
      timeAgo,
      likes,
      comments: replies.length,
      replies: [...replies],
      content: pool.contents[contentIndex] + `\n\nThis is query #${i + 1} under the ${categoryName} category. Let's discuss standard practices, common issues, and workarounds.`,
      category: categoryName,
      tags: postTags,
      contributors,
      image: i % 8 === 0 ? `https://images.unsplash.com/photo-${1500000000000 + (i * 100000)}?w=600&auto=format&fit=crop&q=60` : undefined
    });
  }

  return questions;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

export default function CommunityDiscussionView({ community, onBack }: CommunityDiscussionViewProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"categories" | "discussions">("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [newReplyText, setNewReplyText] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Community");

  const [tagsList, setTagsList] = useState<any[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [newTagTitle, setNewTagTitle] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const fetchTags = async () => {
    try {
      setTagsLoading(true);
      const res = await getTags();
      const list = res?.message?.data || res?.data?.message?.data || (Array.isArray(res?.message) ? res.message : []);
      setTagsList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading tags list:", err);
    } finally {
      setTagsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [community?.id]);

  const handleCreateTag = async () => {
    if (!newTagTitle.trim()) return;
    try {
      setIsCreatingTag(true);
      await createTag(newTagTitle.trim());
      showToast("Tag created successfully!", "success");
      setShowCreateTagModal(false);
      setNewTagTitle("");
      fetchTags();
    } catch (err: any) {
      console.error("Error creating tag:", err);
      showToast(err?.message || "Failed to create tag", "error");
    } finally {
      setIsCreatingTag(false);
    }
  };


  // Initial mockup categories structured like the Open edX screenshot but customized for this community
  const [categoriesData, setCategoriesData] = useState<Record<string, CategoryData>>({
    Community: {
      name: "Community",
      description: "Discussions about where we come together, how we collaborate, finding each other, helping each other.",
      color: "bg-[#0091FF]",
      subtags: ["Introductions", "News", "Events", "Jobs", "Discourse", "Show & Tell"],
      topicsPerMonth: "1 / month",
      posts: [
        {
          id: "c1",
          title: "Contributions Review Spring Cleaning Hackathon",
          author: "Alex Rivera",
          timeAgo: "2d",
          likes: 12,
          comments: 4,
          content: "Hey everyone! Let's get together for our monthly hackathon. We'll be reviewing code and cleaning up our open issues.",
          replies: [
            { author: "Sarah Jenkins", content: "Count me in! I'll focus on frontend issues.", time: "1d ago" },
            { author: "Vikram Shah", content: "I can help review PRs for the core library.", time: "12h ago" }
          ]
        },
        {
          id: "c2",
          title: "PXC: A New Approach to Interactive Learning Content",
          author: "Prof. Clara",
          timeAgo: "19d",
          likes: 24,
          comments: 8,
          content: "Sharing our latest study on interactive learning frameworks. This model has shown a 30% increase in student engagement.",
          replies: []
        },
        {
          id: "c3",
          title: "WHO Academy - Senior Open edX Architect Position Open",
          author: "Hiring Manager",
          timeAgo: "27d",
          likes: 8,
          comments: 2,
          content: "We are looking for a Senior Architect to join our team at the WHO Academy. Remote options available.",
          replies: []
        },
        {
          id: "c4",
          title: "Looking for work: Instructional designers, video editors",
          author: "John Doe",
          timeAgo: "27d",
          likes: 15,
          comments: 5,
          content: "Experienced designer looking to collaborate on upcoming education modules. Reach out for portfolios.",
          replies: []
        }
      ]
    },
    "Site Operators": {
      name: "Site Operators",
      description: "Discussion about running platforms, setting up servers, configurations, and deploying with Docker/Tutor.",
      color: "bg-[#00E676]",
      subtags: ["Site Operations Help", "Tutor Help"],
      topicsPerMonth: "14 / month",
      posts: [
        {
          id: "s1",
          title: "📌 How to get help",
          author: "System Admin",
          timeAgo: "Aug 2019",
          likes: 45,
          comments: 0,
          content: "Before creating a support ticket, please verify your logs and check the documentation wiki.",
          replies: []
        },
        {
          id: "s2",
          title: "How to enable Special Exams in Studio?",
          author: "Elena Rostova",
          timeAgo: "22h",
          likes: 6,
          comments: 1,
          content: "I'm trying to set up timed and proctored exams. Where do I toggle this feature in the advanced settings?",
          replies: [
            { author: "Tutor Bot", content: "You need to add 'proctoring' to the Advanced Settings array in Studio.", time: "18h ago" }
          ]
        },
        {
          id: "s3",
          title: "Looking for help in identifying issue affecting xBlock loading",
          author: "Marcus Aurelius",
          timeAgo: "1d",
          likes: 9,
          comments: 3,
          content: "Our custom xBlocks are failing to load after the recent update. Here is the stack trace...",
          replies: []
        }
      ]
    },
    Educators: {
      name: "Educators",
      description: "Educators' discussion: course creation, learning theory, organizational logistics. How do you use tools to teach your courses?",
      color: "bg-[#D500F9]",
      subtags: ["Instructional Design", "Authoring"],
      topicsPerMonth: "4 / month",
      posts: [
        {
          id: "e1",
          title: "Open edX for IT infrastructure and DevOps training",
          author: "Dr. Rachel",
          timeAgo: "10d",
          likes: 19,
          comments: 3,
          content: "How are you structured labs for hands-on shell practice inside the LMS? Suggestions appreciated.",
          replies: []
        },
        {
          id: "e2",
          title: "Video: Math Tools in Open edX Studio",
          author: "Math Dept",
          timeAgo: "15d",
          likes: 11,
          comments: 2,
          content: "A quick tutorial video explaining how to integrate LaTeX formulas and charts directly inside HTML components.",
          replies: []
        },
        {
          id: "e3",
          title: "Is there an alternative to Discovery Programs?",
          author: "Curriculum Lead",
          timeAgo: "16d",
          likes: 5,
          comments: 1,
          content: "We want to package courses into tracks without using the default discovery plugin. What are the best practices?",
          replies: []
        }
      ]
    },
    Development: {
      name: "Development",
      description: "Core platform development, Python/Django codebase customization, API development, backend architecture.",
      color: "bg-[#FFAB00]",
      subtags: ["Pull Requests", "Core Architecture", "APIs"],
      topicsPerMonth: "4 / month",
      posts: [
        {
          id: "d1",
          title: "Shouldn't Superuser automatically inherit Staff permissions?",
          author: "Developer X",
          timeAgo: "3d",
          likes: 32,
          comments: 14,
          content: "Currently there is a separation between superuser and staff flags. This causes some confusion when logging into dashboards.",
          replies: [
            { author: "Admin", content: "This is by design to ensure separate audit logs for configuration and content editing.", time: "2d ago" }
          ]
        }
      ]
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [categoryQuestions, setCategoryQuestions] = useState<Record<string, Post[]>>({});
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedReplyImage, setSelectedReplyImage] = useState<string | null>(null);
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null);

  const getQuestionsForCategory = (catName: string) => {
    return categoryQuestions[catName] || [];
  };

  // Scroll handler for throttling (infinite scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedCategory) return;
      if (isLoadingMore) return;

      const threshold = 150; // px before reaching bottom
      const docHeight = document.documentElement.scrollHeight;
      const scrollPos = window.innerHeight + window.scrollY;

      const currentPool = getQuestionsForCategory(selectedCategory);
      if (visibleCount >= currentPool.length) return;

      if (docHeight - scrollPos < threshold) {
        setIsLoadingMore(true);
        // Throttle loading to show a beautiful spinner/skeleton
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 10, currentPool.length));
          setIsLoadingMore(false);
        }, 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCategory, visibleCount, isLoadingMore, categoryQuestions]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      setReplyImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedReplyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  const [apiLoading, setApiLoading] = useState(false);

  const formatCreationTime = (creationStr: string) => {
    try {
      const date = new Date(creationStr.replace(" ", "T"));
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs)) return "Recent";
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Recent";
    }
  };

  const isApiPostId = (id: string) => {
    if (!id) return false;
    if (id.includes("_q_") || id.startsWith("feed_") || id.startsWith("p_")) return false;
    if (/^[a-z]\d+$/.test(id)) return false;
    return true;
  };

  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    if (post && post.id && isApiPostId(post.id)) {
      try {
        setRepliesLoading(true);
        const res = await apiService.post(
          "method/stridenex_app.api_stridenex_app.raven.get_replies",
          { message_id: post.id }
        );
        const list = res?.message?.replies || res?.data?.message?.replies || (Array.isArray(res?.message) ? res.message : (Array.isArray(res?.data) ? res.data : []));
        if (Array.isArray(list)) {
          const apiReplies = list.map((r: any) => ({
            author: r.owner ? r.owner.split("@")[0].split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Anonymous",
            content: stripHtml(r.text || ""),
            time: r.creation ? formatCreationTime(r.creation) : "Just now",
            image: r.image || undefined
          }));
          setSelectedPost(prev => prev && prev.id === post.id ? {
            ...prev,
            replies: apiReplies,
            comments: apiReplies.length
          } : prev);
        }
      } catch (err) {
        console.error("Error fetching replies:", err);
      } finally {
        setRepliesLoading(false);
      }
    }
  };

  const mapApiMessageToPost = (msg: any): Post => {
    const textContent = stripHtml(msg.text || "");
    const title = textContent.split("\n")[0] || "Untitled Question";
    const displayTitle = title.length > 80 ? title.substring(0, 80) + "..." : title;
    
    return {
      id: msg.name,
      title: displayTitle,
      author: msg.owner ? msg.owner.split("@")[0].split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Anonymous",
      timeAgo: msg.creation ? formatCreationTime(msg.creation) : "Recent",
      likes: msg.likes || Math.floor(Math.random() * 15) + 2,
      comments: 0,
      content: textContent,
      category: msg.channel_category || selectedCategory || "Category",
      replies: [],
      tags: ["api-integrated", msg.message_type || "Question"],
      contributors: [msg.owner ? msg.owner.substring(0, 2).toUpperCase() : "U"]
    };
  };

  const processApiMessages = (allMsgs: any[]): Post[] => {
    const questions = allMsgs.filter(m => !m.is_reply && !m.linked_message);
    const replies = allMsgs.filter(m => m.is_reply || m.linked_message);
    
    return questions.map(q => {
      const qPost = mapApiMessageToPost(q);
      const qReplies = replies
        .filter(r => r.linked_message === q.name)
        .map(r => ({
          author: r.owner ? r.owner.split("@")[0].split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Anonymous",
          content: stripHtml(r.text || ""),
          time: r.creation ? formatCreationTime(r.creation) : "Just now",
          image: r.image || undefined
        }));
        
      qPost.replies = qReplies;
      qPost.comments = qReplies.length;
      qPost.contributors = Array.from(new Set([
        qPost.author,
        ...qReplies.map(r => r.author)
      ])).slice(0, 4);
      
      return qPost;
    });
  };

  const fetchCategoryQuestions = async (catName: string) => {
    try {
      setApiLoading(true);
      const res = await apiService.post(
        "method/stridenex_app.api_stridenex_app.raven.list_messages",
        {
          channel_id: community.id,
          channel_category: catName
        },
        {
          params: {
            channel_id: community.id,
            channel_category: catName
          }
        }
      );
      
      const list = res?.message || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const posts = processApiMessages(list);
        setCategoryQuestions(prev => ({
          ...prev,
          [catName]: posts
        }));
      } else {
        // Fallback: generate mock questions
        const generated = generateQuestionsForCategory(catName, 120);
        setCategoryQuestions(prev => ({
          ...prev,
          [catName]: generated
        }));
      }
    } catch (err) {
      console.error("Error fetching category questions:", err);
      const generated = generateQuestionsForCategory(catName, 120);
      setCategoryQuestions(prev => ({
        ...prev,
        [catName]: generated
      }));
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryQuestions(selectedCategory);
      setVisibleCount(15);
      setIsLoadingMore(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await apiService.get(
          "method/stridenex_app.api_stridenex_app.raven.get_category_list",
          { params: { parent_category: community.id } }
        );
        const list = res?.message || res?.data || [];
        setCategoriesList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error loading categories list:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    if (community?.id) {
      fetchCategories();
    }
  }, [community?.id]);

  const handleLeaveCommunity = async () => {
    try {
      const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
      const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;

      const response = await fetch(
        "https://devstridenex.quantcloud.in/api/method/stridenex_app.api_stridenex_app.raven.leave_channel",
        {
          method: "POST",
          headers: {
            Authorization: `token ${apiKey}:${apiSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel_id: community.id,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to leave space");
      }

      onBack();
    } catch (err: any) {
      console.error("Error leaving community:", err);
    }
  };

  // Flattened posts for "Latest" & "Top" tabs
  const allPosts = Object.values(categoriesData).flatMap(cat => 
    cat.posts.map(post => ({ ...post, category: cat.name, color: cat.color }))
  );

  const latestPosts = [...allPosts].sort((a, b) => b.id.localeCompare(a.id));
  const topPosts = [...allPosts].sort((a, b) => b.likes - a.likes);

  // Filter posts by search query
  const searchFilter = (p: typeof allPosts[0]) => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.content.toLowerCase().includes(searchQuery.toLowerCase());

  const handleAddReply = async () => {
    if ((!newReplyText.trim() && !selectedReplyImage) || !selectedPost) return;
    
    const postId = selectedPost.id;
    const clientImage = selectedReplyImage;
    
    let apiReply = {
      author: "You (Student)",
      content: newReplyText,
      time: "Just now",
      image: clientImage || undefined
    };

    try {
      const formData = new FormData();
      formData.append("channel_id", community.id);
      formData.append("reply_to_message", selectedPost.content || selectedPost.title || selectedPost.id);
      formData.append("channel_category", selectedCategory || selectedPost.category || "Community");
      formData.append("text", newReplyText);
      if (replyImageFile) {
        formData.append("file", replyImageFile);
      }

      const res = await apiService.post(
        "method/stridenex_app.api_stridenex_app.raven.send_message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const msg = res?.message || res?.data?.message || res?.data;
      if (msg) {
        apiReply = {
          author: msg.owner ? msg.owner.split("@")[0].split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "You (Student)",
          content: stripHtml(msg.text || ""),
          time: msg.creation ? formatCreationTime(msg.creation) : "Just now",
          image: msg.image ? (msg.image.startsWith("http") || msg.image.startsWith("data:") ? msg.image : `${BASE_DOMAIN}${msg.image.startsWith("/") ? "" : "/"}${msg.image}`) : clientImage || undefined
        };
      }
    } catch (err) {
      console.error("Error sending reply to server:", err);
    }
    
    // Find category
    const categoryName = Object.keys(categoriesData).find(catName => 
      categoriesData[catName].posts.some(p => p.id === postId)
    ) || selectedPost.category || "Community";

    // Update categoriesData
    if (categoriesData[categoryName]) {
      const updatedPosts = categoriesData[categoryName].posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments + 1,
            replies: [...p.replies, apiReply]
          };
        }
        return p;
      });

      setCategoriesData(prev => ({
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          posts: updatedPosts
        }
      }));
    }

    // Update categoryQuestions state
    setCategoryQuestions(prev => {
      const existing = prev[categoryName] || [];
      const updated = existing.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments + 1,
            replies: [...p.replies, apiReply]
          };
        }
        return p;
      });
      return {
        ...prev,
        [categoryName]: updated
      };
    });

    // Update selectedPost view
    setSelectedPost(prev => prev ? {
      ...prev,
      comments: prev.comments + 1,
      replies: [...prev.replies, apiReply]
    } : null);

    setNewReplyText("");
    setSelectedReplyImage(null);
    setReplyImageFile(null);
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPostObj: Post = {
      id: `p_${Date.now()}`,
      title: newPostTitle,
      author: "You (Student)",
      timeAgo: "Just now",
      likes: 1,
      comments: 0,
      content: newPostContent,
      replies: [],
      category: newPostCategory,
      tags: [newPostCategory.toLowerCase().replace(" ", "-"), "new"],
      contributors: ["You (Student)"]
    };

    if (categoriesData[newPostCategory]) {
      setCategoriesData(prev => ({
        ...prev,
        [newPostCategory]: {
          ...prev[newPostCategory],
          posts: [newPostObj, ...prev[newPostCategory].posts]
        }
      }));
    }

    setCategoryQuestions(prev => {
      const existing = prev[newPostCategory] || [];
      return {
        ...prev,
        [newPostCategory]: [newPostObj, ...existing]
      };
    });

    setNewPostTitle("");
    setNewPostContent("");
    setShowCreatePost(false);
  };

  // Filter questions for the selected category
  const activeQuestions = selectedCategory ? getQuestionsForCategory(selectedCategory) : [];
  const filteredQuestions = activeQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || 
                       (q.tags && q.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())) ||
                       q.content.toLowerCase().includes(selectedTag.toLowerCase()) ||
                       q.title.toLowerCase().includes(selectedTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  const mockFeedPosts = [
    {
      id: "feed_1",
      title: "Contributions Review Spring Cleaning Hackathon",
      author: "Alex Rivera",
      timeAgo: "2d ago",
      likes: 12,
      comments: 2,
      content: "Hey everyone! Let's get together for our monthly hackathon. We'll be reviewing code and cleaning up our open issues.",
      category: "Community",
      replies: [
        { author: "Sarah Jenkins", content: "Count me in! I'll focus on frontend issues.", time: "1d ago" },
        { author: "Vikram Shah", content: "I can help review PRs for the core library.", time: "12h ago" }
      ]
    },
    {
      id: "feed_2",
      title: "Trouble setting up Tutor on Ubuntu 22.04",
      author: "System Admin",
      timeAgo: "3d ago",
      likes: 45,
      comments: 0,
      content: "I keep getting connection timeouts when running tutor local quickstart. Here is my configuration file.",
      category: "Site Operators",
      replies: []
    },
    {
      id: "feed_3",
      title: "Open edX for IT infrastructure and DevOps training",
      author: "Dr. Rachel",
      timeAgo: "1w ago",
      likes: 19,
      comments: 1,
      content: "How are you structured labs for hands-on shell practice inside the LMS? Suggestions appreciated.",
      category: "Educators",
      replies: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0F10] text-[#E2E8F0] font-sans antialiased overflow-x-hidden flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-[#1F2023] bg-[#121315] py-4 px-6 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => {
              if (selectedPost) {
                setSelectedPost(null);
              } else if (selectedCategory) {
                setSelectedCategory(null);
                setSelectedTag(null);
              } else {
                onBack();
              }
            }} 
            variant="ghost" 
            className="text-slate-400 hover:text-white hover:bg-[#1E2024] gap-2 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-slate-800 hidden md:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <h2 className="font-bold text-white tracking-tight text-sm md:text-base">{community.name} Space</h2>
              <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] uppercase font-bold py-0.5">
                {community.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleLeaveCommunity}
            variant="outline"
            className="border-red-500/35 hover:border-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-500 font-bold text-xs md:text-sm py-2 px-4 transition-all active:scale-[0.98]"
          >
            Leave Space
          </Button>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="bg-accent hover:bg-accent/90 text-white font-bold gap-2 text-xs md:text-sm py-2 px-4 shadow-lg hover:shadow-accent/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Create Topic
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Left Sidebar - Navigation */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6">
          {/* Topics navigation */}
          <div className="bg-[#121315] rounded-xl border border-[#1F2023] p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Navigation</h3>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => { setActiveTab("categories"); setSelectedPost(null); setSelectedCategory(null); }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-all ${
                  activeTab === "categories" && !selectedCategory ? "bg-[#1E2024] text-white" : "text-slate-400 hover:text-white hover:bg-[#121315]/50"
                }`}
              >
                <Folder className="w-4 h-4 text-primary" />
                <span>Categories</span>
              </button>
              <button 
                onClick={() => { setActiveTab("discussions"); setSelectedPost(null); setSelectedCategory(null); }}
                className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg text-sm font-medium transition-all ${
                  activeTab === "discussions" ? "bg-[#1E2024] text-white" : "text-slate-400 hover:text-white hover:bg-[#121315]/50"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span>Discussions Feed</span>
              </button>
            </div>
          </div>

          {/* Categories indicator list (Accordion) */}
          <div className="bg-[#121315] rounded-xl border border-[#1F2023] p-4">
            <button 
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</h3>
              <span className="text-xs text-slate-500">{isCategoriesExpanded ? "▼" : "▶"}</span>
            </button>
            
            {isCategoriesExpanded && (
              <div className="flex flex-col gap-2 mt-3 pl-1">
                {categoriesLoading ? (
                  <span className="text-xs text-slate-500">Loading categories...</span>
                ) : (categoriesList.length > 0 ? categoriesList : Object.keys(categoriesData).map(k => ({ name: k }))).map((cat: any, idx) => {
                  const catName = cat.category_name || cat.name;
                  const mockCat = categoriesData[catName];
                  const colorClass = mockCat ? mockCat.color : "bg-primary";
                  return (
                    <div key={catName || idx} className="flex items-center gap-3 py-1">
                      <div className={`w-2.5 h-2.5 rounded-sm ${colorClass} flex-shrink-0`} />
                      <span 
                        onClick={() => {
                          setSelectedCategory(catName);
                          setSelectedPost(null);
                          setVisibleCount(15);
                          setIsLoadingMore(false);
                          setActiveTab("categories");
                        }}
                        className={`text-sm font-medium transition-colors cursor-pointer ${
                          selectedCategory === catName ? "text-accent font-semibold" : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {catName}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tags list (Accordion) */}
          <div className="bg-[#121315] rounded-xl border border-[#1F2023] p-4">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCreateTagModal(true);
                  }}
                  className="p-1 hover:bg-[#1E2024] rounded text-slate-400 hover:text-white transition-colors"
                  title="Create Tag"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  {isTagsExpanded ? "▼" : "▶"}
                </button>
              </div>
            </div>
            
            {isTagsExpanded && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tagsLoading ? (
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-accent" />
                    Loading...
                  </span>
                ) : tagsList.length === 0 ? (
                  <span className="text-xs text-slate-500">No tags found.</span>
                ) : (
                  tagsList.map((tag) => {
                    const tagVal = tag.title || tag.name;
                    const isSelected = selectedTag === tagVal;
                    return (
                      <button
                        key={tag.name}
                        onClick={() => setSelectedTag(isSelected ? null : tagVal)}
                        className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                          isSelected 
                            ? "bg-[#FF6B00] text-white" 
                            : "bg-[#1E2024] hover:bg-[#25282E] text-slate-400 hover:text-white"
                        }`}
                      >
                        #{tagVal}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Center / Right Content Panel */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!selectedPost ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {selectedCategory ? (
                  // Category Detail View
                  <div className="space-y-6">
                    {/* Category Detail Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121315] p-5 rounded-2xl border border-[#1F2023]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span 
                            onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                            className="hover:text-white cursor-pointer transition-colors"
                          >
                            Categories
                          </span>
                          <span>&gt;</span>
                          <span className="text-white font-semibold">{selectedCategory}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-sm ${categoriesData[selectedCategory]?.color || "bg-primary"} flex-shrink-0`} />
                          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                            {selectedCategory}
                          </h2>
                        </div>
                        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                          {categoriesData[selectedCategory]?.description || `Topics and discussions in the ${selectedCategory} category.`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end md:self-center">
                        <Button 
                          onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                          variant="ghost"
                          className="text-slate-400 hover:text-white hover:bg-[#1E2024] gap-2 active:scale-95 transition-all text-xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          All Categories
                        </Button>
                      </div>
                    </div>

                    {/* Filters & Subtags */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2023] pb-4">
                      {/* Subtags */}
                      <div className="flex flex-wrap gap-2">
                        <span 
                          onClick={() => setSelectedTag(null)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                            !selectedTag 
                              ? "bg-accent text-white" 
                              : "bg-[#1E2024] text-slate-400 hover:text-white hover:bg-[#25282E]"
                          }`}
                        >
                          All Tags
                        </span>
                        {(tagsList.length > 0 ? tagsList.map(t => t.title || t.name) : (categoriesData[selectedCategory]?.subtags || ["frappe", "erpnext", "erp", "learning", "discussion"])).map(tag => (
                          <span 
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                              selectedTag === tag 
                                ? "bg-accent text-white" 
                                : "bg-[#1E2024] text-slate-400 hover:text-white hover:bg-[#25282E]"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Right Search box for Category */}
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder={`Search in ${selectedCategory}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#121315] border border-[#1F2023] rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Topics Table List */}
                    <div className="bg-[#121315] border border-[#1F2023] rounded-2xl overflow-hidden shadow-xl">
                      {/* Table Header */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#1A1C1F] border-b border-[#1F2023] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-8">Topic</div>
                        <div className="col-span-2 text-center">Replies / Views</div>
                        <div className="col-span-2 text-right">Activity</div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-[#1F2023]">
                        {apiLoading ? (
                          <div className="p-12 flex flex-col justify-center items-center gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            <span className="text-sm font-semibold">Fetching queries for {selectedCategory}...</span>
                          </div>
                        ) : filteredQuestions.length === 0 ? (
                          <div className="p-12 text-center text-slate-500 font-medium">
                            No questions found matching your selection.
                          </div>
                        ) : (
                          filteredQuestions.slice(0, visibleCount).map((post) => (
                            <div 
                              key={post.id}
                              onClick={() => handleSelectPost(post)}
                              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#1A1C1F]/40 cursor-pointer transition-colors group animate-fadeIn"
                            >
                              {/* Topic Details */}
                              <div className="col-span-12 md:col-span-8 space-y-1.5 min-w-0">
                                <div className="flex items-start gap-2.5">
                                  <span className="text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform">📄</span>
                                  <h4 className="font-bold text-slate-200 text-sm md:text-base leading-snug group-hover:text-white transition-colors truncate">
                                    {post.title}
                                  </h4>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pl-6">
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    by {post.author}
                                  </span>
                                  <span className="text-slate-700 text-xs">•</span>
                                  {post.tags?.map((t, idx) => (
                                    <span key={idx} className="text-[9px] font-bold text-slate-400 bg-[#1E2024] px-2 py-0.5 rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Replies & Views */}
                              <div className="col-span-6 md:col-span-2 flex flex-col md:items-center justify-center pl-6 md:pl-0">
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-accent/80" />
                                    {post.comments}
                                  </span>
                                  <span className="text-slate-500">|</span>
                                  <span className="text-slate-500">
                                    {post.likes * 7 + 12} views
                                  </span>
                                </div>
                                <span className="md:hidden text-[10px] text-slate-500 font-medium mt-1">
                                  Activity: {post.timeAgo} ago
                                </span>
                              </div>

                              {/* Activity & Contributors */}
                              <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-3">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {post.contributors?.map((contrib, idx) => (
                                    <div 
                                      key={idx}
                                      title={contrib}
                                      className="inline-block h-5 w-5 rounded-full ring-2 ring-[#121315] bg-[#1E2024] flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase shrink-0"
                                    >
                                      {contrib.substring(0, 2)}
                                    </div>
                                  ))}
                                </div>
                                <span className="hidden md:inline text-xs text-slate-400 font-semibold">
                                  {post.timeAgo}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Loading/Infinite Scroll Status */}
                    {isLoadingMore && (
                      <div className="flex justify-center items-center py-6 gap-2 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        <span className="text-xs font-semibold">Loading more questions...</span>
                      </div>
                    )}

                    {!isLoadingMore && visibleCount >= filteredQuestions.length && filteredQuestions.length > 0 && (
                      <div className="text-center py-6 text-slate-500 text-xs font-medium">
                        You've reached the end of the topic list.
                      </div>
                    )}
                  </div>
                ) : (
                  // Welcome hero + activeTab selector (original view)
                  <>
                    {/* Hero Greeting Panel */}
                    <div className="bg-gradient-to-r from-[#121315] to-[#1A1C1F] border border-[#1F2023] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                          Welcome to {community.name} discussions!
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                          A central space to collaborate, find support, ask technical questions, and share resources with fellow students.
                        </p>
                      </div>
                      {/* Search inside discussions */}
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search discussions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Navigation Tabs (Mobile) / Table Headers */}
                    <div className="flex items-center justify-between border-b border-[#1F2023] pb-2 gap-4">
                      <div className="flex items-center gap-1">
                        {(["categories", "discussions"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all ${
                              activeTab === tab 
                                ? "border-accent text-accent" 
                                : "border-transparent text-slate-400 hover:text-white"
                            }`}
                          >
                            {tab === "discussions" ? "Discussions Feed" : "Categories"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab content rendering */}
                    {activeTab === "categories" && !searchQuery ? (
                      // Categories display matching the screenshot layout
                      <div className="space-y-4">
                        {Object.values(categoriesData).map((cat) => (
                          <div 
                            key={cat.name} 
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setVisibleCount(15);
                              setIsLoadingMore(false);
                              setSelectedTag(null);
                            }}
                            className="bg-[#121315] rounded-xl border border-[#1F2023] overflow-hidden flex flex-col md:flex-row hover:border-[#2C2E35] transition-all cursor-pointer group"
                          >
                            {/* Left column: category name and subtags */}
                            <div className="p-5 flex-1 border-b md:border-b-0 md:border-r border-[#1F2023]">
                              <div className="flex items-center gap-3">
                                <div className={`w-3.5 h-3.5 rounded-sm ${cat.color} flex-shrink-0`} />
                                <h3 className="font-extrabold text-white text-lg hover:text-accent transition-colors cursor-pointer">
                                  {cat.name}
                                </h3>
                              </div>
                              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                {cat.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                {cat.subtags.map(sub => (
                                  <span 
                                    key={sub} 
                                    onClick={() => {
                                      setSelectedCategory(cat.name);
                                      setSelectedTag(sub);
                                      setVisibleCount(15);
                                      setIsLoadingMore(false);
                                    }}
                                    className="text-[10px] font-bold text-slate-500 bg-[#1E2024] hover:bg-[#25282E] hover:text-white px-2 py-0.5 rounded transition-colors"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Middle column: stats */}
                            <div className="p-5 w-full md:w-32 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#1F2023] shrink-0">
                              <span className="text-lg font-bold text-white">{cat.topicsPerMonth}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Topics</span>
                            </div>

                            {/* Right column: latest post items */}
                            <div className="p-5 w-full md:w-96 flex flex-col gap-3 justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                              {cat.posts.slice(0, 4).map((post) => (
                                <div 
                                  key={post.id}
                                  onClick={() => handleSelectPost(post)}
                                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#1E2024]/40 p-1.5 rounded-md transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <span className="text-[#0091FF] shrink-0">📄</span>
                                    <span className="text-slate-300 truncate font-semibold hover:text-white">
                                      {post.title}
                                    </span>
                                  </div>
                                  <span className="text-slate-500 shrink-0 font-medium">{post.timeAgo}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Discussions Feed (Mock)
                      <div className="space-y-4">
                        {mockFeedPosts.filter(post => 
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((post) => (
                          <div 
                            key={post.id}
                            onClick={() => handleSelectPost(post)}
                            className="bg-[#121315] border border-[#1F2023] rounded-xl p-5 hover:border-[#2C2E35] transition-all cursor-pointer group shadow-md"
                          >
                            <div className="flex items-center gap-3 justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs">
                                  {post.author.substring(0, 2).toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">{post.author}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-[10px] text-slate-500">{post.timeAgo}</span>
                              </div>
                              <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] uppercase font-bold py-0.5">
                                {post.category}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-white text-sm md:text-base mt-2 group-hover:text-accent transition-colors leading-snug">
                              {post.title}
                            </h4>
                            <p className="text-slate-400 text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-4 border-t border-[#1F2023]/60 pt-3" onClick={(e) => e.stopPropagation()}>
                              <span className="flex items-center gap-1.5 hover:text-white transition-colors" onClick={() => {
                                post.likes = post.likes + 1;
                              }}>
                                <Heart className="w-3.5 h-3.5 text-red-500/80" />
                                {post.likes} Likes
                              </span>
                              <span className="flex items-center gap-1.5 hover:text-white transition-colors" onClick={() => handleSelectPost(post)}>
                                <MessageSquare className="w-3.5 h-3.5" />
                                {post.comments} Comments
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              // Thread Detail View
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6"
              >
                {/* Back to feed button */}
                <Button 
                  onClick={() => setSelectedPost(null)}
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-[#1E2024] gap-2 active:scale-95 transition-all text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </Button>

                {/* Primary Post Card */}
                <div className="bg-[#121315] rounded-2xl border border-[#1F2023] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1E2024] w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-400 uppercase">
                        {selectedPost.author.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{selectedPost.author}</h4>
                        <span className="text-[10px] text-slate-500 font-medium">{selectedPost.timeAgo}</span>
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/20">
                      {selectedPost.category || community.name}
                    </Badge>
                  </div>

                  <h1 className="text-xl md:text-2xl font-extrabold text-white leading-snug pt-2">
                    {selectedPost.title}
                  </h1>

                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pt-2">
                    {selectedPost.content}
                  </p>

                  {selectedPost.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-[#1F2023] max-w-xl">
                      <img src={selectedPost.image} alt="Topic attachment" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-[#1F2023] pt-4 mt-4">
                    <button 
                      onClick={() => {
                        setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-accent transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      <span>{selectedPost.likes} Likes</span>
                    </button>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {selectedPost.comments} Replies
                    </span>
                  </div>
                </div>

                {/* Comments/Replies list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
                    Replies
                  </h3>

                  {repliesLoading ? (
                    <div className="p-8 flex flex-col justify-center items-center gap-3 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-accent" />
                      <span className="text-xs font-semibold">Loading replies...</span>
                    </div>
                  ) : selectedPost.replies.length === 0 ? (
                    <div className="bg-[#121315]/50 border border-dashed border-[#1F2023] rounded-2xl p-8 text-center text-slate-500 text-sm">
                      No replies yet. Be the first to start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedPost.replies.map((reply, idx) => (
                        <div key={idx} className="bg-[#121315] rounded-2xl border border-[#1F2023] p-5 flex gap-4 shadow-md animate-fadeIn">
                          <div className="bg-[#1E2024] w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-500 uppercase text-xs shrink-0">
                            {reply.author.substring(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-xs">{reply.author}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{reply.time}</span>
                            </div>
                            <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
                              {reply.content}
                            </p>
                            {reply.image && (
                              <div className="mt-3 rounded-lg overflow-hidden max-w-lg border border-[#1F2023] bg-[#0E0F10]">
                                <img src={reply.image} alt="Reply attachment" className="w-full h-auto object-cover max-h-[300px]" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Reply Input Panel */}
                <div className="bg-[#121315] rounded-2xl border border-[#1F2023] p-5 flex flex-col gap-4 shadow-xl">
                  <div className="flex gap-3 items-start">
                    <div className="bg-[#1E2024] w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-500 uppercase text-xs shrink-0 mt-1">
                      YO
                    </div>
                    <div className="flex-1 space-y-3">
                      <textarea
                        rows={3}
                        placeholder="Write a helpful reply, solution, or comment..."
                        value={newReplyText}
                        onChange={(e) => setNewReplyText(e.target.value)}
                        className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-all resize-none"
                      />
                      
                      {selectedReplyImage && (
                        <div className="relative inline-block rounded-lg overflow-hidden border border-[#28292E] bg-[#0E0F10] p-1">
                          <img src={selectedReplyImage} alt="Attachment preview" className="max-h-[120px] rounded object-cover" />
                          <button 
                            onClick={() => setSelectedReplyImage(null)}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-transform active:scale-90"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[#1F2023]/60 pt-3">
                    <div className="flex items-center">
                      <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[#1E2024] transition-all">
                        <ImageIcon className="w-4 h-4 text-accent" />
                        <span>Add Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    
                    <Button 
                      onClick={handleAddReply}
                      disabled={!newReplyText.trim() && !selectedReplyImage}
                      className="bg-accent hover:bg-accent/90 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2 active:scale-95 transition-all text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Reply
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Create Topic Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121315] border border-[#28292E] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-[#1F2023]">
              <h2 className="font-extrabold text-white text-lg">Create New Discussion Topic</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Topic Title</label>
                <input 
                  type="text" 
                  placeholder="What is your discussion about?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    {Object.keys(categoriesData).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description / Content</label>
                <textarea 
                  rows={4}
                  placeholder="Share details of your discussion, question, or links..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
            </div>
            <div className="p-6 bg-[#0E0F10]/50 border-t border-[#1F2023] flex items-center justify-end gap-3">
              <Button 
                onClick={() => setShowCreatePost(false)}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-[#1E2024]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePost}
                className="bg-accent hover:bg-accent/90 text-white font-bold"
              >
                Publish Topic
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateTagModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121315] border border-[#28292E] rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-[#1F2023]">
              <h2 className="font-extrabold text-white text-base">Create New Tag</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tag Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. general, help, react"
                  value={newTagTitle}
                  onChange={(e) => setNewTagTitle(e.target.value)}
                  className="w-full bg-[#0E0F10] border border-[#28292E] rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <div className="p-6 bg-[#0E0F10]/50 border-t border-[#1F2023] flex items-center justify-end gap-3">
              <Button 
                onClick={() => {
                  setShowCreateTagModal(false);
                  setNewTagTitle("");
                }}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-[#1E2024] text-xs"
                disabled={isCreatingTag}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTag}
                className="bg-accent hover:bg-accent/90 text-white font-bold text-xs"
                disabled={isCreatingTag}
              >
                {isCreatingTag ? "Creating..." : "Create Tag"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
