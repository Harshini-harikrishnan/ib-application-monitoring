"use client";

import { Bell, Menu, Shield, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function TopBar({ isSidebarOpen, toggleSidebar }: TopBarProps) {
  const [sslStatus, setSslStatus] = useState<"good" | "warning" | "critical">("good");

  // Mock user data - would come from API in real application
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Administrator",
    avatarUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold">WebMonitor</h1>
            </Link>
            <nav className="flex items-center space-x-4 text-sm font-medium">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/monitoring/all-sites"
                className="transition-colors hover:text-foreground/80 text-muted-foreground"
              >
                Monitoring
              </Link>
              <Link
                href="/reports"
                className="transition-colors hover:text-foreground/80 text-muted-foreground"
              >
                Reports
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "hidden md:flex items-center gap-2 transition-colors",
              sslStatus === "good" && "text-green-600 hover:text-green-700 border-green-200 hover:border-green-300",
              sslStatus === "warning" && "text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300",
              sslStatus === "critical" && "text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            )}
            asChild
          >
            <Link href="/monitoring/ssl-expiry">
              <Shield className="h-4 w-4" />
              <span>{sslStatus === "good" ? "SSL Status: Good" : sslStatus === "warning" ? "SSL Expiring Soon" : "SSL Critical"}</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link href="/important-sites">
              <Star className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
              <span className="sr-only">Important Features</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              5
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground pt-1">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}