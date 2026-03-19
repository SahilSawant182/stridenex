"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function FinalCTASection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="py-24 px-6 bg-gradient-to-br from-primary via-purple-600 to-accent relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Floating elements */}
            {mounted && [...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 60 + 20,
                        height: Math.random() * 60 + 20,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: Math.random() * 6 + 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                        Your Future Should Not Be <br />
                        <span className="text-white/90">Left to Chance</span>
                    </h2>
                    
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Discover your strengths, develop real capabilities, and move confidently toward your chosen future.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            size="xl"
                            className="bg-white text-primary hover:bg-white/90 btn-hover-scale shadow-2xl"
                        >
                            Start as Student
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        
                        <Button
                            size="xl"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 btn-hover-scale"
                        >
                            Partner as Institute
                        </Button>
                        
                        <Button
                            size="xl"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 btn-hover-scale"
                        >
                            Hire Skilled Talent
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}