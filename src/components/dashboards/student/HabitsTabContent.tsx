// components/dashboards/student/HabitsTabContent.tsx
"use client";

import { motion } from "framer-motion";
import {
    Flame,
    CheckCircle2,
    Circle,
    Target,
    BookOpen,
    MessageSquare,
    Code,
    Plus,
    Calendar,
    Loader2
} from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getStudentDashboardHabits, getHabitStreaks, getStudentPlans } from "@/services/student.services";

// Types
interface HabitPlan {
    id: number;
    title: string;
    streak: number;
    category: string;
    icon: any;
    color: string;
    bgColor: string;
    progress: number;
    weeklyData: boolean[];
}

interface StatsData {
    streak: {
        current: number;
        longest: number;
    };
    last30Days: {
        done: number;
        partial: number;
        missed: number;
        completionRate: number;
    };
    thisWeek: {
        completed: number;
        total: number;
        days: {
            day: string;
            status: 'done' | 'partial' | 'missed';
        }[];
    };
}

// Dynamic data
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultStatsData: StatsData = {
    streak: {
        current: 18,
        longest: 24
    },
    last30Days: {
        done: 24,
        partial: 4,
        missed: 2,
        completionRate: 80
    },
    thisWeek: {
        completed: 5,
        total: 7,
        days: [
            { day: 'Mon', status: 'done' },
            { day: 'Tue', status: 'done' },
            { day: 'Wed', status: 'done' },
            { day: 'Thu', status: 'partial' },
            { day: 'Fri', status: 'missed' },
            { day: 'Sat', status: 'done' },
            { day: 'Sun', status: 'missed' }
        ]
    }
};

const defaultHabitPlans: HabitPlan[] = [
    {
        id: 1,
        title: "Solve 2 LeetCode Problems",
        streak: 18,
        category: "Problem Solving",
        icon: Code,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        progress: 85,
        weeklyData: [true, true, true, true, false, true, false]
    },
    {
        id: 2,
        title: "Read ML Research Paper",
        streak: 7,
        category: "ML",
        icon: BookOpen,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        progress: 60,
        weeklyData: [true, false, true, true, false, false, true]
    },
    {
        id: 3,
        title: "Update LinkedIn / Network",
        streak: 3,
        category: "Communication",
        icon: MessageSquare,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        progress: 40,
        weeklyData: [false, true, false, true, false, false, false]
    },
    {
        id: 4,
        title: "Watch Study Shorts",
        streak: 12,
        category: "Various",
        icon: Target,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        progress: 75,
        weeklyData: [true, true, true, false, true, true, false]
    }
];

const suggestedHabit = {
    title: "Morning Meditation",
    description: "Based on your activity, try adding a morning meditation habit",
    icon: Calendar
};

// Status configurations
const statusConfig = {
    done: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bgColor: "bg-emerald-100",
        borderColor: "border-emerald-200",
        indicator: "✓"
    },
    partial: {
        icon: Circle,
        color: "text-orange-500",
        bgColor: "bg-orange-100",
        borderColor: "border-orange-200",
        indicator: "○"
    },
    missed: {
        icon: Circle,
        color: "text-slate-400",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
        indicator: "−"
    }
};

export default function HabitsTabContent() {
    const [statsData, setStatsData] = useState<StatsData>(defaultStatsData);
    const [habitPlans, setHabitPlans] = useState<HabitPlan[]>(defaultHabitPlans);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const studentEmail = localStorage.getItem("currentUser") || "";
            if (!studentEmail) {
                setLoading(false);
                return;
            }

            // Fetch main dashboard data
            const dashboardRes = await getStudentDashboardHabits(studentEmail);
            
            if (dashboardRes?.message) {
                const data = dashboardRes.message;
                
                if (data.streak) setStatsData(prev => ({ ...prev, streak: data.streak }));
                if (data.last30Days) setStatsData(prev => ({ ...prev, last30Days: data.last30Days }));
                if (data.thisWeek) setStatsData(prev => ({ ...prev, thisWeek: data.thisWeek }));
                
                if (data.habitPlans && Array.isArray(data.habitPlans)) {
                    const mappedPlans = data.habitPlans.map((p: any, i: number) => ({
                        id: p.id || i,
                        title: p.title || p.habit_name || p.plan_name || "Untitled Habit",
                        streak: p.streak || 0,
                        category: p.category || p.habit_type || "General",
                        icon: Target, // fallback icon
                        color: "text-blue-600",
                        bgColor: "bg-blue-50",
                        progress: p.progress || 0,
                        weeklyData: p.weeklyData || [false, false, false, false, false, false, false]
                    }));
                    setHabitPlans(mappedPlans.length > 0 ? mappedPlans : defaultHabitPlans);
                } else {
                    // Try fetching individual plans if dashboard doesn't provide them
                    const plansRes = await getStudentPlans(studentEmail, "Active");
                    if (plansRes?.message && Array.isArray(plansRes.message)) {
                        const mappedPlans = plansRes.message.map((p: any, i: number) => ({
                            id: p.name || p.id || i,
                            title: p.plan_name || p.habit_name || "Untitled Habit",
                            streak: p.streak || 0,
                            category: p.habit_type || "General",
                            icon: Target,
                            color: "text-blue-600",
                            bgColor: "bg-blue-50",
                            progress: p.progress || 0,
                            weeklyData: p.weeklyData || [false, false, false, false, false, false, false]
                        }));
                        setHabitPlans(mappedPlans.length > 0 ? mappedPlans : defaultHabitPlans);
                    }
                }

                // Also try to get streaks individually if dashboard didn't have it
                if (!data.streak) {
                    const streaksRes = await getHabitStreaks(studentEmail);
                    if (streaksRes?.message) {
                        setStatsData(prev => ({
                            ...prev,
                            streak: {
                                current: streaksRes.message.current || streaksRes.message.current_streak || 0,
                                longest: streaksRes.message.longest || streaksRes.message.longest_streak || 0
                            }
                        }));
                    }
                }
            } else {
                // Try fallback individual API calls if dashboard fails entirely
                const [plansRes, streaksRes] = await Promise.all([
                    getStudentPlans(studentEmail, "Active"),
                    getHabitStreaks(studentEmail)
                ]);

                if (streaksRes?.message) {
                    setStatsData(prev => ({
                        ...prev,
                        streak: {
                            current: streaksRes.message.current || streaksRes.message.current_streak || 0,
                            longest: streaksRes.message.longest || streaksRes.message.longest_streak || 0
                        }
                    }));
                }

                if (plansRes?.message && Array.isArray(plansRes.message)) {
                    const mappedPlans = plansRes.message.map((p: any, i: number) => ({
                        id: p.name || p.id || i,
                        title: p.plan_name || p.habit_name || "Untitled Habit",
                        streak: p.streak || 0,
                        category: p.habit_type || "General",
                        icon: Target,
                        color: "text-blue-600",
                        bgColor: "bg-blue-50",
                        progress: p.progress || 0,
                        weeklyData: p.weeklyData || [false, false, false, false, false, false, false]
                    }));
                    if (mappedPlans.length > 0) setHabitPlans(mappedPlans);
                }
            }
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const last30DaysItems = [
        { key: 'done', label: 'Done', value: statsData.last30Days.done },
        { key: 'partial', label: 'Partial', value: statsData.last30Days.partial },
        { key: 'missed', label: 'Missed', value: statsData.last30Days.missed }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Habits...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Row: Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Streak Card */}
                <StatsCard title="Streak">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                            <Flame className="w-7 h-7 text-orange-500" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-800">{statsData.streak.current}</span>
                                <span className="text-sm text-slate-400">days</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Longest: {statsData.streak.longest} days</p>
                        </div>
                    </div>
                </StatsCard>

                {/* Last 30 Days Card */}
                <StatsCard title="Last 30 Days">
                    <div className="space-y-3">
                        {last30DaysItems.map((item) => {
                            const config = statusConfig[item.key as keyof typeof statusConfig];
                            const Icon = config.icon;
                            return (
                                <div key={item.key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${config.color}`} />
                                        <span className="text-sm text-slate-600">{item.label}</span>
                                    </div>
                                    <span className="font-semibold text-slate-700 text-lg">{item.value}</span>
                                </div>
                            );
                        })}
                        <div className="pt-4 mt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                <span>Completion rate</span>
                                <span className="font-medium text-slate-700">{statsData.last30Days.completionRate}%</span>
                            </div>
                            <Progress
                                value={statsData.last30Days.completionRate}
                                className="h-2 bg-slate-100"
                                indicatorColor="bg-emerald-500"
                            />
                        </div>
                    </div>
                </StatsCard>

                {/* This Week Card */}
                <StatsCard title="This Week">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            {statsData.thisWeek.days.map((day) => {
                                const config = statusConfig[day.status];
                                return (
                                    <div key={day.day} className="flex flex-col items-center gap-2">
                                        <span className="text-xs font-medium text-slate-500">{day.day}</span>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium
                      ${config.bgColor} ${config.color} border-2 ${config.borderColor}`}>
                                            {config.indicator}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-4 mt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Weekly Progress</span>
                                <span className="text-base font-semibold text-slate-700">
                                    {statsData.thisWeek.completed}/{statsData.thisWeek.total} days
                                </span>
                            </div>
                        </div>
                    </div>
                </StatsCard>
            </div>

            {/* My Habit Plans Section - Dynamic Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">My Habit Plans</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                    >
                        <Plus className="w-3 h-3 mr-1" /> New Habit
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {['Habit', 'Category', 'Streak', 'Progress', 'This Week', ''].map((header) => (
                                    <th key={header} className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {habitPlans.map((habit) => {
                                const Icon = habit.icon;
                                return (
                                    <tr key={habit.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${habit.bgColor} flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 ${habit.color}`} />
                                                </div>
                                                <span className="font-medium text-slate-800">{habit.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
                                                {habit.category}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1">
                                                <Flame className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium text-slate-700">{habit.streak}</span>
                                                <span className="text-xs text-slate-400">days</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-600 w-8">{habit.progress}%</span>
                                                <Progress
                                                    value={habit.progress}
                                                    className="w-16 h-1.5 bg-slate-100"
                                                    indicatorColor="bg-orange-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1">
                                                {habit.weeklyData.map((completed, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-medium
                              ${completed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                                'bg-slate-50 text-slate-400 border border-slate-200'}`}
                                                    >
                                                        {weekDays[idx][0]}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
                                                <Target className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}