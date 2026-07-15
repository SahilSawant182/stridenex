// components/dashboards/student/SkillsTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Award, FileText, Lock, Star, Loader2, Clock, Globe } from "lucide-react";
import { StatsCard } from "@/components/dashboards/shared/StatsCard";
import { SkillRadar } from "@/components/dashboards/shared/RadarChart";
import { SummaryList } from "@/components/dashboards/shared/SummaryList";
import { CircularScore } from "@/components/dashboards/shared/CircularScore";
import { getSkillLedger, getEmployabilityScore, createStudentSkill, addSkillEvidence, getSkillTestQuestions, submitSkillTest } from "@/services/student.services";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ChevronRight, AlertCircle, Sparkles, X } from "lucide-react";
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
  const [selectedSkill, setSelectedSkill] = useState<SkillRow | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const { showToast } = useToast();

  // Skill Verification States
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testSessionId, setTestSessionId] = useState<string>("");
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [testSkill, setTestSkill] = useState<string>("");
  const [testLevel, setTestLevel] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

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

  const handleVerifySkillDirect = async (skillName: string, level: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const studentEmail = localStorage.getItem("currentUser") || "";
      if (!studentEmail) {
        showToast("Session expired, please login again", "error");
        return;
      }

      const response = await getSkillTestQuestions(studentEmail, skillName, level);
      const data = response?.message || response?.data || response;

      if (data && data.questions && data.questions.length > 0) {
        setTestQuestions(data.questions);
        setTestSessionId(data.session_id);
        setTestSkill(skillName);
        setTestLevel(level);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setTestResult(null);

        // Close Add New Skill modal if open
        setIsModalOpen(false);
        // Open Test modal
        setIsTestModalOpen(true);
        showToast("Skill test questions loaded successfully!", "success");
      } else {
        showToast("No test questions available for this skill and level.", "error");
      }
    } catch (err: any) {
      console.error("Error fetching skill questions:", err);
      showToast(err?.message || "Failed to load skill test questions", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSkill = async (formData: any) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const studentEmail = localStorage.getItem("currentUser") || "";
      if (!studentEmail) {
        showToast("Session expired, please login again", "error");
        return;
      }

      // Fetch questions from getSkillTestQuestions
      const response = await getSkillTestQuestions(studentEmail, formData.skill, formData.current_level);
      const data = response?.message || response?.data || response;

      if (data && data.questions && data.questions.length > 0) {
        setTestQuestions(data.questions);
        setTestSessionId(data.session_id);
        setTestSkill(formData.skill);
        setTestLevel(formData.current_level);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setTestResult(null);

        // Close Add New Skill modal
        setIsModalOpen(false);
        // Open Test modal
        setIsTestModalOpen(true);
        showToast("Skill test questions loaded successfully!", "success");
      } else {
        showToast("No test questions available for this skill and level.", "error");
      }
    } catch (err: any) {
      console.error("Error fetching skill questions:", err);
      showToast(err?.message || "Failed to load skill test questions", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTest = async () => {
    if (isSubmittingTest) return;
    const unansweredCount = testQuestions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      showToast(`Please answer all questions before submitting. (${unansweredCount} remaining)`, "warning");
      return;
    }

    try {
      setIsSubmittingTest(true);
      
      const studentEmail = localStorage.getItem("currentUser") || "";
      const answersPayload: Record<string, string> = {};
      testQuestions.forEach((q, idx) => {
        const questionText = q.question;
        const answerText = userAnswers[idx] || "";
        answersPayload[questionText] = answerText;
      });

      const response = await submitSkillTest({
        student: studentEmail,
        skill: testSkill,
        level: testLevel,
        answers: answersPayload
      });
      const data = response?.message || response?.data || response;

      if (data) {
        setTestResult(data);
        showToast("Skill verification test submitted successfully!", "success");
        fetchSkillStats();
      } else {
        showToast("Failed to retrieve test result.", "error");
      }
    } catch (err: any) {
      console.error("Error submitting test:", err);
      showToast(err?.message || "Failed to submit skill test", "error");
    } finally {
      setIsSubmittingTest(false);
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

  const evidenceFields: DynamicField[] = [
    { name: "evidence_type", label: "Evidence Type", type: "select", icon: FileText, options: ["Project", "Certification", "Work Experience", "Competition", "Other"], required: true },
    { name: "evidence_date", label: "Evidence Date", type: "date", icon: Clock, required: true, textTransform: "uppercase" },
    { name: "description", label: "Description", type: "textarea", icon: FileText, placeholder: "Built a full-stack web application using React and Frappe", required: true, colSpan: 2 },
    { name: "document_url", label: "Document URL", type: "url", icon: Globe, placeholder: "https://github.com/user/project", required: false, colSpan: 2 }
  ];

  const handleAddEvidence = async (formData: any) => {
    if (!selectedSkill) return;

    try {
      setIsSubmitting(true);
      const studentEmail = localStorage.getItem("currentUser") || "";

      const payload = {
        student_skill: `${studentEmail}-${selectedSkill.name.toLowerCase()}`,
        evidence_type: formData.evidence_type,
        evidence_date: formData.evidence_date,
        description: formData.description,
        reference_doctype: "",
        reference_name: "",
        document_url: formData.document_url || ""
      };

      const response = await addSkillEvidence(payload);

      const isSuccess = response && (
        response.status === 200 || 
        response.status === "200" || 
        response.message === "Evidence added successfully" ||
        (typeof response.message === 'string' && response.message.startsWith("SE-")) ||
        response.data
      );

      if (isSuccess) {
        showToast("Evidence added successfully!", "success");
        setIsEvidenceModalOpen(false);
        setSelectedSkill(null); // Close the skill details modal as well
        fetchSkillStats(); // Refresh ledger to see updated evidence count
      } else {
        showToast(response?.message || "Failed to add evidence", "error");
      }
    } catch (err: any) {
      console.error("Error adding evidence:", err);
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="overflow-x-auto overflow-y-auto max-h-[360px] custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm shadow-slate-100/50 outline outline-1 outline-slate-100">
              <tr>
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
                  <tr
                    key={row.id}
                    onClick={() => setSelectedSkill(row)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
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
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifySkillDirect(row.name, row.level);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 rounded-lg text-[10px] font-bold shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
                        >
                          Verify Skill
                        </Button>
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
        submitText="Verify Skills"
      />

      {/* Skill Info & Evidence Option Modal */}
      {selectedSkill && (
        <DashboardDynamicModal
          isOpen={!!selectedSkill && !isEvidenceModalOpen}
          onClose={() => setSelectedSkill(null)}
          title={selectedSkill.name}
          subtitle={`${selectedSkill.category} • ${selectedSkill.level}`}
          headerIcon={Award}
          iconBgColor={selectedSkill.categoryType === 'Technical' ? 'bg-blue-500' : selectedSkill.categoryType === 'Soft Skill' ? 'bg-emerald-500' : 'bg-purple-500'}
          fields={[]} // Read-only info view usually doesn't need input fields
          onSubmit={async () => {
            setIsEvidenceModalOpen(true);
          }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Evidence</p>
                <p className="text-xl font-bold text-slate-800">{selectedSkill.evidence} items</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Endorsements</p>
                <p className="text-xl font-bold text-slate-800">{selectedSkill.endorsements} points</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100/50">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Strengthen this skill</h4>
                <p className="text-xs text-slate-500">Add a project, certificate or experience as evidence.</p>
              </div>
            </div>

            <Button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="w-full bg-slate-900 text-white h-12 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
            >
              Add New Evidence
            </Button>
          </div>
        </DashboardDynamicModal>
      )}

      {/* Add Evidence Modal */}
      <DashboardDynamicModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Add Skill Evidence"
        subtitle={`Proving your proficiency in ${selectedSkill?.name}`}
        headerIcon={FileText}
        iconBgColor="bg-blue-600"
        fields={evidenceFields}
        onSubmit={handleAddEvidence}
        loading={isSubmitting}
      />

      {/* Skill Verification Test Modal */}
      <AnimatePresence>
        {isTestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50">
                    {testResult ? (
                      <ShieldCheck className="w-6 h-6 text-white" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {testResult ? "Verification Result" : "Skill Verification Test"}
                    </h2>
                    <p className="text-sm text-slate-500 font-semibold">
                      {testSkill} • Level: {testLevel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {!testResult ? (
                  // Question View
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%`,
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>Question {currentQuestionIndex + 1} of {testQuestions.length}</span>
                    </div>

                    {/* Question Card */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-600 uppercase tracking-widest mb-3">
                        {testQuestions[currentQuestionIndex]?.difficulty || "Medium"}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 leading-snug">
                        {testQuestions[currentQuestionIndex]?.question}
                      </h3>
                    </div>

                    {/* Options List / Text Box */}
                    {testQuestions[currentQuestionIndex]?.type === "mcq" ? (
                      <div className="space-y-3">
                        {testQuestions[currentQuestionIndex]?.options?.map((option: string, oIdx: number) => {
                          const isSelected = userAnswers[currentQuestionIndex] === option;
                          return (
                            <div
                              key={oIdx}
                              onClick={() => {
                                setUserAnswers(prev => ({
                                  ...prev,
                                  [currentQuestionIndex]: option
                                }));
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                                isSelected
                                  ? "border-orange-500 bg-orange-50/30 text-orange-950 font-bold shadow-md shadow-orange-500/5"
                                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300"
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-sm font-semibold leading-tight">{option}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={userAnswers[currentQuestionIndex] || ""}
                          onChange={(e) => {
                            setUserAnswers(prev => ({
                              ...prev,
                              [currentQuestionIndex]: e.target.value
                            }));
                          }}
                          placeholder="Type your answer here..."
                          rows={6}
                          className="w-full px-4 py-3.5 rounded-[1.5rem] border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm text-slate-900 resize-none outline-none min-h-[150px]"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // Result Scorecard View
                  <div className="space-y-6">
                    {/* Circle Score & Status */}
                    <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="stroke-slate-200"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className={testResult.passed ? "stroke-emerald-500" : "stroke-rose-500"}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * (testResult.score || 0)) / 100}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-slate-800">{testResult.score}%</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                        </div>
                      </div>

                      <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        testResult.passed 
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      }`}>
                        {testResult.passed ? "Verification Passed" : "Verification Failed"}
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Correct Answers: <span className="font-bold text-slate-800">{testResult.total_correct}</span> / {testResult.total_questions}
                      </p>
                    </div>

                    {/* Summary feedback */}
                    {testResult.feedback?.summary && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">AI Assessment Summary</h4>
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-sm font-semibold text-slate-700 leading-relaxed">
                          {testResult.feedback.summary}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testResult.feedback?.strengths && testResult.feedback.strengths.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">Strengths</h4>
                          <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 space-y-2">
                            {testResult.feedback.strengths.map((str: string, sIdx: number) => (
                              <div key={sIdx} className="flex gap-2 text-xs font-semibold text-slate-700 leading-tight">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{str}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {testResult.feedback?.gaps && testResult.feedback.gaps.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-amber-600">Areas to Improve</h4>
                          <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-100/50 space-y-2">
                            {testResult.feedback.gaps.map((gap: string, gIdx: number) => (
                              <div key={gIdx} className="flex gap-2 text-xs font-semibold text-slate-700 leading-tight">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{gap}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Next Steps */}
                    {testResult.feedback?.next_step && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Recommended Next Steps</h4>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                            {testResult.feedback.next_step}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Breakdown section */}
                    {testResult.breakdown && testResult.breakdown.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Question Breakdown</h4>
                        <div className="space-y-3">
                          {testResult.breakdown.map((item: any, bIdx: number) => (
                            <div key={bIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-widest">
                                  Question {item.index || bIdx + 1}
                                </span>
                                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                  item.is_correct 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-rose-100 text-rose-700"
                                }`}>
                                  {item.is_correct ? "Correct" : "Incorrect"} ({item.answer_score || 0} pts)
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-slate-800 leading-snug">
                                {item.question}
                              </h5>
                              <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-700">
                                <span className="font-bold block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Your Answer</span>
                                {item.selected_answer || <span className="italic text-slate-400">Empty</span>}
                              </div>
                              {item.evaluation_comment && (
                                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/30 text-xs text-slate-700 leading-relaxed">
                                  <span className="font-bold block text-blue-500 text-[10px] uppercase tracking-widest mb-1">AI Evaluation</span>
                                  {item.evaluation_comment}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                {!testResult ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (currentQuestionIndex > 0) {
                          setCurrentQuestionIndex(prev => prev - 1);
                        } else {
                          setIsTestModalOpen(false);
                        }
                      }}
                      className="px-6 h-12 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      {currentQuestionIndex > 0 ? "Back" : "Cancel"}
                    </Button>

                    {currentQuestionIndex < testQuestions.length - 1 ? (
                      <Button
                        onClick={() => {
                          if (!userAnswers[currentQuestionIndex]) {
                            showToast("Please select an answer to proceed", "warning");
                            return;
                          }
                          setCurrentQuestionIndex(prev => prev + 1);
                        }}
                        className="px-8 h-12 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10 flex items-center gap-2"
                      >
                        Next Question
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitTest}
                        disabled={isSubmittingTest}
                        className="px-8 h-12 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingTest ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Submit Test
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="w-full flex justify-end">
                    <Button
                      onClick={() => setIsTestModalOpen(false)}
                      className="px-8 h-12 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                    >
                      Close Result
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}