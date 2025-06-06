import { Metadata } from "next";
import { SSLExpiry } from "@/components/monitoring/SSLExpiry";

export const metadata: Metadata = {
  title: "SSL Certificate Monitoring | Web Monitoring",
  description: "Track SSL certificate expiration dates across all websites",
};

export default function SSLExpiryPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">SSL Certificate Monitoring</h1>
        <p className="text-muted-foreground">
          Track SSL certificate expiration dates and receive timely alerts
        </p>
      </div>
      
      <SSLExpiry />
    </div>
  );
}