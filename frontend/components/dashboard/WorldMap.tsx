"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// Mock data for site locations
const siteLocations = [
  { id: 1, name: "US East Server", lat: 40.7128, lng: -74.0060, status: "up" },
  { id: 2, name: "EU West Server", lat: 51.5074, lng: -0.1278, status: "up" },
  { id: 3, name: "Asia Pacific", lat: 35.6762, lng: 139.6503, status: "down" },
  { id: 4, name: "South America", lat: -23.5505, lng: -46.6333, status: "up" },
  { id: 5, name: "Australia", lat: -33.8688, lng: 151.2093, status: "maintenance" },
];

export function WorldMap() {
  const [selectedSite, setSelectedSite] = useState<number | null>(null);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Geographical Distribution</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted p-2">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {/* In a real application, this would be an actual map component */}
            <div className="w-full h-full relative">
              {/* Placeholder for world map background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm">Interactive World Map</p>
              </div>
              
              {/* Site location markers */}
              {siteLocations.map((site) => (
                <div
                  key={site.id}
                  className="absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                  style={{ 
                    top: `${100 - ((site.lat + 90) / 180) * 100}%`, 
                    left: `${((site.lng + 180) / 360) * 100}%`,
                    backgroundColor: site.status === "up" 
                      ? "hsl(var(--chart-1))" 
                      : site.status === "down" 
                        ? "hsl(var(--chart-3))" 
                        : "hsl(var(--chart-4))"
                  }}
                  onClick={() => setSelectedSite(selectedSite === site.id ? null : site.id)}
                >
                  {selectedSite === site.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-popover shadow-md rounded p-2 min-w-[160px] z-10">
                      <p className="text-sm font-medium">{site.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">Status: {site.status}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}