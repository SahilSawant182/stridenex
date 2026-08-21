"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Briefcase, ArrowRight, ArrowLeft, Home } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alternateText: string;
  alternateLinkText: string;
  alternateLinkHref: string;
  showSocial?: boolean;
  appName?: string;
  bgImage?: string | null;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  alternateText,
  alternateLinkText,
  alternateLinkHref,
  showSocial = true,
  appName = "StrideNex",
  bgImage
}: AuthLayoutProps) {
  const backgroundImage = bgImage || "/images/login-page-background.png";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy to-royal">
      {/* Animated Background Elements */}
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

      <div className="flex w-full h-screen bg-white overflow-hidden shadow-2xl relative z-10">
        {/* LEFT SIDE - Branding - Fixed, no scroll */}
        <div className="hidden lg:flex lg:w-[30%] relative flex-col justify-between p-10 overflow-hidden bg-slate-950 text-white">
          {/* Background Image */}
          {backgroundImage && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/90 z-10" />
              <img
                src={backgroundImage}
                alt="StrideNex Platform"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                loading="lazy"
              />
            </>
          )}

          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>

          {/* Content - Fixed height, no scroll needed */}
          <div className="relative z-20">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-3">
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

            {/* Stats */}
            <div className="flex justify-between items-center w-full gap-4 mt-16 text-center">
              <div className="flex-1">
                <p className="text-3xl font-extrabold text-white">10k+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mt-1">Active Students</p>
              </div>
              <div className="flex-1 border-x border-white/10 px-2">
                <p className="text-3xl font-extrabold text-white">500+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mt-1">Institutes</p>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-extrabold text-white">200+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mt-1">Partners</p>
              </div>
            </div>
          </div>

          {/* Role Icons - Aligned down, centered and spaced between */}
          <div className="relative z-20 w-full flex justify-between items-center gap-4 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 mt-10">
            <div className="flex flex-col items-center justify-center flex-1 py-1 text-center border-r border-white/10">
              <GraduationCap className="w-5 h-5 mb-1 text-orange-400" />
              <span className="text-xs font-bold tracking-wide">Students</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 py-1 text-center border-r border-white/10">
              <Building2 className="w-5 h-5 mb-1 text-blue-400" />
              <span className="text-xs font-bold tracking-wide">Institutes</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 py-1 text-center">
              <Briefcase className="w-5 h-5 mb-1 text-emerald-400" />
              <span className="text-xs font-bold tracking-wide">Industry</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form - Scrollable */}
        <div className="w-full lg:w-[70%] overflow-y-auto relative bg-white">

          <Link
            href="/"
            className="absolute top-6 right-6 lg:top-8 lg:right-10 z-50 flex items-center justify-center w-10 h-10 text-white bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all rounded-full shadow-lg"
            aria-label="Go to home page"
          >
            <Home className="w-4 h-4" />
          </Link>

          <div className="flex flex-col justify-center items-center px-6 py-16 md:px-16 lg:px-24 min-h-full">
            <div className="w-full max-w-[600px]">

              {/* Mobile Branding */}
              <div className="lg:hidden flex items-center gap-4 mb-10">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src="/images/circularLogo.jpg"
                    alt="Skill Bridge Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-navy">{appName}</h2>
                  <p className="text-sm text-slate-500">Pathways to Your Future</p>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-navy mb-2">{title}</h3>
                <p className="text-slate-500">{subtitle}</p>
              </div>

              {/* Form Content */}
              {children}

              {/* Divider */}
              {showSocial && (
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>
              )}

              {/* Social Icons */}
              {showSocial && (
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-purple-600 hover:text-white transition-all text-slate-600 group">
                    <span className="text-sm font-medium">G</span>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-accent hover:to-orange-600 hover:text-white transition-all text-slate-600 group">
                    <span className="text-sm font-medium">f</span>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-500 hover:text-white transition-all text-slate-600 group">
                    <span className="text-sm font-medium">in</span>
                  </button>
                </div>
              )}

              {/* Alternate Link */}
              <p className="mt-6 text-center text-sm text-slate-500">
                {alternateText}{" "}
                <Link
                  href={alternateLinkHref}
                  className="font-semibold text-accent hover:text-orange-600 transition-colors"
                >
                  {alternateLinkText}
                  <ArrowRight className="inline-block w-3 h-3 ml-1" />
                </Link>
              </p>

              {/* Footer Links */}
              <div className="mt-6 flex justify-center gap-4 text-xs text-slate-400">
                <Link href="/privacy" className="hover:text-slate-600 transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-slate-600 transition-colors">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/help" className="hover:text-slate-600 transition-colors">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}