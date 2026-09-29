"use client";

import AuthProvider from "@/auth/AuthProvider";
import AppToaster from "@/common/components/AppToaster";

type ClientProvidersProps = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <AppToaster />
    </AuthProvider>
  );
}
