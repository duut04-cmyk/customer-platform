"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={6000}
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}
