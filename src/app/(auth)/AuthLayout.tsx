"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Briefcase, ArrowRight } from "lucide-react";

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

      <div className="flex w-full min-h-screen bg-white overflow-hidden shadow-2xl relative z-10">
        {/* LEFT SIDE - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-navy to-royal text-white">
          {/* Background Image */}
          {bgImage && (
            <>
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={bgImage}
                alt="StrideNex Platform"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="lazy"
              />
            </>
          )}

          <div className="absolute inset-0 bg-black/20 z-10" />

          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>

          {/* Content */}
          <div className="relative z-20">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center p-3">
                <img
                  src="/images/Social Media Logo Icon 1 A2.jpg"
                  alt="Skill Bridge Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{appName}</h1>
                <p className="text-sm text-white/70 mt-1">Pathways to Your Future</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Bridge Your Learning to <span className="text-gradient-orange">Real Industry Success</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                One platform connecting Students, Institutes, and Industry to create measurable career outcomes through structured development and real-world exposure.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-sm text-white/70">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-white/70">Partner Institutes</p>
              </div>
              <div>
                <p className="text-3xl font-bold">200+</p>
                <p className="text-sm text-white/70">Industry Partners</p>
              </div>
            </div>

            {/* Role Icons */}
            <div className="flex gap-4 mt-12">
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

        {/* RIGHT SIDE - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24">
          <div className="w-full max-w-[440px]">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="bg-gradient-mixed p-2 rounded-lg">
                <div className="w-6 h-6 bg-white rounded-sm" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">{appName}</h2>
                <p className="text-xs text-slate-500">Pathways to Your Future</p>
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
  );
}