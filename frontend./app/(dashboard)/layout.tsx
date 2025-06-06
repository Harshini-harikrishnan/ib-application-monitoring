"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="light">
      <PageLayout>{children}</PageLayout>
    </ThemeProvider>
  );
}