"use client";

import { useLayoutEffect } from "react";
import { initializeAuth } from "@/auth/initializeAuth";
import { preloadGoogleIdentityFromEnv } from "@/auth/google-identity";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  useLayoutEffect(() => {
    void initializeAuth();
    preloadGoogleIdentityFromEnv();
  }, []);

  return children;
}
