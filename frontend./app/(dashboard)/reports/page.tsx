import { Metadata } from "next";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

export const metadata: Metadata = {
  title: "Reports | Web Monitoring",
  description: "Generate and view detailed reports for your monitored websites",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download detailed reports for your monitored websites
        </p>
      </div>
      
      <ReportGenerator />
    </div>
  );
}