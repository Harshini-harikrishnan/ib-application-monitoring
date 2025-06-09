"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user data - would come from API in real application
const mockUserData = {
  id: "USR-001",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Administrator",
  designation: "Senior DevOps Engineer",
  placeOfWork: "TechCorp Solutions",
  contactNumber: "+1 (555) 123-4567",
  avatarUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  joinDate: "2022-03-15",
  lastLogin: "2024-05-25 14:30:00",
  department: "Infrastructure & Operations",
  manager: "Sarah Wilson",
  timezone: "UTC-5 (Eastern Time)",
  language: "English",
};

export function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [editedData, setEditedData] = useState(mockUserData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // In a real application, this would make an API call to update the user data
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture and Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                <AvatarFallback className="text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{userData.name}</h3>
              <Badge variant="secondary">{userData.role}</Badge>
              <p className="text-sm text-muted-foreground">{userData.designation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details and contact information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                {isEditing ? (
                  <Input
                    id="designation"
                    value={editedData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.designation}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placeOfWork">Place of Work</Label>
                {isEditing ? (
                  <Input
                    id="placeOfWork"
                    value={editedData.placeOfWork}
                    onChange={(e) => handleInputChange('placeOfWork', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.placeOfWork}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                {isEditing ? (
                  <Input
                    id="contactNumber"
                    value={editedData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.contactNumber}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editedData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2">{userData.department}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and system information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{userData.id}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <Badge variant="outline">{userData.role}</Badge>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
              <p className="text-sm">{new Date(userData.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
              <p className="text-sm">{new Date(userData.lastLogin).toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Manager</Label>
              <p className="text-sm">{userData.manager}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Timezone</Label>
              <p className="text-sm">{userData.timezone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Active Sessions</h4>
              <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
            </div>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}