// components/dashboards/student/StoriesTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Quote,
    Briefcase,
    IndianRupee,
    Rocket,
    Sparkles,
    ChevronRight,
    Award,
    TrendingUp,
    X
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getSuccessStories, createSuccessStory, getStudentByEmail } from "@/services/student.services";

export default function StoriesTabContent() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState<any>(null);
    
    // Modal state
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form fields state
    const [outcomeCategory, setOutcomeCategory] = useState("Placement");
    const [outcomeTitle, setOutcomeTitle] = useState("");
    const [outcomeMetric, setOutcomeMetric] = useState("");
    const [testimonial, setTestimonial] = useState("");
    const [status, setStatus] = useState("Published");

    const fetchStories = async () => {
        try {
            setLoading(true);
            const res = await getSuccessStories();
            console.log("Success stories API raw response:", res);
            
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
                } else if (res.data && res.data.message && Array.isArray(res.data.message.data)) {
                    fetchedStories = res.data.message.data;
                }
            }
            
            setStories(fetchedStories);
        } catch (error) {
            console.error("Error loading success stories:", error);
            showToast("Failed to load success stories", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
        
        // Load student details
        const loadStudentProfile = async () => {
            if (!currentUser) return;
            try {
                // Try local storage first
                const stored = localStorage.getItem("studentDetails");
                if (stored) {
                    setStudentProfile(JSON.parse(stored));
                    return;
                }
                
                // Fetch from API
                const res = await getStudentByEmail(currentUser);
                const data = res?.data || res?.message?.data || res?.message;
                if (data && typeof data === "object") {
                    setStudentProfile(data);
                    localStorage.setItem("studentDetails", JSON.stringify(data));
                }
            } catch (error) {
                console.error("Error loading student profile:", error);
            }
        };
        
        loadStudentProfile();
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            showToast("Authentication required. Please log in.", "error");
            return;
        }
        if (!outcomeTitle.trim()) {
            showToast("Outcome Title is required.", "warning");
            return;
        }
        if (!testimonial.trim()) {
            showToast("Testimonial is required.", "warning");
            return;
        }
        
        try {
            setSubmitting(true);

            const payload = {
                student: studentProfile?.name || currentUser, // Fallback to currentUser email if studentProfile is not loaded
                outcome_category: outcomeCategory,
                outcome_title: outcomeTitle,
                outcome_metric: outcomeMetric || null,
                testimonial: testimonial,
                status: status
            };
            
            const res = await createSuccessStory(payload);
            if (res) {
                showToast("Success story published successfully!", "success");
                setIsOpen(false);
                // Reset form
                setOutcomeTitle("");
                setOutcomeMetric("");
                setTestimonial("");
                setStatus("Published");
                // Refresh list
                fetchStories();
            }
        } catch (error: any) {
            console.error("Error creating success story:", error);
            showToast(error.message || "Failed to create success story", "error");
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Success Stories</h1>
                    <p className="text-slate-500 mt-1 text-sm">Real outcomes from StrideNex students — your inspiration starts here</p>
                </div>
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                    <Sparkles className="w-4 h-4" />
                    Share Your Story
                </Button>
            </div>

            {/* Stories Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : stories.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center"
                >
                    <Sparkles className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-400 mb-4 font-medium">No success stories published yet.</p>
                    <Button onClick={() => setIsOpen(true)} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                        Be the first to share!
                    </Button>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {stories.map((story) => {
                        const Icon = getCategoryIcon(story.outcome_category);
                        const displayName = getStudentDisplayName(story);
                        const initials = getInitials(story);
                        const avatarStyle = getAvatarStyle(story);
                        return (
                            <BaseCard key={story.id} className="overflow-hidden hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 group border-slate-200 bg-white">
                                <div className="p-5 flex flex-col justify-between h-full space-y-4">
                                    {/* Header with Avatar and Name */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-11 h-11 border border-slate-100">
                                                <AvatarFallback style={avatarStyle} className="text-white font-bold text-sm">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-sm leading-tight">{displayName}</h3>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5" title={story.college}>{story.college || "StrideNex Student"}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-orange-50/50 text-orange-600 border-orange-100/60 text-[10px] font-semibold py-0.5 px-2">
                                            {story.outcome_category}
                                        </Badge>
                                    </div>

                                    {/* Achievement and Metric Row */}
                                    <div className="bg-slate-50/50 rounded-xl p-3 flex items-center justify-between border border-slate-100/50">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-orange-100/40 text-orange-600 rounded-lg">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Achievement</span>
                                                <p className="font-semibold text-slate-700 text-xs mt-0.5">{story.outcome_title}</p>
                                            </div>
                                        </div>
                                        {story.outcome_metric && (
                                            <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100/60 shadow-sm">
                                                {story.outcome_metric}
                                            </div>
                                        )}
                                    </div>

                                    {/* Testimonial Quote */}
                                    <div className="relative pl-3 border-l-2 border-orange-400/80">
                                        <p className="text-xs text-slate-500 italic leading-relaxed">
                                            "{story.testimonial}"
                                        </p>
                                    </div>
                                </div>
                            </BaseCard>
                        );
                    })}
                </motion.div>
            )}

            {/* Call to Action */}
            <div className="mt-8">
                <BaseCard className="bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                    <div className="relative p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Success Story Starts Today</h2>
                        <p className="text-slate-600 mb-6 max-w-xl text-sm">
                            Join 10,000+ students building their future on StrideNex
                        </p>
                        <div className="flex items-center gap-4">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-5 text-base font-semibold shadow-sm">
                                Start Your Path
                            </Button>
                            <Button
                                onClick={() => setIsOpen(true)}
                                variant="outline"
                                className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-700 hover:border-orange-400 px-6 py-5 text-base transition-all"
                            >
                                Share Your Story
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </BaseCard>
            </div>

            {/* Creation Dialog Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999]"
                        />
                        
                        {/* Modal Center Wrapper */}
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] pointer-events-none">
                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", duration: 0.4 }}
                                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 relative text-white flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-xl">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Share Your Success Story</h2>
                                            <p className="text-white/80 text-sm mt-0.5">Inspire the StrideNex community with your achievement</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
                                    {/* Category select */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Category</label>
                                        <select
                                            value={outcomeCategory}
                                            onChange={(e) => setOutcomeCategory(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                                        >
                                            <option value="Placement">Placement</option>
                                            <option value="Startup">Startup</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Higher Studies">Higher Studies</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Status select */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>

                                    {/* Title input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. SDE @ Google, ML Engineer @ Microsoft"
                                            value={outcomeTitle}
                                            onChange={(e) => setOutcomeTitle(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white text-slate-800"
                                        />
                                    </div>

                                    {/* Metric input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Outcome Metric / Package (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ₹42 LPA, ₹12 LPA"
                                            value={outcomeMetric}
                                            onChange={(e) => setOutcomeMetric(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white text-slate-800"
                                        />
                                    </div>

                                    {/* Testimonial textarea */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Testimonial</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Share your experience and how StrideNex helped you achieve your goals..."
                                            value={testimonial}
                                            onChange={(e) => setTestimonial(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none bg-white text-slate-800"
                                        />
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 text-sm font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="px-6 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Publishing...
                                                </>
                                            ) : (
                                                "Publish Story"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}