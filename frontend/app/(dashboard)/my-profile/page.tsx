import { Metadata } from "next";
import { MyProfile } from "@/components/profile/MyProfile";

export const metadata: Metadata = {
  title: "My Profile | Web Monitoring",
  description: "Manage your profile information and account settings",
};

export default function MyProfilePage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and account settings
        </p>
      </div>
      
      <MyProfile />
    </div>
  );
}