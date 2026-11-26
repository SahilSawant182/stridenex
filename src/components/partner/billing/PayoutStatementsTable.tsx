"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  HelpCircle,
  Receipt,
  Search,
  X,
} from "lucide-react";
import type { PartnerBillingStatement, PayoutStatus } from "@/types/partnerBilling.types";
import { exportToCsv, formatINR } from "@/services/partnerBilling.services";

interface PayoutStatementsTableProps {
  statements: PartnerBillingStatement[];
  minPayoutAmount?: number;
  loading?: boolean;
}

const STATUS_OPTIONS: ("All" | PayoutStatus)[] = [
  "All",
  "Pending",
  "Approved",
  "Paid",
  "Carry Forward",
  "On Hold",
];

function getStatusBadgeStyle(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case "Paid":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
    case "Approved":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    case "Pending":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case "Carry Forward":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    case "On Hold":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
      };
  }
}

function getPeriodLabel(row: PartnerBillingStatement): string {
  if (row.period) return row.period;
  const start = row.period_start || row.start_date;
  const end = row.period_end || row.end_date;
  if (start && end) return `${start} to ${end}`;
  return start || end || "—";
}

function formatAppliedPlanRate(row: PartnerBillingStatement): { model: string; rate: string } {
  const model = row.commission_type || "Standard";
  let rate = "";

  if (row.commission_rate) {
    if (typeof row.commission_rate === "string") {
      rate = row.commission_rate;
    } else if (typeof row.commission_rate === "number") {
      rate = `${formatINR(row.commission_rate)} / ref`;
    } else if (typeof row.commission_rate === "object") {
      rate = Object.entries(row.commission_rate)
        .map(([k, v]) => `${k}: ${formatINR(v as number)}`)
        .join(", ");
    }
  }

  if (!rate) {
    rate = model;
  }

  return { model, rate };
}

export default function PayoutStatementsTable({
  statements,
  minPayoutAmount = 0,
  loading = false,
}: PayoutStatementsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const filteredStatements = useMemo(() => {
    return statements.filter((row) => {
      if (statusFilter !== "All" && row.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const idStr = (row.name || "").toLowerCase();
        const catStr = (row.category || "").toLowerCase();
        const periodStr = getPeriodLabel(row).toLowerCase();
        const modelStr = (row.commission_type || "").toLowerCase();
        const rateStr = String(row.commission_rate || "").toLowerCase();
        if (
          !idStr.includes(q) &&
          !catStr.includes(q) &&
          !periodStr.includes(q) &&
          !modelStr.includes(q) &&
          !rateStr.includes(q)
        ) {
          return false;
        }
      }

      const rowDateStr = row.payment_date || row.period_start || row.start_date || "";
      if (fromDate && rowDateStr && rowDateStr < fromDate) return false;
      if (toDate && rowDateStr && rowDateStr > toDate) return false;

      return true;
    });
  }, [statements, statusFilter, searchQuery, fromDate, toDate]);

  const handleExportCsv = () => {
    exportToCsv(
      `partner-payout-statements-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "Statement ID",
        "Period / Cycle",
        "Category At Settlement",
        "Commission Model",
        "Applied Rate",
        "Referrals",
        "Gross Earned (INR)",
        "TDS Deducted (INR)",
        "Net Payout (INR)",
        "Status",
        "Payment Date",
        "Invoice Reference",
      ],
      filteredStatements.map((row) => {
        const { model, rate } = formatAppliedPlanRate(row);
        return [
          row.name || "",
          getPeriodLabel(row),
          row.category || "—",
          model,
          rate,
          row.total_referrals ?? 0,
          row.gross_commission ?? 0,
          row.tds_amount ?? row.tds_deducted ?? 0,
          row.net_payout ?? 0,
          row.status,
          row.payment_date || "Pending Release",
          row.purchase_invoice || "—",
        ];
      })
    );
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setSearchQuery("");
    setFromDate("");
    setToDate("");
  };

  const hasActiveFilters =
    statusFilter !== "All" || searchQuery.trim() !== "" || fromDate !== "" || toDate !== "";

  if (loading) {
    return (
      <div className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-64 bg-slate-200 rounded" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header & Export */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Historical Payout Statements &amp; Cycle Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transparent audit of every settled cycle stamping the exact category and commission rate applied at that time
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filteredStatements.length === 0}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export Statements ({filteredStatements.length})
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                statusFilter === status
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search & Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, category, rate..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="From date"
              className="text-xs text-slate-700 focus:outline-none bg-transparent"
            />
            <span className="text-slate-400 text-xs">–</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="To date"
              className="text-xs text-slate-700 focus:outline-none bg-transparent"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Statements Table */}
      {filteredStatements.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No payout statements generated yet
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {hasActiveFilters
              ? "No statements match the selected status or date filters. Clear filters to see all records."
              : "Statements are automatically generated when a billing cycle concludes and payouts are processed."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Statement ID</th>
                <th className="py-3.5 px-3">Period / Cycle</th>
                <th className="py-3.5 px-3">Category At Settlement</th>
                <th className="py-3.5 px-3">Applied Commission Plan &amp; Rate</th>
                <th className="py-3.5 px-3 text-right">Referrals</th>
                <th className="py-3.5 px-3 text-right">Gross Earned (₹)</th>
                <th className="py-3.5 px-3 text-right">TDS (₹)</th>
                <th className="py-3.5 px-3 text-right">Net Payout (₹)</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStatements.map((row, idx) => {
                const tdsVal = Number(row.tds_amount ?? row.tds_deducted ?? 0);
                const isCarryForward = row.status === "Carry Forward";
                const badge = getStatusBadgeStyle(row.status);
                const { model, rate } = formatAppliedPlanRate(row);

                return (
                  <tr
                    key={row.name || `${getPeriodLabel(row)}-${idx}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* 1. Statement ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                      {row.name || "—"}
                    </td>

                    {/* 2. Period / Cycle */}
                    <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap text-xs font-medium">
                      {getPeriodLabel(row)}
                    </td>

                    {/* 3. Category At Settlement */}
                    <td className="py-3.5 px-3 text-slate-800 whitespace-nowrap text-xs font-semibold">
                      {row.category || "—"}
                    </td>

                    {/* 4. Applied Commission Plan & Rate */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-slate-900 font-bold">{model}</strong>
                        {rate && rate !== model && (
                          <span className="text-slate-500 font-medium">({rate})</span>
                        )}
                      </div>
                    </td>

                    {/* 5. Referrals */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700 whitespace-nowrap">
                      {Number(row.total_referrals ?? 0).toLocaleString("en-IN")}
                    </td>

                    {/* 6. Gross Earned */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                      {formatINR(row.gross_commission)}
                    </td>

                    {/* 7. TDS */}
                    <td className="py-3.5 px-3 text-right font-medium text-rose-600 whitespace-nowrap">
                      {tdsVal > 0 ? `-${formatINR(tdsVal)}` : formatINR(0)}
                    </td>

                    {/* 8. Net Payout */}
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(row.net_payout)}
                    </td>

                    {/* 9. Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {row.status}
                        </span>

                        {isCarryForward && (
                          <div className="relative group">
                            <HelpCircle className="w-3.5 h-3.5 text-orange-500 cursor-help" />
                            <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 w-60 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] leading-relaxed shadow-xl z-30 whitespace-normal">
                              Balance below minimum payout threshold
                              {minPayoutAmount > 0 ? ` (${formatINR(minPayoutAmount)})` : ""}.
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 10. Date */}
                    <td className="py-3.5 px-4 text-right text-slate-600 whitespace-nowrap text-xs">
                      {row.payment_date || (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
