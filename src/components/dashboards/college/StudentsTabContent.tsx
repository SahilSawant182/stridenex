"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Download, Search, Settings2, MoreHorizontal, Loader2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getCollegeDetails, getMasterData, getStudentAnalyticsList } from "@/services/college.services";
import Dropdown from "@/components/ui/Dropdown";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-purple-600', 'bg-amber-600', 'bg-emerald-500', 
    'bg-blue-600', 'bg-emerald-400', 'bg-indigo-500', 'bg-pink-600'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function StudentsTabContent() {
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [collegeDetails, setCollegeDetails] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [availableBranches, setAvailableBranches] = useState<string[]>(["CS", "CSE", "ECE", "IT", "ME", "MBA", "Civil", "EE"]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Fetch available branches from master API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getMasterData("College Department");
        const raw = res?.data ?? res?.message?.data ?? res?.message ?? res;
        const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
        if (arr.length > 0) {
          const names = arr.map((item: any) => item.branch_name || item.branch || item.name || String(item)).filter(Boolean);
          const uniqueBranches = Array.from(new Set([...names, "CS", "CSE", "ECE", "IT", "ME", "MBA", "Civil", "EE"]));
          setAvailableBranches(uniqueBranches);
        }
      } catch (err) {
        console.error("Failed to fetch branches from master:", err);
      }
    };
    fetchBranches();
  }, []);

  // Fetch available skills from master API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getMasterData("Skill");
        const raw = res?.data ?? res?.message?.data ?? res?.message ?? res;
        const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
        if (arr.length > 0) {
          const names = arr.map((item: any) => item.skill_name || item.skill || item.name || String(item)).filter(Boolean);
          const uniqueSkills = Array.from(new Set([...names, "Python", "React", "NodeJS", "TypeScript", "SQL", "Pandas"]));
          setAvailableSkills(uniqueSkills);
        } else {
          setAvailableSkills(["Python", "React", "NodeJS", "TypeScript", "SQL", "Pandas"]);
        }
      } catch (err) {
        console.error("Failed to fetch skills from master:", err);
        setAvailableSkills(["Python", "React", "NodeJS", "TypeScript", "SQL", "Pandas"]);
      }
    };
    fetchSkills();
  }, []);

  // Load college details
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
          console.error("Failed to load college details in Students Tab:", err);
        }
      }
    };

    if (currentUser) {
      loadDetails();
    }
  }, [currentUser]);

  const branchesStr = selectedBranches.join(",");
  const skillsStr = selectedSkills.join(",");

  // Fetch students analytics list
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const collegeName = collegeDetails?.name;
      const res = await getStudentAnalyticsList({
        search: searchQuery,
        college: collegeName || "",
        department: branchesStr,
        skill: skillsStr,
        current_year: selectedYear === "All" ? undefined : selectedYear,
        page: currentPage,
        page_size: pageSize
      });
      const raw = res?.message ?? res;
      const nestedData = raw?.data;
      
      let arr = [];
      if (nestedData && Array.isArray(nestedData.data)) {
        arr = nestedData.data;
        const pag = nestedData.pagination;
        if (pag) {
          setTotalStudents(pag.total ?? arr.length);
          setTotalPages(pag.total_pages ?? 1);
          setCurrentPage(pag.page ?? 1);
          setPageSize(pag.page_size ?? 20);
          setHasNextPage(pag.has_next ?? false);
          setHasPrevPage(pag.has_prev ?? false);
        }
      } else {
        arr = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
        setTotalStudents(arr.length);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
      setStudentsList(arr);
    } catch (err) {
      console.error("Failed to fetch student analytics:", err);
      showToast("Failed to load student analytics from server", "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 on filters or search queries change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, branchesStr, skillsStr, selectedYear, selectedRisk]);

  useEffect(() => {
    if (collegeDetails) {
      fetchStudents();
    }
  }, [collegeDetails, searchQuery, branchesStr, skillsStr, selectedYear, currentPage, pageSize]);

  // CSV download notification
  const handleExportCSV = () => {
    if (studentsList.length === 0) {
      showToast("No data to export", "warning");
      return;
    }
    const headers = "Student,Branch,Year,Employability,Internship,Status,Risk\n";
    const rows = studentsList.map(student => {
      const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.student_name || student.name || "—";
      const branch = student.branch || student.department || "—";
      const year = student.year || student.academic_year || "—";
      const employability = student.employability_score !== undefined ? student.employability_score : (student.employability !== undefined ? student.employability : 75);
      const internship = student.internship_count !== undefined ? student.internship_count : (student.internship || "0");
      const status = student.placement_status || student.status || "—";
      const risk = student.risk_level || student.risk || "Low";
      return `"${fullName}","${branch}","${year}",${employability},"${internship}","${status}","${risk}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Students_List_${collegeDetails?.name || "College"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Student list downloaded successfully.", "success");
  };

  // Local filtering for mock year and risk selectors just to maintain UI logic
  const filteredStudents = studentsList.filter(student => {
    const year = student.year || student.academic_year || "—";
    const risk = student.risk_level || student.risk || "low";
    
    const matchesYear = selectedYear === "All" || 
      String(year).toLowerCase().includes(selectedYear.toLowerCase()) ||
      (selectedYear === "First Year" && String(year).toLowerCase().includes("1st")) ||
      (selectedYear === "Second Year" && String(year).toLowerCase().includes("2nd")) ||
      (selectedYear === "Third Year" && String(year).toLowerCase().includes("3rd")) ||
      (selectedYear === "Final Year" && String(year).toLowerCase().includes("4th"));
      
    const matchesRisk = selectedRisk === "All" || String(risk).toLowerCase() === selectedRisk.toLowerCase();
    
    return matchesYear && matchesRisk;
  });

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      
      {/* Search and Filters Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, branch, year..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-visible pb-1 sm:pb-0">
          <Dropdown
            id="branches-filter"
            placeholder="All Branches"
            options={availableBranches}
            value={selectedBranches}
            onChange={setSelectedBranches}
            multiSelect={true}
            searchable={true}
          />
          <Dropdown
            id="skills-filter"
            placeholder="All Skills"
            options={availableSkills}
            value={selectedSkills}
            onChange={setSelectedSkills}
            multiSelect={true}
            searchable={true}
          />
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none"
          >
            <option value="All">All Years</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Final Year">Final Year</option>
          </select>
          <select 
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none"
          >
            <option value="All">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          {(searchQuery || selectedBranches.length > 0 || selectedSkills.length > 0 || selectedYear !== "All" || selectedRisk !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBranches([]);
                setSelectedSkills([]);
                setSelectedYear("All");
                setSelectedRisk("All");
              }}
              className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center gap-1 bg-white"
            >
              Clear
            </button>
          )}
          <button onClick={handleExportCSV} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors shrink-0">
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={itemVariants}>
        <BaseCard className="overflow-hidden border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold tracking-wider uppercase bg-slate-50/40">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Branch</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Employability</th>
                  <th className="px-6 py-4 font-medium">Internship</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Risk</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
                      Loading student analytics records...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      No student records found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.student_name || student.name || "—";
                    const branch = student.branch || student.department || "—";
                    const year = student.year || student.academic_year || "—";
                    const employability = student.employability_score !== undefined ? student.employability_score : (student.employability !== undefined ? student.employability : 75);
                    const internship = student.internship_count !== undefined ? student.internship_count : (student.internship || "0");
                    const status = student.placement_status || student.status || "—";
                    const risk = String(student.risk_level || student.risk || "Low").toLowerCase();
                    const riskColor = risk === "high" ? "bg-red-500" : risk === "medium" ? "bg-amber-400" : "bg-green-500";
                    const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "S";
                    return (
                      <tr key={`${student.name || idx}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(fullName)}`}>
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-800">{fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-500 font-semibold">{branch}</td>
                        <td className="px-6 py-3 text-slate-500 font-semibold">{year}</td>
                        <td className="px-6 py-3 text-slate-500 font-semibold">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                               <div 
                                 className={`h-full rounded-full ${employability > 80 ? 'bg-emerald-500' : employability > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                 style={{ width: `${employability}%` }}
                               />
                            </div>
                            <span className={employability > 80 ? 'text-emerald-600' : employability > 60 ? 'text-amber-600' : 'text-red-600'}>
                              {employability}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-500 font-semibold">{internship}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border
                            ${status === 'Interning' || status === 'Placed' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 
                              status === 'Searching' || status === 'Applied' ? 'bg-amber-50/50 text-amber-600 border-amber-100' : 
                              'bg-purple-50/50 text-purple-600 border-purple-100'}
                          `}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex justify-center">
                            <div className="relative flex items-center justify-center w-5 h-5">
                                {risk === 'high' ? (
                                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/>
                                    </svg>
                                ) : (
                                    <div className={`w-3 h-3 rounded-full ${riskColor} shadow-sm border border-black/5`}></div>
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => showToast(`Viewing profile of ${fullName}`, "info")} className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 text-xs font-bold rounded-full transition-colors shadow-sm inline-flex items-center justify-center">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-slate-800">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
                <span className="font-bold text-slate-800">{Math.min(currentPage * pageSize, totalStudents)}</span> of{" "}
                <span className="font-bold text-slate-800">{totalStudents}</span> students
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => hasPrevPage && setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!hasPrevPage}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                    hasPrevPage
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                      : "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {getPageNumbers().map((p, idx) => (
                    <button
                      key={idx}
                      disabled={p === "..."}
                      onClick={() => typeof p === 'number' && setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        p === "..."
                          ? "text-slate-400 cursor-default"
                          : currentPage === p
                          ? "bg-orange-500 text-white shadow-sm cursor-pointer"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => hasNextPage && setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={!hasNextPage}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                    hasNextPage
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                      : "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}