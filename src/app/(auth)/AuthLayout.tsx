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
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                      <path d="M16.671 15.542l.532-3.469h-3.328V9.82c0-.949.465-1.874 1.956-1.874h1.514V5.008s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.633H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z" fill="#ffffff"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                    </svg>
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