import { Metadata } from "next";
import { AllSitesTable } from "@/components/monitoring/AllSitesTable";

export const metadata: Metadata = {
  title: "Important Sites | Web Monitoring",
  description: "Starred important monitored websites",
};

export default function ImportantSitesPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Important Sites</h1>
        <p className="text-muted-foreground">
          View your starred/important websites only
        </p>
      </div>

      <AllSitesTable showOnlyFavorites={true} />
    </div>
  );
}
