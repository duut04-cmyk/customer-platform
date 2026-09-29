import PrivateAuthGate from "@/auth/PrivateAuthGate";
import ClientProviders from "@/common/components/ClientProviders";
import DashboardShell from "@/dashboard/components/DashboardShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <PrivateAuthGate>
        <DashboardShell>{children}</DashboardShell>
      </PrivateAuthGate>
    </ClientProviders>
  );
}
