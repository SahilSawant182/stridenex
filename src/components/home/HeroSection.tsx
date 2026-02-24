"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
    appName?: string;
}

const heroSlides = [
    {
        id: 1,
        microTagline: "Discover Your Direction. Build Real Skills. Achieve Real Careers.",
        title: "Bridge Your Learning to",
        subtitle: "Real Industry Success",
        description: "StrideNex helps students move beyond degrees and certifications by identifying their real interests, building practical skills, and guiding them toward careers, entrepreneurship, or higher education pathways — all aligned with industry expectations.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stat: "10k+",
        statLabel: "Active Students",
        gradient: "from-blue-600 to-purple-600",
        icon: "🚀",
    },
    {
        id: 2,
        microTagline: "Industry-Aligned Learning. Real-World Results.",
        title: "Transform Your Future with",
        subtitle: "Real-World Skills",
        description: "Join thousands of students who have accelerated their careers through our industry-connected programs, mentorship, and practical project experience.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        stat: "500+",
        statLabel: "Partner Institutes",
        gradient: "from-purple-600 to-pink-600",
        icon: "⚡",
    },
    {
        id: 3,
        microTagline: "From Learning to Earning. Faster.",
        title: "Launch Your Career with",
        subtitle: "Industry Connections",
        description: "Connect directly with industry partners, work on real projects, and build a portfolio that employers trust. Your journey to career success starts here.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
        stat: "200+",
        statLabel: "Industry Partners",
        gradient: "from-orange-500 to-red-500",
        icon: "🔥",
    },
];

export default function HeroSection({ appName }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const slide = heroSlides[currentSlide];

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #0f0fbd 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                    transition: 'transform 0.2s ease-out',
                }} />
            </div>

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    x: mousePosition.x * 50,
                    y: mousePosition.y * 50,
                }}
                transition={{ type: "spring", stiffness: 50 }}
                className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: mousePosition.x * -50,
                    y: mousePosition.y * -50,
                }}
                transition={{ type: "spring", stiffness: 50 }}
                className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
            />

            {/* Carousel Controls */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:scale-110 transition-all shadow-lg"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary hover:scale-110 transition-all shadow-lg"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-30 flex gap-3">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative"
                    >
                        <span className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? "w-12 bg-primary"
                                : "bg-primary/30 group-hover:bg-primary/50"
                        }`} />
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-20 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        {/* Left Content */}
                        <div className="z-10">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8"
                            >
                                <Sparkles className="w-4 h-4" />
                                {slide.microTagline}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-6xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-black"
                            >
                                {slide.title}
                                <br />
                                {slide.subtitle}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-slate-600 max-w-xl leading-relaxed mb-8"
                            >
                                {slide.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Button
                                    variant="accent"
                                    size="xl"
                                    className="btn-hover-scale btn-hover-glow"
                                >
                                    Start Your Career Journey
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="btn-hover-scale"
                                >
                                    Partner as Institute
                                </Button>

                                <Button
                                    variant="outline"
                                    size="xl"
                                    className="btn-hover-scale"
                                >
                                    Access Skilled Talent
                                </Button>
                            </motion.div>

                            {/* Core Promise */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10"
                            >
                                <p className="text-sm text-slate-700 font-medium">
                                    <span className="font-bold text-primary">One platform</span> connecting Students, Institutes, and Industry to create measurable career outcomes through structured development and real-world exposure.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Image with 3D Effect */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="relative"
                            style={{
                                transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${mousePosition.y * -10}deg)`,
                                transition: 'transform 0.1s ease-out',
                            }}
                        >
                            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    alt="Students collaborating"
                                    className="w-full h-full object-cover"
                                    src={slide.image}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient} opacity-20 mix-blend-overlay`}></div>
                            </div>

                            {/* Floating Stats Cards */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -top-6 -right-6 bg-white p-5 rounded-xl shadow-2xl border border-primary/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-mixed flex items-center justify-center text-white text-xl">
                                        {slide.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">{slide.stat}</div>
                                        <div className="text-xs text-slate-500">{slide.statLabel}</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1,
                                }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-2xl border border-primary/10"
                            >
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-bold text-slate-900">Industry-Aligned</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}