"use client";

import { motion } from "framer-motion";
import { Briefcase, Rocket, GraduationCap } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import PathwayCard from "@/components/ui/PathwayCard";

const pathways = [
    {
        id: 1,
        title: "Skill Facilitating Program",
        tagline: "Become Industry-Ready Before You Graduate",
        description: "Designed for students aiming to enter the workforce with confidence and practical capability.",
        icon: Briefcase,
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
        color: "from-primary to-purple-600",
        features: [
            "Industry-aligned skill pathways",
            "Real-world project exposure",
            "Portfolio and execution-based learning",
            "Continuous mentor guidance",
            "Industry readiness score and validation",
        ],
        outcome: "Students transition from learners to professionals prepared for real job roles.",
        cta: "Build Job-Ready Skills →",
    },
    {
        id: 2,
        title: "Entrepreneur Development Program",
        tagline: "Transform Ideas into Scalable Ventures",
        description: "For students who aspire to create, innovate, and lead.",
        icon: Rocket,
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
        color: "from-accent to-orange-600",
        features: [
            "Innovation and problem-identification frameworks",
            "Startup mentoring and incubation guidance",
            "Product development exposure",
            "Business model and market validation support",
            "Industry and investor ecosystem connect",
        ],
        outcome: "Students evolve from idea thinkers into startup creators.",
        cta: "Start Your Innovation Journey →",
    },
    {
        id: 3,
        title: "Higher Education Pathway",
        tagline: "Prepare for Advanced Academic Excellence",
        description: "For learners planning global or specialized higher studies with clarity and preparation.",
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
        color: "from-emerald-600 to-emerald-500",
        features: [
            "Career-aligned higher education mapping",
            "Research and specialization guidance",
            "Skill portfolio strengthening",
            "Industry exposure to support academic applications",
            "Future-focused learning preparation",
        ],
        outcome: "Students pursue higher education with stronger profiles and clearer specialization goals.",
        cta: "Plan Your Academic Future →",
    },
];

export default function PathwaysSection() {
    return (
        <SectionWrapper bgColor="slate" spacing="default">
            <SectionHeader
                badge="Three Core Development Pathways"
                title={
                    <>
                        One Platform. <span className="text-slate-900">Three Powerful Growth Directions.</span>
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