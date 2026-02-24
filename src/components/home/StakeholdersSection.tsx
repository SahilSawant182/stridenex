"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Briefcase, CheckCircle } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const stakeholders = [
    {
        id: "students",
        label: "For Students",
        title: "For Students",
        subtitle: "Clarity, Confidence, and Career Direction",
        icon: Users,
        color: "from-accent to-orange-600",
        bgColor: "bg-gradient-to-r from-accent to-orange-600",
        buttonVariant: "accent" as const,
        features: [
            "Discover your real professional interests",
            "Gain hands-on industry exposure",
            "Build portfolios that employers trust",
            "Choose career, startup, or higher education pathways",
            "Develop skills aligned with future industries",
        ],
        cta: "Start Your Journey",
    },
    {
        id: "industry",
        label: "For Industry",
        title: "For Industry",
        subtitle: "Engage with Talent That Demonstrates Capability",
        icon: Briefcase,
        color: "navy",
        bgColor: "bg-navy",
        buttonVariant: "primary" as const,
        features: [
            "Access pre-evaluated candidate pools",
            "Skill-validated student profiles",
            "Reduced recruitment uncertainty",
            "Early engagement with emerging talent",
            "Continuous talent pipeline development",
        ],
        cta: "Explore Talent Network",
    },
];

export default function StakeholdersSection() {
    const [activeTab, setActiveTab] = useState("students");

    // Get the active item
    const activeItem = stakeholders.find(item => item.id === activeTab) || stakeholders[0];

    return (
        <SectionWrapper bgColor="gradient" spacing="default">
            <SectionHeader
                badge="Built For Every Stakeholder"
                title="A Platform for Everyone"
            />

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex p-1 bg-slate-100 rounded-full">
                    {stakeholders.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === item.id
                                ? item.id === "industry"
                                    ? "bg-navy text-white shadow-lg"
                                    : `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                : 'text-slate-600 hover:text-primary'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl border border-primary/10 overflow-hidden"
                >
                    <div className="grid md:grid-cols-2">
                        {/* Left side - Content */}
                        <div className="p-8 md:p-12">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeItem.id === "industry"
                                ? "bg-navy text-white"
                                : `bg-gradient-to-r ${activeItem.color} text-white`
                                } text-sm font-bold mb-6`}>
                                <activeItem.icon className="w-4 h-4" />
                                {activeItem.title}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                {activeItem.subtitle}
                            </h3>

                            <div className="space-y-4 mb-8">
                                {activeItem.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Button with dynamic variant */}
                            <Button
                                variant="primary" 
                                className={activeItem.id === "industry" ? "btn-cta-navy" : "btn-cta-accent"}
                            >
                                {activeItem.cta}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>

                        {/* Right side - Visual */}
                        <div className={`${activeItem.id === "industry"
                            ? "bg-navy"
                            : `bg-gradient-to-br ${activeItem.color}`
                            } p-12 flex items-center justify-center`}>
                            <activeItem.icon className="w-40 h-40 text-white/30" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </SectionWrapper>
    );
}