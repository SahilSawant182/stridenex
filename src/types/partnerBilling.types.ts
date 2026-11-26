export type CommissionType =
  | "Per Module"
  | "Flat Amount"
  | "Tiered Volume"
  | "Flat Rate"
  | "Tiered"
  | string;

export type PayoutCycle =
  | "Monthly"
  | "Weekly"
  | "Quarterly"
  | "Custom Days"
  | "Manual"
  | string;

export type PayoutStatus =
  | "Pending"
  | "Approved"
  | "Paid"
  | "On Hold"
  | "Carry Forward"
  | string;

export interface ModuleRateItem {
  module: string;
  rate?: number;
  commission_rate?: number;
  reward_per_referral?: number;
  /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
  conversion_bonus?: number;
}

export interface TierRateItem {
  tier_number?: number;
  tier_name?: string;
  label?: string;
  min_referrals: number;
  max_referrals: number | null;
  rate?: number;
  reward_per_referral?: number;
  commission_rate?: number;
  commission_percentage?: number;
}

export interface TierProgressInfo {
  tier_number: number;
  tier_name: string;
  label: string;
  min_referrals: number;
  max_referrals: number;
  reward_per_referral: number;
}

export interface PartnerCategoryHistoryItem {
  name: string;
  category: string;
  commission_type: string;
  effective_from: string;
  effective_to?: string | null;
  status: "Active" | "Expired" | string;
}

export interface PartnerBillingSummary {
  partner?: number | string;
  partner_name?: string;
  partner_email?: string;
  organisation?: string;
  referal_code?: string;
  referral_code?: string;
  has_active_category?: boolean;
  category?: string | null;
  active_category?: string | null;
  commission_type?: CommissionType | null;
  commission_rate?: Record<string, number> | number | string | null;
  reward_structure?: Record<string, number> | number | string | null;
  applicable_rate?: number | string | null;
  applicable_rates?: Record<string, number> | ModuleRateItem[] | TierRateItem[] | null;
  rate_display?: string | null;
  active_commission_plan_price?: number;
  current_tier?: TierProgressInfo;
  next_tier?: TierProgressInfo | null;
  referrals_needed_for_next_tier?: number;
  total_referrals_lifetime?: number;
  lifetime_referrals?: number;
  total_referrals?: number;
  total_referrals_this_month?: number;
  current_month_referrals?: number;
  month_referrals?: number;
  total_earned_lifetime?: number;
  total_earned?: number;
  total_paid?: number;
  total_paid_amount?: number;
  approved_payout_amount?: number;
  pending_payout_amount?: number;
  pending_payout?: number;
  carry_forward_amount?: number;
  min_payout_amount?: number;
  payout_cycle?: PayoutCycle;
  /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
  conversion_bonus?: number;
  billing_settings?: string | PartnerBillingSettings | null;
  statements?: PartnerBillingStatement[];
  category_history?: PartnerCategoryHistoryItem[];
}

export interface TdsConfig {
  tds_applicable?: boolean | number;
  tds_rate?: number;
  tds_percentage?: number;
  tds_threshold?: number;
}

export interface PartnerBillingSettings {
  commission_type?: CommissionType;
  flat_rate?: number;
  commission_rate?: number | Record<string, number>;
  module_rates?: Record<string, number> | ModuleRateItem[];
  tiers?: TierRateItem[];
  tier_rates?: TierRateItem[];
  payout_cycle?: PayoutCycle;
  min_payout_amount?: number;
  reward_per_referral?: number;
  /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
  conversion_bonus?: number;
  tds_applicable?: boolean | number;
  tds_rate?: number;
  tds_percentage?: number;
  tds_threshold?: number;
  tds_config?: TdsConfig;
}

export interface PartnerCategoryInfo {
  partner?: string;
  partner_name?: string;
  partner_email?: string;
  has_active_category?: boolean;
  category?: string | null;
  category_name?: string | null;
  category_code?: string | null;
  partner_category?: {
    name?: string;
    category_name?: string;
    badge_color?: string;
    description?: string;
  } | null;
  assignment?: Record<string, unknown> | null;
  assignment_id?: number | string | null;
  billing_settings?: string | PartnerBillingSettings | null;
  settings?: PartnerBillingSettings | null;
  settings_name?: string | null;
  commission_type?: CommissionType;
  payout_cycle?: PayoutCycle;
  min_payout_amount?: number;
  active_commission_plan_price?: number;
  reward_per_referral?: number;
  /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
  conversion_bonus?: number;
  flat_reward_amount?: number;
  student_reward_amount?: number;
  industry_reward_amount?: number;
  mentor_reward_amount?: number;
  college_reward_amount?: number;
  flat_commission_rate?: number;
  student_commission_rate?: number;
  college_commission_rate?: number;
  mentor_commission_rate?: number;
  industry_commission_rate?: number;
  commission_tiers?: TierRateItem[];
  current_tier?: TierProgressInfo;
  next_tier?: TierProgressInfo | null;
  referrals_needed_for_next_tier?: number;
  total_referrals?: number;
  tds_applicable?: 0 | 1 | boolean | number;
  tds_rate?: number;
  tds_threshold?: number;
  tds_percentage?: number;
  tds_config?: TdsConfig;
  module_rates?: Record<string, number> | ModuleRateItem[];
  tiers?: TierRateItem[];
}

export interface PartnerBillingStatement {
  name: string;
  period: string;
  period_start?: string;
  period_end?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  commission_type?: string;
  commission_rate?: string | number | Record<string, number>;
  total_referrals?: number;
  converted_referrals?: number;
  gross_commission: number;
  /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
  conversion_bonus?: number;
  tds_rate?: number;
  tds_amount: number;
  tds_deducted?: number;
  net_payout: number;
  status: PayoutStatus;
  payment_date?: string | null;
  transaction_reference?: string | null;
  utr_reference?: string | null;
  payout_slip_pdf?: string | null;
  purchase_invoice?: string | null;
  remarks?: string | null;
}

export type PartnerStatement = PartnerBillingStatement;

export interface ModuleEarningItem {
  module: "Student" | "College" | "Mentor" | "Industry" | string;
  count?: number;
  referral_count: number;
  converted_count?: number;
  earned_amount: number;
  rate?: number;
}

export type ModuleEarning = ModuleEarningItem;
export type ModuleEarningsResponse = ModuleEarningItem[];

export interface PartnerPayoutSheet {
  name: string;
  start_date?: string;
  end_date?: string;
  payout_cycle?: string;
  status?: string;
  total_partners?: number;
  total_net_payout?: number;
  total_gross_commission?: number;
  creation?: string;
  released_on?: string;
}

export interface OnboardingPartnerCategory {
  category_name: string;
  category_code: string;
  badge?: string | null;
  description: string;
  features: string[];
  billing_settings: string;
  reward_structure: {
    type: "Per Module" | "Flat Amount" | "Tiered Volume";
    student?: number;
    industry?: number;
    mentor?: number;
    college?: number;
    flat_reward?: number;
    /** @deprecated Deprecated by business - partner commissions are based purely on Referral Rewards */
    conversion_bonus?: number;
    tiers?: Array<{ min: number; max: number; reward: number }>;
  };
}
