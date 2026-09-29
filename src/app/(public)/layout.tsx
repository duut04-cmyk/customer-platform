import ClientProviders from "@/common/components/ClientProviders";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
