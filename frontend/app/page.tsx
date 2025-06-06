import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gauge, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold text-xl">WebMonitor</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 md:px-20 lg:px-32 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Professional Website Monitoring
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your web applications in real-time with comprehensive analytics, 
            performance metrics, and intelligent alerts.
          </p>
          <div className="pt-6">
            <Button size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track uptime, response times, and performance metrics in real-time across all your websites.
                </p>
              </div>
              <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">SSL Certificate Tracking</h3>
                <p className="text-muted-foreground">
                  Never miss an SSL expiration with automated alerts and detailed certificate monitoring.
                </p>
              </div>
              <div className="bg-card shadow-sm rounded-lg p-6 text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights with detailed reports and performance analytics for all your websites.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5" />
              <span className="font-bold">WebMonitor</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WebMonitor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}