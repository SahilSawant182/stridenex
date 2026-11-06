"use client";

import { useState } from "react";
import CollegeMembersTabContent from "./CollegeMembersTabContent";
import { Users, Settings as SettingsIcon, ShieldCheck } from "lucide-react";

export default function CollegeSettingsTabContent({
  initialSection = "members",
}: {
  initialSection?: "members";
} = {}) {
  const [activeSettingSection, setActiveSettingSection] = useState<"members">(initialSection);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Settings Subtab Switcher / Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">College Settings</h2>
          <p className="text-slate-500 text-sm font-medium">
            Manage your institution staff, instructor permissions, and college administrators.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-2xs self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveSettingSection("members")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSettingSection === "members"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Staff &amp; Members</span>
          </button>
        </div>
      </div>

      {/* ── Active Section Content ── */}
      {activeSettingSection === "members" && <CollegeMembersTabContent />}
    </div>
  );
}

