"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  color?: string;
}

interface TabbedContentProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export default function TabbedContent({ tabs, defaultTab }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-slate-100 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color || 'from-primary to-purple-600'} text-white shadow-lg`
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          tab.id === activeTab && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {tab.content}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}