// components/dashboards/shared/ReportQuestionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { reportQuestion } from "@/services/student.services";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ReportQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The unique question_bank_id from the API response */
  questionBankId: string;
  /** Called after a successful (or already-reported) submission so the parent
   *  can disable the flag button for this question. */
  onReported: (questionBankId: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const REASON_OPTIONS = [
  { value: "wrong_answer",       label: "The correct answer is wrong" },
  { value: "unclear_question",   label: "Question is confusing or unclear" },
  { value: "outdated_content",   label: "Content is outdated" },
  { value: "duplicate_question", label: "I've seen this question before" },
  { value: "other",              label: "Other issue" },
] as const;

type ReasonValue = (typeof REASON_OPTIONS)[number]["value"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReportQuestionModal({
  isOpen,
  onClose,
  questionBankId,
  onReported,
}: ReportQuestionModalProps) {
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState<ReasonValue | "">("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  // Portal mount guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form state whenever the modal opens for a (potentially different) question
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setDetails("");
      setReasonError(false);
    }
  }, [isOpen, questionBankId]);

  const handleSubmit = async () => {
    if (!reason) {
      setReasonError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await reportQuestion({
        question_bank_id: questionBankId,
        reason,
        details: details.trim() || "",
      });

      const status = response?.message?.status;

      if (status === "reported") {
        showToast("Thanks! We'll review this question.", "success");
        onReported(questionBankId);
        onClose();
      } else if (status === "already_reported") {
        showToast("You've already reported this question.", "info");
        onReported(questionBankId); // still disable the button
        onClose();
      } else {
        showToast("Failed to submit report. Please try again.", "error");
        onClose();
      }
    } catch {
      showToast("Failed to submit report. Please try again.", "error");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                  <Flag className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Report This Question
                  </h2>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Help us improve question quality
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
                aria-label="Close report modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-5 space-y-5">
              {/* Reason dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  What is the issue?{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value as ReasonValue);
                      setReasonError(false);
                    }}
                    className={`w-full appearance-none px-4 py-3 rounded-xl border text-sm font-semibold text-slate-700 bg-white outline-none transition-all pr-10 cursor-pointer ${
                      reasonError
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    }`}
                  >
                    <option value="" disabled>
                      Select a reason...
                    </option>
                    {REASON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {reasonError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    Please select a reason before submitting.
                  </p>
                )}
              </div>

              {/* Details textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Additional details{" "}
                  <span className="text-slate-400 font-medium normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setDetails(e.target.value);
                    }
                  }}
                  placeholder="Describe the issue in more detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-semibold text-sm text-slate-800 resize-none outline-none placeholder:text-slate-300 placeholder:font-normal"
                />
                <p className="text-right text-[10px] font-semibold text-slate-400">
                  {details.length} / 500
                </p>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 px-5 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
