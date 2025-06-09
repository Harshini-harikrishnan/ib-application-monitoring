import { Metadata } from "next";
import { ManageSites } from "@/components/manage-sites/ManageSites";

export const metadata: Metadata = {
  title: "Manage Sites | Web Monitoring",
  description: "Add, edit, and manage your monitored websites",
};

export default function ManageSitesPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Manage Sites</h1>
        <p className="text-muted-foreground">
          Add new sites to monitor and manage existing ones
        </p>
      </div>
      
      <ManageSites />
    </div>
  );
}