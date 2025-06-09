"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { useState } from "react";

// Mock data
const responseTimeData = [
  { time: "00:00", value: 120 }, { time: "02:00", value: 132 },
  { time: "04:00", value: 121 }, { time: "06:00", value: 154 },
  { time: "08:00", value: 178 }, { time: "10:00", value: 195 },
  { time: "12:00", value: 220 }, { time: "14:00", value: 185 },
  { time: "16:00", value: 164 }, { time: "18:00", value: 142 },
  { time: "20:00", value: 123 }, { time: "22:00", value: 118 },
];

const errorRateData = [
  { day: "Mon", errors: 5 }, { day: "Tue", errors: 3 },
  { day: "Wed", errors: 7 }, { day: "Thu", errors: 2 },
  { day: "Fri", errors: 4 }, { day: "Sat", errors: 1 },
  { day: "Sun", errors: 0 },
];

const resourceUsageData = [
  { name: "CPU", value: 48 },
  { name: "Memory", value: 72 },
  { name: "Disk I/O", value: 35 },
  { name: "Network", value: 63 },
];

const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE"];

interface PerformanceMetricsProps {
  siteId?: string;
  siteName?: string;
}

export function PerformanceMetrics({ siteId = "site_001", siteName = "Main Website" }: PerformanceMetricsProps) {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{siteName}</h2>
          <p className="text-sm text-muted-foreground">Site ID: {siteId}</p>
        </div>
        <div className="flex items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.98%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
                <div className="mt-4 h-1 w-full bg-secondary">
                  <div className="h-1 w-[99.98%] bg-green-500"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156ms</div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={responseTimeData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.05%</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={errorRateData}>
                      <Bar
                        dataKey="errors"
                        fill="hsl(var(--chart-3))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
              <CardDescription>
                Average response time over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis unit="ms" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Response Time"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4 pt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>
                  Current system resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={resourceUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      labelLine={false}
                    >
                      {resourceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage Over Time</CardTitle>
                <CardDescription>
                  Memory usage trend for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { time: "00:00", usage: 65 },
                      { time: "04:00", usage: 68 },
                      { time: "08:00", usage: 75 },
                      { time: "12:00", usage: 84 },
                      { time: "16:00", usage: 78 },
                      { time: "20:00", usage: 72 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      name="Memory"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
              <CardDescription>
                Error types and frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { type: "5xx", count: 12 },
                    { type: "4xx", count: 48 },
                    { type: "3xx", count: 8 },
                    { type: "Connection", count: 5 },
                    { type: "Timeout", count: 23 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Error Count" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}