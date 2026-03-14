// components/dashboard/widgets/WelcomeWidget.tsx
"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface WelcomeWidgetProps {
  data?: any;
}

export default function WelcomeWidget({ data }: WelcomeWidgetProps) {
  const { fullName } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Good Morning, <span className="text-primary">{fullName || "Arjun Patel"}</span>
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            B.Tech CSE - 3rd Year - VJTI Mumbai
          </p>

          {/* Profile Completeness */}
          <div className="w-64">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600">Profile Completeness</span>
              <span className="text-xs font-medium text-primary">78%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </div>

        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">{fullName?.[0] || "A"}</span>
        </div>
      </div>
    </motion.div>
  );
}