"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ExternalLink, Star } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data for recent/searched sites
const mockRecentSites = [
  {
    id: 1,
    name: "Main Website",
    url: "https://example.com",
    status: "up",
    lastChecked: "2 min ago",
    isFavorite: true,
  },
  {
    id: 2,
    name: "API Gateway",
    url: "https://api.example.com",
    status: "up",
    lastChecked: "5 min ago",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Customer Portal",
    url: "https://portal.example.com",
    status: "down",
    lastChecked: "12 min ago",
    isFavorite: true,
  },
  {
    id: 4,
    name: "Documentation",
    url: "https://docs.example.com",
    status: "up",
    lastChecked: "18 min ago",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Blog",
    url: "https://blog.example.com",
    status: "maintenance",
    lastChecked: "23 min ago",
    isFavorite: false,
  },
  {
    id: 6,
    name: "Auth Service",
    url: "https://auth.example.com",
    status: "up",
    lastChecked: "30 min ago",
    isFavorite: true,
  },
];

export function RecentSites() {
  const [recentSites, setRecentSites] = useState(mockRecentSites);

  const toggleFavorite = (id: number) => {
    setRecentSites(
      recentSites.map((site) =>
        site.id === id ? { ...site, isFavorite: !site.isFavorite } : site
      )
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Search History / Recently Searched Sites</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-4">
            {recentSites.map((site) => (
              <Card key={site.id} className="w-[300px] flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm truncate max-w-[200px]">{site.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{site.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 -mt-1 -mr-1"
                      onClick={() => toggleFavorite(site.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          site.isFavorite
                            ? "fill-current text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="sr-only">
                        {site.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      </span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center mt-2 mb-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 mr-2",
                        site.status === "up" && "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/20",
                        site.status === "down" && "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20",
                        site.status === "maintenance" && "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
                      )}
                    >
                      {site.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Checked {site.lastChecked}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`/monitoring/performance-metrics?siteId=${site.id}`} className="flex items-center justify-center">
                        <span>Details</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-8" asChild>
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Visit site</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}