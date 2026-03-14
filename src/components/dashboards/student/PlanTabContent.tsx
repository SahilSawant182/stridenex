// components/dashboards/student/PlansTabContent.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Crown, 
  Download, 
  CheckCircle,
  Sparkles
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Plans data
const plans = [
  {
    id: 1,
    name: "Basic",
    price: "0",
    period: "/month",
    features: ["Basic skill tracking", "Community access", "5 mentor sessions/year"],
    isCurrent: false,
    buttonText: "Upgrade",
    buttonVariant: "outline" as const
  },
  {
    id: 2,
    name: "Pro",
    price: "299",
    period: "/month",
    features: ["Everything in Basic", "AI Coach insights", "Unlimited mentor sessions", "Skill ledger export"],
    isCurrent: true,
    isPopular: true,
    buttonText: "Current Plan",
    buttonVariant: "primary" as const
  },
  {
    id: 3,
    name: "Elite",
    price: "499",
    period: "/month",
    features: ["Everything in Pro", "1-on-1 career coaching", "Resume review", "Mock interviews"],
    isCurrent: false,
    buttonText: "Upgrade",
    buttonVariant: "outline" as const
  }
];

// Billing history data
const billingHistory = [
  {
    id: 1,
    date: "Feb 1, 2025",
    description: "Pro Plan – Monthly",
    amount: "₹299",
    status: "Paid",
    hasInvoice: true
  },
  {
    id: 2,
    date: "Jan 1, 2025",
    description: "Pro Plan – Monthly",
    amount: "₹299",
    status: "Paid",
    hasInvoice: false
  },
  {
    id: 3,
    date: "Dec 1, 2024",
    description: "Pro Plan – Monthly",
    amount: "₹299",
    status: "Paid",
    hasInvoice: false
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PlansTabContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Plans Grid - 3 Cards exactly as in screenshot */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <BaseCard 
            key={plan.id} 
            className={`border ${plan.isPopular ? 'border-orange-200' : 'border-slate-200'}`}
          >
            <div className="p-5">
              {plan.isPopular && (
                <div className="mb-3">
                  <Badge className="bg-orange-500 text-white border-0 text-xs px-2 py-0.5">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <h3 className="text-base font-semibold text-slate-800 mb-2">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-slate-800">₹{plan.price}</span>
                <span className="text-slate-400 text-xs">{plan.period}</span>
              </div>
              
              <ul className="space-y-2 mb-5">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant}
                className={`w-full text-xs py-2 h-8 ${
                  plan.buttonVariant === 'primary' 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-0' 
                    : 'border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          </BaseCard>
        ))}
      </motion.div>

      {/* Billing History - exactly as in screenshot */}
      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Billing History</h3>
        
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2 px-4 text-[10px] font-medium text-slate-500 uppercase">DATE</th>
                <th className="py-2 px-4 text-[10px] font-medium text-slate-500 uppercase">DESCRIPTION</th>
                <th className="py-2 px-4 text-[10px] font-medium text-slate-500 uppercase">AMOUNT</th>
                <th className="py-2 px-4 text-[10px] font-medium text-slate-500 uppercase">STATUS</th>
                <th className="py-2 px-4 text-[10px] font-medium text-slate-500 uppercase">INVOICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billingHistory.map((record) => (
                <tr key={record.id} className="text-sm">
                  <td className="py-3 px-4 text-slate-600">{record.date}</td>
                  <td className="py-3 px-4 text-slate-800">{record.description}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{record.amount}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 text-xs font-medium">{record.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    {record.hasInvoice ? (
                      <button className="text-slate-400 hover:text-orange-500 text-xs flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        PDF
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}