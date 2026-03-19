// components/dashboard/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dashboardConfig, type DashboardRole } from "@/config/dashboardNavigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SidebarProps {
  role: DashboardRole;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, collapsed = false, onToggle, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, fullName } = useAuth();
  const config = dashboardConfig[role];
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!config) return null;

  const handleLogoClick = () => {
    if (role) {
      router.push(`${config.baseRoute}`);
    } else {
      router.push("/");
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return "U";
  };

  const getActiveTabStyles = () => {
    switch (role) {
      case 'college':
        return "bg-green-50 text-green-600 font-semibold";
      case 'mentor':
        return "bg-violet-50 text-violet-600 font-semibold";
      case 'industry':
        return "bg-purple-50 text-purple-600 font-semibold";
      case 'student':
      default:
        return "bg-orange-50 text-orange-600 font-semibold";
    }
  };

  const getActiveIconStyles = () => {
    switch(role) {
      case 'college':
        return "text-green-600";
      case 'mentor':
        return "text-violet-600";
      case 'industry':
        return "text-purple-600";
      case 'student':
      default:
        return "text-orange-600";
    }
  };

  return (
    <motion.div
      initial={{ width: collapsed ? 80 : 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-50 shrink-0"
    >
      {/* Logo Area */}
      <div className="h-[72px] shrink-0 flex items-center justify-between px-4 border-b border-slate-100">
        <div onClick={handleLogoClick} className={`flex items-center gap-2 cursor-pointer group ${collapsed ? 'w-full justify-center' : ''}`}>
          <div className="relative">
            <img
              src="/images/Logo.png"
              alt="StrideNex Logo"
              className="w-40 h-40 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
            />
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {!isMobile && onToggle && (
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow hover:bg-slate-50 transition-all duration-300 z-10 ${collapsed ? 'absolute -right-3 top-6' : ''}`}
          >
            {collapsed ? (
              <ChevronRight className="w-[14px] h-[14px] text-slate-500" />
            ) : (
              <ChevronLeft className="w-[14px] h-[14px] text-slate-500" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
        {config.links.map((link) => {
          // Exact match for base dashboard route to prevent it from being active on sub-routes
          const isBaseRoute = link.href === `${config.baseRoute}/dashboard`;
          const isActive = isBaseRoute
            ? pathname === link.href
            : (pathname === link.href || pathname.startsWith(`${link.href}/`));

          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={isMobile ? onClose : undefined}
              onMouseEnter={() => setHoveredItem(link.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-300 group
                ${isActive
                  ? getActiveTabStyles()
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-medium"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                className={`w-[20px] h-[20px] transition-colors ${isActive ? getActiveIconStyles() : "text-slate-400 group-hover:text-slate-600"
                  }`}
              />

              {!collapsed && (
                <span className={`flex-1 text-[14px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>{link.name}</span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && hoveredItem === link.name && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
                >
                  {link.name}
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Links & User Profile */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
        {/* Bottom Navigation Links */}
        <div className="space-y-1.5">
          {config.bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={isMobile ? onClose : undefined}
                onMouseEnter={() => setHoveredItem(link.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-300 group
                  ${isActive
                    ? getActiveTabStyles()
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className={`w-[20px] h-[20px] transition-colors ${isActive ? getActiveIconStyles() : "text-slate-400 group-hover:text-slate-600"}`} />

                {!collapsed && (
                  <span className={`flex-1 text-[14px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>{link.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === link.name && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
                  >
                    {link.name}
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        {!collapsed ? (
          <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] text-slate-800 tracking-wide truncate">
                {fullName || "User"}
              </div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-widest truncate">
                {config.roleName}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-200/60 flex justify-center relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all"
              onMouseEnter={() => setHoveredItem("profile")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {getInitials()}
              {hoveredItem === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none"
                >
                  {fullName || "User"} • {config.roleName}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}