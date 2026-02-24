"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Clock } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const stats = [
    { value: 85, suffix: "%", label: "Faster transition to employment", icon: TrendingUp, color: "from-accent to-orange-600" },
    { value: 92, suffix: "%", label: "Increased student confidence", icon: Users, color: "from-primary to-purple-600" },
    { value: 3, suffix: "x", label: "Stronger placement outcomes", icon: Award, color: "from-emerald-600 to-emerald-500" },
    { value: 40, suffix: "%", label: "Reduced hiring risk", icon: Clock, color: "from-accent to-orange-600" },
];

function Counter({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;

        let start = 0;
        const increment = end / (duration / 16);
        let timer: NodeJS.Timeout;

        const updateCount = () => {
            start += increment;
            if (start < end) {
                setCount(Math.floor(start));
                timer = setTimeout(updateCount, 16);
            } else {
                setCount(end);
            }
        };

        updateCount();

        return () => clearTimeout(timer);
    }, [end, duration, inView]);

    return (
        <span ref={ref} className="text-4xl md:text-5xl font-black text-white">
            {count}{suffix}
        </span>
    );
}

export default function ImpactSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-accent">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Floating Bubbles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 80 + 30,
                        height: Math.random() * 80 + 30,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, Math.random() * 15 - 7.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <SectionHeader
                    badge="Impact & Outcomes"
                    title="Creating Measurable Career Transformation"
                    badgeColor="white"
                    titleClassName="text-white"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all`}
                            >
                                <stat.icon className="w-8 h-8 text-white" />
                            </motion.div>
                            <Counter end={stat.value} suffix={stat.suffix} />
                            <div className="text-white/80 text-sm font-medium mt-2">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}