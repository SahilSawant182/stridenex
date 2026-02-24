"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Code, Users } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import TiltCard from "@/components/ui/TiltCard";

const offerings = [
    {
        id: 1,
        title: "Strategic Leadership",
        description: "Advanced decision-making frameworks for high-stakes environments.",
        icon: TrendingUp,
        color: "from-accent to-orange-600",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stats: "15+ Modules",
        features: ["Executive Coaching", "Strategy Workshops", "Leadership Assessment"],
    },
    {
        id: 2,
        title: "Tech Mastery",
        description: "Deep dives into AI, cloud architecture, and data orchestration.",
        icon: Code,
        color: "from-accent to-orange-600",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stats: "20+ Courses",
        features: ["AI & Machine Learning", "Cloud Architecture", "Data Science"],
    },
    {
        id: 3,
        title: "Cultural Dynamics",
        description: "Building resilient, inclusive, and high-performance teams.",
        icon: Users,
        color: "from-accent to-orange-600",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stats: "10+ Workshops",
        features: ["Team Building", "Diversity & Inclusion", "Change Management"],
    },
];

export default function OfferingsSection() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <SectionWrapper bgColor="gradient" spacing="wide">
            <SectionHeader
                badge="The Curriculum"
                title="Curated for the Modern Executive"
                subtitle="Specialized programs designed to transform your leadership capabilities"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {offerings.map((offering, index) => (
                    <motion.div
                        key={offering.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        onHoverStart={() => setHoveredId(offering.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        className="relative group"
                    >
                        <TiltCard className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary/10 h-full">
                            <div className="relative h-48 overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-r ${offering.color} opacity-90 mix-blend-overlay z-10`} />
                                <img
                                    src={offering.image}
                                    alt={offering.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                                        {offering.stats}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${offering.color} flex items-center justify-center mb-6 transform -translate-y-10 shadow-lg`}>
                                    <offering.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-3">
                                    {offering.title}
                                </h3>
                                <p className="text-slate-600 mb-6">
                                    {offering.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {offering.features.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-3 text-sm"
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${offering.color}`} />
                                            {feature}
                                        </motion.li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/offerings/${offering.id}`}
                                    className="inline-flex items-center gap-2 text-accent font-bold group/link"
                                >
                                    <span className="text-xs text-accent group-hover:text-orange-600 transition-colors">
                                        → Learn more
                                    </span>
                                </Link>
                            </div>
                        </TiltCard>

                        {/* Glow Effect on Hover */}
                        {hoveredId === offering.id && (
                            <motion.div
                                layoutId="glow"
                                className={`absolute -inset-2 bg-gradient-to-r ${offering.color} rounded-3xl -z-10 blur-xl opacity-50`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mt-16"
            >
                <Link
                    href="/offerings"
                    className="group inline-flex items-center gap-2 font-bold text-accent hover:text-orange-600 transition-colors"
                >
                    Explore All Paths
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
            </motion.div>
        </SectionWrapper>
    );
}