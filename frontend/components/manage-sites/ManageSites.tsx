"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Site {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "maintenance";
  ssl_id: string;
  created_date: string;
  last_checked: string;
}

// Mock data for existing sites
const mockSites: Site[] = [
  {
    id: "site_001",
    name: "Main Website",
    url: "https://example.com",
    status: "up",
    ssl_id: "ssl_001",
    created_date: "2024-01-15",
    last_checked: "2 min ago",
  },
  {
    id: "site_002",
    name: "API Gateway",
    url: "https://api.example.com",
    status: "up",
    ssl_id: "ssl_002",
    created_date: "2024-01-20",
    last_checked: "5 min ago",
  },
  {
    id: "site_003",
    name: "Customer Portal",
    url: "https://portal.example.com",
    status: "down",
    ssl_id: "ssl_003",
    created_date: "2024-02-01",
    last_checked: "12 min ago",
  },
  {
    id: "site_004",
    name: "Documentation",
    url: "https://docs.example.com",
    status: "up",
    ssl_id: "ssl_004",
    created_date: "2024-02-10",
    last_checked: "18 min ago",
  },
];

interface SiteFormData {
  name: string;
  url: string;
}

export function ManageSites() {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState<SiteFormData>({ name: "", url: "" });
  const [formErrors, setFormErrors] = useState<Partial<SiteFormData>>({});

  const validateForm = (data: SiteFormData): boolean => {
    const errors: Partial<SiteFormData> = {};
    
    if (!data.name.trim()) {
      errors.name = "Site name is required";
    }
    
    if (!data.url.trim()) {
      errors.url = "Site URL is required";
    } else {
      try {
        new URL(data.url);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateSiteId = (): string => {
    const maxId = Math.max(...sites.map(site => parseInt(site.id.split('_')[1])));
    return `site_${String(maxId + 1).padStart(3, '0')}`;
  };

  const generateSSLId = (): string => {
    const maxId = Math.max(...sites.map(site => parseInt(site.ssl_id.split('_')[1])));
    return `ssl_${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleAddSite = () => {
    if (!validateForm(formData)) return;

    const newSite: Site = {
      id: generateSiteId(),
      name: formData.name,
      url: formData.url,
      status: "up", // Default status
      ssl_id: generateSSLId(),
      created_date: new Date().toISOString().split('T')[0],
      last_checked: "Just now",
    };

    setSites([...sites, newSite]);
    setFormData({ name: "", url: "" });
    setFormErrors({});
    setIsAddDialogOpen(false);
    
    // In a real application, this would make an API call to add the site
    console.log("Adding new site:", newSite);
  };

  const handleEditSite = () => {
    if (!editingSite || !validateForm(formData)) return;

    const updatedSites = sites.map(site =>
      site.id === editingSite.id
        ? { ...site, name: formData.name, url: formData.url }
        : site
    );

    setSites(updatedSites);
    setFormData({ name: "", url: "" });
    setFormErrors({});
    setEditingSite(null);
    setIsEditDialogOpen(false);
    
    // In a real application, this would make an API call to update the site
    console.log("Updating site:", editingSite.id, formData);
  };

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(site => site.id !== siteId));
    
    // In a real application, this would make an API call to delete the site
    console.log("Deleting site:", siteId);
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

  return (
    <div className="space-y-6">
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
                <Button onClick={openAddDialog}>
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
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input
                      id="site-url"
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className={cn(formErrors.url && "border-red-500")}
                    />
                    {formErrors.url && (
                      <p className="text-sm text-red-500">{formErrors.url}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSite}>Add Site</Button>
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
                <TableHead>SSL ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.id}</TableCell>
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
                        site.status === "maintenance" && "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20"
                      )}
                    >
                      {site.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{site.ssl_id}</TableCell>
                  <TableCell>{site.created_date}</TableCell>
                  <TableCell>{site.last_checked}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(site)}
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
                              />
                              {formErrors.url && (
                                <p className="text-sm text-red-500">{formErrors.url}</p>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditSite}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete site</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the site
                              "{site.name}" and remove all associated monitoring data.
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
              No sites added yet. Click "Add Site" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}