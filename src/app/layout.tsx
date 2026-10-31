import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteDescription =
  "Arrange local deliveries for individuals and businesses. Doot connects you with eligible logistics partners through one simple platform.";

export const metadata: Metadata = {
  title: "Doot — Local Deliveries, Simplified",
  description: siteDescription,
  openGraph: {
    title: "Doot — Local Deliveries, Simplified",
    description: siteDescription,
    type: "website",
    siteName: "Doot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doot — Local Deliveries, Simplified",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
