"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Wallet,
  CheckCircle,
  Clock,
  BarChart3,
  List,
  Target,
  FileText,
  ShieldCheck,
  TrendingUp,
  Award
} from "lucide-react";

const payoutHistory = [
  { month: "February 2025", sessions: 18, gross: "₹21,600", feePercent: "15%", feeAmount: "-₹3,240", net: "₹18,360", status: "Processing", date: "Mar 1, 2025" },
  { month: "January 2025", sessions: 22, gross: "₹26,400", feePercent: "15%", feeAmount: "-₹3,960", net: "₹22,440", status: "Paid", date: "Feb 1, 2025" },
  { month: "December 2024", sessions: 16, gross: "₹19,200", feePercent: "15%", feeAmount: "-₹2,880", net: "₹16,320", status: "Paid", date: "Jan 1, 2025" },
  { month: "November 2024", sessions: 19, gross: "₹22,800", feePercent: "15%", feeAmount: "-₹3,420", net: "₹19,380", status: "Paid", date: "Dec 1, 2024" },
  { month: "October 2024", sessions: 14, gross: "₹16,800", feePercent: "15%", feeAmount: "-₹2,520", net: "₹14,280", status: "Paid", date: "Nov 1, 2024" },
];

const commissionWorks = [
  { title: "AI Matching", desc: "We surface your profile to the right students based on skills, domain, and psychometric fit.", icon: Target },
  { title: "Payment Processing", desc: "Razorpay integration, auto-invoicing, GST handling, and bank transfers on 1st of each month.", icon: Wallet },
  { title: "Trust & Safety", desc: "Background verification, student reviews moderation, dispute resolution, and fraud prevention.", icon: ShieldCheck },
  { title: "Platform Infrastructure", desc: "Video sessions, scheduling tools, notes sync, skill ledger integration, and analytics dashboards.", icon: BarChart3 },
  { title: "Marketing & Discovery", desc: "Your profile appears in college searches, student feed recommendations, and industry showcases.", icon: TrendingUp },
  { title: "Performance Rewards", desc: "Top-rated mentors (4.8+) get promoted in the AI recommendation engine with lower commission tiers.", icon: Award },
];

export default function PayoutsTabContent() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#242b6a] rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between text-white relative shadow-md"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex-1 z-10">
          <h2 className="text-2xl font-bold mb-3">Payout & Earnings Transparency</h2>
          <p className="text-blue-100/80 text-sm leading-relaxed max-w-2xl mb-8">
            Stridenex charges a platform commission on each session. You can track every rupee — gross earned, commission deducted, and net transferred to your bank account.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 px-5 text-center">
              <p className="text-lg font-bold text-orange-400">15%</p>
              <p className="text-[10px] text-blue-200">Standard Rate</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 px-5 text-center">
              <p className="text-lg font-bold text-orange-400">12%</p>
              <p className="text-[10px] text-blue-200">Above ₹50k/mo</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 px-5 text-center">
              <p className="text-lg font-bold text-orange-400">10%</p>
              <p className="text-[10px] text-blue-200">Above ₹1L/mo</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center min-w-[220px] z-10">
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center pb-3">
            <h3 className="text-2xl font-extrabold mb-0.5">₹2,84,400</h3>
            <p className="text-xs text-blue-200 uppercase tracking-wider">Lifetime Earned</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center pb-3">
            <h3 className="text-2xl font-extrabold mb-0.5">₹42,660</h3>
            <p className="text-xs text-blue-200 uppercase tracking-wider">Lifetime Commission</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center pb-3">
            <h3 className="text-2xl font-extrabold mb-0.5 text-emerald-400">₹2,41,740</h3>
            <p className="text-xs text-blue-200 uppercase tracking-wider">Lifetime Net Payout</p>
          </div>
        </div>
      </motion.div>

      {/* Middle Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-t-4 border-t-orange-400 rounded-xl shadow-sm border border-slate-200 p-5 flex justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">PENDING PAYOUT (FEB)</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mb-1">₹18,360</h3>
            <p className="text-xs font-semibold text-red-500 flex items-center gap-1">▼ Releases Mar 1</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border-t-4 border-t-emerald-500 rounded-xl shadow-sm border border-slate-200 p-5 flex justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">LAST PAID (JAN)</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mb-1">₹22,440</h3>
            <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">▲ Paid Feb 1</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider mb-1">Q1 2025 TOTAL</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mb-1">₹63,240</h3>
            <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">▲ +22% vs Q4</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Payout History Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
            <List className="w-4 h-4 text-orange-500" /> Payout History — Full Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-6">Month</th>
                <th className="py-4 px-6">Sessions</th>
                <th className="py-4 px-6">Gross Earned</th>
                <th className="py-4 px-6">Commission Rate</th>
                <th className="py-4 px-6">Commission Amount</th>
                <th className="py-4 px-6">Net Payout</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payoutHistory.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{row.month}</td>
                  <td className="py-4 px-6 text-slate-600">{row.sessions}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{row.gross}</td>
                  <td className="py-4 px-6 text-slate-500 flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded">{row.feePercent}</span>
                    <span className="text-[10px]">Platform fee</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-red-500">{row.feeAmount}</td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{row.net}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 w-fit ${row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {row.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium whitespace-nowrap">{row.date}</td>
                  <td className="py-4 px-6">
                    <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1 bg-white rounded shadow-sm transition-colors">
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* How Commission Works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-[15px]">
            <Target className="w-4 h-4 text-yellow-500" /> How Commission Works
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commissionWorks.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <item.icon className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
