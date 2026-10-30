export interface UserInfo {
  email: string;
  full_name: string;
  roles: string[];
  role_label: "Student" | "Mentor" | "Instructor" | "College" | "Industry" | "Partner" | "Course Creator" | string;
  account_view: "organization" | "mentor" | "student";
  is_mentor: boolean;
  is_organization: boolean;
  is_student: boolean;
}

export interface ActivePlan {
  name: string;
  package_type: string;
  duration: string;
  purchase_date: string | null;
  expiry_date: string | null;
  invoice_no: string;
  invoice_url: string | null;
}

export interface PaymentSummary {
  currency: string;
  account_view: "organization" | "mentor" | "student";
  role_label: string;
  total_spent: number;
  total_transactions: number;
  plans_count: number;
  plans_spent: number;
  // Student metrics
  sessions_count?: number;
  sessions_spent?: number;
  courses_count?: number;
  courses_spent?: number;
  // Mentor metrics
  mentor_sessions_count?: number;
  mentor_total_earnings?: number;
  // Active plan for College/Industry/Mentors
  active_plan?: ActivePlan | null;
}

export interface MentorEarningsSummary {
  total_sessions_conducted: number;
  completed_sessions: number;
  total_earnings: number;
  pending_payout_count: number;
  currency: string;
}

export interface CategoryTab {
  key: "all" | "plan" | "mentorship" | "course" | "conducted_session" | string;
  label: string;
  count: number;
}

export interface PaymentItem {
  id: string;
  category: "plan" | "mentorship" | "course" | "conducted_session" | string;
  category_label: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string; // "Paid", "Completed", "Active", "Pending", "Cancelled"
  status_badge?: "success" | "warning" | "danger";
  date: string;
  created_at?: string;
  payment_id?: string;
  invoice_no?: string;
  invoice_url?: string | null;
  download_url?: string | null;
  payout_status?: string; // For conducted_session
  payout_reference?: string;
  meta?: Record<string, any>;
}

export interface UnifiedPaymentHistoryData {
  user_info: UserInfo;
  summary: PaymentSummary;
  categories: CategoryTab[];
  pagination: {
    page: number;
    page_length: number;
    total_items: number;
    total_pages: number;
  };
  payments: PaymentItem[];
  mentor_earnings_summary?: MentorEarningsSummary | null;
}

export interface PaymentHistoryResponse {
  message: {
    status: number;
    success: boolean;
    data: UnifiedPaymentHistoryData;
  };
}
