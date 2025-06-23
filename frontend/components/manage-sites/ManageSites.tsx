"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink, RefreshCw, Shield, AlertTriangle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sitesApi, sslApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data for sites (temporary until backend is ready)
const mockSites = [
  {
    id: 1,
    name: "Main Website",
    url: "https://example.com",
    siteId: "site_001",
    isActive: true,
    createdDate: "2024-03-15T00:00:00Z",
    lastChecked: "2024-05-25T14:30:00Z",
    status: "up" as const,
    sslCertificate: {
      id: 1,
      domain: "example.com",
      sslId: "ssl_001",
      expiryDate: "2024-06-15T00:00:00Z",
      status: "expiring" as const,
      daysRemaining: 15,
      lastChecked: "2024-05-25T14:30:00Z"
    }
  },
  {
    id: 2,
    name: "API Gateway",
    url: "https://api.example.com",
    siteId: "site_002",
    isActive: true,
    createdDate: "2024-03-10T00:00:00Z",
    lastChecked: "2024-05-25T14:25:00Z",
    status: "up" as const,
    sslCertificate: {
      id: 2,
      domain: "api.example.com",
      sslId: "ssl_002",
      expiryDate: "2024-06-08T00:00:00Z",
      status: "critical" as const,
      daysRemaining: 7,
      lastChecked: "2024-05-25T14:25:00Z"
    }
  },
  {
    id: 3,
    name: "Customer Portal",
    url: "https://portal.example.com",
    siteId: "site_003",
    isActive: true,
    createdDate: "2024-03-20T00:00:00Z",
    lastChecked: "2024-05-25T14:20:00Z",
    status: "down" as const,
    sslCertificate: {
      id: 3,
      domain: "portal.example.com",
      sslId: "ssl_003",
      expiryDate: "2024-08-20T00:00:00Z",
      status: "valid" as const,
      daysRemaining: 85,
      lastChecked: "2024-05-25T14:20:00Z"
    }
  }
];

interface Site {
  id: number;
  name: string;
  url: string;
  siteId: string;
  isActive: boolean;
  createdDate: string;
  lastChecked?: string;
  status: 'up' | 'down' | 'maintenance' | 'unknown';
  sslCertificate?: {
    id: number;
    domain: string;
    sslId: string;
    expiryDate?: string;
    status: 'valid' | 'expiring' | 'critical' | 'expired' | 'invalid' | 'error';
    daysRemaining: number;
    lastChecked: string;
  };
}

interface SiteFormData {
  name: string;
  url: string;
}

export function ManageSites() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState<SiteFormData>({ name: "", url: "" });
  const [formErrors, setFormErrors] = useState<Partial<SiteFormData>>({});
  const [error, setError] = useState<string | null>(null);
  const [checkingSSL, setCheckingSSL] = useState<number | null>(null);
  const [useBackendAPI, setUseBackendAPI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  // Check if backend API is available
  const checkBackendAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        return false;
      }

      const response = await fetch('http://localhost:5000/api/sites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Backend availability check:', response.status);
      return response.status !== 404; // Even if unauthorized, if we get a response, backend is available
    } catch (error) {
      console.log('Backend not available:', error);
      return false;
    }
  };

  // Fetch sites from backend API
  const fetchSitesFromAPI = async () => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      const sitesData = await sitesApi.getAllSites();
      setSites(sitesData);
      setUseBackendAPI(true);
      console.log('Successfully fetched sites from API:', sitesData);
    } catch (err) {
      console.warn('Backend API not available or error occurred:', err);
      throw err;
    }
  };

  // Load mock data
  const loadMockData = () => {
    setSites(mockSites);
    setUseBackendAPI(false);
    console.log('Using mock data for sites');
  };

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        setError('Please log in to manage sites');
        loadMockData();
        return;
      }
      
      // First check if backend is available
      const backendAvailable = await checkBackendAvailability();
      
      if (backendAvailable) {
        await fetchSitesFromAPI();
      } else {
        loadMockData();
      }
    } catch (err) {
      // Fallback to mock data if API fails
      loadMockData();
      console.log('Using mock data for sites due to error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (data: SiteFormData): boolean => {
    const errors: Partial<SiteFormData> = {};
    
    if (!data.name.trim()) {
      errors.name = "Site name is required";
    }
    
    if (!data.url.trim()) {
      errors.url = "Site URL is required";
    } else {
      try {
        const urlToValidate = data.url.startsWith('http') ? data.url : `https://${data.url}`;
        new URL(urlToValidate);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSite = async () => {
    if (!validateForm(formData)) return;

    if (!isAuthenticated()) {
      setError('Please log in to add sites');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure URL has protocol
      const urlToSubmit = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      const siteDataToSubmit = {
        ...formData,
        url: urlToSubmit
      };

      if (useBackendAPI) {
        console.log('Attempting to create site via API...');
        const newSite = await sitesApi.createSite(siteDataToSubmit);
        console.log('Site created successfully:', newSite);
        
        // Refresh the sites list
        await fetchSites();
      } else {
        // Mock site creation
        const newSite: Site = {
          id: Math.max(...sites.map(s => s.id)) + 1,
          name: formData.name,
          url: urlToSubmit,
          siteId: `site_${String(sites.length + 1).padStart(3, '0')}`,
          isActive: true,
          createdDate: new Date().toISOString(),
          status: 'unknown',
        };
        setSites([...sites, newSite]);
      }
      
      setFormData({ name: "", url: "" });
      setFormErrors({});
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding site:', err);
      setError(err instanceof Error ? err.message : 'Failed to add site');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSite = async () => {
    if (!editingSite || !validateForm(formData)) return;

    if (!isAuthenticated()) {
      setError('Please log in to edit sites');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure URL has protocol
      const urlToSubmit = formData.url.startsWith('http') ? formData.url : `https://${formData.url}`;
      const siteDataToSubmit = {
        name: formData.name,
        url: urlToSubmit,
        isActive: editingSite.isActive
      };

      if (useBackendAPI) {
        await sitesApi.updateSite(editingSite.id, siteDataToSubmit);
        // Refresh the sites list
        await fetchSites();
      } else {
        const updatedSites = sites.map(site =>
          site.id === editingSite.id
            ? { ...site, name: formData.name, url: urlToSubmit }
            : site
        );
        setSites(updatedSites);
      }
      
      setFormData({ name: "", url: "" });
      setFormErrors({});
      setEditingSite(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating site:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSite = async (siteId: number) => {
    if (!isAuthenticated()) {
      setError('Please log in to delete sites');
      return;
    }

    try {
      if (useBackendAPI) {
        await sitesApi.deleteSite(siteId);
        // Refresh the sites list
        await fetchSites();
      } else {
        setSites(sites.filter(site => site.id !== siteId));
      }
    } catch (err) {
      console.error('Error deleting site:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete site');
    }
  };

  const handleCheckSSL = async (siteId: number) => {
    try {
      setCheckingSSL(siteId);
      
      if (useBackendAPI) {
        console.log('Checking SSL for site:', siteId);
        await sslApi.checkSSLCertificate(siteId);
        
        // Refresh sites data to get updated SSL info
        await fetchSites();
        
        // Navigate to SSL expiry page with the specific site
        router.push(`/monitoring/ssl-expiry?siteId=${siteId}`);
      } else {
        // Simulate SSL check with mock data
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Mock: SSL check completed for site', siteId);
        
        // Navigate to SSL expiry page
        router.push(`/monitoring/ssl-expiry?siteId=${siteId}`);
      }
    } catch (err) {
      console.error('SSL check error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check SSL certificate');
    } finally {
      setCheckingSSL(null);
    }
  };

  const handleViewPerformance = (siteId: number) => {
    // Navigate to performance metrics page for the specific site
    router.push(`/monitoring/performance-metrics?siteId=${siteId}`);
  };

  const openEditDialog = (site: Site) => {
    setEditingSite(site);
    setFormData({ name: site.name, url: site.url });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ name: "", url: "" });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading sites...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authentication Warning */}
      {!isAuthenticated() && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 dark:text-red-200">
                You are not logged in. Please log in to manage sites.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => setError(null)} variant="outline" size="sm">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Site Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Site</CardTitle>
              <CardDescription>
                Add a new website to monitor for uptime, performance, and SSL certificates
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} disabled={!isAuthenticated()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Site</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new site you want to monitor.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      placeholder="e.g., Main Website"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn(formErrors.name && "border-red-500")}
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input
                      id="site-url"
                      placeholder="https://example.com or example.com"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className={cn(formErrors.url && "border-red-500")}
                      disabled={isSubmitting}
                    />
                    {formErrors.url && (
                      <p className="text-sm text-red-500">{formErrors.url}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Protocol (https://) will be added automatically if not provided
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSite} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Site'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Existing Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Sites ({sites.length})</CardTitle>
          <CardDescription>
            Manage your currently monitored websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site ID</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SSL Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.siteId}</TableCell>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 max-w-[200px] truncate"
                    >
                      {site.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        site.status === "up" && "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20",
                        site.status === "down" && "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20",
                        site.status === "maintenance" && "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
                        site.status === "unknown" && "text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-950/20"
                      )}
                    >
                      {site.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {site.sslCertificate ? (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            site.sslCertificate.status === "valid" && "text-green-600 border-green-200 bg-green-50",
                            site.sslCertificate.status === "expiring" && "text-amber-600 border-amber-200 bg-amber-50",
                            site.sslCertificate.status === "critical" && "text-red-600 border-red-200 bg-red-50",
                            site.sslCertificate.status === "expired" && "text-gray-600 border-gray-200 bg-gray-50"
                          )}
                        >
                          {site.sslCertificate.daysRemaining}d
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {site.sslCertificate.sslId}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        Not checked
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(site.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {site.lastChecked 
                      ? new Date(site.lastChecked).toLocaleString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Performance Metrics Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPerformance(site.id)}
                        disabled={!isAuthenticated()}
                        title="View Performance Metrics"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>

                      {/* SSL Check Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCheckSSL(site.id)}
                        disabled={checkingSSL === site.id || !isAuthenticated()}
                        title="Check SSL Certificate"
                      >
                        {checkingSSL === site.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Edit Button */}
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(site)}
                            disabled={!isAuthenticated()}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit site</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Site</DialogTitle>
                            <DialogDescription>
                              Update the details for this monitored site.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-site-name">Site Name</Label>
                              <Input
                                id="edit-site-name"
                                placeholder="e.g., Main Website"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={cn(formErrors.name && "border-red-500")}
                                disabled={isSubmitting}
                              />
                              {formErrors.name && (
                                <p className="text-sm text-red-500">{formErrors.name}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-site-url">Site URL</Label>
                              <Input
                                id="edit-site-url"
                                placeholder="https://example.com"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className={cn(formErrors.url && "border-red-500")}
                                disabled={isSubmitting}
                              />
                              {formErrors.url && (
                                <p className="text-sm text-red-500">{formErrors.url}</p>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsEditDialogOpen(false)}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEditSite} disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={!isAuthenticated()}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete site</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the site
                              "{site.name}" and remove all associated monitoring data including SSL certificates.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSite(site.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Site
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p>No sites added yet. Click "Add Site" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}