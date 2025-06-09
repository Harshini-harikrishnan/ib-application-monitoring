"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Globe, 
  BarChart3, 
  Clock, 
  Users, 
  Target, 
  Award, 
  Zap,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export function AboutContent() {
  const features = [
    {
      icon: Globe,
      title: "Real-time Monitoring",
      description: "24/7 tracking of banking portals, ATM networks, and critical infrastructure"
    },
    {
      icon: Shield,
      title: "SSL Certificate Tracking",
      description: "Automated SSL monitoring for secure banking channels and alerts on expiry"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed analytics for uptime, latency, and transaction processing speed"
    },
    {
      icon: Clock,
      title: "Response Time Monitoring",
      description: "Evaluate service latency across branches and customer regions"
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Get alerts via internal channels, SMS, and secure emails for quick actions"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Access controls and monitoring roles for IT and cybersecurity teams"
    }
  ];

  const stats = [
    { label: "Banking Services Monitored", value: "800+", description: "Including branches, ATMs, and digital portals" },
    { label: "Uptime Achieved", value: "99.95%", description: "Banking system uptime across monitored units" },
    { label: "Average Response Time", value: "<150ms", description: "Measured across core banking systems" },
    { label: "IT Personnel Engaged", value: "100+", description: "Teams actively using the monitoring suite" }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Platform Conceptualization",
      description: "Initiated to centralize Indian Bank's service monitoring efforts"
    },
    {
      year: "2020",
      title: "Pilot Launch",
      description: "Launched internal monitoring for digital banking and ATM services"
    },
    {
      year: "2021",
      title: "Security & Compliance Integration",
      description: "Enhanced with SSL tracking and compliance dashboards"
    },
    {
      year: "2022",
      title: "Pan-India Coverage",
      description: "Monitoring expanded across all Indian Bank regional offices and zones"
    },
    {
      year: "2023",
      title: "Smart Alerts & Analytics",
      description: "Deployed AI-driven insights for predictive maintenance"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Bank Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            About Indian Bank's WebMonitor Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            WebMonitor is Indian Bank's in-house monitoring framework, developed to ensure 
            the reliability, speed, and security of our national banking infrastructure across digital and physical channels.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Serving millions of customers nationwide, Indian Bank manages a broad range of banking 
            platforms. WebMonitor offers centralized oversight of uptime, response rates, system 
            alerts, and infrastructure health across ATMs, branches, mobile apps, and websites.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            With automated monitoring of performance, SSL validity, and user transaction responsiveness, 
            WebMonitor is vital to delivering seamless and secure banking experiences 24/7.
          </p>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              To ensure uninterrupted and secure access to Indian Bank’s financial services by empowering 
              our IT teams with proactive monitoring and data-driven decision-making tools.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              To establish WebMonitor as a central pillar of Indian Bank’s digital transformation, 
              guaranteeing operational transparency, compliance, and customer trust across all services.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features & Capabilities</CardTitle>
          <CardDescription>
            Tailored for financial-grade monitoring and infrastructure resilience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Impact</CardTitle>
          <CardDescription>
            Metrics showcasing platform efficiency across Indian Bank operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="font-medium">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Timeline</CardTitle>
          <CardDescription>
            Development milestones of WebMonitor at Indian Bank
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                </div>
                {index < milestones.length - 1 && (
                  <div className="absolute left-5 mt-10 h-6 w-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Financial-grade technologies powering secure monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Backend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">.NET Core</Badge>
                <Badge variant="secondary">C#</Badge>
                <Badge variant="secondary">Oracle Database</Badge>
                <Badge variant="secondary">RESTful APIs</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Bank’s Private Cloud</Badge>
                <Badge variant="secondary">Docker</Badge>
                <Badge variant="secondary">Kubernetes</Badge>
                <Badge variant="secondary">CI/CD Pipelines</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Benefits</CardTitle>
          <CardDescription>
            Value delivered to Indian Bank’s technology and operations units
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>85% reduction in incident resolution times</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Boosted customer digital experience satisfaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Improved fraud detection via anomaly monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>SSL and infrastructure compliance enforcement</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Streamlined IT ops across 4000+ branches</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Cost-effective resource allocation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Meets RBI monitoring standards</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Data-driven governance and auditing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Reach out to the WebMonitor support and development teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">IT Operations</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">webmonitor-support@indianbank.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">1800-425-00XX</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Development Team</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">webmonitor-dev@indianbank.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Indian Bank Tech Centre, Chennai HQ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/reports">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Generate Reports
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Shield className="h-4 w-4 mr-2" />
                  Platform Settings
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              WebMonitor is a proprietary monitoring platform developed by Indian Bank’s 
              Digital Banking & IT Operations division.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Indian Bank. All rights reserved. Internal use only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
