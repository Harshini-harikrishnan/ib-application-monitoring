"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ArrowLeft, RefreshCw, Play, ExternalLink, Gauge } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { performanceApi } from "@/lib/api";
import { Label } from "@/components/ui/label";

interface PerformanceMetricsProps {
  siteId?: string;
  siteName?: string;
}

export function PerformanceMetrics({ siteId: propSiteId, siteName: propSiteName }: PerformanceMetricsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSiteId = searchParams.get('siteId');
  const siteId = propSiteId || urlSiteId || "1"; // Default to site ID 1 if not provided
  
  const [timeRange, setTimeRange] = useState("24h");
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteName, setSiteName] = useState(propSiteName || "Unknown Site");

  useEffect(() => {
    fetchPerformanceData();
  }, [siteId]);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Not authenticated. Please log in.");
      }

      const data = await performanceApi.getPerformanceMetrics(parseInt(siteId));
      setPerformanceData(data);
      setSiteName(data.siteName || siteName);
    } catch (err: any) {
      setError(err.message || "Failed to fetch performance data");
      console.error('Error fetching performance data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runLighthouseAudit = async () => {
    setIsRunningAudit(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Not authenticated. Please log in.");
      }

      await performanceApi.runLighthouseAudit(parseInt(siteId));
      await fetchPerformanceData(); // Refresh data after audit
    } catch (err: any) {
      setError(err.message || "Failed to run Lighthouse audit");
      console.error('Error running Lighthouse audit:', err);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const downloadLighthouseReport = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error("Not authenticated. Please log in.");
      }

      await performanceApi.downloadLighthouseReport(parseInt(siteId));
    } catch (err: any) {
      setError(err.message || "Failed to download Lighthouse report");
      console.error('Error downloading Lighthouse report:', err);
    }
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      {urlSiteId && (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage-sites">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Manage Sites
            </Link>
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{siteName}</h2>
          <p className="text-sm text-muted-foreground">Site ID: {siteId}</p>
          {performanceData?.siteUrl && (
            <a
              href={performanceData.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              {performanceData.siteUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runLighthouseAudit} disabled={isRunningAudit}>
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
          {performanceData?.metrics?.reportUrl && (
            <Button onClick={downloadLighthouseReport} variant="outline">
              Download Report
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="lighthouse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lighthouse">Lighthouse</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="lighthouse" className="space-y-4 pt-4">
          {performanceData?.metrics ? (
            <div className="space-y-6">
              {/* Lighthouse Scores */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">{performanceData.metrics.performanceScore ?? 'N/A'}</div>
                      <Badge
                        variant="outline"
                        className={
                          performanceData.metrics.performanceScore >= 90
                            ? "text-green-600 border-green-200 bg-green-50"
                            : performanceData.metrics.performanceScore >= 50
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {performanceData.metrics.performanceScore >= 90
                          ? "Good"
                          : performanceData.metrics.performanceScore >= 50
                          ? "Needs Improvement"
                          : "Poor"}
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
                      <div className="text-2xl font-bold">{performanceData.metrics.accessibilityScore ?? 'N/A'}</div>
                      <Badge
                        variant="outline"
                        className={
                          performanceData.metrics.accessibilityScore >= 90
                            ? "text-green-600 border-green-200 bg-green-50"
                            : performanceData.metrics.accessibilityScore >= 50
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {performanceData.metrics.accessibilityScore >= 90
                          ? "Good"
                          : performanceData.metrics.accessibilityScore >= 50
                          ? "Needs Improvement"
                          : "Poor"}
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
                      <div className="text-2xl font-bold">{performanceData.metrics.bestPracticesScore ?? 'N/A'}</div>
                      <Badge
                        variant="outline"
                        className={
                          performanceData.metrics.bestPracticesScore >= 90
                            ? "text-green-600 border-green-200 bg-green-50"
                            : performanceData.metrics.bestPracticesScore >= 50
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {performanceData.metrics.bestPracticesScore >= 90
                          ? "Good"
                          : performanceData.metrics.bestPracticesScore >= 50
                          ? "Needs Improvement"
                          : "Poor"}
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
                      <div className="text-2xl font-bold">{performanceData.metrics.seoScore ?? 'N/A'}</div>
                      <Badge
                        variant="outline"
                        className={
                          performanceData.metrics.seoScore >= 90
                            ? "text-green-600 border-green-200 bg-green-50"
                            : performanceData.metrics.seoScore >= 50
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {performanceData.metrics.seoScore >= 90
                          ? "Good"
                          : performanceData.metrics.seoScore >= 50
                          ? "Needs Improvement"
                          : "Poor"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Line Chart for Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Lighthouse scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[{
                        name: performanceData.metrics.auditDate
                          ? new Date(performanceData.metrics.auditDate).toLocaleDateString()
                          : 'Latest',
                        performance: performanceData.metrics.performanceScore,
                        accessibility: performanceData.metrics.accessibilityScore,
                        bestPractices: performanceData.metrics.bestPracticesScore,
                        seo: performanceData.metrics.seoScore,
                      }]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="performance" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="accessibility" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="bestPractices" stroke="#ff7300" strokeWidth={2} />
                      <Line type="monotone" dataKey="seo" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Core Web Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                  <CardDescription>Key metrics that measure real-world user experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">First Contentful Paint</Label>
                      <div className="text-lg font-bold">
                        {performanceData.metrics.detailedMetrics?.firstContentfulPaint ?? 'N/A'}ms
                      </div>
                      <p className="text-xs text-muted-foreground">Time to first content render</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Largest Contentful Paint</Label>
                      <div className="text-lg font-bold">
                        {performanceData.metrics.detailedMetrics?.largestContentfulPaint ?? 'N/A'}ms
                      </div>
                      <p className="text-xs text-muted-foreground">Time to largest content render</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cumulative Layout Shift</Label>
                      <div className="text-lg font-bold">
                        {performanceData.metrics.detailedMetrics?.cumulativeLayoutShift ?? 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Visual stability score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Last audit: {performanceData.metrics.auditDate
                      ? new Date(performanceData.metrics.auditDate).toLocaleString()
                      : 'Never'}
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
                    Run a Lighthouse audit to get detailed performance insights
                  </p>
                  <Button onClick={runLighthouseAudit} disabled={isRunningAudit}>
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
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Overview</CardTitle>
              <CardDescription>Summary of site performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Last Performance Score</Label>
                  <p className="text-lg font-bold">{performanceData?.metrics?.performanceScore ?? 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Audit Date</Label>
                  <p className="text-lg font-bold">
                    {performanceData?.metrics?.auditDate
                      ? new Date(performanceData.metrics.auditDate).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Site URL</Label>
                  <p className="text-lg font-bold">{performanceData?.siteUrl ?? 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}