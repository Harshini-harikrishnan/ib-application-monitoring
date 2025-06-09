"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3,
  BookOpen, 
  ChevronDown,
  ChevronRight,
  Globe, 
  Gauge, 
  LayoutDashboard, 
  Lock, 
  Mail, 
  Settings, 
  Shield, 
  Users, 
  Wrench,
  UserCircle, 
  LightbulbIcon,
  FileBarChart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [monitoringExpanded, setMonitoringExpanded] = useState(true);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Monitoring",
      icon: Gauge,
      href: "/monitoring",
      active: pathname.includes("/monitoring"),
      submenu: true,
      expanded: monitoringExpanded,
      subItems: [
        {
          label: "All Sites",
          href: "/monitoring/all-sites",
          active: pathname === "/monitoring/all-sites",
        },
        {
          label: "Performance Metrics",
          href: "/monitoring/performance-metrics",
          active: pathname === "/monitoring/performance-metrics",
        },
        {
          label: "SSL Expiry",
          href: "/monitoring/ssl-expiry",
          active: pathname === "/monitoring/ssl-expiry",
        },
      ],
    },
    {
      label: "Reports",
      icon: FileBarChart,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Insights (AI)",
      icon: LightbulbIcon,
      href: "/insights",
      active: pathname === "/insights",
    },
    {
      label: "My People",
      icon: Users,
      href: "/my-people",
      active: pathname === "/my-people",
    },
    {
      label: "Manage Sites",
      icon: Wrench,
      href: "/manage-sites",
      active: pathname === "/manage-sites",
    },
    {
      label: "My Profile",
      icon: UserCircle,
      href: "/my-profile",
      active: pathname === "/my-profile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      label: "About",
      icon: BookOpen,
      href: "/about",
      active: pathname === "/about",
    },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className={cn("flex items-center", !isOpen && "md:justify-center")}>
          <span className={cn("text-xl font-bold", !isOpen && "md:hidden")}>WebMonitor</span>
          <Shield className={cn("h-6 w-6 mr-2", !isOpen ? "md:mr-0" : "md:mr-2")} />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {routes.map((route) => (
            <div key={route.href}>
              {route.submenu ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-muted-foreground",
                      route.active && "text-foreground bg-accent",
                      !isOpen && "md:justify-center"
                    )}
                    onClick={() => setMonitoringExpanded(!monitoringExpanded)}
                  >
                    <route.icon className="h-5 w-5" />
                    <span className={cn("text-sm font-medium", !isOpen && "md:hidden")}>{route.label}</span>
                    {isOpen && (
                      <div className="ml-auto">
                        {monitoringExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Button>
                  {monitoringExpanded && isOpen && (
                    <div className="ml-6 my-1 space-y-1">
                      {route.subItems?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                            "hover:bg-accent hover:text-accent-foreground",
                            subItem.active && "bg-accent text-accent-foreground"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2",
                    "hover:bg-accent hover:text-accent-foreground transition-all",
                    route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    !isOpen && "md:justify-center md:px-2"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  <span className={cn("text-sm font-medium", !isOpen && "md:hidden")}>{route.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}