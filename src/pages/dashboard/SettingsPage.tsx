
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BellRing, CreditCard, Lock, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your brand profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input id="brandName" defaultValue="ad hoc gaming GmbH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Gaming" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://www.adhocgaming.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Brand Description</Label>
                <Input id="description" className="min-h-[100px]" defaultValue="Leading mobile gaming developer specializing in casual and hyper-casual games." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" defaultValue="john@adhocgaming.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" defaultValue="Marketing Director" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5" />
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Campaign Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about your campaign status</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Creator Applications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when creators apply to your campaigns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Content Submissions</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts when content is submitted</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Performance Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly and monthly campaign performance reports</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Platform Updates</Label>
                      <p className="text-sm text-muted-foreground">News and updates about the platform features</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">In-App Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Messages</Label>
                      <p className="text-sm text-muted-foreground">Notify when new messages are received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Campaign Activity</Label>
                      <p className="text-sm text-muted-foreground">Alerts for important campaign activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your payment methods and billing settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Current Plan</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">Business Pro</div>
                      <p className="text-sm text-muted-foreground">$199/month, billed annually</p>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-card p-2 rounded-md">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">Default</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-3">Add Payment Method</Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Billing History</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Invoice #12345</div>
                      <p className="text-sm text-muted-foreground">Jul 01, 2023</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$199.00</div>
                      <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Invoice #12344</div>
                      <p className="text-sm text-muted-foreground">Jun 01, 2023</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$199.00</div>
                      <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Invoice #12343</div>
                      <p className="text-sm text-muted-foreground">May 01, 2023</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$199.00</div>
                      <Button variant="link" size="sm" className="h-auto p-0">Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5" />
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Change Password</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button className="mt-3">Update Password</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Add an extra layer of security to your account</p>
                    <p className="text-sm text-muted-foreground mt-1">Currently disabled</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Login Sessions</h3>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <p className="text-sm text-muted-foreground">MacOS • Chrome • New York, USA</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">iPhone • Safari</div>
                        <p className="text-sm text-muted-foreground">New York, USA • 2 days ago</p>
                      </div>
                      <Button variant="ghost" size="sm">Log Out</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-3 text-red-600 hover:text-red-600 hover:bg-red-50">Log Out All Other Devices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
