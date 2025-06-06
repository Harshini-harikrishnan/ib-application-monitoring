"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Globe, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusSummaryCardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

function StatusSummaryCard({
  title,
  count,
  description,
  icon,
  className,
  iconClassName,
}: StatusSummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-1 rounded-full", iconClassName)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatusSummary() {
  // In a real application, this data would come from an API
  const statusData = {
    totalSites: 124,
    upSites: 118,
    downSites: 3,
    maintenanceSites: 3,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusSummaryCard
        title="Total Sites"
        count={statusData.totalSites}
        description="Sites linked to this application"
        icon={<Globe className="h-4 w-4" />}
        iconClassName="bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
      />
      <StatusSummaryCard
        title="Up Sites"
        count={statusData.upSites}
        description="Sites operating normally"
        icon={<Activity className="h-4 w-4" />}
        iconClassName="bg-green-100 text-green-500 dark:bg-green-900/20 dark:text-green-400"
      />
      <StatusSummaryCard
        title="Down Sites"
        count={statusData.downSites}
        description="Sites currently down"
        icon={<AlertTriangle className="h-4 w-4" />}
        iconClassName="bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400"
      />
      <StatusSummaryCard
        title="Under Maintenance"
        count={statusData.maintenanceSites}
        description="Sites in maintenance mode"
        icon={<Clock className="h-4 w-4" />}
        iconClassName="bg-amber-100 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
      />
    </div>
  );
}