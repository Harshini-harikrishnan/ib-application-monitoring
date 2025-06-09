import { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About | WebMonitor - Indian Bank",
  description: "Explore Indian Bank's in-house WebMonitor platform designed for secure and real-time digital infrastructure monitoring.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">About WebMonitor</h1>
        <p className="text-muted-foreground">
          Real-time infrastructure monitoring built by Indian Bank for secure and seamless banking operations
        </p>
      </div>

      <AboutContent />
    </div>
  );
}
