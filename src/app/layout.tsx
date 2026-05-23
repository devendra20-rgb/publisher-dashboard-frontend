import type { Metadata } from "next";

import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";

import { Toaster } from "@/components/ui/sonner";

import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Publisher Admin Dashboard",
  description:
    "Monitor publisher onboarding from multiple Google Sheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <AppShell>
          {children}
        </AppShell>

        <Toaster />
      </body>
    </html>
  );
}