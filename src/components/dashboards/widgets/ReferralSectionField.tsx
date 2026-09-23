// components/dashboards/widgets/ReferralSectionField.tsx
"use client";

import { useState } from "react";
import ReferralPerformanceWidget from "@/components/dashboards/widgets/ReferralPerformanceWidget";

interface Props {
  role: "student" | "mentor" | "college" | "industry" | "partner";
  referralCode: string;
}

export default function ReferralSectionField({ role, referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  if (!referralCode) return null;

  return (
    <div className="flex flex-col w-full gap-4 mt-2">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm p-5">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                🎁 Refer &amp; Earn
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {role === "student"
                ? "Bring your squad in! 🔥"
                : role === "mentor"
                ? "Grow your network! 🌐"
                : role === "college"
                ? "Level up your network! 🎓"
                : "Expand your talent network! 🚀"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Share your code with anyone. For every referral that joins, earn{" "}
              <span className="font-bold text-emerald-600">500 Points</span>!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
              <span className="text-lg font-black text-emerald-600 tracking-widest font-mono">
                {referralCode}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`flex items-center justify-center h-10 px-3 rounded-lg transition-all ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
              title="Copy Code"
            >
              {copied ? (
                <span className="text-xs font-bold">Copied!</span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <ReferralPerformanceWidget referralCode={referralCode} role={role} />
    </div>
  );
}

