"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter
} from "recharts";
import { 
  Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, 
  Filter, Download, RefreshCw, Zap, Target, BarChart3,
  Activity, Globe, Shield, Users, Calendar, Search
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for AI insights
const performanceInsights = [
  { site: "Main Website", score: 92, trend: "up", issues: 2, recommendations: 5 },
  { site: "API Gateway", score: 88, trend: "stable", issues: 1, recommendations: 3 },
  { site: "Customer Portal", score: 76, trend: "down", issues: 4, recommendations: 8 },
  { site: "Documentation", score: 94, trend: "up", issues: 0, recommendations: 2 },
];

const trendData = [
  { date: "2024-01", uptime: 99.2, performance: 85, security: 92 },
  { date: "2024-02", uptime: 99.5, performance: 87, security: 94 },
  { date: "2024-03", uptime: 99.8, performance: 89, security: 96 },
  { date: "2024-04", uptime: 99.1, performance: 84, security: 91 },
  { date: "2024-05", uptime: 99.9, performance: 92, security: 98 },
];

const anomalyData = [
  { time: "00:00", normal: 120, anomaly: 0 },
  { time: "02:00", normal: 115, anomaly: 0 },
  { time: "04:00", normal: 118, anomaly: 0 },
  { time: "06:00", normal: 125, anomaly: 0 },
  { time: "08:00", normal: 0, anomaly: 180 },
  { time: "10:00", normal: 135, anomaly: 0 },
  { time: "12:00", normal: 142, anomaly: 0 },
];

const predictiveData = [
  { metric: "SSL Expiry", risk: "High", days: 7, confidence: 95 },
  { metric: "Server Load", risk: "Medium", days: 14, confidence: 87 },
  { metric: "Storage Space", risk: "Low", days: 45, confidence: 92 },
  { metric: "Memory Usage", risk: "Medium", days: 21, confidence: 89 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function InsightsAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedSites, setSelectedSites] = useState("all");
  const [selectedMetrics, setSelectedMetrics] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleExportReport = () => {
    // In real implementation, this would generate and download a comprehensive report
    console.log("Exporting AI insights report...");
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Analysis Controls
          </CardTitle>
          <CardDescription>
            Configure your analysis parameters and generate intelligent insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sites">Sites</Label>
              <Select value={selectedSites} onValueChange={setSelectedSites}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="critical">Critical Sites Only</SelectItem>
                  <SelectItem value="main">Main Website</SelectItem>
                  <SelectItem value="api">API Services</SelectItem>
                  <SelectItem value="portal">Customer Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metrics">Metrics</Label>
              <Select value={selectedMetrics} onValueChange={setSelectedMetrics}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="performance">Performance Only</SelectItem>
                  <SelectItem value="security">Security Only</SelectItem>
                  <SelectItem value="uptime">Uptime Only</SelectItem>
                  <SelectItem value="ssl">SSL Certificates</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Search Filter</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Filter insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run AI Analysis
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          {/* AI Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Overall Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
                <div className="mt-2 h-2 w-full bg-secondary rounded-full">
                  <div className="h-2 w-[87%] bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">3</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
                <div className="mt-2 flex gap-1">
                  <Badge variant="destructive" className="text-xs">SSL</Badge>
                  <Badge variant="outline" className="text-xs">Performance</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">↗ 12%</div>
                <p className="text-xs text-muted-foreground">
                  Improvement over 30 days
                </p>
                <div className="mt-2">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={trendData.slice(-7)}>
                      <Line
                        type="monotone"
                        dataKey="performance"
                        stroke="#3b82f6"
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
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">18</div>
                <p className="text-xs text-muted-foreground">
                  Optimization suggestions
                </p>
                <div className="mt-2 flex gap-1">
                  <Badge className="text-xs bg-purple-100 text-purple-700">High Priority</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Site Performance Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Site Performance Matrix</CardTitle>
              <CardDescription>
                AI-analyzed performance scores and recommendations for each site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceInsights.map((site, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-medium">{site.site}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              site.score >= 90 && "text-green-600 border-green-200 bg-green-50",
                              site.score >= 80 && site.score < 90 && "text-blue-600 border-blue-200 bg-blue-50",
                              site.score < 80 && "text-amber-600 border-amber-200 bg-amber-50"
                            )}
                          >
                            Score: {site.score}%
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              site.trend === "up" && "text-green-600 border-green-200 bg-green-50",
                              site.trend === "stable" && "text-blue-600 border-blue-200 bg-blue-50",
                              site.trend === "down" && "text-red-600 border-red-200 bg-red-50"
                            )}
                          >
                            {site.trend === "up" ? "↗" : site.trend === "down" ? "↘" : "→"} {site.trend}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium text-red-600">{site.issues}</div>
                        <div>Issues</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{site.recommendations}</div>
                        <div>Recommendations</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Multi-metric performance analysis over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="security"
                      stackId="3"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>
                  Current performance metrics across all sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Excellent (90-100%)", value: 45, color: "#10b981" },
                        { name: "Good (80-89%)", value: 35, color: "#3b82f6" },
                        { name: "Fair (70-79%)", value: 15, color: "#f59e0b" },
                        { name: "Poor (<70%)", value: 5, color: "#ef4444" },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {[
                        { name: "Excellent (90-100%)", value: 45, color: "#10b981" },
                        { name: "Good (80-89%)", value: 35, color: "#3b82f6" },
                        { name: "Fair (70-79%)", value: 15, color: "#f59e0b" },
                        { name: "Poor (<70%)", value: 5, color: "#ef4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>
                AI-detected anomalies in website performance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={anomalyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="normal" fill="#10b981" name="Normal Response Time" />
                  <Bar dataKey="anomaly" fill="#ef4444" name="Anomalous Response Time" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Response Time Spike</h4>
                      <p className="text-sm text-muted-foreground">Main Website - 08:00 AM</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Unusual Traffic Pattern</h4>
                      <p className="text-sm text-muted-foreground">API Gateway - 06:30 AM</p>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-200">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Memory Usage Anomaly</h4>
                      <p className="text-sm text-muted-foreground">Customer Portal - 05:15 AM</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">Info</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time Spikes</span>
                      <span>12 occurrences</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                      <div className="h-2 w-[60%] bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Traffic Anomalies</span>
                      <span>8 occurrences</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                      <div className="h-2 w-[40%] bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Resource Usage</span>
                      <span>5 occurrences</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-secondary rounded-full">
                      <div className="h-2 w-[25%] bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                AI-powered predictions for potential issues and maintenance needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveData.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-3 w-3 rounded-full",
                        prediction.risk === "High" && "bg-red-500",
                        prediction.risk === "Medium" && "bg-amber-500",
                        prediction.risk === "Low" && "bg-green-500"
                      )} />
                      <div>
                        <h4 className="font-medium">{prediction.metric}</h4>
                        <p className="text-sm text-muted-foreground">
                          Predicted issue in {prediction.days} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          prediction.risk === "High" && "text-red-600 border-red-200 bg-red-50",
                          prediction.risk === "Medium" && "text-amber-600 border-amber-200 bg-amber-50",
                          prediction.risk === "Low" && "text-green-600 border-green-200 bg-green-50"
                        )}
                      >
                        {prediction.risk} Risk
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {prediction.confidence}% confidence
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>High Priority Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium">SSL Certificate Renewal</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      3 certificates expiring within 7 days. Immediate action required.
                    </p>
                    <Button size="sm" variant="destructive">
                      Take Action
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">Performance Optimization</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Customer Portal showing 15% performance degradation.
                    </p>
                    <Button size="sm" variant="outline">
                      Optimize
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium">CDN Configuration</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enable CDN for static assets to improve load times.
                    </p>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium">Database Optimization</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Query optimization could improve response times by 20%.
                    </p>
                    <Button size="sm" variant="outline">
                      Optimize
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <h4 className="font-medium">Load Balancing</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Implement load balancing for high-traffic endpoints.
                    </p>
                    <Button size="sm" variant="outline">
                      Implement
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <h4 className="font-medium">Maintenance Scheduling</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Schedule proactive maintenance for optimal performance.
                    </p>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}