"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for sites
const mockSites = [
  {
    id: "site_001",
    name: "Main Website",
    url: "https://example.com",
    ssl_id: "ssl_001",
    status: "up",
    isFavorite: true,
  },
  {
    id: "site_002",
    name: "API Gateway",
    url: "https://api.example.com",
    ssl_id: "ssl_002",
    status: "up",
    isFavorite: false,
  },
  {
    id: "site_003",
    name: "Customer Portal",
    url: "https://portal.example.com",
    ssl_id: "ssl_003",
    status: "down",
    isFavorite: true,
  },
  {
    id: "site_004",
    name: "Documentation",
    url: "https://docs.example.com",
    ssl_id: "ssl_004",
    status: "up",
    isFavorite: false,
  },
];

export function AllSitesTable({
  showOnlyFavorites = false,
}: {
  showOnlyFavorites?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sites, setSites] = useState(mockSites);

  const filteredSites = sites
    .filter((site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((site) => !showOnlyFavorites || site.isFavorite);

  const toggleFavorite = (id: string) => {
    setSites(
      sites.map((site) =>
        site.id === id ? { ...site, isFavorite: !site.isFavorite } : site
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {showOnlyFavorites ? "Important Sites" : "All Monitored Sites"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>SSL ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {site.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>{site.ssl_id}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      site.status === "up"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    )}
                  >
                    {site.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(site.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          site.isFavorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="sr-only">
                        {site.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"}
                      </span>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/monitoring/performance-metrics?siteId=${site.id}`}
                      >
                        <BarChart2 className="h-4 w-4" />
                        <span className="sr-only">View performance metrics</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
