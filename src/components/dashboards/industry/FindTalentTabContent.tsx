"use client";

import { motion, Variants } from "framer-motion";
import { Search, ChevronDown, Download, Sparkles, Bookmark } from "lucide-react";

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

const candidates = [
  { id: 1, initials: "PS", bgColor: "bg-red-500", name: "Priya Sharma", college: "VJTI Mumbai • CGPA 8.7", skills: ["Python", "ML", "SQL"], match: 94 },
  { id: 2, initials: "SP", bgColor: "bg-lime-500", name: "Sneha Patel", college: "COEP Pune • CGPA 8.4", skills: ["Python", "SQL"], match: 87 },
  { id: 3, initials: "AN", bgColor: "bg-green-500", name: "Arjun Nair", college: "IIT Bombay • CGPA 9.1", skills: ["ML", "Python"], match: 80 },
  { id: 4, initials: "KR", bgColor: "bg-blue-500", name: "Kiran Reddy", college: "NIT Warangal • CGPA 8", skills: ["Deep Learning"], match: 74 },
  { id: 5, initials: "PS", bgColor: "bg-indigo-500", name: "Priya Sharma", college: "VJTI Mumbai • CGPA 8.7", skills: ["Python", "ML", "SQL"], match: 90 },
  { id: 6, initials: "SP", bgColor: "bg-purple-500", name: "Sneha Patel", college: "COEP Pune • CGPA 8.4", skills: ["Python", "SQL"], match: 83 }
];

export default function FindTalentTabContent() {
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
          
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option>College Tier</option>
              <option>Tier 1</option>
              <option>Tier 2</option>
              <option>Tier 3</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">847 candidates match</h3>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm relative">
              <div className="absolute right-6 top-6 w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">{candidate.match}%</span>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${candidate.bgColor} text-white flex items-center justify-center text-lg font-bold shrink-0`}>
                  {candidate.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{candidate.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{candidate.college}</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" /> Invite
                </button>
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-lg border border-slate-200 transition-colors text-sm">
                  View Ledger
                </button>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
