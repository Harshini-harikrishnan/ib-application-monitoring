"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Bell, RefreshCw, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for SSL certificates (temporary until backend is ready)
const mockSSLCertificates = [
  {
    id: 1,
    domain: "example.com",
    sslId: "ssl_001",
    expiryDate: "2024-06-15T00:00:00Z",
    issueDate: "2024-03-15T00:00:00Z",
    issuer: "Let's Encrypt",
    status: "expiring" as const,
    daysRemaining: 15,
    alertsSent: true,
    lastAlertSent: "2024-05-25T09:00:00Z",
    lastChecked: "2024-05-25T14:30:00Z",
    siteName: "Main Website",
    siteUrl: "https://example.com"
  },
  {
    id: 2,
    domain: "api.example.com",
    sslId: "ssl_002",
    expiryDate: "2024-06-08T00:00:00Z",
    issueDate: "2024-03-08T00:00:00Z",
    issuer: "Let's Encrypt",
    status: "critical" as const,
    daysRemaining: 7,
    alertsSent: true,
    lastAlertSent: "2024-05-25T09:00:00Z",
    lastChecked: "2024-05-25T14:30:00Z",
    siteName: "API Gateway",
    siteUrl: "https://api.example.com"
  },
  {
    id: 3,
    domain: "portal.example.com",
    sslId: "ssl_003",
    expiryDate: "2024-08-20T00:00:00Z",
    issueDate: "2024-05-20T00:00:00Z",
    issuer: "DigiCert",
    status: "valid" as const,
    daysRemaining: 85,
    alertsSent: false,
    lastAlertSent: null,
    lastChecked: "2024-05-25T14:30:00Z",
    siteName: "Customer Portal",
    siteUrl: "https://portal.example.com"
  },
  {
    id: 4,
    domain: "docs.example.com",
    sslId: "ssl_004",
    expiryDate: "2024-07-10T00:00:00Z",
    issueDate: "2024-04-10T00:00:00Z",
    issuer: "Let's Encrypt",
    status: "valid" as const,
    daysRemaining: 45,
    alertsSent: false,
    lastAlertSent: null,
    lastChecked: "2024-05-25T14:30:00Z",
    siteName: "Documentation",
    siteUrl: "https://docs.example.com"
  },
  {
    id: 5,
    domain: "auth.example.com",
    sslId: "ssl_005",
    expiryDate: "2024-05-28T00:00:00Z",
    issueDate: "2024-02-28T00:00:00Z",
    issuer: "Let's Encrypt",
    status: "critical" as const,
    daysRemaining: 3,
    alertsSent: true,
    lastAlertSent: "2024-05-25T09:00:00Z",
    lastChecked: "2024-05-25T14:30:00Z",
    siteName: "Auth Service",
    siteUrl: "https://auth.example.com"
  }
];

// Mock SSL summary data
const mockSSLSummary = {
  totalCertificates: 5,
  validCertificates: 2,
  expiringCertificates: 1,
  criticalCertificates: 2,
  expiredCertificates: 0
};

interface SSLCertificate {
  id: number;
  domain: string;
  sslId: string;
  expiryDate?: string;
  issueDate?: string;
  issuer?: string;
  status: 'valid' | 'expiring' | 'critical' | 'expired' | 'invalid' | 'error';
  daysRemaining: number;
  alertsSent: boolean;
  lastAlertSent?: string | null;
  lastChecked: string;
  siteName?: string;
  siteUrl?: string;
}

interface SSLSummary {
  totalCertificates: number;
  validCertificates: number;
  expiringCertificates: number;
  criticalCertificates: number;
  expiredCertificates: number;
}

export function SSLExpiry() {
  const [sslCertificates, setSSLCertificates] = useState<SSLCertificate[]>([]);
  const [sslSummary, setSslSummary] = useState<SSLSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackendAPI, setUseBackendAPI] = useState(false);

  // Check if backend API is available
  const checkBackendAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ssl/summary', {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Fetch SSL data from backend API
  const fetchSSLDataFromAPI = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const [certificatesResponse, summaryResponse] = await Promise.all([
        fetch('http://localhost:5000/api/ssl', { headers }),
        fetch('http://localhost:5000/api/ssl/summary', { headers })
      ]);

      if (!certificatesResponse.ok || !summaryResponse.ok) {
        throw new Error('Failed to fetch SSL data from API');
      }

      const certificates = await certificatesResponse.json();
      const summary = await summaryResponse.json();

      setSSLCertificates(certificates);
      setSslSummary(summary);
      setUseBackendAPI(true);
    } catch (err) {
      console.warn('Backend API not available, using mock data:', err);
      throw err;
    }
  };

  // Load mock data
  const loadMockData = () => {
    setSSLCertificates(mockSSLCertificates);
    setSslSummary(mockSSLSummary);
    setUseBackendAPI(false);
  };

  // Fetch SSL data on component mount
  useEffect(() => {
    fetchSSLData();
  }, []);

  const fetchSSLData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (backendAvailable) {
        await fetchSSLDataFromAPI();
      } else {
        loadMockData();
      }
    } catch (err) {
      // Fallback to mock data if API fails
      loadMockData();
      console.log('Using mock data for SSL certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    try {
      setIsRefreshing(true);
      
      if (useBackendAPI) {
        const token = localStorage.getItem('authToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        await fetch('http://localhost:5000/api/ssl/check-all', {
          method: 'POST',
          headers
        });
        
        await fetchSSLData(); // Refresh the data after checking
      } else {
        // Simulate refresh with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        loadMockData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh SSL certificates');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendAlerts = async () => {
    try {
      if (useBackendAPI) {
        const token = localStorage.getItem('authToken');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        await fetch('http://localhost:5000/api/ssl/send-alerts', {
          method: 'POST',
          headers
        });
      } else {
        // Simulate sending alerts with mock data
        console.log('Mock: SSL alerts sent');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send SSL alerts');
    }
  };

  // Prepare data for donut chart
  const chartData = sslSummary ? [
    { 
      name: "Critical (≤ 7 days)", 
      value: sslSummary.criticalCertificates, 
      color: "hsl(0, 84.2%, 60.2%)" 
    },
    { 
      name: "Expiring (≤ 30 days)", 
      value: sslSummary.expiringCertificates, 
      color: "hsl(38, 92%, 50%)" 
    },
    { 
      name: "Valid (> 30 days)", 
      value: sslSummary.validCertificates, 
      color: "hsl(143, 85%, 40%)" 
    },
    { 
      name: "Expired", 
      value: sslSummary.expiredCertificates, 
      color: "hsl(0, 0%, 50%)" 
    },
  ].filter(item => item.value > 0) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading SSL certificates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Backend Status Indicator */}
      {!useBackendAPI && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800 dark:text-amber-200">
                Backend API not available. Displaying mock data for demonstration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">SSL Certificate Status</h2>
          <p className="text-muted-foreground">
            Monitor SSL certificate expiration dates across all sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshAll} 
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Checking..." : "Refresh All"}
          </Button>
          <Button onClick={handleSendAlerts} variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Send Alerts
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Total Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sslSummary?.totalCertificates || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Valid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sslSummary?.validCertificates || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {sslSummary?.expiringCertificates || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {sslSummary?.criticalCertificates || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>SSL Certificates Overview</CardTitle>
            <CardDescription>
              Distribution of certificate expiration dates
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            {chartData.length > 0 ? (
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
                    label={(entry) => `${entry.value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No SSL certificates found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Certificates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expiring Certificates</CardTitle>
            <CardDescription>
              SSL certificates requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {sslCertificates
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
                        Expires on: {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Unknown'}
                      </p>
                      {cert.siteName && (
                        <p className="text-xs text-muted-foreground">
                          Site: {cert.siteName}
                        </p>
                      )}
                    </div>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium",
                      cert.daysRemaining <= 7 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : 
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    )}>
                      {cert.daysRemaining}
                    </div>
                  </div>
                ))}
                
              {sslCertificates.filter(cert => cert.daysRemaining <= 30).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No SSL certificates expiring soon.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All SSL Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>All SSL Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sslCertificates.map(cert => (
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
                        cert.status === "critical" && "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20",
                        cert.status === "expired" && "text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-950/20"
                      )}
                    >
                      {cert.status}
                    </Badge>
                    {cert.alertsSent && (
                      <Bell className="h-4 w-4 text-blue-500" title="Alerts sent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires on: {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Unknown'} 
                    ({cert.daysRemaining} days remaining)
                  </p>
                  {cert.siteName && (
                    <p className="text-xs text-muted-foreground">
                      Site: {cert.siteName} • SSL ID: {cert.sslId}
                    </p>
                  )}
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium",
                  cert.daysRemaining <= 7 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : 
                  cert.daysRemaining <= 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" :
                  cert.daysRemaining <= 90 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                  "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                )}>
                  {cert.daysRemaining}
                </div>
              </div>
            ))}
            
            {sslCertificates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <p>No SSL certificates found. Add some sites to start monitoring.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}