import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/auth/AuthProvider";
import AppToaster from "@/common/components/AppToaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Doot",
  description:
    "Doot finds the best delivery option, shows transparent pricing, and books after you approve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <AppToaster />
      </body>
    </html>
  );
}
