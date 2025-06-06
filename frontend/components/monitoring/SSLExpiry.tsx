"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for SSL certificates
const mockSSLData = [
  {
    id: "ssl_001",
    domain: "example.com",
    expiryDate: "2025-04-15",
    daysRemaining: 328,
    alertsSent: true,
    status: "valid", // valid, expiring, critical
  },
  {
    id: "ssl_002",
    domain: "api.example.com",
    expiryDate: "2024-06-22",
    daysRemaining: 28,
    alertsSent: true,
    status: "expiring",
  },
  {
    id: "ssl_003",
    domain: "portal.example.com",
    expiryDate: "2024-06-08",
    daysRemaining: 14,
    alertsSent: true,
    status: "expiring",
  },
  {
    id: "ssl_004",
    domain: "docs.example.com",
    expiryDate: "2024-06-01",
    daysRemaining: 7,
    alertsSent: true,
    status: "critical",
  },
  {
    id: "ssl_005",
    domain: "blog.example.com",
    expiryDate: "2024-05-26",
    daysRemaining: 2,
    alertsSent: true,
    status: "critical",
  },
  {
    id: "ssl_006",
    domain: "auth.example.com",
    expiryDate: "2025-02-18",
    daysRemaining: 271,
    alertsSent: false,
    status: "valid",
  },
  {
    id: "ssl_007",
    domain: "shop.example.com",
    expiryDate: "2024-12-05",
    daysRemaining: 194,
    alertsSent: false,
    status: "valid",
  },
  {
    id: "ssl_008",
    domain: "media.example.com",
    expiryDate: "2025-01-12",
    daysRemaining: 232,
    alertsSent: false,
    status: "valid",
  },
  {
    id: "ssl_009",
    domain: "admin.example.com",
    expiryDate: "2024-10-30",
    daysRemaining: 158,
    alertsSent: false,
    status: "valid",
  },
  {
    id: "ssl_010",
    domain: "status.example.com",
    expiryDate: "2024-08-17",
    daysRemaining: 84,
    alertsSent: false,
    status: "valid",
  },
];

// Prepare data for donut chart
const chartData = [
  { name: "Critical (< 7 days)", value: mockSSLData.filter(cert => cert.daysRemaining <= 7).length, color: "hsl(0, 84.2%, 60.2%)" },
  { name: "Expiring (< 30 days)", value: mockSSLData.filter(cert => cert.daysRemaining > 7 && cert.daysRemaining <= 30).length, color: "hsl(38, 92%, 50%)" },
  { name: "Valid (1-3 months)", value: mockSSLData.filter(cert => cert.daysRemaining > 30 && cert.daysRemaining <= 90).length, color: "hsl(220, 85%, 65%)" },
  { name: "Valid (> 3 months)", value: mockSSLData.filter(cert => cert.daysRemaining > 90).length, color: "hsl(143, 85%, 40%)" },
];

export function SSLExpiry() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">SSL Certificate Status</h2>
        <p className="text-muted-foreground">
          Monitor SSL certificate expiration dates across all sites
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>SSL Certificates Overview</CardTitle>
            <CardDescription>
              Distribution of certificate expiration dates
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expiring Certificates</CardTitle>
            <CardDescription>
              SSL certificates requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSSLData
                .filter(cert => cert.daysRemaining <= 30)
                .sort((a, b) => a.daysRemaining - b.daysRemaining)
                .map(cert => (
                  <div key={cert.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cert.domain}</h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            cert.status === "valid" && "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20",
                            cert.status === "expiring" && "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
                            cert.status === "critical" && "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20"
                          )}
                        >
                          {cert.daysRemaining} days left
                        </Badge>
                        {cert.alertsSent && (
                          <Bell className="h-4 w-4 text-blue-500" title="Alerts sent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires on: {cert.expiryDate}
                      </p>
                    </div>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      cert.daysRemaining <= 7 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : 
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    )}>
                      {cert.daysRemaining}
                    </div>
                  </div>
                ))}
                
              {mockSSLData.filter(cert => cert.daysRemaining <= 30).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No SSL certificates expiring soon.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All SSL Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockSSLData.map(cert => (
              <div 
                key={cert.id} 
                className={cn(
                  "p-3 rounded-lg border flex items-center justify-between",
                  cert.daysRemaining <= 7 && "border-red-200 bg-red-50/50 dark:bg-red-950/10",
                  cert.daysRemaining > 7 && cert.daysRemaining <= 30 && "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{cert.domain}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        cert.status === "valid" && "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20",
                        cert.status === "expiring" && "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
                        cert.status === "critical" && "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20"
                      )}
                    >
                      {cert.status}
                    </Badge>
                    {cert.alertsSent && (
                      <Bell className="h-4 w-4 text-blue-500" title="Alerts sent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires on: {cert.expiryDate} ({cert.daysRemaining} days remaining)
                  </p>
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  cert.daysRemaining <= 7 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : 
                  cert.daysRemaining <= 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" :
                  cert.daysRemaining <= 90 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                  "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                )}>
                  {cert.daysRemaining}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}