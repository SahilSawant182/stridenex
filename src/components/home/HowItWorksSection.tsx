"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users, TrendingUp, CheckCircle } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
    {
        id: 1,
        title: "Learn with Purpose",
        description: "Follow guided pathways aligned with real industry expectations instead of random course selection.",
        icon: Lightbulb,
        color: "from-primary to-purple-600",
    },
    {
        id: 2,
        title: "Execute with Guidance",
        description: "Work on practical assignments and collaborative projects supported by mentors and experts.",
        icon: Users,
        color: "from-accent to-orange-600",
    },
    {
        id: 3,
        title: "Progress with Confidence",
        description: "Showcase verified skills through dynamic profiles trusted by recruiters and institutions.",
        icon: TrendingUp,
        color: "from-emerald-600 to-emerald-500",
    },
];

export default function HowItWorksSection() {
    return (
        <SectionWrapper bgColor="gradient" spacing="default">
            <SectionHeader
                badge="How StrideNex Works"
                title="A Structured Pathway from Campus to Career"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/5 h-full text-center">
                            <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <step.icon className="w-10 h-10 text-white" />
                            </div>
                            
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                                {step.id}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                {step.title}
                            </h3>
                            
                            <p className="text-slate-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
            >
                <div className="inline-flex items-center gap-2 text-primary font-medium">
                    <CheckCircle className="w-5 h-5" />
                    <span>Industry-validated skills • Mentor-guided learning • Career-ready portfolios</span>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}