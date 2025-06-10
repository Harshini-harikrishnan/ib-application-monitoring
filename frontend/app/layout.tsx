import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/contexts/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WebMonitor Dashboard",
  description: "Professional website monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}