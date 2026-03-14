// components/dashboards/student/StoriesTabContent.tsx
"use client";

import { motion } from "framer-motion";
import {
    Quote,
    Briefcase,
    IndianRupee,
    Rocket,
    Sparkles,
    ChevronRight,
    Star,
    Award,
    TrendingUp
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { CardHeader } from "@/components/dashboards/shared/CardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types
interface Story {
    id: number;
    name: string;
    initials: string;
    college: string;
    achievement: string;
    package?: string;
    outcome: string;
    quote: string;
    avatarColor: string;
    icon: any;
}

// Stories data
const stories: Story[] = [
    {
        id: 1,
        name: "Riya Sharma",
        initials: "RS",
        college: "VJTI Mumbai",
        achievement: "SDE @ Google",
        package: "₹42 LPA",
        outcome: "Founded Fintech Startup Seed Funded",
        quote: "The Skill Ledger and AI coach helped me identify gaps early and fix them systematically.",
        avatarColor: "bg-purple-600",
        icon: Briefcase
    },
    {
        id: 2,
        name: "Arjun Mehta",
        initials: "AM",
        college: "COEP Pune",
        achievement: "ML Engineer @ Microsoft",
        package: "₹38 LPA",
        outcome: "Published 3 research papers",
        quote: "Path Finder mapped my startup journey. Mentor sessions with industry pros changed everything.",
        avatarColor: "bg-blue-600",
        icon: TrendingUp
    },
    {
        id: 3,
        name: "Priya Krishnan",
        initials: "PK",
        college: "BITS Pilani",
        achievement: "Product Manager @ Amazon",
        package: "₹45 LPA",
        outcome: "Launched 2 successful products",
        quote: "The community and mentorship helped me transition from engineering to product management.",
        avatarColor: "bg-emerald-600",
        icon: Rocket
    },
    {
        id: 4,
        name: "Siddharth Shah",
        initials: "SS",
        college: "IIT Bombay",
        achievement: "Data Scientist @ Microsoft",
        package: "₹36 LPA",
        outcome: "Built AI solution for healthcare",
        quote: "The AI coach identified my weak areas and recommended exactly what I needed to learn.",
        avatarColor: "bg-orange-600",
        icon: Award
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function StoriesTabContent() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={item}>
                <h1 className="text-2xl font-bold text-slate-800">Success Stories</h1>
                <p className="text-slate-500 mt-1">Real outcomes from StrideNex students — your inspiration starts here</p>
            </motion.div>

            {/* Stories Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map((story) => {
                    const Icon = story.icon;
                    return (
                        <BaseCard key={story.id} className="overflow-hidden hover:shadow-xl transition-all group border-slate-200">
                            <div className="p-6">
                                {/* Header with Avatar and Name */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-14 h-14">
                                            <AvatarFallback className={`${story.avatarColor} text-white font-bold text-lg`}>
                                                {story.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 text-lg">{story.name}</h3>
                                            <p className="text-sm text-slate-500">{story.college}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Success Story
                                    </Badge>
                                </div>

                                {/* Achievement and Package */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs text-slate-500">Achievement</span>
                                        </div>
                                        <p className="font-semibold text-slate-800">{story.achievement}</p>
                                    </div>
                                    {story.package && (
                                        <div className="bg-emerald-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <IndianRupee className="w-4 h-4 text-emerald-600" />
                                                <span className="text-xs text-slate-500">Package</span>
                                            </div>
                                            <p className="font-semibold text-emerald-600">{story.package}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Outcome */}
                                <div className="mb-4">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 mb-2">
                                        <Rocket className="w-3 h-3 mr-1" />
                                        Outcome
                                    </Badge>
                                    <p className="text-sm text-slate-700">{story.outcome}</p>
                                </div>

                                {/* Quote with quotation marks */}
                                <div className="relative bg-slate-50 rounded-lg p-4 mt-2">
                                    <Quote className="absolute top-3 left-3 w-6 h-6 text-orange-200" />
                                    <p className="text-sm text-slate-600 italic pl-6">"{story.quote}"</p>
                                </div>
                            </div>
                        </BaseCard>
                    );
                })}
            </motion.div>

            {/* Call to Action */}
            <motion.div variants={item} className="mt-8">
                <BaseCard className="bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                    <div className="relative p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Success Story Starts Today</h2>
                        <p className="text-slate-600 mb-6 max-w-xl">
                            Join 10,000+ students building their future on StrideNex
                        </p>
                        <div className="flex items-center gap-4">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-5 text-base font-semibold shadow-sm">
                                Start Your Path
                            </Button>
                            <Button
                                variant="outline"
                                className="border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-700 hover:border-orange-400 px-6 py-5 text-base transition-all"
                            >
                                View All Stories
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </BaseCard>
            </motion.div>
        </motion.div>
    );
}