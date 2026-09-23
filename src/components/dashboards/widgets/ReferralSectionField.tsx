// components/dashboards/widgets/ReferralSectionField.tsx
"use client";

import { useState, useEffect } from "react";
import ReferralPerformanceWidget from "@/components/dashboards/widgets/ReferralPerformanceWidget";
import { getReferenceCard } from "@/services/api.services";
import { Copy, Download, CheckCircle2 } from "lucide-react";

interface Props {
  role: "student" | "mentor" | "college" | "industry" | "partner";
  referralCode: string;
  showPerformance?: boolean;
}

export default function ReferralSectionField({ role, referralCode, showPerformance = true }: Props) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [refCardUrl, setRefCardUrl] = useState<string | null>(null);

  useEffect(() => {
    if (referralCode) {
      getReferenceCard({ reference_code: referralCode, module: role })
        .then((res: any) => {
          if (res?.message?.data?.image_url) {
            setRefCardUrl(res.message.data.image_url);
          }
        })
        .catch(err => console.error("Failed to load reference card", err));
    }
  }, [referralCode, role]);

  if (!referralCode) return null;

  return (
    <div className="flex flex-col w-full gap-4 mt-2">
      {/* Referral Card Display */}
      {refCardUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm p-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg">
            <img src={refCardUrl} alt="Referral Card" className="w-full h-auto rounded-xl border border-slate-100 shadow-sm" />
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(referralCode);
                  setCopiedCard(true);
                  setTimeout(() => setCopiedCard(false), 2000);
                } catch (err) {
                  console.error("Failed to copy code", err);
                }
              }}
              className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm border ${
                copiedCard 
                  ? "bg-emerald-500 text-white border-emerald-600" 
                  : "bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 border-slate-200"
              }`}
              title="Copy Code"
            >
              {copiedCard ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showPerformance && (
        <ReferralPerformanceWidget referralCode={referralCode} role={role} />
      )}
    </div>
  );
}

