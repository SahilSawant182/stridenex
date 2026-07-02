
export interface SubscriptionSummary {
  total_spent: number;
  total_purchases: number;
  active_subscription: boolean;
  current_package: string | null;
  current_package_type: string | null;
  next_expiry: string | null;
}

export interface ActiveSubscription {
  name: string;
  package_name: string;
  package_type: string;
  app_name: string;
  amount: number;
  discount: number;
  currency: string;
  payment_status: string;
  purchase_date: string;
  expiry_date: string;
  is_active: boolean;
  sales_invoice_no: string;
}

export interface SubscriptionHistoryItem {
  name: string;
  package_name: string;
  package_type: string;
  app_name: string;
  amount: number;
  discount: number;
  currency: string;
  payment_status: string;
  purchase_date: string;
  expiry_date: string;
  is_active: boolean;
  sales_invoice_no: string;
}

export interface SubscriptionDashboardResponse {
  status: "success" | "error";
  summary: SubscriptionSummary;
  active_subscription: ActiveSubscription | null;
  history: SubscriptionHistoryItem[];
}
