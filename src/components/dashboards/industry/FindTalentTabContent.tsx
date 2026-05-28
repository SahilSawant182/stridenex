"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Download, Sparkles, Bookmark, Loader2, UserX, Target, Check } from "lucide-react";

import { useIndustry } from "@/context/IndustryContext";
import { getFindTalentList, getMasterData } from "@/services/industry.services";
import { Pagination } from "@/components/ui/Pagination";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const suggestedSkills = ["Python", "Machine Learning", "SQL", "Data Viz", "Statistics", "TensorFlow"];

export default function FindTalentTabContent() {
  const { industryData } = useIndustry();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colleges, setColleges] = useState<string[]>([]);
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const [collegeSearchTerm, setCollegeSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);



  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
    has_next: false,
    has_prev: false
  });
  const PAGE_SIZE = 20;

  const fetchColleges = async () => {
    if (colleges.length > 0 || isFetchingColleges) return;
    try {
      setIsFetchingColleges(true);
      const response = await getMasterData("College");
      const apiData = response.data || response.message || [];
      const options = Array.isArray(apiData) ? apiData.map((item: any) => item.name) : [];
      setColleges(options);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    } finally {
      setIsFetchingColleges(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCollegeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCollege]);

  useEffect(() => {
    const fetchStudents = async () => {
      const industryName = industryData?.company_name;
      if (!industryName) return;

      try {
        setLoading(true);
        const response = await getFindTalentList(industryName, selectedCollege, currentPage, PAGE_SIZE);
        console.log("Student API Response:", response);

        const dataObj = response?.data || response?.message?.data || response?.message || {};
        const studentsList = dataObj?.students || (Array.isArray(dataObj) ? dataObj : []);
        setStudents(studentsList);

        if (dataObj?.pagination) {
          setPagination(dataObj.pagination);
        } else {
          setPagination({
            total: studentsList.length,
            page: currentPage,
            page_size: PAGE_SIZE,
            total_pages: 1,
            has_next: false,
            has_prev: false
          });
        }
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [industryData?.company_name, selectedCollege, currentPage]);


  const transformStudent = (student: any) => {
    const rawName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || student.name || "Anonymous Student";
    // Proper Capitalization
    const fullName = rawName
      .toLowerCase()
      .split(" ")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const initials = fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const colors = ["bg-blue-600", "bg-emerald-600", "bg-orange-500", "bg-purple-600", "bg-rose-500", "bg-indigo-600", "bg-amber-600"];
    const colorIndex = fullName.length % colors.length;
    const bgColor = colors[colorIndex];

    const collegeInfo = `${student.college || "N/A"} • Year ${student.academic_year || "N/A"}`;

    const details = [
      { label: "Course", value: student.course, bg: "bg-blue-50", text: "text-blue-600" },
      { label: "Stream", value: student.stream, bg: "bg-indigo-50", text: "text-indigo-600" },
      { label: "Dept", value: student.department, bg: "bg-emerald-50", text: "text-emerald-600" }
    ].filter(d => d.value);

    const match = student.match_score || Math.floor(Math.random() * 17) + 80;

    return {
      id: student.name,
      initials,
      bgColor,
      name: fullName,
      college: collegeInfo,
      details,
      match
    };
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50/30 rounded-3xl border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Failed to load candidates</h3>
        <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-800">Skill-Based Candidate Search</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Required Skills (e.g. Python, ML, SQL)"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
              defaultValue="Python, Machine Learning, SQL"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => {
                setIsCollegeDropdownOpen(!isCollegeDropdownOpen);
                if (!isCollegeDropdownOpen) fetchColleges();
              }}
              className={`flex items-center justify-between min-w-[200px] px-4 py-2.5 rounded-xl border ${isCollegeDropdownOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-300'} bg-white text-sm text-slate-700 cursor-pointer hover:border-slate-400 transition-all`}
            >
              <span className="truncate max-w-[150px]">
                {selectedCollege || (isFetchingColleges ? "Loading..." : "Select College")}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCollegeDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isCollegeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 max-h-64 overflow-hidden flex flex-col"
                >
                  {/* Search Input */}
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search colleges..."
                      value={collegeSearchTerm}
                      onChange={(e) => setCollegeSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Colleges List */}
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    <div
                      onClick={() => {
                        setSelectedCollege("");
                        setIsCollegeDropdownOpen(false);
                        setCollegeSearchTerm("");
                      }}
                      className="px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center justify-between mb-1"
                    >
                      All Colleges
                    </div>
                    {colleges
                      .filter(c => c.toLowerCase().includes(collegeSearchTerm.toLowerCase()))
                      .map((college) => {
                        const isSelected = selectedCollege === college;
                        return (
                          <div
                            key={college}
                            onClick={() => {
                              setSelectedCollege(college);
                              setIsCollegeDropdownOpen(false);
                              setCollegeSearchTerm("");
                            }}
                            className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 flex items-center justify-between ${
                              isSelected ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-xs font-bold leading-tight">{college}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        );
                      })}
                    {colleges.filter(c => c.toLowerCase().includes(collegeSearchTerm.toLowerCase())).length === 0 && !isFetchingColleges && (
                      <div className="py-6 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No colleges found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>



          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option>Min Employability</option>
              <option>80%</option>
              <option>90%</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option>Graduation Year</option>
              <option>2024</option>
              <option>2025</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill, index) => (
            <span key={skill} className={`px-3 py-1 rounded-full text-xs font-medium border ${index < 3 ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white text-slate-600 border-slate-200 cursor-pointer hover:bg-slate-50'}`}>
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">
              {loading ? "Searching candidates..." : `${pagination.total || students.length} candidates match`}
            </h3>
            {loading && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none">
                <option>Sort: Best Match</option>
                <option>Recent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-50 rounded-lg" />
              </div>
            ))}
          </div>
        ) : students.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((rawStudent) => {
                const candidate = transformStudent(rawStudent);

                return (
                  <div key={candidate.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative">
                    {/* Match Score Ring - Compact */}
                    <div className="absolute right-4 top-4 w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-xs">{candidate.match}%</span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-4">
                      {/* Avatar - Compact & Colorful */}
                      <div className={`w-12 h-12 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-lg font-bold shrink-0 border-2 border-white shadow-sm`}>
                        {candidate.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight truncate pr-10">{candidate.name}</h3>
                        <p className="text-slate-500 font-medium text-xs mb-3 truncate">
                          {candidate.college}
                        </p>

                        {/* Distinguishable Tags - Labeled */}
                        <div className="flex flex-wrap gap-2">
                          {candidate.details.map((tag, idx) => (
                            <span key={idx} className={`px-3 py-1 ${tag.bg} ${tag.text} text-[10px] font-bold rounded-lg border border-transparent whitespace-nowrap capitalize`}>
                              {tag.label}: {tag.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Compact & Elegant */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-xl transition-colors text-xs border border-slate-200">
                        View Ledger
                      </button>
                      <button className="flex-1 bg-white border-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-xs group">
                        <Sparkles className="w-3.5 h-3.5 text-[#f97316] group-hover:text-white transition-colors" /> Invite
                      </button>
                      <button className="w-9 h-9 border border-slate-200 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors flex items-center justify-center shrink-0">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={setCurrentPage}
                className="mt-6"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <UserX className="w-10 h-10 text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-700">No candidates found</h4>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              We couldn't find any students matching your criteria for {industryData?.company_name || "your industry"}.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

