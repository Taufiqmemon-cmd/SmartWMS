import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthBoundary } from "@/components/auth-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartWMS | Warehouse Management",
  description: "SmartWMS warehouse and inventory management system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Suspense fallback={<main role="status" className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Loading SmartWMS…</main>}><AuthBoundary>{children}</AuthBoundary></Suspense></body>
    </html>
  );
}
