import PrivateAuthGate from "@/auth/PrivateAuthGate";
import DashboardShell from "@/dashboard/components/DashboardShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateAuthGate>
      <DashboardShell>{children}</DashboardShell>
    </PrivateAuthGate>
  );
}
