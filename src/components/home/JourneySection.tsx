"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";

const steps = [
    {
        id: 1,
        title: "Evaluate & Map",
        description: "We assess interests, strengths, and career inclination using structured evaluation frameworks to identify the most suitable growth pathway.",
        icon: Compass,
        color: "from-primary to-purple-600",
    },
    {
        id: 2,
        title: "Guided Development",
        description: "Students are mapped into specialized development tracks supported by mentors, industry inputs, and experiential learning.",
        icon: Target,
        color: "from-accent to-orange-600",
    },
    {
        id: 3,
        title: "Outcome Achievement",
        description: "Learners progress toward employment, entrepreneurship, or advanced education with validated skills and confidence.",
        icon: Award,
        color: "from-emerald-600 to-emerald-500",
    },
];

export default function JourneySection() {
    return (
        <SectionWrapper bgColor="gradient" spacing="default">
            <SectionHeader
                badge="Our Journey With Every Student"
                title="Every Successful Career Begins with the Right Direction"
                subtitle="StrideNex starts by understanding each learner - not just academically, but professionally."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/5 h-full">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <step.icon className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                Step {step.id} - {step.title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed">
                                {step.description}
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl"></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
            >
                <Button variant="outline" className="btn-outline-cta">
                    Learn More About Our Process
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </motion.div>
        </SectionWrapper>
    );
}