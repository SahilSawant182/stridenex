import DashboardLayout from "@/components/dashboards/shared/DashboardLayout";

export default function CollegeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="college">{children}</DashboardLayout>;
}
