// components/dashboards/student/PlansTabContent.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  CheckCircle,
  Sparkles,
  Clock,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBillingPackagesByType, getBillingUrl } from "@/services/common.services";
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
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Determine the account type from the current route.
 * Matches the role prefix in the URL to the correct billing API parameter.
 */
function getAccountTypeFromPath(pathname: string): string {
  if (pathname.includes("/student/")) return "Student";
  if (pathname.includes("/mentor/")) return "Mentor";
  if (pathname.includes("/industry/")) return "Industry";
  if (pathname.includes("/college/")) return "College";
  return "Student"; // fallback
}

/**
 * Fetch the billing URL from the backend and redirect to proceedpayment.html
 * with the selected package details.
 *
 * Uses the same get_billing_url API that the landing page's payNow() function calls.
 * The billing URL is NOT hardcoded — it comes from the server dynamically.
 *
 * `from_site` is the ERPNext site hostname, derived from BASE_DOMAIN.
 */
async function redirectToPayment(plan: BillingPackage): Promise<void> {
  // Derive the ERPNext site hostname for the from_site parameter
  let fromSite: string;
  try {
    fromSite = new URL(BASE_DOMAIN).hostname;
  } catch {
    fromSite = window.location.hostname;
  }

  console.log("Selected Plan:", plan);
  console.log("from_site:", fromSite);

  // 1. Fetch the billing platform URL from the backend
  const billingUrl = await getBillingUrl(fromSite);
  console.log("Billing URL (from API):", billingUrl);

  if (!billingUrl) {
    throw new Error("Billing URL not returned from server");
  }

  // 2. Build payment query parameters matching what proceedpayment.html expects
  const paymentParams = new URLSearchParams({
    from_site: fromSite,
    pkg_name: plan.package_name,
    pkg_type: plan.package_type || "",
    pkg_app: plan.app_name || plan.app || "",
    pkg_users: String(plan.no_of_users ?? ""),
    pkg_days: String(plan.no_of_days ?? ""),
    pkg_amount: String(plan.amount ?? ""),
  });

  // 3. Resolve proceedpayment.html relative to the billing URL
  //    (mirrors the HTML plans page which uses a relative redirect:
  //     window.location.href = `proceedpayment.html?${params}`)
  const proceedPaymentUrl = new URL("proceedpayment.html", billingUrl);
  const finalUrl = `${proceedPaymentUrl.origin}${proceedPaymentUrl.pathname}?${paymentParams.toString()}`;

  console.log("Redirect URL:", finalUrl);

  // 4. Redirect
  window.location.href = finalUrl;
}

export default function PlansTabContent() {
  const [packages, setPackages] = useState<BillingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const pathname = usePathname();
  const accountType = getAccountTypeFromPath(pathname);

  /**
   * Handle plan selection: fetch billing URL and redirect.
   * Shows loading state on the clicked button and disables all others.
   */
  const handleSelectPlan = async (plan: BillingPackage) => {
    setRedirectingPlan(plan.package_name);
    try {
      await redirectToPayment(plan);
    } catch (err: any) {
      console.error("Payment redirect failed:", err);
      setRedirectingPlan(null);
      alert(err?.message || "Failed to initiate payment. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      setError(null);
      try {
        const res = await getBillingPackagesByType(accountType);
        const data = res?.message?.data || res?.data || [];
        // Temporary debug log — verify actual package fields from API
        console.log("Fetched Billing Packages:", JSON.stringify(data, null, 2));
        setPackages(data);
      } catch (err: any) {
        console.error("Failed to fetch billing packages:", err);
        setError(err?.message || "Failed to load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, [accountType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading plans...</p>
      </div>
    );
  }

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

  // Find the most expensive plan to highlight it as "popular"
  const maxAmount = Math.max(...packages.map((p) => p.amount));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a plan that fits your learning journey. All plans include
          access to the {accountType} dashboard.
        </p>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        variants={item}
        className={`grid grid-cols-1 ${packages.length === 1
          ? "md:grid-cols-1 max-w-md"
          : packages.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
          } gap-5`}
      >
        {packages.map((plan, index) => {
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
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-3 min-h-[28px]">
                    {isPopular ? (
                      <Badge className="bg-orange-500 text-white border-0 text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Plan name */}
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    {plan.package_name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={`text-3xl font-black ${isPopular ? "text-orange-500" : "text-slate-800"
                        }`}
                    >
                      ₹{plan.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Duration info */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {plan.no_of_days > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {plan.no_of_days} days
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

                  {/* Features */}
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle
                            className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular
                              ? "text-orange-500"
                              : "text-emerald-500"
                              }`}
                          />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-4 mb-6">
                      <p className="text-xs text-slate-400 italic">
                        No features listed
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
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
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          Redirecting…
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-1.5" />
                          Get Started
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </BaseCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
