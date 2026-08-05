// components/dashboards/widgets/SkillsWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Award, FileText, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { SummaryList } from "@/components/dashboards/shared/SummaryList";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSkillLedger } from "@/services/student.services";

export default function SkillsWidget() {
  const router = useRouter();
  const [ledgerItems, setLedgerItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillStats = async () => {
      try {
        setLoading(true);
        const studentEmail = localStorage.getItem("currentUser") || "";
        if (!studentEmail) return;

        const ledgerRes = await getSkillLedger(studentEmail);
        if (ledgerRes?.message) {
          const summary = ledgerRes.message.summary || {};
          const ledger = [
            { label: 'Total Skills', value: summary.total_skills || 0, icon: <span>🎯</span>, bgColor: 'bg-red-50', textColor: 'text-red-500' },
            { label: 'AI Verified', value: summary.ai_verified || 0, icon: <span>🤖</span>, bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
            { label: 'Mentor Endorsed', value: summary.mentor_endorsed || 0, icon: <Award className="w-3 h-3" />, bgColor: 'bg-amber-50', textColor: 'text-amber-500' },
            { label: 'Industry Endorsed', value: summary.industry_endorsed || 0, icon: <span>🏭</span>, bgColor: 'bg-purple-50', textColor: 'text-purple-500' },
            { label: 'Evidence Items', value: summary.evidence_items || 0, icon: <FileText className="w-3 h-3" />, bgColor: 'bg-slate-100', textColor: 'text-slate-500' },
          ];
          setLedgerItems(ledger);
        }
      } catch (err) {
        console.error("Error fetching skill stats in widget:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillStats();
  }, []);

  const navigateToLedger = () => {
    router.push("/student/dashboard/skills");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 h-full min-h-[350px] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Skill Ledger...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-slate-200/60 p-6 h-full flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[350px]"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 shrink-0">
        <h3 className="text-[15px] font-bold text-slate-900">Ledger Summary</h3>
        <button 
          onClick={navigateToLedger}
          className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
        >
          Full Ledger <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <SummaryList items={ledgerItems} footer={
          <div className="flex justify-between items-center py-2 mt-auto border-t border-slate-50">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-5 h-5 flex items-center justify-center text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              Ledger Integrity
            </div>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified
            </span>
          </div>
        } />
      </div>
    </motion.div>
  );
}