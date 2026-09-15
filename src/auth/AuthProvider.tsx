"use client";

import { useEffect } from "react";
import { initializeAuth } from "@/auth/initializeAuth";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    void initializeAuth();
  }, []);

  return children;
}
