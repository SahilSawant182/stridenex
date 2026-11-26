"use client";

import React, { useState } from "react";
import {
  Award,
  CalendarClock,
  CheckCircle2,
  HelpCircle,
  History,
  Info,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import type {
  PartnerBillingSummary,
  PartnerCategoryInfo,
  TierRateItem,
} from "@/types/partnerBilling.types";
import { formatINR } from "@/services/partnerBilling.services";
import PlanHistoryDrawer from "./PlanHistoryDrawer";

interface CategoryPlanBannerProps {
  categoryInfo: PartnerCategoryInfo | null;
  summary: PartnerBillingSummary | null;
  loading?: boolean;
}

export default function CategoryPlanBanner({
  categoryInfo,
  summary,
  loading = false,
}: CategoryPlanBannerProps) {
  const [showDrawer, setShowDrawer] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 shadow-sm animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 bg-slate-200 rounded" />
          <div className="h-8 w-28 bg-slate-100 rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-28 bg-slate-100 rounded-xl" />
          <div className="h-28 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const partnerName =
    categoryInfo?.partner_name ||
    summary?.partner_name ||
    summary?.organisation ||
    "Partner";

  const categoryName =
    categoryInfo?.category_name ||
    categoryInfo?.category ||
    summary?.active_category ||
    summary?.category ||
    null;

  const hasActiveCategory =
    categoryInfo?.has_active_category === false || summary?.has_active_category === false
      ? false
      : Boolean(categoryName);

  if (!hasActiveCategory || !categoryName) {
    return (
      <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            No Billing Category Assigned
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Your partner account does not have an active category assignment yet. Once assigned by the Stridenex partnerships team, your commission plan and payout cycle will appear here.
          </p>
        </div>
      </div>
    );
  }

  const settingsObj =
    typeof categoryInfo?.billing_settings === "object"
      ? categoryInfo.billing_settings
      : categoryInfo?.settings;

  const commissionType =
    categoryInfo?.commission_type ||
    settingsObj?.commission_type ||
    summary?.commission_type ||
    "Flat Amount";

  const payoutCycle =
    categoryInfo?.payout_cycle ||
    settingsObj?.payout_cycle ||
    summary?.payout_cycle ||
    "Monthly";

  const activePlanPrice = Number(
    categoryInfo?.active_commission_plan_price ??
      summary?.active_commission_plan_price ??
      categoryInfo?.flat_reward_amount ??
      15
  );

  const currentTier = categoryInfo?.current_tier || summary?.current_tier;
  const nextTier = categoryInfo?.next_tier || summary?.next_tier;
  const referralsNeeded =
    categoryInfo?.referrals_needed_for_next_tier ??
    summary?.referrals_needed_for_next_tier;

  const isTiered =
    commissionType === "Tiered Volume" ||
    commissionType === "Tiered" ||
    Boolean(currentTier) ||
    Boolean(categoryInfo?.commission_tiers?.length);

  const isPerModule = commissionType === "Per Module";
  const isFlat = !isTiered && !isPerModule;

  // Rate text presentation
  let currentRateText = `${formatINR(activePlanPrice)} / referral`;
  if (isTiered && currentTier) {
    currentRateText = `${formatINR(activePlanPrice)} / referral (${currentTier.label || currentTier.tier_name})`;
  } else if (isFlat) {
    currentRateText = `${formatINR(activePlanPrice)} / referral (Flat Rate)`;
  } else if (isPerModule) {
    const stu = Number(categoryInfo?.student_reward_amount ?? categoryInfo?.student_commission_rate ?? 1);
    const ind = Number(categoryInfo?.industry_reward_amount ?? categoryInfo?.industry_commission_rate ?? 5);
    const men = Number(categoryInfo?.mentor_reward_amount ?? categoryInfo?.mentor_commission_rate ?? 20);
    const col = Number(categoryInfo?.college_reward_amount ?? categoryInfo?.college_commission_rate ?? 50);
    currentRateText = `Student ${formatINR(stu)} • Industry ${formatINR(ind)} • Mentor ${formatINR(men)} • College ${formatINR(col)}`;
  }

  // Tier progress math
  const totalReferrals = Number(
    categoryInfo?.total_referrals ??
      summary?.total_referrals_lifetime ??
      0
  );
  const isTopTier = isTiered && (nextTier === null || nextTier === undefined);

  let progressPercent = 100;
  if (isTiered && !isTopTier && nextTier) {
    const minForNext = nextTier.min_referrals;
    const prevMin = currentTier ? currentTier.min_referrals : 0;
    const span = Math.max(1, minForNext - prevMin);
    const done = Math.max(0, totalReferrals - prevMin);
    progressPercent = Math.min(100, Math.max(0, Math.round((done / span) * 100)));
  }

  const categoryHistory = summary?.category_history || [];

  return (
    <>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        {/* Banner Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Current Active Billing Plan &amp; Rate
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {categoryName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>View Plan &amp; Rate History</span>
            </button>
          </div>
        </div>

        {/* 2-Column Standardized Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Plan & Rate specifications */}
          <div className={`${isTiered ? "lg:col-span-6" : "lg:col-span-12"} space-y-3`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                {commissionType}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                {payoutCycle} Settlements
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current Pending Cycle Rate
              </span>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                {currentRateText}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed italic">
              Notice: This rate applies to your current unbilled referrals. Past cycles remain locked at their historical rates.
            </p>
          </div>

          {/* Right Column: Tier Progress Bar (if Tiered Volume) */}
          {isTiered && (
            <div className="lg:col-span-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50/60 to-blue-50/40 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Tier Progression: {totalReferrals} referrals</span>
                </span>
                <span className="text-indigo-700 font-bold">
                  {isTopTier ? "Max Tier Active" : `${progressPercent}%`}
                </span>
              </div>

              {/* Track */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${isTopTier ? 100 : progressPercent}%` }}
                />
              </div>

              {/* Label */}
              <div className="text-xs">
                {isTopTier ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Maximum Tier Reached
                  </span>
                ) : nextTier ? (
                  <span className="text-slate-600 font-medium">
                    <strong className="text-indigo-700 font-bold">
                      {referralsNeeded !== undefined
                        ? referralsNeeded
                        : Math.max(0, nextTier.min_referrals - totalReferrals)}
                    </strong>{" "}
                    more referrals needed to unlock{" "}
                    <strong className="text-slate-900 font-semibold">
                      {formatINR(nextTier.reward_per_referral)}/ref
                    </strong>{" "}
                    ({nextTier.tier_name})
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan History Drawer */}
      <PlanHistoryDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        categoryHistory={categoryHistory}
        partnerName={partnerName}
      />
    </>
  );
}
