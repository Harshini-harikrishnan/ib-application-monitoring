import { Metadata } from "next";
import { StatusSummary } from "@/components/dashboard/StatusSummary";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { RecentSites } from "@/components/dashboard/RecentSites";

export const metadata: Metadata = {
  title: "Dashboard | Web Monitoring",
  description: "Web monitoring application dashboard showing overall status",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your web monitoring overview for all connected sites
        </p>
      </div>
      
      <StatusSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WorldMap />
        <NotificationsPanel />
      </div>
      
      <RecentSites />
    </div>
  );
}