"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, Mail, Send, Paperclip, Smile, Users, 
  Shield, Bell, Clock, Search, Plus, Settings, Phone,
  Video, MoreHorizontal, Download, Archive, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Sarah Wilson",
    role: "DevOps Manager",
    email: "sarah.wilson@company.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    status: "online",
    lastSeen: "now"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Senior Developer",
    email: "mike.chen@company.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    status: "online",
    lastSeen: "5 min ago"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Security Analyst",
    email: "emily.rodriguez@company.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    status: "away",
    lastSeen: "1 hour ago"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Infrastructure Engineer",
    email: "david.kim@company.com",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    status: "offline",
    lastSeen: "2 hours ago"
  }
];

// Mock chat messages
const chatMessages = [
  {
    id: 1,
    sender: "Sarah Wilson",
    message: "Hey team, we need to discuss the SSL certificate renewals for next week.",
    timestamp: "10:30 AM",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    id: 2,
    sender: "Mike Chen",
    message: "I can handle the API gateway certificates. Already have the process documented.",
    timestamp: "10:32 AM",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  },
  {
    id: 3,
    sender: "You",
    message: "Great! I'll take care of the main website and customer portal certificates.",
    timestamp: "10:35 AM",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  }
];

// Mock email data
const emails = [
  {
    id: 1,
    from: "SSL Monitor <noreply@webmonitor.com>",
    subject: "SSL Certificate Expiry Alert - api.example.com",
    preview: "Your SSL certificate for api.example.com will expire in 7 days...",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: true,
    hasAttachment: false
  },
  {
    id: 2,
    from: "Performance Monitor <noreply@webmonitor.com>",
    subject: "Weekly Performance Report - All Sites",
    preview: "Your weekly performance report is ready for download...",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: false,
    hasAttachment: true
  },
  {
    id: 3,
    from: "Security Alert <security@webmonitor.com>",
    subject: "Security Scan Complete - Customer Portal",
    preview: "Security scan completed successfully. No vulnerabilities found...",
    timestamp: "2 days ago",
    isRead: true,
    isStarred: false,
    hasAttachment: false
  }
];

// Mock SSL alert history
const sslAlerts = [
  {
    id: 1,
    domain: "api.example.com",
    expiryDate: "2024-06-15",
    alertsSent: 3,
    recipients: ["sarah.wilson@company.com", "mike.chen@company.com"],
    lastAlert: "2024-05-25 09:00:00",
    status: "active"
  },
  {
    id: 2,
    domain: "portal.example.com",
    expiryDate: "2024-06-08",
    alertsSent: 5,
    recipients: ["emily.rodriguez@company.com", "david.kim@company.com"],
    lastAlert: "2024-05-25 09:00:00",
    status: "active"
  },
  {
    id: 3,
    domain: "docs.example.com",
    expiryDate: "2024-05-20",
    alertsSent: 8,
    recipients: ["sarah.wilson@company.com"],
    lastAlert: "2024-05-19 15:30:00",
    status: "renewed"
  }
];

export function MyPeople() {
  const [selectedChat, setSelectedChat] = useState("team");
  const [newMessage, setNewMessage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real implementation, this would send the message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleComposeEmail = () => {
    // In real implementation, this would open email composer
    console.log("Opening email composer...");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat Space</TabsTrigger>
          <TabsTrigger value="mail">Mail Space</TabsTrigger>
          <TabsTrigger value="ssl-alerts">SSL Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Team Members Sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent",
                          selectedChat === `user-${member.id}` && "bg-accent"
                        )}
                        onClick={() => setSelectedChat(`user-${member.id}`)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            member.status === "online" && "bg-green-500",
                            member.status === "away" && "bg-amber-500",
                            member.status === "offline" && "bg-gray-400"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Team Chat Option */}
                    <div
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent",
                        selectedChat === "team" && "bg-accent"
                      )}
                      onClick={() => setSelectedChat("team")}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Team Chat</p>
                        <p className="text-xs text-muted-foreground">General discussion</p>
                      </div>
                      <Badge variant="secondary">3</Badge>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Team Chat</CardTitle>
                      <CardDescription>4 members online</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Messages */}
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <p className="text-sm mt-1">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Separator />
                  
                  {/* Message Input */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="mail" className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Email List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Inbox
                  </CardTitle>
                  <Button onClick={handleComposeEmail} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Compose
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div
                        key={email.id}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer border transition-colors",
                          selectedEmail === email.id ? "bg-accent border-primary" : "hover:bg-accent",
                          !email.isRead && "bg-blue-50 dark:bg-blue-950/20"
                        )}
                        onClick={() => setSelectedEmail(email.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                "text-sm truncate",
                                !email.isRead && "font-semibold"
                              )}>
                                {email.from}
                              </p>
                              {email.isStarred && (
                                <Star className="h-3 w-3 text-amber-500 fill-current" />
                              )}
                              {email.hasAttachment && (
                                <Paperclip className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <p className={cn(
                              "text-sm truncate mt-1",
                              !email.isRead && "font-medium"
                            )}>
                              {email.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {email.preview}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                          {!email.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Email Content */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedEmail ? emails.find(e => e.id === selectedEmail)?.subject : "Select an email"}
                  </CardTitle>
                  {selectedEmail && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedEmail ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">
                            {emails.find(e => e.id === selectedEmail)?.from}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {emails.find(e => e.id === selectedEmail)?.timestamp}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p>Dear Team,</p>
                        <p>
                          This is an automated alert from WebMonitor regarding SSL certificate expiration.
                          The certificate for <strong>api.example.com</strong> is scheduled to expire in 7 days.
                        </p>
                        <p><strong>Certificate Details:</strong></p>
                        <ul>
                          <li>Domain: api.example.com</li>
                          <li>Expiry Date: June 15, 2024</li>
                          <li>Days Remaining: 7</li>
                          <li>Certificate Authority: Let's Encrypt</li>
                        </ul>
                        <p>
                          Please take immediate action to renew this certificate to avoid service disruption.
                        </p>
                        <p>
                          Best regards,<br />
                          WebMonitor SSL Alert System
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an email to view its content</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ssl-alerts" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                SSL Expiry Alert History
              </CardTitle>
              <CardDescription>
                Track and manage automated SSL certificate expiry notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sslAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-3 w-3 rounded-full",
                          alert.status === "active" ? "bg-amber-500" : "bg-green-500"
                        )} />
                        <div>
                          <h4 className="font-medium">{alert.domain}</h4>
                          <p className="text-sm text-muted-foreground">
                            Expires: {alert.expiryDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            alert.status === "active" && "text-amber-600 border-amber-200 bg-amber-50",
                            alert.status === "renewed" && "text-green-600 border-green-200 bg-green-50"
                          )}
                        >
                          {alert.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {alert.alertsSent} alerts sent
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Recipients</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {alert.recipients.map((recipient, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Last Alert Sent</Label>
                          <p className="text-sm mt-1">{alert.lastAlert}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* SSL Alert Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>
                Configure SSL certificate expiry alert settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alert-days">Alert Days Before Expiry</Label>
                  <Input
                    id="alert-days"
                    type="number"
                    defaultValue="30,15,7,1"
                    placeholder="30,15,7,1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of days before expiry to send alerts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alert-emails">Alert Recipients</Label>
                  <Textarea
                    id="alert-emails"
                    placeholder="admin@company.com, devops@company.com"
                    defaultValue="admin@company.com, devops@company.com"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of email addresses
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button>Save Configuration</Button>
                <Button variant="outline">Test Alert</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}