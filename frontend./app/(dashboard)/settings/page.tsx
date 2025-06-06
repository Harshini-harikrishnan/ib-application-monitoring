import { Metadata } from "next";
import { ThemeSettings } from "@/components/settings/ThemeSettings";

export const metadata: Metadata = {
  title: "Settings | Web Monitoring",
  description: "Configure your web monitoring application preferences",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your web monitoring application preferences
        </p>
      </div>
      
      <div className="grid gap-6">
        <ThemeSettings />
      </div>
    </div>
  );
}