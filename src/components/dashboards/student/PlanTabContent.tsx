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
} from "lucide-react";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBillingPackagesByType, getBillingUrl } from "@/services/common.services";
import { getUserPackages, getPackageRemainingDays } from "@/services/student.services";
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

interface ActivePackage {
  billing_package: string;
  app_name?: string;
  billing_role?: string;
}

interface PackageRemainingDays {
  success: boolean;
  status?: string;
  billing_package?: string;
  from_date?: string;
  to_date?: string;
  remaining_days?: number;
  message?: string;
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
async function redirectToPayment(
  plan: BillingPackage,
  accountType: string,
  customerEmail: string
): Promise<void> {
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

  // 3. Resolve proceedpayment.html relative to the billing URL
  //    (mirrors the HTML plans page which uses a relative redirect:
  //     window.location.href = `proceedpayment.html?${params}`)
  const proceedPaymentUrl = new URL("proceedpayment.html", billingUrl);
  const finalUrl = `${proceedPaymentUrl.origin}${proceedPaymentUrl.pathname}?${paymentParams.toString()}`;

  console.log("Account Type:", accountType);
  console.log("Customer Email:", customerEmail);
  console.log("Final Payment URL:", finalUrl);

  // 4. Redirect
  window.location.href = finalUrl;
}

export default function PlansTabContent() {
  const [packages, setPackages] = useState<BillingPackage[]>([]);
  const [activePackages, setActivePackages] = useState<ActivePackage[]>([]);
  const [remainingDays, setRemainingDays] = useState<PackageRemainingDays | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const accountType = getAccountTypeFromPath(pathname);
  const customerEmail = currentUser || "";

  /**
   * Handle plan selection: fetch billing URL and redirect.
   * Shows loading state on the clicked button and disables all others.
   */
  const handleSelectPlan = async (plan: BillingPackage) => {
    setRedirectingPlan(plan.package_name);
    try {
      await redirectToPayment(plan, accountType, customerEmail);
    } catch (err: unknown) {
      console.error("Payment redirect failed:", err);
      setRedirectingPlan(null);
      const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to initiate payment. Please try again.";
      alert(errMsg);
    }
  };

  useEffect(() => {
    async function fetchPackagesAndActive() {
      setLoading(true);
      setError(null);
      try {
        const [packagesRes, activeRes, remainingDaysRes] = await Promise.allSettled([
          getBillingPackagesByType(accountType),
          customerEmail ? getUserPackages(customerEmail) : Promise.reject("No user email"),
          customerEmail ? getPackageRemainingDays(customerEmail) : Promise.reject("No user email")
        ]);

        if (packagesRes.status === "fulfilled") {
          const res = packagesRes.value;
          const data = res?.message?.data || res?.data || [];
          setPackages(data);
        } else {
          console.error("Failed to fetch packages", packagesRes.reason);
          throw new Error("Failed to load plans.");
        }

        if (activeRes.status === "fulfilled") {
          const res = activeRes.value;
          const pkgData = res?.message || res?.data || res;
          if (pkgData && pkgData.active_packages) {
            setActivePackages(pkgData.active_packages);
          }
        }

        if (remainingDaysRes.status === "fulfilled") {
          const res = remainingDaysRes.value;
          const data = res?.message || res?.data || res;
          setRemainingDays(data);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch billing data:", err);
        const errMsg = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to load plans. Please try again.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }
    fetchPackagesAndActive();
  }, [accountType, customerEmail]);

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


      {/* Active / Expired Plan Section */}
      {((activePackages && activePackages.length > 0) ||
        (remainingDays && (remainingDays.status === "Expired" || remainingDays.remaining_days === 0))) && (
        <motion.div variants={item} className="mb-6">
          {remainingDays && (remainingDays.status === "Expired" || remainingDays.remaining_days === 0) ? (
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-50/80 via-rose-50/50 to-transparent p-6 shadow-sm">
              {/* Ambient background glows */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-400/10 rounded-full blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 flex-shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-red-700 bg-red-100/80 border border-red-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        Plan Status
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                        {remainingDays.message || "Package expired"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Please renew or subscribe to a new plan below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center self-start">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm shadow-red-100">
                    <AlertCircle className="w-4 h-4" /> Package expired
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-transparent p-6 shadow-sm">
              {/* Ambient background glows */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Current Active Plan
                      </span>
                    </div>
                    <div className="space-y-2">
                      {activePackages.map((pkg: ActivePackage, idx: number) => {
                        const isMatchingPkg = !remainingDays?.billing_package || remainingDays?.billing_package === pkg.billing_package;
                        return (
                          <div key={idx} className={idx > 0 ? "pt-2 mt-2 border-t border-slate-100" : ""}>
                            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                              {pkg.billing_package}
                            </h3>
                            <div className="flex flex-col gap-1.5 mt-1.5">
                              {/* {pkg.billing_role && (
                                <p className="text-xs text-slate-500">
                                  Role: <span className="font-semibold text-slate-600">{pkg.billing_role}</span>
                                </p>
                              )} */}
                              {isMatchingPkg && remainingDays && (
                                <>
                                  {remainingDays.remaining_days !== undefined && remainingDays.remaining_days > 0 ? (
                                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                      {remainingDays.remaining_days} days remaining
                                    </p>
                                  ) : (
                                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-0.5">
                                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                      {remainingDays.message || "Package expired"}
                                    </p>
                                  )}
                                  {remainingDays.to_date && (
                                    <p className="text-xs text-slate-500">
                                      Active till: <span className="font-semibold text-slate-600">{remainingDays.to_date}</span>
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center self-start">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm shadow-emerald-100">
                    <CheckCircle className="w-4 h-4" /> Subscription Active
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a plan that best suits you. All plans include access to the {accountType} dashboard.
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
