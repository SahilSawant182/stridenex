"use client";

import { Code, Rocket, GraduationCap } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";

const approaches = [
  {
    title: "Skill Facilitating",
    description: "Develop practical capabilities and industry readiness through guided execution and project exposure.",
    icon: Code,
    color: "from-primary to-purple-600"
  },
  {
    title: "Entrepreneur Development",
    description: "Encourage innovation by supporting students in transforming ideas into viable ventures.",
    icon: Rocket,
    color: "from-accent to-orange-600"
  },
  {
    title: "Higher Education Pathway",
    description: "Prepare learners for advanced academic opportunities through structured specialization and profile development.",
    icon: GraduationCap,
    color: "from-emerald-600 to-emerald-500"
  }
];

export default function Approach() {
  return (
    <SectionWrapper bgColor="slate" spacing="default">
      <SectionHeader
        badge="Our Approach"
        title="A Structured Journey to Success"
        subtitle="StrideNex begins with understanding each learner's interests, strengths, and aspirations. Based on this mapping, students progress through structured development pathways supported by mentors, institutions, and industry insights."
        alignment="center"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {approaches.map((item, index) => (
          <FeatureCard
            key={item.title}
            icon={<item.icon className="w-7 h-7 text-white" />}
            iconBgColor={item.color}
            title={item.title}
            description={item.description}
            hoverEffect="lift"
          />
        ))}
      </div>
    </SectionWrapper>
  );
}