"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, TrendingUp } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import PathwayCard from "@/components/ui/PathwayCard";

const pathways = [
    {
        id: 1,
        title: "Phase 1: Learn with Purpose",
        tagline: "Build a Strong, Industry-Aligned Foundation",
        description: "Move away from random course selection. Follow guided, structured pathways that are directly aligned with real industry expectations and current market demands.",
        icon: Lightbulb,
        image: "/images/journey-phase-1.jpeg", 
        color: "from-primary to-purple-600",
        features: [
            "Industry-aligned skill pathways",
            "Structured foundational curriculum",
            "Targeted learning objectives",
            "Interactive learning modules",
            "Skill gap identification",
        ],
        outcome: "Students gain clarity and foundational knowledge tailored to specific career goals.",
        cta: "Start Learning →",
    },
    {
        id: 2,
        title: "Phase 2: Execute with Guidance",
        tagline: "Apply Knowledge Through Hands-on Projects",
        description: "Bridge the gap between theory and practice. Work on practical assignments and collaborative projects supported by experienced mentors and industry experts.",
        icon: Users,
        image: "/images/journey-phase-2.jpeg", 
        color: "from-pink-500 to-rose-500",
        features: [
            "Real-world project execution",
            "Collaborative team assignments",
            "1-on-1 mentor guidance",
            "Iterative feedback loops",
            "Practical problem scenarios",
        ],
        outcome: "Students transform theoretical knowledge into demonstrated practical capabilities.",
        cta: "Start Executing →",
    },
    {
        id: 3,
        title: "Phase 3: Progress with Confidence",
        tagline: "Showcase Verified Skills to the World",
        description: "Transition smoothly from campus to career. Showcase your verified skills and project portfolios through dynamic profiles trusted by top recruiters and institutions.",
        icon: TrendingUp,
        image: "/images/journey-phase-3.jpeg", 
        color: "from-emerald-600 to-emerald-500",
        features: [
            "Dynamic skill profile creation",
            "Industry readiness validation",
            "Verified portfolio showcasing",
            "Direct recruiter visibility",
            "Seamless career transition",
        ],
        outcome: "Students confidently step into the professional world with proven, verified credentials.",
        cta: "Accelerate Your Career →",
    },
];

export default function PathwaysSection() {
    return (
        <SectionWrapper bgColor="slate" spacing="default">
            <SectionHeader
                badge="The StrideNex Journey"
                title={
                    <>
                        A Structured Path from <span className="text-slate-900">Campus to Career.</span>
                    </>
                }
            />

            <div className="space-y-16">
                {pathways.map((pathway, index) => (
                    <PathwayCard
                        key={pathway.id}
                        title={pathway.title}
                        tagline={pathway.tagline}
                        description={pathway.description}
                        icon={pathway.icon}
                        color={pathway.color}
                        image={pathway.image}
                        features={pathway.features}
                        outcome={pathway.outcome}
                        cta={pathway.cta}
                        index={index}
                    />
                ))}
            </div>
        </SectionWrapper>
    );
}