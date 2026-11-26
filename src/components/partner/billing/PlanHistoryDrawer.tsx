"use client";

import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  History,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import type { PartnerCategoryHistoryItem } from "@/types/partnerBilling.types";

interface PlanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryHistory: PartnerCategoryHistoryItem[];
  partnerName?: string;
}

export default function PlanHistoryDrawer({
  isOpen,
  onClose,
  categoryHistory = [],
  partnerName = "Partner",
}: PlanHistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Plan &amp; Rate History
                </h3>
                <p className="text-xs text-slate-500">
                  Assignment lifecycle for {partnerName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              Stridenex records every partner category transition. Referrals registered during each specific period are locked and settled under that plan&apos;s commission structure.
            </div>

            {categoryHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">
                  No previous plan transitions
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  You are currently on your original assigned plan.
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8 my-4">
                {categoryHistory.map((item, index) => {
                  const isActive =
                    item.status === "Active" || !item.effective_to;
                  return (
                    <div key={item.name || index} className="relative group">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                          isActive
                            ? "bg-emerald-500 ring-4 ring-emerald-100"
                            : "bg-slate-300"
                        }`}
                      />

                      {/* Card */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          isActive
                            ? "bg-emerald-50/40 border-emerald-200 shadow-sm"
                            : "bg-slate-50/70 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isActive
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Current Active
                              </>
                            ) : (
                              "Expired / Historical"
                            )}
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.name}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">
                          {item.category}
                        </h4>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-semibold">{item.commission_type}</span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {item.effective_from} to{" "}
                            {item.effective_to || "Present"}
                          </span>
                        </div>

                        <p className="mt-2 text-[11px] text-slate-500 italic">
                          Referrals registered during this period were calculated under this plan.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
