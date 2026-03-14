import DashboardLayout from "@/components/dashboards/shared/DashboardLayout";

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="mentor">{children}</DashboardLayout>;
}
