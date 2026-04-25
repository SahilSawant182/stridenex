// components/dashboards/student/SkillsTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Award, FileText, Lock, Star, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { SkillRadar } from "@/components/dashboards/shared/RadarChart";
import { SummaryList } from "@/components/dashboards/shared/SummaryList";
import { CircularScore } from "@/components/dashboards/shared/CircularScore";
import { getSkillLedger, getEmployabilityScore, createStudentSkill } from "@/services/student.services";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardDynamicModal, { DynamicField } from "@/components/dashboards/shared/DashboardDynamicModal";
import { useToast } from "@/context/ToastContext";

// Types
interface RadarData {
  subject: string;
  value: number;
  fullMark: number;
}

interface SkillRow {
  id: string;
  name: string;
  category: string;
  categoryType: "Technical" | "Cognitive" | "Soft Skill";
  level: string;
  levelType: "Advanced" | "Intermediate" | "Beginner";
  evidence: number;
  endorsements: number;
  aiVerified: boolean;
  lastDemo: string;
}

// Fallback Mock Data for Radar and Table
const mockRadarData: RadarData[] = [
  { subject: 'Python', value: 90, fullMark: 100 },
  { subject: 'ML', value: 70, fullMark: 100 },
  { subject: 'SQL', value: 85, fullMark: 100 },
  { subject: 'Comm', value: 65, fullMark: 100 },
  { subject: 'Problem', value: 80, fullMark: 100 },
  { subject: 'Data Viz', value: 75, fullMark: 100 },
];

const mockSkillRows: SkillRow[] = [
  { id: '1', name: 'Python', category: 'Technical', categoryType: 'Technical', level: 'Advanced', levelType: 'Advanced', evidence: 5, endorsements: 2, aiVerified: true, lastDemo: 'Feb 14' },
  { id: '2', name: 'SQL', category: 'Technical', categoryType: 'Technical', level: 'Advanced', levelType: 'Advanced', evidence: 4, endorsements: 2, aiVerified: true, lastDemo: 'Feb 10' },
  { id: '3', name: 'Problem Solving', category: 'Cognitive', categoryType: 'Cognitive', level: 'Advanced', levelType: 'Advanced', evidence: 6, endorsements: 1, aiVerified: true, lastDemo: 'Feb 18' },
  { id: '4', name: 'Machine Learning', category: 'Technical', categoryType: 'Technical', level: 'Intermediate', levelType: 'Intermediate', evidence: 3, endorsements: 1, aiVerified: true, lastDemo: 'Jan 30' },
  { id: '5', name: 'Communication', category: 'Soft Skill', categoryType: 'Soft Skill', level: 'Intermediate', levelType: 'Intermediate', evidence: 2, endorsements: 1, aiVerified: false, lastDemo: 'Jan 20' },
];

const getCategoryStyle = (category: string) => {
  const styles: Record<string, string> = {
    Technical: "bg-slate-100 text-slate-600",
    Cognitive: "bg-purple-100 text-purple-600",
    "Soft Skill": "bg-emerald-100 text-emerald-600"
  };
  return styles[category] || styles.Technical;
};

const getLevelStyle = (level: string, type: string) => {
  if (type === 'Advanced') return "text-orange-500 font-medium text-xs";
  if (type === 'Intermediate') return "text-blue-500 font-medium text-xs";
  return "text-slate-500 font-medium text-xs";
};

export default function SkillsTabContent() {
  const [ledgerItems, setLedgerItems] = useState<any[]>([]);
  const [skillRows, setSkillRows] = useState<SkillRow[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSkillStats();
  }, []);

  const fetchSkillStats = async () => {
    try {
      setLoading(true);
      const studentEmail = localStorage.getItem("currentUser") || "";

      const [ledgerRes, scoreRes] = await Promise.all([
        getSkillLedger(studentEmail),
        getEmployabilityScore(studentEmail)
      ]);

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

        // Map skills to table rows
        if (ledgerRes.message.skills && Array.isArray(ledgerRes.message.skills)) {
          const mappedRows: SkillRow[] = ledgerRes.message.skills.map((s: any, idx: number) => ({
            id: s.name || `skill-${idx}`,
            name: s.skill || s.skill_name || "Untitled Skill",
            category: s.skill_category || "Technical",
            categoryType: (s.skill_category as any) || "Technical",
            level: s.current_level || "Beginner",
            levelType: (s.current_level as any) || "Beginner",
            evidence: s.evidence_count || 0,
            endorsements: s.endorsement_count || 0,
            aiVerified: !!s.ai_verified,
            lastDemo: s.last_demo || "-"
          }));
          setSkillRows(mappedRows);
        }
      }

      console.log(scoreRes)
      if (scoreRes?.message) {
        setOverallScore(scoreRes?.message || 0);
      }
    } catch (err) {
      console.error("Error fetching skill stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const studentEmail = localStorage.getItem("currentUser") || "";
      
      const payload = {
        student: studentEmail,
        skill: formData.skill,
        current_level: formData.current_level,
        status: "Active",
        first_acquired: new Date().toISOString().split('T')[0], // Today's date
        last_demonstrated: "",
        self_declared: 1,
        ai_verified: 0,
        is_public: 1
      };

      const response = await createStudentSkill(payload);
      
      if (response && (response.status === 200 || response.status === "200" || response.message?.name)) {
        showToast("Skill created successfully!", "success");
        setIsModalOpen(false);
        fetchSkillStats(); // Refresh ledger
      } else {
        showToast(response?.message || "Failed to create skill", "error");
      }
    } catch (err: any) {
      console.error("Error creating skill:", err);
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillFields: DynamicField[] = [
    { 
      name: "skill", 
      label: "Skill Name", 
      type: "select", 
      apiEndpoint: "method/stridenex_app.api_stridenex_app.college.master.get_master_data",
      apiParams: { doctype: "Skill" },
      placeholder: "Select a skill", 
      required: true 
    },
    { 
      name: "current_level", 
      label: "Current Level", 
      type: "select", 
      options: ["Beginner", "Intermediate", "Advanced"], 
      required: true 
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-sm font-medium italic tracking-widest uppercase opacity-70">Syncing Skill Ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skill Radar */}
        <StatsCard title="Skill Radar" className="overflow-hidden">
          <SkillRadar data={mockRadarData} />
        </StatsCard>

        {/* Ledger Summary */}
        <StatsCard title="Ledger Summary">
          <SummaryList items={ledgerItems} footer={
            <div className="flex justify-between items-center py-2">
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
        </StatsCard>

        {/* Overall Score */}
        <StatsCard title="Overall Score" className="flex flex-col items-center justify-center relative overflow-hidden group">
          <CircularScore score={overallScore} label="Overall" color="stroke-orange-500" />
          <p className="text-[11px] font-medium text-slate-500 mt-6 group-hover:text-slate-700 transition-colors">
            {overallScore > 70 ? 'Top 15% in cohort' : overallScore > 50 ? 'Above average profile' : 'Keep building your profile'}
          </p>
        </StatsCard>
      </div>

      {/* Full Skill Ledger Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Full Skill Ledger</h3>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white h-9 rounded-xl text-xs font-bold gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Skill
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Skill', 'Category', 'Level', 'Evidence', 'Endorsements', 'AI Verified', 'Last Demo'].map((header) => (
                  <th key={header} className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {skillRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No skills found in your ledger. Click "Add New Skill" to get started.
                  </td>
                </tr>
              ) : (
                skillRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-slate-800">{row.name}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${getCategoryStyle(row.categoryType)}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getLevelStyle(row.level, row.levelType)}>{row.level}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{row.evidence} items</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-slate-800">{row.endorsements}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {row.aiVerified ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[11px] font-bold">Verified</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px] px-2 py-1">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">{row.lastDemo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <DashboardDynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Skill"
        subtitle="Declare your proficiency in a new skill"
        headerIcon={Award}
        iconBgColor="bg-orange-500"
        fields={skillFields}
        onSubmit={handleCreateSkill}
        loading={isSubmitting}
      />
    </div>
  );
}