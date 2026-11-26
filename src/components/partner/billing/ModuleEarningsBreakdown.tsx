"use client";

import React from "react";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";
import type {
  ModuleEarningItem,
  PartnerCategoryInfo,
} from "@/types/partnerBilling.types";
import { formatINR } from "@/services/partnerBilling.services";

interface ModuleEarningsBreakdownProps {
  items: ModuleEarningItem[];
  categoryInfo?: PartnerCategoryInfo | null;
  loading?: boolean;
}

const MODULE_CARD_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgIcon: string;
    border: string;
  }
> = {
  Student: {
    icon: GraduationCap,
    accentColor: "text-blue-600",
    bgIcon: "bg-blue-50 text-blue-600",
    border: "border-slate-200/90 hover:border-blue-300",
  },
  Industry: {
    icon: Briefcase,
    accentColor: "text-emerald-600",
    bgIcon: "bg-emerald-50 text-emerald-600",
    border: "border-slate-200/90 hover:border-emerald-300",
  },
  Mentor: {
    icon: Users,
    accentColor: "text-amber-600",
    bgIcon: "bg-amber-50 text-amber-600",
    border: "border-slate-200/90 hover:border-amber-300",
  },
  College: {
    icon: Building2,
    accentColor: "text-purple-600",
    bgIcon: "bg-purple-50 text-purple-600",
    border: "border-slate-200/90 hover:border-purple-300",
  },
};

export default function ModuleEarningsBreakdown({
  items,
  loading = false,
}: ModuleEarningsBreakdownProps) {
  if (loading) {
    return (
      <div className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-5 w-56 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Exact order required: Student, Industry, Mentor, College
  const standardModules = ["Student", "Industry", "Mentor", "College"];

  const itemsMap = new Map<string, ModuleEarningItem>();
  for (const item of items) {
    itemsMap.set(item.module, item);
  }

  const normalizedItems: ModuleEarningItem[] = standardModules.map((m) => {
    const existing = itemsMap.get(m);
    return {
      module: m,
      referral_count: existing?.referral_count ?? existing?.count ?? 0,
      earned_amount: existing?.earned_amount ?? 0,
    };
  });

  const totalReferrals = normalizedItems.reduce((acc, i) => acc + i.referral_count, 0);
  const totalEarnings = normalizedItems.reduce((acc, i) => acc + i.earned_amount, 0);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Cumulative Module Earnings Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lifetime referrals and cumulative earnings aggregated across all historical and current rates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            Total Referrals:{" "}
            <strong className="text-slate-900 font-bold">
              {totalReferrals.toLocaleString("en-IN")}
            </strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            Cumulative Earned:{" "}
            <strong className="text-slate-900 font-bold">
              {formatINR(totalEarnings)}
            </strong>
          </span>
        </div>
      </div>

      {/* 4 Standard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {normalizedItems.map((item) => {
          const cfg = MODULE_CARD_CONFIG[item.module] || MODULE_CARD_CONFIG.Student;
          const Icon = cfg.icon;

          return (
            <div
              key={item.module}
              className={`p-5 rounded-2xl border ${cfg.border} bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl ${cfg.bgIcon} flex items-center justify-center border border-slate-100`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.module}
                      </h4>
                      <span className="text-[11px] text-slate-400">Vertical</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Cumulative Referrals:
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.referral_count.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Total Module Earnings:
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatINR(item.earned_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 italic block">
                  Includes all historical settlements + current pending
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
