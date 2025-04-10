
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Mail, ShieldAlert, Database, Layers, User, Bell } from "lucide-react";

export default function SettingsPage() {
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Payper",
    siteDescription: "A platform for connecting brands with creators",
    supportEmail: "support@payper.io",
    contactEmail: "contact@payper.io"
  });
  
  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    enableEmails: true,
    welcomeEmail: true,
    campaignUpdates: true,
    paymentNotifications: true,
    marketingEmails: false
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    twoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireSpecial: true
  });
  
  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    allowSignups: true,
    moderateCampaigns: true,
    moderateSubmissions: true,
    campaignApprovalRequired: true
  });
  
  // Handle general settings change
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">Manage global platform configuration</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-8">
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-2">
            <Layers className="h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Platform Name</Label>
                <Input 
                  id="siteName" 
                  name="siteName" 
                  value={generalSettings.siteName} 
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Platform Description</Label>
                <Textarea 
                  id="siteDescription" 
                  name="siteDescription" 
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input 
                  id="supportEmail" 
                  name="supportEmail" 
                  type="email" 
                  value={generalSettings.supportEmail}
                  onChange={handleGeneralChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail" 
                  type="email" 
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmails">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on/off all email notifications globally
                  </p>
                </div>
                <Switch 
                  id="enableEmails" 
                  checked={emailSettings.enableEmails}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, enableEmails: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="welcomeEmail">Welcome Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome emails to new users
                  </p>
                </div>
                <Switch 
                  id="welcomeEmail" 
                  checked={emailSettings.welcomeEmail}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, welcomeEmail: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="campaignUpdates">Campaign Update Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications about campaign changes
                  </p>
                </div>
                <Switch 
                  id="campaignUpdates" 
                  checked={emailSettings.campaignUpdates}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, campaignUpdates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentNotifications">Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications about payments
                  </p>
                </div>
                <Switch 
                  id="paymentNotifications" 
                  checked={emailSettings.paymentNotifications}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, paymentNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send promotional and marketing emails
                  </p>
                </div>
                <Switch 
                  id="marketingEmails" 
                  checked={emailSettings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch 
                  id="requireEmailVerification" 
                  checked={securitySettings.requireEmailVerification}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, requireEmailVerification: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for all users
                  </p>
                </div>
                <Switch 
                  id="twoFactorAuth" 
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input 
                  id="passwordMinLength" 
                  type="number" 
                  min={6}
                  max={20}
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => 
                    setSecuritySettings(prev => ({ 
                      ...prev, 
                      passwordMinLength: parseInt(e.target.value) 
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="passwordRequireSpecial">Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">
                    Passwords must contain special characters
                  </p>
                </div>
                <Switch 
                  id="passwordRequireSpecial" 
                  checked={securitySettings.passwordRequireSpecial}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, passwordRequireSpecial: checked }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure core platform functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowSignups">Allow New Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register for the platform
                  </p>
                </div>
                <Switch 
                  id="allowSignups" 
                  checked={platformSettings.allowSignups}
                  onCheckedChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, allowSignups: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="moderateCampaigns">Moderate New Campaigns</Label>
                  <p className="text-sm text-muted-foreground">
                    Manually review all new campaigns before they go live
                  </p>
                </div>
                <Switch 
                  id="moderateCampaigns" 
                  checked={platformSettings.moderateCampaigns}
                  onCheckedChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, moderateCampaigns: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="moderateSubmissions">Moderate Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow system admins to review all submissions
                  </p>
                </div>
                <Switch 
                  id="moderateSubmissions" 
                  checked={platformSettings.moderateSubmissions}
                  onCheckedChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, moderateSubmissions: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="campaignApprovalRequired">Campaign Approval Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval before campaigns go live
                  </p>
                </div>
                <Switch 
                  id="campaignApprovalRequired" 
                  checked={platformSettings.campaignApprovalRequired}
                  onCheckedChange={(checked) => 
                    setPlatformSettings(prev => ({ ...prev, campaignApprovalRequired: checked }))
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Manage database settings and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Backup Database</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a complete backup of the database
                  </p>
                  <Button variant="outline">Create Backup</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Clear Cache</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear system cache to resolve issues
                  </p>
                  <Button variant="outline">Clear Cache</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Run Database Optimization</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optimize database performance
                  </p>
                  <Button variant="outline">Run Optimization</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-red-600 mb-2">Reset Database</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reset the database to default state. This will delete all data.
                  </p>
                  <Button variant="destructive">Reset Database</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
