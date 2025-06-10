import { Metadata } from "next";
import { MyPeople } from "@/components/my-people/MyPeople";

export const metadata: Metadata = {
  title: "My People | Web Monitoring",
  description: "Team communication, chat, and collaboration tools",
};

export default function MyPeoplePage() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My People</h1>
        <p className="text-muted-foreground">
          Team communication, collaboration, and SSL alert management
        </p>
      </div>
      
      <MyPeople />
    </div>
  );
}