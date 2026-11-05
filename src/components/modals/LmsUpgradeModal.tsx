"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LmsUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}

export default function LmsUpgradeModal({ isOpen, onClose, role }: LmsUpgradeModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleUpgradeClick = () => {
    onClose();
    if (role === "college") {
      router.push("/college/dashboard/plans");
    } else if (role === "industry") {
      router.push("/industry/dashboard/plans");
    } else {
      router.push("/billing/pricing");
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Graphic */}
            <div className="pt-8 px-6 pb-2 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pro Feature</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Unlock LMS Studio with Pro
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">
                Course authoring, batch management, quizzes, and certificates are available on our Pro plan.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="px-6 py-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                {[
                  "Complete course creation & curriculum authoring",
                  "Cohort, batch & live session scheduling",
                  "Interactive quizzes, assignments & coding tests",
                  "Automated certificate generation & grading",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleUpgradeClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md shadow-blue-500/20 text-sm"
              >
                <span>Upgrade Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

