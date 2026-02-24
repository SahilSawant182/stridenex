"use client";

import { Zap, Target, Users, Award } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import ComparisonCard from "@/components/ui/ComparisonCard";

const comparisons = [
    {
        conventional: "Course-focused learning",
        skillbridge: "Career pathway development",
        icon: Target,
    },
    {
        conventional: "Certifications",
        skillbridge: "Demonstrated capability",
        icon: Award,
    },
    {
        conventional: "Generic training",
        skillbridge: "Personalized progression",
        icon: Users,
    },
    {
        conventional: "Hiring after graduation",
        skillbridge: "Industry connected from day one",
        icon: Zap,
    },
];

export default function WhyDifferentSection() {
    const conventionalItems = comparisons.map(item => ({
        text: item.conventional,
        icon: item.icon
    }));

    const skillbridgeItems = comparisons.map(item => ({
        text: item.skillbridge,
        icon: item.icon
    }));

    return (
        <SectionWrapper bgColor="slate" spacing="default">
            <SectionHeader
                badge="Why StrideNex Stands Different"
                title={
                    <>
                        Not Another Learning Platform - <br />
                        A Career Development Ecosystem
                    </>
                }
            />

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <ComparisonCard
                    type="conventional"
                    title="Conventional Platforms"
                    items={conventionalItems}
                    delay={0}
                />

                <ComparisonCard
                    type="skillbridge"
                    title="StrideNex"
                    items={skillbridgeItems}
                    delay={0.2}
                />
            </div>
        </SectionWrapper>
    );
}