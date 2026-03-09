import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalesHub - Sales Data Analysis & Business Insights Dashboard",
  description: "Modern analytics dashboard for sales data analysis with interactive charts, KPI metrics, and AI-powered business insights. Built with Next.js, React, and Python FastAPI.",
  keywords: ["Sales Analytics", "Dashboard", "Next.js", "React", "FastAPI", "Python", "Data Visualization", "Business Intelligence"],
  authors: [{ name: "SalesHub Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SalesHub - Sales Analytics Dashboard",
    description: "Professional sales data analysis and business insights dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesHub - Sales Analytics Dashboard",
    description: "Professional sales data analysis and business insights dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
