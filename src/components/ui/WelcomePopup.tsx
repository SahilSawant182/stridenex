"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "./button";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  userType?: "student" | "institute" | "industry" | null;
}

export default function WelcomePopup({ 
  isOpen, 
  onClose, 
  userName, 
  userEmail,
}: WelcomePopupProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get first name
  const firstName = userName.split(' ')[0] || userName;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />
          
          {/* Popup - Clean design with orange gradient header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[1000]"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Orange Gradient Header */}
              <div className="bg-gradient-to-r from-accent to-orange-400 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">
                    Welcome, {firstName}!
                  </h2>
                  {userEmail && (
                    <p className="text-sm text-white/80 mt-1">{userEmail}</p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Message */}
                <div className="mb-6">
                  <p className="text-slate-700">
                    Ready to bridge your learning to career success?
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span className="text-sm text-slate-600">Explore industry-aligned skill pathways</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span className="text-sm text-slate-600">Connect with mentors and experts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span className="text-sm text-slate-600">Track your career readiness score</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-navy">10k+</div>
                    <div className="text-xs text-slate-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-navy">500+</div>
                    <div className="text-xs text-slate-500">Institutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-navy">200+</div>
                    <div className="text-xs text-slate-500">Partners</div>
                  </div>
                </div>

                {/* Single button */}
                <Button
                  variant="accent"
                  className="w-full py-3 text-base font-semibold"
                  onClick={onClose}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}