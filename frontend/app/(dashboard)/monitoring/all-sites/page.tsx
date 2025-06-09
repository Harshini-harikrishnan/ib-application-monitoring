import { Metadata } from "next";
import { AllSitesTable } from "@/components/monitoring/AllSitesTable";

export const metadata: Metadata = {
  title: "All Sites | Web Monitoring",
  description: "Comprehensive list of all monitored websites and services",
};

export default function AllSitesPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">All Sites</h1>
        <p className="text-muted-foreground">
          View and manage all your monitored websites
        </p>
      </div>
      
      <AllSitesTable />
    </div>
  );
}