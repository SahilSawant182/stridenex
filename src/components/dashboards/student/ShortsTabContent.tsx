// components/dashboards/student/ShortsTabContent.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { getShortsFeed, saveShort, unsaveShort, getSavedShorts, toggleLikeShort } from "@/services/student.services";
import { BASE_DOMAIN } from "@/services/api.services";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ReactPlayer from "react-player";
import { 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronRight as ChevronRightIcon,
  Heart
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types
interface ShortVideo {
  id: any;
  title: string;
  category: string;
  duration: string;
  views: string;
  author: string;
  authorAvatar: string;
  authorHandle: string;
  tags: string[];
  description?: string;
  isSaved: boolean;
  videoUrl: string;
  thumbnail?: string;
  color: string;
}

interface SavedShort {
  id: number;
  title: string;
  category: string;
  savedDate: string;
  icon: string;
  color: string;
}

interface RecommendedShort {
  id: number;
  title: string;
  duration: string;
  match: string;
  views: string;
  category: string;
}

// Sample video URLs
const videoUrls = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
];

// Trending shorts data
const trendingShorts: ShortVideo[] = [
  {
    id: 1,
    title: "System Design in 30s",
    category: "Architecture",
    duration: "30 sec",
    views: "128K",
    author: "techbro",
    authorHandle: "@techbro",
    authorAvatar: "TB",
    tags: ["System Design", "Architecture"],
    isSaved: false,
    videoUrl: videoUrls[0],
    color: "blue"
  },
  {
    id: 2,
    title: "Async/Await explained",
    category: "JavaScript",
    duration: "30 sec",
    views: "89K",
    author: "jsmaster",
    authorHandle: "@jsmaster",
    authorAvatar: "JM",
    tags: ["JavaScript", "Promises"],
    isSaved: true,
    videoUrl: videoUrls[1],
    color: "yellow"
  },
  {
    id: 3,
    title: "SQL Joins visualized",
    category: "SQL",
    duration: "30 sec",
    views: "210K",
    author: "databaseguru",
    authorHandle: "@databaseguru",
    authorAvatar: "DG",
    tags: ["SQL", "Database"],
    isSaved: false,
    videoUrl: videoUrls[2],
    color: "blue"
  },
  {
    id: 4,
    title: "Python List Comprehension",
    category: "Python",
    duration: "30 sec",
    views: "156K",
    author: "pythonista",
    authorHandle: "@pythonista",
    authorAvatar: "PY",
    tags: ["Python", "Coding"],
    isSaved: true,
    videoUrl: videoUrls[3],
    color: "blue"
  },
  {
    id: 5,
    title: "ML Bias in 28 seconds",
    category: "Machine Learning",
    duration: "28 sec",
    views: "74K",
    author: "mlengineer",
    authorHandle: "@mlengineer",
    authorAvatar: "ML",
    tags: ["ML", "Bias"],
    isSaved: false,
    videoUrl: videoUrls[4],
    color: "purple"
  },
  {
    id: 6,
    title: "Bias-Variance Tradeoff",
    category: "Machine Learning",
    duration: "28s",
    views: "67K",
    author: "mlguru",
    authorHandle: "@mlguru",
    authorAvatar: "MG",
    tags: ["ML", "Model Evaluation"],
    isSaved: false,
    videoUrl: videoUrls[5],
    color: "purple"
  }
];

// Saved shorts data
const savedShorts: SavedShort[] = [
  {
    id: 1,
    title: "Python List Comprehension",
    category: "Python",
    savedDate: "Saved 2d ago",
    icon: "🐍",
    color: "blue"
  },
  {
    id: 2,
    title: "SQL Joins visualized",
    category: "SQL",
    savedDate: "Saved 4d ago",
    icon: "🗄️",
    color: "blue"
  },
  {
    id: 3,
    title: "Async/Await explained",
    category: "JavaScript",
    savedDate: "Saved 1w ago",
    icon: "🟨",
    color: "yellow"
  }
];

// Recommended shorts data - enhanced for table view
const recommendedShorts: RecommendedShort[] = [
  {
    id: 1,
    title: "Bias-Variance Tradeoff",
    duration: "28s",
    match: "97%",
    views: "45K",
    category: "Machine Learning"
  },
  {
    id: 2,
    title: "Feature Scaling methods",
    duration: "30s",
    match: "94%",
    views: "38K",
    category: "Machine Learning"
  },
  {
    id: 3,
    title: "Confusion Matrix explained",
    duration: "25s",
    match: "91%",
    views: "52K",
    category: "Machine Learning"
  },
  {
    id: 4,
    title: "Gradient Descent visualized",
    duration: "32s",
    match: "89%",
    views: "41K",
    category: "Deep Learning"
  },
  {
    id: 5,
    title: "Cross Validation basics",
    duration: "27s",
    match: "86%",
    views: "29K",
    category: "Model Evaluation"
  }
];

// Video Player Component
function VideoPlayer({ video, isActive }: { video: ShortVideo; isActive: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [played, setPlayed] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [loadingVideo, setLoadingVideo] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!video.videoUrl) return;

    let active = true;
    let objectUrl = "";

    const loadVideo = async () => {
      try {
        setLoadingVideo(true);
        const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
        const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;
        
        const headers: Record<string, string> = {};
        if (apiKey && apiSecret) {
          headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
        }
        
        const response = await fetch(video.videoUrl, { headers });
        if (!response.ok) {
          console.warn(`Secure video fetch returned status ${response.status}, falling back to direct URL.`);
          if (active) {
            setVideoSrc(video.videoUrl);
          }
          return;
        }
        
        const blob = await response.blob();
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setVideoSrc(objectUrl);
        }
      } catch (err) {
        console.warn("Error fetching video blob, falling back to direct url:", err);
        if (active) {
          setVideoSrc(video.videoUrl);
        }
      } finally {
        if (active) {
          setLoadingVideo(false);
        }
      }
    };

    loadVideo();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [video.videoUrl]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state: any) => {
    setPlayed(state.played);
  };

  return (
    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden group flex items-center justify-center">
      {loadingVideo && !videoSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {videoSrc ? (
        <ReactPlayer
          ref={playerRef}
          url={videoSrc}
          width="100%"
          height="100%"
          playing={playing && isActive}
          muted={muted}
          loop={true}
          playsinline={true}
          onProgress={handleProgress}
          style={{ objectFit: 'cover' }}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              }
            }
          }}
        />
      ) : null}
      
      {/* Video Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all"
        >
          {playing ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-all"
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-orange-500 transition-all"
            style={{ width: `${played * 100}%` }}
          />
        </div>
      </div>

      <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        {video.duration}
      </Badge>
    </div>
  );
}

// Horizontal Scroll Component
function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-5"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </button>
      
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-5"
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </button>
    </div>
  );
}

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

export default function ShortsTabContent() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [activeVideoId, setActiveVideoId] = useState<any>(null);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [shortsList, setShortsList] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"all" | "saved">("all");

  const fetchSaved = async () => {
    if (!currentUser) return;
    try {
      setLoadingSaved(true);
      const res = await getSavedShorts(currentUser);
      console.log("Saved shorts response:", res);
      let rawSaved = [];
      if (res && Array.isArray(res.message)) {
        rawSaved = res.message;
      } else if (res && Array.isArray(res.data)) {
        rawSaved = res.data;
      }
      
      // Match the correct property "short" from the Frappe response
      const savedIds = rawSaved.map((item: any) => String(item.short));
      setSavedItems(savedIds);
    } catch (err) {
      console.error("Error loading saved shorts:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        const res = await getShortsFeed(currentUser || undefined);
        console.log("Shorts API response:", res);
        
        let rawShorts = [];
        if (res && Array.isArray(res.message)) {
          rawShorts = res.message;
        } else if (res && Array.isArray(res.data)) {
          rawShorts = res.data;
        } else if (res && res.message && Array.isArray(res.message.data)) {
          rawShorts = res.message.data;
        }

        const savedIdsFromFeed: string[] = [];
        const likedIdsFromFeed: string[] = [];
        const mapped = rawShorts.map((item: any): ShortVideo => {
          const videoUrl = item.video ? (item.video.startsWith('http') ? item.video : `${BASE_DOMAIN}${item.video}`) : '';
          const thumbnail = item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${BASE_DOMAIN}${item.thumbnail}`) : undefined;
          
          const skill = item.skill || "Skill";
          const authorAvatar = skill.substring(0, 2).toUpperCase();

          if (item.is_saved) {
            savedIdsFromFeed.push(String(item.name));
          }
          if (item.is_liked) {
            likedIdsFromFeed.push(String(item.name));
          }

          let tagsArray: string[] = [];
          if (Array.isArray(item.tags)) {
            tagsArray = item.tags;
          } else if (typeof item.tags === "string" && item.tags.trim() !== "") {
            tagsArray = item.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
          }
          tagsArray = tagsArray.map((t: string) => t.startsWith('#') ? t : `#${t}`);

          return {
            id: item.name,
            title: item.title || "Untitled Short",
            category: skill,
            duration: item.duration_display || `${item.duration_seconds || 30} sec`,
            views: item.views_display || `${item.view_count || 0}`,
            author: "StrideNex",
            authorHandle: "@stridenex",
            authorAvatar: authorAvatar,
            tags: tagsArray,
            description: item.description || "",
            isSaved: Boolean(item.is_saved),
            videoUrl: videoUrl,
            thumbnail: thumbnail,
            color: "orange"
          };
        });
        setShortsList(mapped);
        if (savedIdsFromFeed.length > 0) {
          setSavedItems(prev => {
            const combined = new Set([...prev, ...savedIdsFromFeed]);
            return Array.from(combined);
          });
        }
        if (likedIdsFromFeed.length > 0) {
          setLikedItems(prev => {
            const combined = new Set([...prev, ...likedIdsFromFeed]);
            return Array.from(combined);
          });
        }
      } catch (err) {
        console.error("Error fetching shorts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
    fetchSaved(); // Sync checks on mount
  }, [currentUser]);

  const toggleSave = async (id: any) => {
    if (!currentUser) {
      showToast("Authentication required to save shorts.", "warning");
      return;
    }

    const isAlreadySaved = savedItems.includes(String(id));

    try {
      // Opt-in UI update
      setSavedItems(prev =>
        prev.includes(String(id)) ? prev.filter(item => item !== String(id)) : [...prev, String(id)]
      );

      // Call API
      if (isAlreadySaved) {
        const res = await unsaveShort({
          user: currentUser,
          short_name: String(id)
        });
        console.log("Unsave short API response:", res);
      } else {
        const res = await saveShort({
          user: currentUser,
          short_name: String(id)
        });
        console.log("Save short API response:", res);
      }

      // Refresh list to keep in sync
      fetchSaved();
      
      if (!isAlreadySaved) {
        showToast("Short saved successfully!", "success");
      } else {
        showToast("Short unsaved.", "info");
      }
    } catch (err: any) {
      console.error("Error saving short via API:", err);
      showToast(err.message || "Failed to save short", "error");
      
      // Rollback UI update
      setSavedItems(prev =>
        isAlreadySaved ? [...prev, String(id)] : prev.filter(item => item !== String(id))
      );
    }
  };

  const toggleLike = async (id: any) => {
    if (!currentUser) {
      showToast("Authentication required to like shorts.", "warning");
      return;
    }

    const isAlreadyLiked = likedItems.includes(String(id));

    try {
      // Opt-in UI update
      setLikedItems(prev =>
        prev.includes(String(id)) ? prev.filter(item => item !== String(id)) : [...prev, String(id)]
      );

      // Call API
      const res = await toggleLikeShort({
        short: String(id)
      });
      console.log("Toggle like API response:", res);

      if (!isAlreadyLiked) {
        showToast("Short liked!", "success");
      } else {
        showToast("Short unliked.", "info");
      }
    } catch (err: any) {
      console.error("Error liking short via API:", err);
      showToast(err.message || "Failed to toggle like", "error");

      // Rollback UI update
      setLikedItems(prev =>
        isAlreadyLiked ? [...prev, String(id)] : prev.filter(item => item !== String(id))
      );
    }
  };

  // Derive saved shorts list details on-the-fly to prevent sync issues
  const savedShortsList: SavedShort[] = shortsList
    .filter(short => savedItems.map(String).includes(String(short.id)))
    .map((short: ShortVideo): SavedShort => {
      const icon = short.category.toLowerCase().includes("python") ? "🐍" : short.category.toLowerCase().includes("pandas") ? "🐼" : "🗄️";
      return {
        id: short.id,
        title: short.title,
        category: short.category,
        savedDate: "Saved",
        icon: icon,
        color: "blue"
      };
    });

  // Calculate displayed list based on active sub tab
  const displayedShorts = activeSubTab === "saved"
    ? shortsList.filter(short => savedItems.map(String).includes(String(short.id)))
    : shortsList;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-800">Study Shorts</h1>
        <p className="text-slate-500 mt-1">30-second skill videos — swipe, learn, level up every day</p>
      </motion.div>

      {/* Sub Tab Bar */}
      <motion.div variants={item} className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("all")}
          className={`pb-3 px-2 text-sm font-semibold transition-all relative ${
            activeSubTab === "all"
              ? "text-orange-500 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          All Shorts
          {activeSubTab === "all" && (
            <motion.div layoutId="activeWebSubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveSubTab("saved");
            fetchSaved(); // Call API ONLY when user goes to this section
          }}
          className={`pb-3 px-2 text-sm font-semibold transition-all relative ${
            activeSubTab === "saved"
              ? "text-orange-500 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Saved Shorts
          {activeSubTab === "saved" && (
            <motion.div layoutId="activeWebSubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
          )}
        </button>
      </motion.div>

      {/* Trending Videos - Horizontal Scroll */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              {activeSubTab === "all" ? "Trending" : "Saved Shorts"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-orange-600">
            View All
          </Button>
        </div>

        {loading || (activeSubTab === "saved" && loadingSaved) ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayedShorts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <Sparkles className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-slate-400 font-medium">
              {activeSubTab === "all" ? "No study shorts available yet." : "No saved shorts yet."}
            </p>
          </div>
        ) : (
          <HorizontalScroll>
            {displayedShorts.map((short) => (
              <div
                key={short.id}
                className="w-[280px] flex-shrink-0"
                onMouseEnter={() => setActiveVideoId(short.id)}
                onMouseLeave={() => setActiveVideoId(null)}
              >
                <div className="space-y-3">
                  <VideoPlayer video={short} isActive={activeVideoId === short.id} />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{short.title}</h3>
                      {short.description ? (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1" title={short.description}>
                          {short.description}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[8px] bg-slate-200 text-slate-600">
                            {short.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">{short.authorHandle}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{short.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(short.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-all ${likedItems.includes(String(short.id)) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} 
                        />
                      </button>
                      <button
                        onClick={() => toggleSave(short.id)}
                        className="text-slate-400 hover:text-orange-500 transition-colors"
                      >
                        {savedItems.includes(String(short.id)) ? (
                          <BookmarkCheck className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {short.tags && short.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {short.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px]">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </HorizontalScroll>
        )}
      </motion.div>

      {/* Two Column Layout - Saved & Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Left Column - Saved Shorts */}
        <motion.div variants={item} className="lg:col-span-1">
          <BaseCard className="border-slate-200 sticky top-24">
            <div className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-orange-500" />
                Saved Shorts
              </h3>
              <div className="space-y-4">
                {savedShortsList.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">No saved shorts yet.</p>
                ) : (
                  savedShortsList.map((saved) => (
                    <div key={saved.id} className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0">
                        {saved.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-orange-600 transition-colors">
                          {saved.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{saved.savedDate}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-xs text-slate-500 hover:text-orange-600">
                View All Saved
              </Button>
            </div>
          </BaseCard>
        </motion.div>

        {/* Right Column - Recommended for Your Gaps - Table Style */}
        <motion.div variants={item} className="lg:col-span-2">
          <BaseCard className="border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-bold text-slate-800">Recommended for Your Gaps</h3>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                  ML • Feature Engineering • Model Evaluation
                </Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Short</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</th>
                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {recommendedShorts.map((short) => (
                    <tr key={short.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Play className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-medium text-slate-800 group-hover:text-orange-600 transition-colors">
                            {short.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                          {short.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{short.duration}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                          {short.match}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{short.views}</td>
                      <td className="py-4 px-6">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-orange-600">
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-orange-600 ml-auto flex items-center gap-1">
                View All Recommendations
                <ChevronRightIcon className="w-3 h-3" />
              </Button>
            </div>
          </BaseCard>
        </motion.div>
      </div>
    </motion.div>
  );
}