import { Metadata } from "next";
import { InsightsAnalytics } from "@/components/insights/InsightsAnalytics";

export const metadata: Metadata = {
  title: "Insights (AI) | Web Monitoring",
  description: "AI-powered analytics and insights for your monitored websites",
};

export default function InsightsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Insights (AI)</h1>
        <p className="text-muted-foreground">
          AI-powered analytics and intelligent insights for comprehensive website monitoring
        </p>
      </div>
      
      <InsightsAnalytics />
    </div>
  );
}