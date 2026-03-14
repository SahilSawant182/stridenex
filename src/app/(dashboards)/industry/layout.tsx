import DashboardLayout from "@/components/dashboards/shared/DashboardLayout";

export default function IndustryDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="industry">{children}</DashboardLayout>;
}
