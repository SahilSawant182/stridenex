"use client";

export default function IndustryDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Industry Dashboard</h1>
          <p className="text-slate-500 mt-1">Discover talent and manage placements.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Talent Pool</h3>
            <p className="text-sm text-slate-500 mt-2">Explore candidates matching your requirements.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Skill Gap Analysis</h3>
            <p className="text-sm text-slate-500 mt-2">Analyze the market supply vs demand.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 text-lg">Active Drives</h3>
            <p className="text-sm text-slate-500 mt-2">Manage ongoing recruitment drives.</p>
        </div>
      </div>
    </div>
  );
}
