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
    Loader2,
    X,
    Clock,
    Link,
    Zap
} from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { 
    getStudentDashboardHabits, 
    getHabitStreaks, 
    getStudentPlans, 
    getTodaysPendingHabits, 
    logDailyHabits, 
    updateLogStatus, 
    createHabitPlan, 
    getHabitHistory, 
    getPlanSummary,
    completeHabitPlanStatus
} from "@/services/student.services";

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

interface PendingHabit {
    id: string;
    habit_name: string;
    habit_type: string;
    target_value: number;
    current_value: number;
    status: 'pending' | 'completed' | 'partial';
    plan_name?: string;
}

interface HabitHistoryItem {
    date: string;
    habit_name: string;
    status: 'done' | 'partial' | 'missed';
    value: number;
}

interface SuggestedHabit {
    title: string;
    description: string;
    icon: any;
}

interface HabitFormData {
    plan_name: string;
    start_date: string;
    end_date: string;
    linked_path: string;
    habits: string[];
    ai_generated: number;
}

interface HabitItem {
    habit_name: string;
    doctype?: string;
}

// Dynamic data
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

// Date conversion functions
const convertDDMMYYYYToISO = (ddmmyyyy: string): string => {
    if (!ddmmyyyy) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const convertISOToDDMMYYYY = (iso: string): string => {
    if (!iso) return '';
    const [year, month, day] = iso.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
};

export default function HabitsTabContent() {
    const [statsData, setStatsData] = useState<StatsData>({
        streak: { current: 0, longest: 0 },
        last30Days: { done: 0, partial: 0, missed: 0, completionRate: 0 },
        thisWeek: { completed: 0, total: 0, days: [] }
    });
    const [habitPlans, setHabitPlans] = useState<HabitPlan[]>([]);
    const [pendingHabits, setPendingHabits] = useState<PendingHabit[]>([]);
    const [habitHistory, setHabitHistory] = useState<HabitHistoryItem[]>([]);
    const [suggestedHabit, setSuggestedHabit] = useState<SuggestedHabit | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewHabitModal, setShowNewHabitModal] = useState(false);
    const [formData, setFormData] = useState<HabitFormData>({
        plan_name: '',
        start_date: new Date().toLocaleDateString('en-GB').replace(/\//g, '/'), // DD/MM/YYYY format
        end_date: '',
        linked_path: '',
        habits: [''],
        ai_generated: 0
    });
    const [submitting, setSubmitting] = useState(false);
    const [completingHabit, setCompletingHabit] = useState<string | null>(null);

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

            // Fetch all habits data in parallel
            const [dashboardRes, pendingRes, plansRes, streaksRes] = await Promise.all([
                getStudentDashboardHabits(studentEmail),
                getTodaysPendingHabits(studentEmail),
                getStudentPlans(studentEmail, "Active"),
                getHabitStreaks(studentEmail)
            ]);

            // Process dashboard data
            if (dashboardRes?.message) {
                const data = dashboardRes.message;
                
                // Map streak data
                if (data.current_streak !== undefined && data.longest_streak !== undefined) {
                    setStatsData(prev => ({ 
                        ...prev, 
                        streak: {
                            current: data.current_streak || 0,
                            longest: data.longest_streak || 0
                        }
                    }));
                }
                
                // Map last 30 days data
                if (data.last_30_days && Array.isArray(data.last_30_days)) {
                    const doneCount = data.last_30_days.filter((day: any) => day.status === 'done').length;
                    const partialCount = data.last_30_days.filter((day: any) => day.status === 'partial').length;
                    const missedCount = data.last_30_days.filter((day: any) => day.status === 'none' || day.status === 'missed').length;
                    const completionRate = data.last_30_days.length > 0 ? Math.round((doneCount / data.last_30_days.length) * 100) : 0;
                    
                    setStatsData(prev => ({ 
                        ...prev, 
                        last30Days: {
                            done: data.done_30 !== undefined ? data.done_30 : doneCount,
                            partial: data.partial_30 !== undefined ? data.partial_30 : partialCount,
                            missed: data.missed_30 !== undefined ? data.missed_30 : missedCount,
                            completionRate: data.missed_30 !== undefined ? (data.done_30 || 0) / (data.last_30_days.length || 1) * 100 : completionRate
                        }
                    }));
                }
                
                // Map this week data
                if (data.this_week && Array.isArray(data.this_week)) {
                    const completedCount = data.this_week.filter((day: any) => day.status === 'done').length;
                    const totalCount = data.this_week.length;
                    
                    setStatsData(prev => ({ 
                        ...prev, 
                        thisWeek: {
                            completed: completedCount,
                            total: totalCount,
                            days: data.this_week.map((day: any) => ({
                                day: day.day,
                                status: day.status === 'none' ? 'missed' : day.status
                            }))
                        }
                    }));
                }
                
                // Map habits from dashboard
                if (data.habits && Array.isArray(data.habits)) {
                    const mappedPlans = data.habits.flatMap((plan: any, planIndex: number) => {
                        if (plan.habits && Array.isArray(plan.habits)) {
                            return plan.habits.map((habit: any, habitIndex: number) => ({
                                id: `${plan.name || planIndex}-${habitIndex}`,
                                title: habit.habit_name || plan.plan_name || "Untitled Habit",
                                streak: habit.current_streak || 0,
                                category: habit.habit_type || "General",
                                icon: getIconForCategory(habit.habit_type),
                                color: getColorForCategory(habit.habit_type),
                                bgColor: getBgColorForCategory(habit.habit_type),
                                progress: habit.completion_rate || 0,
                                weeklyData: [false, false, false, false, false], // Default weekly data
                                planName: plan.plan_name,
                                planStatus: plan.status,
                                startDate: plan.start_date,
                                endDate: plan.end_date,
                                aiGenerated: plan.ai_generated
                            }));
                        }
                        return [];
                    });
                    setHabitPlans(mappedPlans);
                }
            }

            // Process pending habits
            if (pendingRes?.message && Array.isArray(pendingRes.message)) {
                console.log("Pending habits from API:", pendingRes.message);
                setPendingHabits(pendingRes.message);
            } else {
                console.log("No pending habits or invalid response:", pendingRes);
            }

            // Process habit plans from getStudentPlans API (always process to ensure we get all plans)
            if (plansRes?.message && Array.isArray(plansRes.message)) {
                console.log("Plans from API:", plansRes.message);
                const mappedPlans = plansRes.message.flatMap((plan: any, planIndex: number) => {
                    if (plan.habits && Array.isArray(plan.habits)) {
                        return plan.habits.map((habit: any, habitIndex: number) => ({
                            id: `${plan.name || planIndex}-${habitIndex}`,
                            title: habit.habit_name || plan.plan_name || "Untitled Habit",
                            streak: habit.current_streak || 0,
                            category: habit.habit_type || "General",
                            icon: getIconForCategory(habit.habit_type),
                            color: getColorForCategory(habit.habit_type),
                            bgColor: getBgColorForCategory(habit.habit_type),
                            progress: habit.completion_rate || 0,
                            weeklyData: [false, false, false, false, false, false], // Default weekly data
                            planName: plan.plan_name,
                            planStatus: plan.status,
                            startDate: plan.start_date,
                            endDate: plan.end_date,
                            aiGenerated: plan.ai_generated
                        }));
                    }
                    return [];
                });
                console.log("Mapped plans:", mappedPlans);
                setHabitPlans(mappedPlans);
            }

            // Process streaks if not already set from dashboard
            if (streaksRes?.message && Array.isArray(streaksRes.message) && !statsData.streak.current) {
                // Find the habit with highest current streak for overall stats
                const maxStreak = streaksRes.message.reduce((max: any, habit: any) => {
                    return (habit.current_streak || 0) > (max?.current_streak || 0) ? habit : max;
                }, null);
                
                if (maxStreak) {
                    setStatsData(prev => ({
                        ...prev,
                        streak: {
                            current: maxStreak.current_streak || 0,
                            longest: maxStreak.longest_streak || 0
                        }
                    }));
                }
            }

            // Generate suggested habit based on activity
            if (habitPlans.length > 0) {
                const categories = habitPlans.map(p => p.category);
                const suggestion = generateSuggestedHabit(categories);
                setSuggestedHabit(suggestion);
            }

        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for dynamic styling
    const getIconForCategory = (category: string) => {
        const iconMap: { [key: string]: any } = {
            'Problem Solving': Code,
            'ML': BookOpen,
            'Communication': MessageSquare,
            'Various': Target,
            'General': Target
        };
        return iconMap[category] || Target;
    };

    const getColorForCategory = (category: string) => {
        const colorMap: { [key: string]: string } = {
            'Problem Solving': 'text-blue-600',
            'ML': 'text-purple-600',
            'Communication': 'text-orange-600',
            'Various': 'text-emerald-600',
            'General': 'text-slate-600'
        };
        return colorMap[category] || 'text-slate-600';
    };

    const getBgColorForCategory = (category: string) => {
        const bgColorMap: { [key: string]: string } = {
            'Problem Solving': 'bg-blue-50',
            'ML': 'bg-purple-50',
            'Communication': 'bg-orange-50',
            'Various': 'bg-emerald-50',
            'General': 'bg-slate-50'
        };
        return bgColorMap[category] || 'bg-slate-50';
    };

    const generateSuggestedHabit = (categories: string[]): SuggestedHabit => {
        const hasProblemSolving = categories.includes('Problem Solving');
        const hasML = categories.includes('ML');
        const hasCommunication = categories.includes('Communication');
        
        if (!hasCommunication && categories.length >= 2) {
            return {
                title: "Daily Networking",
                description: "Connect with professionals in your field to expand your network",
                icon: MessageSquare
            };
        }
        
        if (hasProblemSolving && !hasML) {
            return {
                title: "ML Fundamentals",
                description: "Build your machine learning foundation with daily practice",
                icon: BookOpen
            };
        }
        
        return {
            title: "Morning Meditation",
            description: "Start your day with mindfulness and focus",
            icon: Calendar
        };
    };

    // API interaction functions
    const handleLogHabit = async (habitId: string, value: number, planName?: string) => {
        try {
            setCompletingHabit(habitId);
            const studentEmail = localStorage.getItem("currentUser") || "";
            
            // Find the habit to get plan name if not provided
            const habit = pendingHabits.find(h => h.id === habitId);
            const actualPlanName = planName || habit?.plan_name;
            
            // Optimistically update UI - remove the habit from pending list immediately
            setPendingHabits(prev => prev.filter(habit => habit.id !== habitId));
            
            await logDailyHabits({
                student: studentEmail,
                logs: [{
                    habit_id: habitId,
                    value: value,
                    date: new Date().toISOString().split('T')[0]
                }]
            });
            
            // Call complete habit plan status API if plan name is available
            if (actualPlanName && habit) {
                await completeHabitPlanStatus(actualPlanName, habit.habit_name, studentEmail);
            }
            
            // Refresh data to ensure consistency with backend
            fetchData();
        } catch (error) {
            console.error("Error logging habit:", error);
            // If there's an error, refresh data to restore the correct state
            fetchData();
        } finally {
            setCompletingHabit(null);
        }
    };

    const handleUpdateHabitStatus = async (logName: string, status: string) => {
        try {
            await updateLogStatus(logName, status);
            // Refresh data after updating
            fetchData();
        } catch (error) {
            console.error("Error updating habit status:", error);
        }
    };

    const handleCreateHabitPlan = async (planData: any) => {
        try {
            const studentEmail = localStorage.getItem("currentUser") || "";
            await createHabitPlan({
                ...planData,
                student: studentEmail
            });
            // Refresh data after creating
            fetchData();
        } catch (error) {
            console.error("Error creating habit plan:", error);
        }
    };

    const handleNewHabitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.plan_name.trim() || !formData.start_date) {
            alert('Please fill in at least the plan name and start date');
            return;
        }

        try {
            setSubmitting(true);
            const studentEmail = localStorage.getItem("currentUser") || "";
            
            const payload = {
                student: studentEmail,
                plan_name: formData.plan_name,
                start_date: formData.start_date,
                end_date: formData.end_date || null,
                linked_path: formData.linked_path || null,
                habits: formData.habits
                    .filter(h => h.trim() !== '')
                    .map(habit => ({
                        habit_name: habit,
                        doctype: "Habit Plan Item"
                    })),
                ai_generated: formData.ai_generated
            };

            await createHabitPlan(payload);
            
            // Reset form and close modal
            setFormData({
                plan_name: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                linked_path: '',
                habits: [''],
                ai_generated: 0
            });
            setShowNewHabitModal(false);
            
            // Refresh data
            fetchData();
        } catch (error) {
            console.error("Error creating habit plan:", error);
            alert('Error creating habit plan. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHabitChange = (index: number, value: string) => {
        const newHabits = [...formData.habits];
        newHabits[index] = value;
        setFormData({ ...formData, habits: newHabits });
    };

    const addHabitField = () => {
        setFormData({ ...formData, habits: [...formData.habits, ''] });
    };

    const removeHabitField = (index: number) => {
        if (formData.habits.length > 1) {
            const newHabits = formData.habits.filter((_, i) => i !== index);
            setFormData({ ...formData, habits: newHabits });
        }
    };

    const handleGetHabitHistory = async (habitName: string) => {
        try {
            const studentEmail = localStorage.getItem("currentUser") || "";
            const historyRes = await getHabitHistory(studentEmail, habitName, 30);
            if (historyRes?.message && Array.isArray(historyRes.message)) {
                setHabitHistory(historyRes.message);
            }
        } catch (error) {
            console.error("Error fetching habit history:", error);
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
                                <span className="font-medium text-slate-700">{statsData.last30Days.completionRate.toFixed(4)}%</span>
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
                        onClick={() => setShowNewHabitModal(true)}
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
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
                                                onClick={() => handleLogHabit(habit.id.toString(), 1)}
                                            >
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

            {/* Today's Pending Habits Section */}
            {pendingHabits.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Today's Pending Habits</h3>
                    </div>
                    <div className="p-6 space-y-3">
                        {pendingHabits.map((habit) => (
                            <div key={habit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${getBgColorForCategory(habit.habit_type)} flex items-center justify-center`}>
                                        {(() => {
                                            const Icon = getIconForCategory(habit.habit_type);
                                            return <Icon className={`w-4 h-4 ${getColorForCategory(habit.habit_type)}`} />;
                                        })()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{habit.habit_name}</p>
                                        <p className="text-xs text-slate-500">{habit.habit_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">
                                        {habit.current_value}/{habit.target_value}
                                    </span>
                                    <Button
                                        size="sm"
                                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => handleLogHabit(habit.id, habit.target_value, habit.plan_name)}
                                        disabled={completingHabit === habit.id}
                                    >
                                        {completingHabit === habit.id ? (
                                            <>
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                Completing...
                                            </>
                                        ) : (
                                            'Complete'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Suggested Habit Section */}
            {suggestedHabit && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/60 shadow-sm overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <suggestedHabit.icon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 mb-1">{suggestedHabit.title}</h4>
                                <p className="text-sm text-slate-600 mb-3">{suggestedHabit.description}</p>
                                <Button
                                    size="sm"
                                    className="text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() => handleCreateHabitPlan({ 
                                        plan_name: suggestedHabit.title, 
                                        habit_type: "Suggested",
                                        description: suggestedHabit.description 
                                    })}
                                >
                                    Add This Habit
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* New Habit Modal */}
            {showNewHabitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl border border-slate-200/60 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Create New Habit Plan</h3>
                                    <p className="text-sm text-slate-500">Set up a new habit to track your progress</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-slate-600"
                                onClick={() => setShowNewHabitModal(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <form onSubmit={handleNewHabitSubmit} className="p-6 space-y-6">
                            {/* Plan Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Plan Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.plan_name}
                                    onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="e.g., Daily Coding Challenge"
                                    required
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={formData.start_date ? convertDDMMYYYYToISO(formData.start_date) : ''}
                                            onChange={(e) => setFormData({ ...formData, start_date: convertISOToDDMMYYYY(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:uppercase"
                                            placeholder="DD/MM/YYYY"
                                            required
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        End Date <span className="text-slate-400">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={formData.end_date ? convertDDMMYYYYToISO(formData.end_date) : ''}
                                            onChange={(e) => setFormData({ ...formData, end_date: convertISOToDDMMYYYY(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:uppercase"
                                            placeholder="DD/MM/YYYY"
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Habits List */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Habits <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {formData.habits.map((habit, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={habit}
                                                onChange={(e) => handleHabitChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="e.g., Solve 2 LeetCode problems"
                                            />
                                            {formData.habits.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-red-500"
                                                    onClick={() => removeHabitField(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                                        onClick={addHabitField}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Another Habit
                                    </Button>
                                </div>
                            </div>

                            {/* Linked Path */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Linked Path <span className="text-slate-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Link className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.linked_path}
                                        onChange={(e) => setFormData({ ...formData, linked_path: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="e.g., /career/software-engineering"
                                    />
                                </div>
                            </div>

                            {/* AI Generated */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.ai_generated === 1}
                                        onChange={(e) => setFormData({ ...formData, ai_generated: e.target.checked ? 1 : 0 })}
                                        className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm font-medium text-slate-700">AI Generated</span>
                                    </div>
                                </label>
                                <p className="text-xs text-slate-500 mt-1 ml-7">Mark if this habit was suggested by AI</p>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                    onClick={() => setShowNewHabitModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Habit Plan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}