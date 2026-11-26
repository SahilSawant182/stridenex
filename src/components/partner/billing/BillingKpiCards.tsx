"use client";

import React from "react";
import {
  AlertCircle,
  Building2,
  Clock,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type {
  PartnerBillingSummary,
  PartnerCategoryInfo,
} from "@/types/partnerBilling.types";
import { formatINR } from "@/services/partnerBilling.services";

interface BillingKpiCardsProps {
  summary: PartnerBillingSummary | null;
  categoryInfo: PartnerCategoryInfo | null;
  loading?: boolean;
}

export default function BillingKpiCards({
  summary,
  categoryInfo,
  loading = false,
}: BillingKpiCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="bg-white/90 rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 bg-slate-200 rounded" />
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            <div className="h-3.5 w-44 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // 1. Lifetime Total Earnings
  const totalEarnedLifetime = Number(
    summary?.total_earned_lifetime ??
      summary?.total_earned ??
      summary?.total_paid ??
      0
  );

  // 2. Total Paid / Disbursed
  const totalPaidAmount = Number(
    summary?.total_paid_amount ??
      summary?.total_paid ??
      0
  );

  // 3. Upcoming / Pending Payout = pending_payout_amount + approved_payout_amount
  const pendingPayoutAmount = Number(
    summary?.pending_payout_amount ?? summary?.pending_payout ?? 0
  );
  const approvedPayoutAmount = Number(summary?.approved_payout_amount ?? 0);
  const upcomingPayoutTotal = pendingPayoutAmount + approvedPayoutAmount;

  // 4. Total Referrals
  const lifetimeReferrals = Number(
    summary?.total_referrals_lifetime ??
      summary?.lifetime_referrals ??
      summary?.total_referrals ??
      categoryInfo?.total_referrals ??
      0
  );

  const thisMonthReferrals = Number(
    summary?.total_referrals_this_month ??
      summary?.current_month_referrals ??
      summary?.month_referrals ??
      0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Lifetime Total Earnings */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Lifetime Total Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(totalEarnedLifetime)}
          </div>
        </div>
        <div className="mt-3 text-xs font-medium text-slate-500">
          Total earnings across all historical cycles &amp; current pending
        </div>
      </div>

      {/* 2. Total Paid / Disbursed */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Paid / Disbursed
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
            {formatINR(totalPaidAmount)}
          </div>
        </div>
        <div className="mt-3 text-xs font-medium text-emerald-700 flex items-center gap-1">
          Cash transferred to bank
        </div>
      </div>

      {/* 3. Upcoming / Pending Payout */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Upcoming / Pending Payout
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(upcomingPayoutTotal)}
          </div>
        </div>
        <div className="mt-3 text-xs font-medium text-slate-500">
          Will be processed in next payout cycle
        </div>
      </div>

      {/* 4. Total Referrals */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Referrals
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lifetimeReferrals.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="mt-3 text-xs font-medium text-slate-500">
          <strong className="text-indigo-600 font-bold">{thisMonthReferrals}</strong> new in current cycle
        </div>
      </div>
    </div>
  );
}
