"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Bell, Menu, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardConfig, type DashboardRole } from "@/config/dashboardNavigation";

interface NavbarProps {
  role: DashboardRole;
}

export default function Navbar({ role }: NavbarProps) {
  const { currentUser, fullName, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const config = dashboardConfig[role];
  const displayName = fullName || currentUser?.split('@')[0] || config?.roleName || "User";

  if (!config) return null;

  return (
    <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          {role === 'student' && (
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                role === 'student' ? 'bg-gradient-to-tr from-accent to-orange-500' :
                role === 'college' ? 'bg-green-600' :
                role === 'mentor' ? 'bg-violet-600' :
                'bg-purple-600' // industry
              }`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {displayName}
            </span>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{currentUser}</p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
