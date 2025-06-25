"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { ArrowLeft, RefreshCw, Play, ExternalLink, Gauge, Zap, Shield, Search, BarChart3 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { performanceApi, sitesApi } from "@/lib/api";
import { cn } from "@/lib/utils";

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

interface Site {
  id: number;
  name: string;
  url: string;
  siteId: string;
  status: string;
}

interface PerformanceData {
  siteId: number;
  siteName: string;
  siteUrl: string;
  metrics: {
    responseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
    lastChecked: string;
  };
}

export function PerformanceMetrics() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSiteId = searchParams.get('siteId');
  
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedSite, setSelectedSite] = useState<string>(urlSiteId || "all");
  const [sites, setSites] = useState<Site[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [lighthouseData, setLighthouseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [useBackendAPI, setUseBackendAPI] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Try to fetch sites from backend
          const sitesData = await sitesApi.getAllSites();
          setSites(sitesData);
          
          // Fetch performance data for all sites
          const performancePromises = sitesData.map(async (site: Site) => {
            try {
              const data = await performanceApi.getPerformanceMetrics(site.id);
              return data;
            } catch (error) {
              // Return mock data for sites that fail
              return generateMockPerformanceData(site);
            }
          });
          
          const allPerformanceData = await Promise.all(performancePromises);
          setPerformanceData(allPerformanceData);
          setUseBackendAPI(true);
        } catch (error) {
          console.log('Backend not available, using mock data');
          loadMockData();
        }
      } else {
        loadMockData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    const mockSites = [
      { id: 1, name: "Main Website", url: "https://example.com", siteId: "site_001", status: "up" },
      { id: 2, name: "API Gateway", url: "https://api.example.com", siteId: "site_002", status: "up" },
      { id: 3, name: "Customer Portal", url: "https://portal.example.com", siteId: "site_003", status: "down" },
      { id: 4, name: "Documentation", url: "https://docs.example.com", siteId: "site_004", status: "up" },
    ];
    
    setSites(mockSites);
    const mockPerformanceData = mockSites.map(site => generateMockPerformanceData(site));
    setPerformanceData(mockPerformanceData);
    setUseBackendAPI(false);
  };

  const generateMockPerformanceData = (site: Site): PerformanceData => ({
    siteId: site.id,
    siteName: site.name,
    siteUrl: site.url,
    metrics: {
      responseTime: Math.floor(Math.random() * 400) + 100,
      uptime: 99.9 - Math.random() * 0.5,
      errorRate: Math.random() * 0.2,
      throughput: Math.floor(Math.random() * 3000) + 1000,
      lastChecked: new Date().toISOString()
    }
  });

  const runLighthouseAudit = async (siteId?: number) => {
    try {
      setIsRunningAudit(true);
      
      if (useBackendAPI && siteId) {
        const results = await performanceApi.runLighthouseAudit(siteId);
        setLighthouseData(results.results);
      } else {
        // Simulate Lighthouse audit with mock data
        await new Promise(resolve => setTimeout(resolve, 3000));
        setLighthouseData({
          performance: Math.floor(Math.random() * 30) + 70,
          accessibility: Math.floor(Math.random() * 20) + 80,
          bestPractices: Math.floor(Math.random() * 25) + 75,
          seo: Math.floor(Math.random() * 20) + 80,
          metrics: {
            firstContentfulPaint: Math.floor(Math.random() * 800) + 800,
            largestContentfulPaint: Math.floor(Math.random() * 1500) + 1500,
            cumulativeLayoutShift: Math.round(Math.random() * 0.3 * 100) / 100,
            speedIndex: Math.floor(Math.random() * 1000) + 1000,
            totalBlockingTime: Math.floor(Math.random() * 200) + 50
          },
          auditTime: new Date().toISOString(),
          url: selectedSite !== "all" ? sites.find(s => s.id.toString() === selectedSite)?.url : "https://example.com",
          isMockData: true
        });
      }
    } catch (error) {
      console.error('Error running Lighthouse audit:', error);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPerformanceData = selectedSite === "all" 
    ? performanceData.filter(data => 
        sites.some(site => 
          site.id === data.siteId && 
          (site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           site.url.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : performanceData.filter(data => data.siteId.toString() === selectedSite);

  const selectedSiteData = selectedSite !== "all" 
    ? sites.find(s => s.id.toString() === selectedSite)
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading performance data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      {urlSiteId && (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/monitoring/ssl-expiry">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to SSL Expiry
            </Link>
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {selectedSiteData ? `${selectedSiteData.name} Performance` : 'Performance Metrics'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedSiteData 
              ? `Performance metrics for ${selectedSiteData.url}`
              : `Performance overview for ${filteredPerformanceData.length} sites`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          {selectedSiteData && (
            <Button onClick={() => runLighthouseAudit(selectedSiteData.id)} disabled={isRunningAudit}>
              {isRunningAudit ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Lighthouse Audit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Backend Status */}
      {!useBackendAPI && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Backend API not available. Displaying mock performance data for demonstration.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Site Selection and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Site Selection</CardTitle>
          <CardDescription>
            Choose which sites to view performance metrics for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Sites</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="sm:w-[200px]">
              <Label htmlFor="site-select">Select Site</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {filteredSites.map((site) => (
                    <SelectItem key={site.id} value={site.id.toString()}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lighthouse">Lighthouse</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Site Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          {selectedSite === "all" ? (
            // All Sites Overview
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-green-500" />
                      Average Uptime
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(filteredPerformanceData.reduce((acc, data) => acc + data.metrics.uptime, 0) / filteredPerformanceData.length).toFixed(2)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Across all sites</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Average Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(filteredPerformanceData.reduce((acc, data) => acc + data.metrics.responseTime, 0) / filteredPerformanceData.length)}ms
                    </div>
                    <p className="text-xs text-muted-foreground">Across all sites</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      Average Error Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(filteredPerformanceData.reduce((acc, data) => acc + data.metrics.errorRate, 0) / filteredPerformanceData.length).toFixed(3)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Across all sites</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      Total Throughput
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredPerformanceData.reduce((acc, data) => acc + data.metrics.throughput, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Requests/hour total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sites Performance List */}
              <Card>
                <CardHeader>
                  <CardTitle>Sites Performance Overview</CardTitle>
                  <CardDescription>
                    Performance metrics for all monitored sites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPerformanceData.map((data) => {
                      const site = sites.find(s => s.id === data.siteId);
                      return (
                        <div key={data.siteId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-medium">{data.siteName}</h3>
                              <p className="text-sm text-muted-foreground">{data.siteUrl}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                site?.status === "up" && "text-green-600 border-green-200 bg-green-50",
                                site?.status === "down" && "text-red-600 border-red-200 bg-red-50"
                              )}
                            >
                              {site?.status?.toUpperCase() || "UNKNOWN"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{data.metrics.uptime.toFixed(2)}%</div>
                              <div className="text-muted-foreground">Uptime</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{data.metrics.responseTime}ms</div>
                              <div className="text-muted-foreground">Response</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{data.metrics.errorRate.toFixed(3)}%</div>
                              <div className="text-muted-foreground">Errors</div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedSite(data.siteId.toString())}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Single Site Overview
            <div className="space-y-6">
              {filteredPerformanceData.map((data) => (
                <div key={data.siteId} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-green-500" />
                          Uptime
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.uptime.toFixed(2)}%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                        <div className="mt-4 h-1 w-full bg-secondary">
                          <div className={`h-1 bg-green-500`} style={{ width: `${data.metrics.uptime}%` }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4 text-blue-500" />
                          Response Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.responseTime}ms</div>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
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
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-amber-500" />
                          Error Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.errorRate.toFixed(3)}%</div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                        <div className="mt-4">
                          <ResponsiveContainer width="100%" height={60}>
                            <BarChart data={errorRateData}>
                              <Bar dataKey="errors" fill="hsl(var(--chart-3))" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-500" />
                          Throughput
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.throughput.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Requests/hour</p>
                        <div className="mt-4 h-1 w-full bg-secondary">
                          <div className="h-1 w-[75%] bg-purple-500"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date(data.metrics.lastChecked).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lighthouse" className="space-y-4 pt-4">
          {lighthouseData ? (
            <div className="space-y-6">
              {lighthouseData.isMockData && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-6">
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      This is mock Lighthouse data for demonstration. Install Lighthouse CLI for real audits.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Lighthouse Scores */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{lighthouseData.performance}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          lighthouseData.performance >= 90 ? "text-green-600 border-green-200 bg-green-50" :
                          lighthouseData.performance >= 50 ? "text-amber-600 border-amber-200 bg-amber-50" :
                          "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {lighthouseData.performance >= 90 ? "Good" : lighthouseData.performance >= 50 ? "Needs Improvement" : "Poor"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{lighthouseData.accessibility}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          lighthouseData.accessibility >= 90 ? "text-green-600 border-green-200 bg-green-50" :
                          lighthouseData.accessibility >= 50 ? "text-amber-600 border-amber-200 bg-amber-50" :
                          "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {lighthouseData.accessibility >= 90 ? "Good" : lighthouseData.accessibility >= 50 ? "Needs Improvement" : "Poor"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{lighthouseData.bestPractices}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          lighthouseData.bestPractices >= 90 ? "text-green-600 border-green-200 bg-green-50" :
                          lighthouseData.bestPractices >= 50 ? "text-amber-600 border-amber-200 bg-amber-50" :
                          "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {lighthouseData.bestPractices >= 90 ? "Good" : lighthouseData.bestPractices >= 50 ? "Needs Improvement" : "Poor"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">SEO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{lighthouseData.seo}</div>
                      <Badge 
                        variant="outline" 
                        className={
                          lighthouseData.seo >= 90 ? "text-green-600 border-green-200 bg-green-50" :
                          lighthouseData.seo >= 50 ? "text-amber-600 border-amber-200 bg-amber-50" :
                          "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {lighthouseData.seo >= 90 ? "Good" : lighthouseData.seo >= 50 ? "Needs Improvement" : "Poor"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Core Web Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                  <CardDescription>
                    Key metrics that measure real-world user experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">First Contentful Paint</Label>
                      <div className="text-lg font-bold">{lighthouseData.metrics.firstContentfulPaint}ms</div>
                      <p className="text-xs text-muted-foreground">Time to first content render</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Largest Contentful Paint</Label>
                      <div className="text-lg font-bold">{lighthouseData.metrics.largestContentfulPaint}ms</div>
                      <p className="text-xs text-muted-foreground">Time to largest content render</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cumulative Layout Shift</Label>
                      <div className="text-lg font-bold">{lighthouseData.metrics.cumulativeLayoutShift}</div>
                      <p className="text-xs text-muted-foreground">Visual stability score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Audit completed: {new Date(lighthouseData.auditTime).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Gauge className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Lighthouse Audit Data</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedSite === "all" 
                      ? "Select a specific site to run Lighthouse audit"
                      : "Run a Lighthouse audit to get detailed performance insights"
                    }
                  </p>
                  {selectedSite !== "all" && (
                    <Button onClick={() => runLighthouseAudit(parseInt(selectedSite))} disabled={isRunningAudit}>
                      {isRunningAudit ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Running Audit...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Lighthouse Audit
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>
                  Response time patterns over the selected period
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
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Performance Comparison</CardTitle>
              <CardDescription>
                Compare performance metrics across all sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredPerformanceData.map(data => ({
                  name: data.siteName,
                  responseTime: data.metrics.responseTime,
                  uptime: data.metrics.uptime,
                  errorRate: data.metrics.errorRate * 100, // Convert to percentage for better visualization
                  throughput: data.metrics.throughput / 100 // Scale down for better visualization
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="responseTime" name="Response Time (ms)" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="uptime" name="Uptime (%)" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="errorRate" name="Error Rate (%)" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="throughput" name="Throughput (x100 req/h)" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}