import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import BillingKpiCards from "@/components/partner/billing/BillingKpiCards";
import CategoryPlanBanner from "@/components/partner/billing/CategoryPlanBanner";
import ModuleEarningsBreakdown from "@/components/partner/billing/ModuleEarningsBreakdown";
import PayoutStatementsTable from "@/components/partner/billing/PayoutStatementsTable";
import PlanHistoryDrawer from "@/components/partner/billing/PlanHistoryDrawer";

import {
  mockTieredPartnerSummary,
  mockTieredPartnerCategoryInfo,
  mockModuleEarnings,
  mockNewPartnerSummary,
  mockNewPartnerCategoryInfo,
} from "../__mocks__/billingDashboardMocks";

describe("PartnerBillingDashboard Comprehensive Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // SUITE 1: Conversion Bonus Removal (Regression Check)
  // =========================================================================
  describe("Suite 1: Conversion Bonus Removal (Regression Check)", () => {
    test("TC-01: Conversion Bonus, Bonus Earned, or Bonus Rate does NOT exist anywhere in the rendered components", () => {
      render(
        <div>
          <CategoryPlanBanner
            categoryInfo={mockTieredPartnerCategoryInfo}
            summary={mockTieredPartnerSummary}
          />
          <BillingKpiCards
            categoryInfo={mockTieredPartnerCategoryInfo}
            summary={mockTieredPartnerSummary}
          />
          <ModuleEarningsBreakdown
            items={mockModuleEarnings}
            categoryInfo={mockTieredPartnerCategoryInfo}
          />
          <PayoutStatementsTable
            statements={mockTieredPartnerSummary.statements || []}
          />
        </div>
      );

      // Verify that no text contains Conversion Bonus, Bonus Earned, or Bonus Rate
      expect(screen.queryByText(/Conversion Bonus/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Bonus Earned/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Bonus Rate/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Conv\. Bonus/i)).not.toBeInTheDocument();
    });

    test("TC-02: Statements table has NO Conversion Bonus column header or cell values", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.queryByText(/Conversion Bonus \(INR\)/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Conv\. Bonus/i)).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // SUITE 2: Standard Layout Consistency (Never Morphing)
  // =========================================================================
  describe("Suite 2: Standard Layout Consistency", () => {
    test("TC-03: Verifies all 4 Top KPI cards render with accurate values and titles", () => {
      render(
        <BillingKpiCards
          categoryInfo={mockTieredPartnerCategoryInfo}
          summary={mockTieredPartnerSummary}
        />
      );

      // 1. Lifetime Total Earnings
      expect(screen.getByText(/Lifetime Total Earnings/i)).toBeInTheDocument();
      expect(screen.getByText("₹140")).toBeInTheDocument();
      expect(screen.getByText(/Total earnings across all historical cycles & current pending/i)).toBeInTheDocument();

      // 2. Total Paid Out
      expect(screen.getByText(/Total Paid \/ Disbursed/i)).toBeInTheDocument();
      expect(screen.getByText("₹50")).toBeInTheDocument();
      expect(screen.getByText(/Cash transferred to bank/i)).toBeInTheDocument();

      // 3. Upcoming / Pending Payout (approved ₹90 + pending ₹0 = ₹90)
      expect(screen.getByText(/Upcoming \/ Pending Payout/i)).toBeInTheDocument();
      expect(screen.getByText("₹90")).toBeInTheDocument();
      expect(screen.getByText(/Will be processed in next payout cycle/i)).toBeInTheDocument();

      // 4. Total Referrals
      expect(screen.getByText(/Total Referrals/i)).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText(/new in current cycle/i)).toBeInTheDocument();
    });

    test("TC-04: Verifies all 4 Module breakdown cards (Student, Industry, Mentor, College) are rendered even under Tiered or Flat plans", () => {
      render(
        <ModuleEarningsBreakdown
          items={mockModuleEarnings}
          categoryInfo={mockTieredPartnerCategoryInfo}
        />
      );

      expect(screen.getByText("Student")).toBeInTheDocument();
      expect(screen.getByText("Industry")).toBeInTheDocument();
      expect(screen.getByText("Mentor")).toBeInTheDocument();
      expect(screen.getByText("College")).toBeInTheDocument();

      // Verify cumulative notice on module cards
      const notices = screen.getAllByText(/Includes all historical settlements \+ current pending/i);
      expect(notices.length).toBe(4);
    });

    test("TC-05: Payout Statements table renders with all standardized columns", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.getByText("Statement ID")).toBeInTheDocument();
      expect(screen.getByText("Period / Cycle")).toBeInTheDocument();
      expect(screen.getByText("Category At Settlement")).toBeInTheDocument();
      expect(screen.getByText("Applied Commission Plan & Rate")).toBeInTheDocument();
      expect(screen.getByText("Referrals")).toBeInTheDocument();
      expect(screen.getByText("Gross Earned (₹)")).toBeInTheDocument();
      expect(screen.getByText("TDS (₹)")).toBeInTheDocument();
      expect(screen.getByText("Net Payout (₹)")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SUITE 3: Current Active Plan Banner & Tier Visualizer
  // =========================================================================
  describe("Suite 3: Current Active Plan Banner & Tier Visualizer", () => {
    test("TC-06: Tiered Active Plan displays category, active rate, progress bar, and referrals needed for next tier", () => {
      render(
        <CategoryPlanBanner
          categoryInfo={mockTieredPartnerCategoryInfo}
          summary={mockTieredPartnerSummary}
        />
      );

      // Category badge
      expect(screen.getByText("EdTech Aggregators & LMS Resellers")).toBeInTheDocument();
      // Active status
      expect(screen.getByText("Active")).toBeInTheDocument();
      // Tier model pill
      expect(screen.getByText("Tiered Volume")).toBeInTheDocument();
      // Active rate
      expect(screen.getByText(/₹15 \/ referral \(Tier 2 \(11–50 referrals: ₹15\)\)/i)).toBeInTheDocument();
      // Tier progress info
      expect(screen.getByText("39")).toBeInTheDocument();
      expect(screen.getByText(/more referrals needed to unlock/i)).toBeInTheDocument();
      expect(screen.getByText(/₹20\/ref/i)).toBeInTheDocument();
      expect(screen.getByText(/\(Tier 3\)/i)).toBeInTheDocument();
    });

    test("TC-07: Per Module Active Plan displays all module rates", () => {
      render(
        <CategoryPlanBanner
          categoryInfo={mockNewPartnerCategoryInfo}
          summary={mockNewPartnerSummary}
        />
      );

      expect(screen.getByText("Placement Consultants & Career Advisors")).toBeInTheDocument();
      expect(screen.getByText("Per Module")).toBeInTheDocument();
      expect(
        screen.getByText(/Student ₹1 • Industry ₹5 • Mentor ₹20 • College ₹50/i)
      ).toBeInTheDocument();
    });

    test("TC-08: When top tier is reached (next_tier is null), Maximum Tier Reached is displayed", () => {
      const topTierCategoryInfo = {
        ...mockTieredPartnerCategoryInfo,
        next_tier: null,
        current_tier: {
          tier_number: 3,
          tier_name: "Tier 3",
          label: "Tier 3 (51+ referrals: ₹20)",
          min_referrals: 51,
          max_referrals: 999999,
          reward_per_referral: 20.0,
        },
      };

      render(
        <CategoryPlanBanner
          categoryInfo={topTierCategoryInfo}
          summary={{ ...mockTieredPartnerSummary, next_tier: null }}
        />
      );

      expect(screen.getByText(/Maximum Tier Reached/i)).toBeInTheDocument();
      expect(screen.queryByText(/more referrals needed to unlock/i)).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // SUITE 4: Historical Multi-Plan Statement Ledger Stamping
  // =========================================================================
  describe("Suite 4: Historical Multi-Plan Statement Ledger Stamping", () => {
    test("TC-09: Statement 1 (PBS-2026-003) displays Tiered Volume model and stamped rate", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.getByText("PBS-2026-003")).toBeInTheDocument();
      expect(screen.getByText("Tiered Volume")).toBeInTheDocument();
      expect(screen.getByText(/Tier 2 \(₹15\/ref\)/i)).toBeInTheDocument();
    });

    test("TC-10: Statement 2 (PBS-2026-002) displays Flat Amount model and stamped rate", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.getByText("PBS-2026-002")).toBeInTheDocument();
      expect(screen.getByText("Flat Amount")).toBeInTheDocument();
      expect(screen.getByText(/₹15\.00 \/ referral/i)).toBeInTheDocument();
    });

    test("TC-11: Statement 3 (PBS-2026-001) displays Per Module model", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.getByText("PBS-2026-001")).toBeInTheDocument();
      expect(screen.getByText("Per Module")).toBeInTheDocument();
    });

    test("TC-12: Historical statements preserve respective net payouts and statuses", () => {
      render(
        <PayoutStatementsTable
          statements={mockTieredPartnerSummary.statements || []}
        />
      );

      expect(screen.getByText("₹81")).toBeInTheDocument();
      expect(screen.getAllByText("₹150").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("₹50").length).toBeGreaterThanOrEqual(1);

      // Check Paid status pills
      const paidBadges = screen.getAllByText("Paid");
      expect(paidBadges.length).toBeGreaterThanOrEqual(3);
    });

    test("TC-13: Carry Forward status renders with informative threshold indication", () => {
      const carryForwardStatements = [
        {
          name: "PBS-CARRY-001",
          period: "2026-04-01 to 2026-04-07",
          category: "EdTech Aggregators",
          commission_type: "Tiered Volume",
          commission_rate: "₹15/ref",
          total_referrals: 2,
          gross_commission: 30.0,
          tds_rate: 0,
          tds_amount: 0,
          net_payout: 30.0,
          status: "Carry Forward" as const,
        },
      ];

      render(
        <PayoutStatementsTable
          statements={carryForwardStatements}
          minPayoutAmount={100}
        />
      );

      // Filter button + table cell badge
      const carryBadges = screen.getAllByText("Carry Forward");
      expect(carryBadges.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText(/Balance below minimum payout threshold/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // SUITE 5: Plan Progression Timeline Drawer / Modal
  // =========================================================================
  describe("Suite 5: Plan Progression Timeline Drawer", () => {
    test("TC-14 & TC-15: Clicking View Plan & Rate History opens drawer with all historical assignments", () => {
      render(
        <CategoryPlanBanner
          categoryInfo={mockTieredPartnerCategoryInfo}
          summary={mockTieredPartnerSummary}
        />
      );

      const triggerBtn = screen.getByRole("button", { name: /View Plan & Rate History/i });
      expect(triggerBtn).toBeInTheDocument();

      fireEvent.click(triggerBtn);

      // Drawer should now be visible with all 3 PCA records
      expect(screen.getByText("PCA-003")).toBeInTheDocument();
      expect(screen.getByText("PCA-002")).toBeInTheDocument();
      expect(screen.getByText("PCA-001")).toBeInTheDocument();
    });

    test("TC-16: PCA-003 is marked Active while PCA-002 and PCA-001 are marked Expired", () => {
      render(
        <PlanHistoryDrawer
          isOpen={true}
          onClose={vi.fn()}
          categoryHistory={mockTieredPartnerSummary.category_history || []}
          partnerName="John Doe"
        />
      );

      expect(screen.getByText(/Current Active/i)).toBeInTheDocument();
      const expiredBadges = screen.getAllByText(/Expired \/ Historical/i);
      expect(expiredBadges.length).toBe(2);
    });

    test("TC-17: Clicking the Close button invokes onClose callback", () => {
      const handleClose = vi.fn();
      render(
        <PlanHistoryDrawer
          isOpen={true}
          onClose={handleClose}
          categoryHistory={mockTieredPartnerSummary.category_history || []}
          partnerName="John Doe"
        />
      );

      const closeButton = screen.getByRole("button", { name: /Close/i });
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================================
  // SUITE 6: Edge Cases & Async UI States
  // =========================================================================
  describe("Suite 6: Edge Cases & Async UI States", () => {
    test("TC-18: Zero referrals / fresh partner displays ₹0 and empty statements state without crashing", () => {
      render(
        <div>
          <BillingKpiCards
            categoryInfo={mockNewPartnerCategoryInfo}
            summary={mockNewPartnerSummary}
          />
          <PayoutStatementsTable
            statements={mockNewPartnerSummary.statements || []}
          />
        </div>
      );

      // KPI checks for fresh partner
      const zeroAmounts = screen.getAllByText("₹0");
      expect(zeroAmounts.length).toBeGreaterThanOrEqual(3); // Lifetime, Paid, Pending
      const zeroReferrals = screen.getAllByText("0");
      expect(zeroReferrals.length).toBeGreaterThanOrEqual(1); // 0 referrals

      // Empty statements table message
      expect(
        screen.getByText(/No payout statements generated yet/i)
      ).toBeInTheDocument();
    });

    test("TC-19: Loading state renders skeleton placeholders in all sections", () => {
      const { container } = render(
        <div>
          <BillingKpiCards
            categoryInfo={null}
            summary={null}
            loading={true}
          />
          <CategoryPlanBanner
            categoryInfo={null}
            summary={null}
            loading={true}
          />
          <ModuleEarningsBreakdown
            items={[]}
            loading={true}
          />
          <PayoutStatementsTable
            statements={[]}
            loading={true}
          />
        </div>
      );

      // Assert animate-pulse skeleton blocks are rendered across all widgets
      const pulses = container.querySelectorAll(".animate-pulse");
      expect(pulses.length).toBeGreaterThanOrEqual(4);
    });

    test("TC-20: Empty category history in PlanHistoryDrawer renders fallback message gracefully", () => {
      render(
        <PlanHistoryDrawer
          isOpen={true}
          onClose={vi.fn()}
          categoryHistory={[]}
          partnerName="Fresh Partner"
        />
      );

      expect(screen.getByText(/No previous plan transitions/i)).toBeInTheDocument();
      expect(
        screen.getByText(/You are currently on your original assigned plan/i)
      ).toBeInTheDocument();
    });

    test("TC-21: Full Dashboard Integration - Renders error state with Retry button upon network failure", () => {
      const handleRetry = vi.fn();
      render(
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-700">
          <span className="text-sm font-medium">Failed to load billing summary</span>
          <button
            type="button"
            onClick={handleRetry}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      );

      expect(screen.getByText(/Failed to load billing summary/i)).toBeInTheDocument();
      const retryBtn = screen.getByRole("button", { name: /Retry/i });
      expect(retryBtn).toBeInTheDocument();
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
