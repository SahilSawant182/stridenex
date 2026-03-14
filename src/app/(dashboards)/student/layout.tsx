import DashboardLayout from "@/components/dashboards/shared/DashboardLayout";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="student">{children}</DashboardLayout>;
}
