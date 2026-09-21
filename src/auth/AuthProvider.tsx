"use client";

import { useLayoutEffect } from "react";
import { initializeAuth } from "@/auth/initializeAuth";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  useLayoutEffect(() => {
    void initializeAuth();
  }, []);

  return children;
}
