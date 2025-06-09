"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
    },
    {
      id: "system",
      name: "System",
      icon: Laptop,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base">Theme</Label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((t) => (
                <div key={t.id}>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full flex flex-col items-center justify-center gap-1 py-6",
                      theme === t.id && "border-primary"
                    )}
                    onClick={() => setTheme(t.id as "light" | "dark" | "system")}
                  >
                    <t.icon className={cn("h-6 w-6", theme === t.id && "text-primary")} />
                    <span className={cn("mt-1", theme === t.id && "font-medium text-primary")}>
                      {t.name}
                    </span>
                    {theme === t.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}