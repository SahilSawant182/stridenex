// components/dashboards/student/PlansTabContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Crown,
  CheckCircle,
  Sparkles,
  Clock,
  Zap,
  AlertCircle,
  Loader2,
  IndianRupee,
  ShoppingBag,
  History,
  CalendarDays,
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBillingPackagesByType, getBillingUrl, getUserSubscriptionDashboard } from "@/services/common.services";
import type {
  SubscriptionDashboardResponse,
  ActiveSubscription,
  CurrentPlan,
  SubscriptionHistoryItem,
} from "@/types/subscription";
import { BASE_DOMAIN } from "@/services/api.services";
import { usePathname } from "next/navigation";


interface BillingPackage {
  package_name: string;
  amount: number;
  package_type: string;
  no_of_days: number;
  no_of_users?: number | string;
  app?: string;
  app_name?: string;
  features: string[];
}


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function getAccountTypeFromPath(pathname: string): string {
  if (pathname.includes("/student/")) return "Student";
  if (pathname.includes("/mentor/")) return "Mentor";
  if (pathname.includes("/industry/")) return "Industry";
  if (pathname.includes("/college/")) return "College";
  return "Student";
}


function calcRemainingDays(expiryDateStr: string): number {
  try {
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  } catch {
    return 0;
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

async function redirectToPayment(
  plan: BillingPackage,
  accountType: string,
  customerEmail: string
): Promise<void> {
  let fromSite: string;
  try {
    fromSite = new URL(BASE_DOMAIN).hostname;
  } catch {
    fromSite = window.location.hostname;
  }
  const billingUrl = await getBillingUrl(fromSite);
  if (!billingUrl) throw new Error("Billing URL not returned from server");
  const paymentParams = new URLSearchParams({
    from_site: fromSite,
    frontend_url: window.location.origin,
    pkg_name: plan.package_name,
    pkg_type: plan.package_type || "",
    pkg_app: plan.app_name || plan.app || "",
    pkg_users: String(plan.no_of_users ?? ""),
    pkg_days: String(plan.no_of_days ?? ""),
    pkg_amount: String(plan.amount ?? ""),
    account_type: accountType,
    customer_email: customerEmail,
  });
  const proceedPaymentUrl = new URL("proceedpayment.html", billingUrl);
  window.location.href = `${proceedPaymentUrl.origin}${proceedPaymentUrl.pathname}?${paymentParams.toString()}`;
}

interface SummaryCardsProps {
  dashboard: SubscriptionDashboardResponse;
}

function SummaryCards({ dashboard }: SummaryCardsProps) {
  const { summary } = dashboard;
  const cards = [
    {
      label: "Current Plan",
      value: summary.current_package ?? "No Active Plan",
      icon: <Crown className="w-5 h-5 text-orange-500" />,
      bg: "from-orange-50/80 via-amber-50/40 to-transparent",
      border: "border-orange-200/60",
    },
    {
      label: "Total Spent",
      value: `₹${(summary.total_spent ?? 0).toLocaleString("en-IN")}`,
      icon: <IndianRupee className="w-5 h-5 text-emerald-500" />,
      bg: "from-emerald-50/80 via-teal-50/40 to-transparent",
      border: "border-emerald-200/60",
    },
    {
      label: "Purchases",
      value: String(summary.total_purchases ?? 0),
      icon: <ShoppingBag className="w-5 h-5 text-indigo-500" />,
      bg: "from-indigo-50/80 via-blue-50/40 to-transparent",
      border: "border-indigo-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-r ${card.bg} p-4 shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-1">
            {card.icon}
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <p className="text-xl font-extrabold text-slate-800 truncate">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

type DisplayPlan =
  | { kind: "paid"; data: ActiveSubscription }
  | { kind: "free"; data: CurrentPlan };

interface ActivePlanSectionProps {
  plan: DisplayPlan;
}

function ActivePlanSection({ plan }: ActivePlanSectionProps) {
  const isPaid = plan.kind === "paid";
  const isTokenBased =
    plan.kind === "free" && plan.data.package_type === "Token Based";

  // Determine expiry/remaining days
  const expiryDateStr =
    isPaid
      ? (plan.data as ActiveSubscription).expiry_date
      : (plan.data as CurrentPlan).to_date ?? "";
  const remaining = expiryDateStr ? calcRemainingDays(expiryDateStr) : null;
  const isExpired = remaining === 0 && !isTokenBased;

  const packageName = isPaid
    ? (plan.data as ActiveSubscription).package_name
    : (plan.data as CurrentPlan).package_name;
  const packageType = isPaid
    ? (plan.data as ActiveSubscription).package_type
    : (plan.data as CurrentPlan).package_type;
  const isFree =
    plan.kind === "free" &&
    (plan.data as CurrentPlan).source === "active_package";

  if (isExpired) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-r from-red-50/80 via-rose-50/40 to-transparent p-5 shadow-sm">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-400/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-red-700 bg-red-100/80 border border-red-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Expired
                </span>
                <span className="text-sm font-extrabold text-slate-800">{packageName}</span>
              </div>
              <p className="text-xs text-slate-500">Your package has expired. Please renew or choose a new plan below.</p>
            </div>
          </div>
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5" /> Expired
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-transparent p-5 shadow-sm">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
      <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        {/* Left: icon + two-row info */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            {/* Row 1: label + package name */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Current Active Plan
              </span>
              <span className="text-sm font-extrabold text-slate-800">{packageName}</span>
              {isFree && (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Free Plan
                </span>
              )}
            </div>
            {/* Row 2: meta chips */}
            <div className="flex flex-wrap items-center gap-2">
              {packageType && (
                <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-white/70 rounded-full border border-slate-200">
                  {packageType}
                </span>
              )}
              {/* Token-based: show token usage */}
              {isTokenBased ? (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  {(plan.data as CurrentPlan).remaining_tokens ?? 0} /{" "}
                  {(plan.data as CurrentPlan).total_tokens ?? 0} tokens
                </span>
              ) : (
                remaining !== null && (
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {remaining} days remaining
                  </span>
                )
              )}
              {expiryDateStr && !isTokenBased && (
                <span className="text-xs text-slate-500">
                  Expires On:{" "}
                  <span className="font-semibold text-slate-600">{formatDate(expiryDateStr)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: badge */}
        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm shadow-emerald-200 flex-shrink-0">
          <CheckCircle className="w-4 h-4" /> {isFree ? "Free Plan" : "Subscription Active"}
        </Badge>
      </div>
    </div>
  );
}

interface PurchaseHistoryProps {
  history: SubscriptionHistoryItem[];
}

function PurchaseHistory({ history }: PurchaseHistoryProps) {
  if (!history || history.length === 0) return null;

  // newest first
  const sorted = [...history].sort(
    (a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
  );

  return (
    <motion.div variants={item} className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Purchase History</h2>
      </div>
      <div className="space-y-3">
        {sorted.map((entry) => (
          <BaseCard
            key={entry.name}
            className="border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="flex">
              {/* Colour accent strip */}
              <div
                className={`w-1.5 flex-shrink-0 rounded-l ${entry.is_active ? "bg-emerald-400" : "bg-slate-200"
                  }`}
              />

              {/* Card body */}
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Left: icon + info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${entry.is_active
                      ? "bg-emerald-50 border border-emerald-100"
                      : "bg-slate-50 border border-slate-100"
                      }`}
                  >
                    <ShoppingBag
                      className={`w-5 h-5 ${entry.is_active ? "text-emerald-500" : "text-slate-400"
                        }`}
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{entry.package_name}</p>
                      <Badge
                        className={`border-0 text-[10px] px-2 py-0.5 font-bold ${entry.payment_status === "Paid"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {entry.payment_status}
                      </Badge>
                    </div>

                    {/* Type + App pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.package_type && (
                        <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                          {entry.package_type}
                        </span>
                      )}
                      {entry.app_name && (
                        <span className="text-[10px] text-indigo-500 font-semibold px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">
                          {entry.app_name}
                        </span>
                      )}
                    </div>

                    {/* Dates + invoice */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 pt-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays className="w-3 h-3 text-slate-400" />
                        Purchased:{" "}
                        <span className="font-medium text-slate-600">
                          {formatDate(entry.purchase_date)}
                        </span>
                      </span>
                      {entry.expiry_date && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Expires:{" "}
                          <span className="font-medium text-slate-600">
                            {formatDate(entry.expiry_date)}
                          </span>
                        </span>
                      )}
                      {entry.sales_invoice_no && (
                        <span className="text-xs text-slate-400">
                          #{entry.sales_invoice_no}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: amount */}
                <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <p className="text-xl font-black text-slate-800">
                    ₹{(entry.amount ?? 0).toLocaleString("en-IN")}
                  </p>
                  {entry.discount > 0 && (
                    <p className="text-[10px] text-slate-400">
                      Discount: ₹{entry.discount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

              </div>
            </div>
          </BaseCard>
        ))}
      </div>
    </motion.div>
  );
}


export default function PlansTabContent() {
  const [packages, setPackages] = useState<BillingPackage[]>([]);
  const [dashboard, setDashboard] = useState<SubscriptionDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const accountType = getAccountTypeFromPath(pathname);
  const customerEmail = currentUser || "";

  const handleSelectPlan = async (plan: BillingPackage) => {
    setRedirectingPlan(plan.package_name);
    try {
      await redirectToPayment(plan, accountType, customerEmail);
    } catch (err: unknown) {
      console.error("Payment redirect failed:", err);
      setRedirectingPlan(null);
      const errMsg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
          "Failed to initiate payment. Please try again.";
      alert(errMsg);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [packagesRes, dashboardRes] = await Promise.allSettled([
          getBillingPackagesByType(accountType),
          getUserSubscriptionDashboard(),
        ]);

        if (packagesRes.status === "fulfilled") {
          const res = packagesRes.value;
          const data = res?.message?.data || res?.data || [];
          setPackages(data);
        } else {
          console.error("Failed to fetch packages", packagesRes.reason);
          throw new Error("Failed to load plans.");
        }

        if (dashboardRes.status === "fulfilled") {
          setDashboard(dashboardRes.value);
        } else {
          console.warn("Failed to fetch subscription dashboard:", dashboardRes.reason);
          // Non-fatal: plans grid still shown
        }
      } catch (err: unknown) {
        console.error("Failed to fetch billing data:", err);
        const errMsg =
          err instanceof Error
            ? err.message
            : (err as { message?: string })?.message ||
            "Failed to load plans. Please try again.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [accountType, customerEmail]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading plans...</p>
      </div>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button
          variant="outline"
          className="text-xs border-slate-200 hover:bg-slate-50"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // ---------- Empty ----------
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
          <Crown className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          No plans available for your account type.
        </p>
      </div>
    );
  }

  const maxAmount = Math.max(...packages.map((p) => p.amount));
  const displayPlan: DisplayPlan | null = dashboard?.active_subscription
    ? { kind: "paid", data: dashboard.active_subscription }
    : dashboard?.current_plan
    ? { kind: "free", data: dashboard.current_plan }
    : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* 1. Active / Expired Plan Banner */}
      {displayPlan && (
        <motion.div variants={item}>
          <ActivePlanSection plan={displayPlan} />
        </motion.div>
      )}


      {/* 2. Choose Your Plan header */}
      <motion.div variants={item}>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Choose Your Plan</h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a plan that best suits you. All plans include access to the {accountType}{" "}
          dashboard.
        </p>
      </motion.div>

      {/* 3. Plans Grid */}
      <motion.div
        variants={item}
        className={`grid grid-cols-1 ${packages.length === 1
            ? "md:grid-cols-1 max-w-md"
            : packages.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
          } gap-5`}
      >
        {packages.map((plan) => {
          const isPopular = plan.amount === maxAmount && packages.length > 1;
          return (
            <motion.div
              key={plan.package_name}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <BaseCard
                className={`border h-full flex flex-col transition-shadow duration-300 ${isPopular
                    ? "border-orange-300 shadow-lg shadow-orange-100/50 ring-1 ring-orange-200/50"
                    : "border-slate-200 hover:shadow-md"
                  }`}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 min-h-[28px]">
                    {isPopular ? (
                      <Badge className="bg-orange-500 text-white border-0 text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 mr-1" /> Best Value
                      </Badge>
                    ) : (
                      <div />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{plan.package_name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className={`text-3xl font-black ${isPopular ? "text-orange-500" : "text-slate-800"}`}>
                      ₹{plan.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {plan.no_of_days > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {plan.no_of_days} days
                      </span>
                    )}
                    {plan.package_type && (
                      <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                        {plan.package_type}
                      </span>
                    )}
                    {plan.app_name && (
                      <span className="text-[10px] text-indigo-500 font-semibold px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">
                        {plan.app_name}
                      </span>
                    )}
                  </div>
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? "text-orange-500" : "text-emerald-500"}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-4 mb-6">
                      <p className="text-xs text-slate-400 italic">No features listed</p>
                    </div>
                  )}
                  <div className="mt-auto">
                    <Button
                      className={`w-full text-sm py-2.5 h-10 font-semibold transition-all duration-200 ${isPopular
                          ? "bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm shadow-orange-200"
                          : "border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 bg-white"
                        }`}
                      variant={isPopular ? "primary" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={redirectingPlan !== null}
                    >
                      {redirectingPlan === plan.package_name ? (
                        <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Redirecting…</>
                      ) : (
                        <><Zap className="w-4 h-4 mr-1.5" /> Get Started</>
                      )}
                    </Button>
                  </div>
                </div>
              </BaseCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 4. Summary Cards */}
      {dashboard && (
        <motion.div variants={item}>
          <SummaryCards dashboard={dashboard} />
        </motion.div>
      )}

      {/* 5. Purchase History */}
      {dashboard && dashboard.history && dashboard.history.length > 0 && (
        <PurchaseHistory history={dashboard.history} />
      )}

    </motion.div>
  );
}

