import { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Web Monitoring",
  description: "Create your web monitoring account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <SignupForm />
    </div>
  );
}