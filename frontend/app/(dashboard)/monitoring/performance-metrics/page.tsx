import { Metadata } from "next";
import { PerformanceMetrics } from "@/components/monitoring/PerformanceMetrics";

export const metadata: Metadata = {
  title: "Performance Metrics | Web Monitoring",
  description: "Detailed performance metrics for monitored websites",
};

export default function PerformanceMetricsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Performance Metrics</h1>
        <p className="text-muted-foreground">
          Detailed performance analytics and metrics for your websites
        </p>
      </div>
      
      <PerformanceMetrics />
    </div>
  );
}