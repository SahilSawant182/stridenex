"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Briefcase } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onSkip?: () => void;
  showSkip?: boolean;
  appName?: string;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onSkip,
  showSkip = true,
  appName = "StrideNex"
}: OnboardingLayoutProps) {

  const getStepCompletion = () => {
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 33;
    if (currentStep === 3) return 67;
    return 0;
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex lg:w-[30%] h-full relative bg-gradient-to-br from-navy to-royal overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          {/* Floating Orbs */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-accent/20 to-orange-600/20 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-between p-10 text-white">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center p-3">
                <img
                  src="/images/circularLogo.jpg"
                  alt="Skill Bridge Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{appName}</h1>
                <p className="text-xs text-white/70 mt-1">Pathways to Your Future</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-6">
                Bridge Your Learning to <span className="text-gradient-orange">Real Industry Success</span>
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                One platform connecting Students, Institutes, and Industry to create measurable career outcomes through structured development and real-world exposure.
              </p>
            </div>
          </div>

          {/* Stats and Roles */}
          <div>
            {/* Stats */}
            <div className="flex gap-4 mb-8">
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Active Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Institutes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Partners</p>
              </div>
            </div>

            {/* Role Icons */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs">Students</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Building2 className="w-4 h-4" />
                <span className="text-xs">Institutes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs">Industry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-[70%] h-full bg-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center px-8 lg:px-16 py-12">
          <div className="w-full max-w-[850px]">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-100">
                <img
                  src="/images/circularLogo.jpg"
                  alt="Skill Bridge Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">{appName}</h2>
                <p className="text-xs text-slate-500">Pathways to Your Future</p>
              </div>
            </div>

            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                  STEP {currentStep} OF {totalSteps}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Profile Completion: {getStepCompletion()}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${getStepCompletion()}%` }}
                />
              </div>
            </div>

            {/* Form Heading */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-navy mb-2">{title}</h3>
              <p className="text-slate-500">{description}</p>
            </div>

            {/* Content */}
            {children}

            {/* Skip Option */}
            {showSkip && onSkip && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-sm text-slate-500 hover:text-accent transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
              {/* <Link href="/privacy" className="hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-600 transition-colors">
                Terms of Service
              </Link>
              <span>•</span> */}
              <Link href="/help" className="hover:text-slate-600 transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}