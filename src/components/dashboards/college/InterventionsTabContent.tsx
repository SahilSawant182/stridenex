"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { AlertTriangle, Clock, TrendingDown, Target, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getCollegeDetails,
  getLowEmployabilityStudents,
  assignStudentMentor,
  getMasterData
} from "@/services/college.services";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const MetricCard = ({ title, value, icon, iconColor, borderColor }: { title: string, value: string | number, icon: React.ReactNode, iconColor: string, borderColor?: string }) => (
  <BaseCard className={`p-4 border-slate-200 relative overflow-hidden ${borderColor ? `border-t-4 ${borderColor}` : ''}`}>
      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
      <div className={`absolute top-4 right-4 w-7 h-7 rounded bg-slate-50 flex items-center justify-center border border-slate-100 ${iconColor}`}>
        {icon}
      </div>
  </BaseCard>
);

const recommendations = [
  { icon: "📚", text: "Bulk-enroll CSE 3rd Year in Data bootcamp", subject: "84 students", impact: "Impact: +15 avg score", impactColor: "text-emerald-600" },
  { icon: "🤝", text: "Peer mentors for at-risk 4th year students", subject: "47 students", impact: "Impact: Improve retention", impactColor: "text-emerald-600" },
  { icon: "🏢", text: "Partner with 3 more companies for mini-internships", subject: "120 students", impact: "Impact: NEP compliance", impactColor: "text-emerald-600" },
  { icon: "🎤", text: "AI mock-interview sessions for Mech students", subject: "52 students", impact: "Impact: +20% offer rate", impactColor: "text-emerald-600" },
];

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-purple-600', 'bg-amber-600', 'bg-emerald-500', 
    'bg-blue-600', 'bg-emerald-400', 'bg-indigo-500', 'bg-pink-600'
  ];
  // Simple deterministic hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function InterventionsTabContent() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [collegeDetails, setCollegeDetails] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentors, setSelectedMentors] = useState<Record<string, string>>({});
  const [assigningMap, setAssigningMap] = useState<Record<string, boolean>>({});

  // Load college details from localStorage or API
  useEffect(() => {
    const loadDetails = async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("collegeDetails") : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCollegeDetails(parsed);
          return;
        } catch (_) { }
      }

      if (currentUser) {
        try {
          const res = await getCollegeDetails(currentUser);
          const data = res?.data || res?.message?.data || res?.message;
          if (data) {
            setCollegeDetails(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem("collegeDetails", JSON.stringify(data));
            }
          }
        } catch (err) {
          console.error("Failed to load college details in Interventions:", err);
        }
      }
    };

    if (currentUser) {
      loadDetails();
    }
  }, [currentUser]);

  // Load low employability students and mentors
  useEffect(() => {
    const fetchStudentsAndMentors = async () => {
      const collegeName = collegeDetails?.name || collegeDetails?.email || currentUser || "sanjay9975@gmail.com";
      if (!collegeName) return;

      try {
        setLoading(true);
        const [studentsRes, mentorsRes] = await Promise.allSettled([
          getLowEmployabilityStudents(collegeName),
          getMasterData("Mentor")
        ]);

        if (studentsRes.status === "fulfilled") {
          const raw = studentsRes.value?.data ?? studentsRes.value?.message?.data ?? studentsRes.value?.message ?? studentsRes.value;
          const list = Array.isArray(raw?.students) ? raw.students : (Array.isArray(raw) ? raw : []);
          setStudentsList(list);
        } else {
          console.error("Failed to load low employability students:", studentsRes.reason);
        }

        if (mentorsRes.status === "fulfilled") {
          const raw = mentorsRes.value?.data ?? mentorsRes.value?.message?.data ?? mentorsRes.value?.message ?? mentorsRes.value;
          const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
          setMentorsList(arr);
        } else {
          console.error("Failed to load mentors:", mentorsRes.reason);
        }
      } catch (err) {
        console.error("Error fetching interventions data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (collegeDetails || currentUser) {
      fetchStudentsAndMentors();
    }
  }, [collegeDetails, currentUser]);

  const handleAssignMentor = async (studentEmail: string, mentorEmail: string) => {
    if (!studentEmail || !mentorEmail) return;

    try {
      setAssigningMap(prev => ({ ...prev, [studentEmail]: true }));
      await assignStudentMentor({
        student: studentEmail,
        mentor: mentorEmail
      });
      showToast("Mentor assigned successfully!", "success");
      if (typeof window !== "undefined") {
        window.alert("Mentor assigned successfully!");
      }
    } catch (err: any) {
      console.error("Failed to assign mentor:", err);
      showToast(err?.message || "Failed to assign mentor", "error");
      if (typeof window !== "undefined") {
        window.alert(`Error: ${err?.message || "Failed to assign mentor"}`);
      }
    } finally {
      setAssigningMap(prev => ({ ...prev, [studentEmail]: false }));
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      {/* Top Warning metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Critical Risk <40" 
             value={loading ? "..." : studentsList.length} 
             icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/></svg>} 
             iconColor="text-red-500" 
             borderColor="border-t-red-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="High Risk 40-55" 
             value="96" 
             icon={<AlertTriangle className="w-4 h-4" />} 
             iconColor="text-amber-500" 
             borderColor="border-t-amber-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Declining Progress" 
             value="128" 
             icon={<TrendingDown className="w-4 h-4" />} 
             iconColor="text-blue-400" 
             borderColor="border-t-blue-500" 
           />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard 
             title="Placement-Ready" 
             value="312" 
             icon={<Target className="w-4 h-4" />} 
             iconColor="text-emerald-500" 
             borderColor="border-t-emerald-500" 
           />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Critical Students */}
        <motion.div variants={itemVariants}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-2">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/></svg>
              Critical Students — Immediate Action
            </h3>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Loading critical students...</p>
                </div>
              ) : studentsList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xs text-slate-400 font-semibold">No critical students found</p>
                </div>
              ) : (
                studentsList.map((student, idx) => {
                  const fullName = student.student_name || student.name || student.email || "—";
                  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                  const detailText = student.course ? `${student.course} ${student.academic_year && student.academic_year !== '0' ? `(${student.academic_year} Yr)` : ''}` : "Critical Student";
                  return (
                    <div key={student.name || student.email || idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getAvatarColor(fullName)}`}>
                          {initials || "CS"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{fullName} <span className="font-medium text-slate-400 text-xs ml-1">{detailText}</span></h4>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Employability Score: <span className="text-red-600 font-bold">{student.employability_score !== undefined ? student.employability_score : "—"}</span>
                            {student.cgpa !== undefined && student.cgpa !== null && student.cgpa !== 0 && (
                              <span className="text-slate-400 font-medium ml-2">| CGPA: {student.cgpa}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={selectedMentors[student.email || student.name] || ""}
                          onChange={(e) => setSelectedMentors(prev => ({ ...prev, [student.email || student.name]: e.target.value }))}
                          className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                        >
                          <option value="">Select Mentor</option>
                          {mentorsList.map((mentor) => (
                            <option key={mentor.name} value={mentor.name}>
                              {mentor.mentor_name || mentor.full_name || mentor.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignMentor(student.email || student.name, selectedMentors[student.email || student.name])}
                          disabled={!selectedMentors[student.email || student.name] || assigningMap[student.email || student.name]}
                          className="text-[10px] font-bold tracking-wide bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          {assigningMap[student.email || student.name] ? "Assigning..." : "Assign"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </BaseCard>
        </motion.div>

        {/* Right Column - AI Recommendations */}
        <motion.div variants={itemVariants}>
          <BaseCard className="border-slate-200 p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <Zap className="w-4 h-4 text-blue-500" fill="currentColor" />
              AI Recommendations
            </h3>

            <div className="space-y-3">
               {recommendations.map((rec, idx) => (
                 <div key={idx} className="border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white hover:bg-orange-50/80 rounded-xl p-3 flex justify-between items-center transition-colors">
                    <div className="flex items-start gap-3">
                       <div className="text-xl shrink-0 mt-0.5 bg-white p-1 rounded-lg border border-orange-100 shadow-sm">{rec.icon}</div>
                       <div>
                         <h4 className="text-sm font-bold text-slate-800 leading-tight">{rec.text}</h4>
                         <div className="flex items-center gap-2 mt-1.5">
                           <span className="text-[10px] bg-white border border-slate-100 font-bold px-1.5 py-0.5 text-slate-500 rounded">{rec.subject}</span>
                           <span className={`text-[10px] font-bold ${rec.impactColor}`}>{rec.impact}</span>
                         </div>
                       </div>
                    </div>
                    <button className="shrink-0 ml-4 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full shadow-sm transition-colors">
                      Execute
                    </button>
                 </div>
               ))}
            </div>
          </BaseCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
