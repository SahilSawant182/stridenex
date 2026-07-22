"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { type DashboardRole } from "@/config/dashboardNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: DashboardRole;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isShortsPage = pathname.endsWith("/shorts");

  useEffect(() => {
    if (isShortsPage) {
      setIsSidebarCollapsed(true);
    }
  }, [isShortsPage]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Return null while redirecting
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isShortsPage ? 'bg-[#0f0f0f]' : 'bg-slate-50'}`}>
      <Sidebar 
        role={role} 
        collapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar role={role} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isShortsPage ? 'p-0 overflow-hidden bg-[#0f0f0f]' : 'p-6 lg:p-8 bg-slate-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}