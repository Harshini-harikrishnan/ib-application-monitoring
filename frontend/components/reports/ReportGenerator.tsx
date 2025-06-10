"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Download, FileDown, Filter } from "lucide-react";

// Mock data for reports
const mockReports = [
  {
    id: "RPT-001",
    site_id: "site_001",
    site_name: "Main Website",
    site_url: "https://example.com",
    report_type: "Performance",
    generated_date: "2024-05-10",
    status: "Completed"
  },
  {
    id: "RPT-002",
    site_id: "site_002",
    site_name: "API Gateway",
    site_url: "https://api.example.com",
    report_type: "Uptime",
    generated_date: "2024-05-09",
    status: "Completed"
  },
  {
    id: "RPT-003",
    site_id: "site_003",
    site_name: "Customer Portal",
    site_url: "https://portal.example.com",
    report_type: "SSL",
    generated_date: "2024-05-08",
    status: "Completed"
  },
  {
    id: "RPT-004",
    site_id: "site_001",
    site_name: "Main Website",
    site_url: "https://example.com",
    report_type: "Security",
    generated_date: "2024-05-07",
    status: "Completed"
  },
  {
    id: "RPT-005",
    site_id: "site_004",
    site_name: "Documentation",
    site_url: "https://docs.example.com",
    report_type: "Performance",
    generated_date: "2024-05-06",
    status: "Completed"
  },
  {
    id: "RPT-006",
    site_id: "site_006",
    site_name: "Auth Service",
    site_url: "https://auth.example.com",
    report_type: "Uptime",
    generated_date: "2024-05-05",
    status: "Completed"
  },
];

export function ReportGenerator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("30d");
  const [selectedReportId, setSelectedReportId] = useState("");
  
  // Filter reports based on search term and filters
  const filteredReports = mockReports.filter(report => 
    (report.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.site_url.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSite === "" || report.site_id === selectedSite) &&
    (selectedReportType === "" || report.report_type === selectedReportType)
  );

  // Get unique site IDs for filter dropdown
  const siteOptions = Array.from(new Set(mockReports.map(report => report.site_id)));
  
  // Get unique report types for filter dropdown
  const reportTypeOptions = Array.from(new Set(mockReports.map(report => report.report_type)));

  const handleDownload = (reportId: string) => {
    setSelectedReportId(reportId);
    setDownloadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Input
          placeholder="Search by ID, name, or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {siteOptions.map((siteId) => (
                <SelectItem key={siteId} value={siteId}>
                  {siteId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {reportTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            View and download previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.site_name}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                    <a href={report.site_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {report.site_url}
                    </a>
                  </TableCell>
                  <TableCell>{report.report_type}</TableCell>
                  <TableCell className="hidden md:table-cell">{report.generated_date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleDownload(report.id)}
                    >
                      <FileDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports found matching your criteria.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredReports.length} of {mockReports.length} reports
          </div>
          <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Generate New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download Report</DialogTitle>
                <DialogDescription>
                  Select the time period for the report data.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup 
                  defaultValue={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="24h" />
                    <Label htmlFor="24h">Last 24 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7d" id="7d" />
                    <Label htmlFor="7d">Last 7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30d" id="30d" />
                    <Label htmlFor="30d">Last 30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom range</Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // In a real application, this would trigger the report download
                  setDownloadDialogOpen(false);
                }}>
                  Download Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}