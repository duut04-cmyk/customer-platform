import DashboardShell from "@/dashboard/components/DashboardShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
