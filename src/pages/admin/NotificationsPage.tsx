
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, Send, Users, CalendarClock, Filter, MessageSquare, MoreHorizontal 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export default function NotificationsPage() {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  
  // Mock sent notifications data
  const sentNotifications = [
    { 
      id: 1, 
      title: "New Feature Release", 
      body: "We've just launched a new collaboration feature!", 
      recipients: "All Users", 
      sentAt: "2023-09-15 10:30 AM",
      status: "Delivered"
    },
    { 
      id: 2, 
      title: "Important System Update", 
      body: "The platform will be down for maintenance on Saturday.", 
      recipients: "Brands", 
      sentAt: "2023-09-10 09:15 AM",
      status: "Delivered"
    },
    { 
      id: 3, 
      title: "Your Campaign Was Featured", 
      body: "Congratulations! Your campaign was selected as a featured campaign.", 
      recipients: "Nike", 
      sentAt: "2023-09-05 02:45 PM",
      status: "Delivered"
    },
    { 
      id: 4, 
      title: "Upcoming Payment Schedule", 
      body: "This is a reminder about the upcoming creator payments.", 
      recipients: "Creators", 
      sentAt: "2023-09-01 11:20 AM",
      status: "Scheduled"
    },
  ];
  
  const handleSendNotification = () => {
    if (!notificationTitle || !notificationBody) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and message for the notification.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulated send notification logic
    toast({
      title: "Notification Sent",
      description: isScheduled 
        ? `Your notification has been scheduled for ${scheduleDate}` 
        : "Your notification has been sent successfully"
    });
    
    // Reset form fields
    setNotificationTitle("");
    setNotificationBody("");
    setRecipientType("all");
    setIsScheduled(false);
    setScheduleDate("");
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications Management</h1>
          <p className="text-muted-foreground">Send notifications to users and brands</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Create and send notifications to app users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                placeholder="Notification title" 
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">Message</label>
              <Textarea 
                id="body" 
                placeholder="Write your notification message here..." 
                className="min-h-[120px]" 
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="recipients" className="text-sm font-medium">Recipients</label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="brands">All Brands</SelectItem>
                  <SelectItem value="creators">All Creators</SelectItem>
                  <SelectItem value="specific">Specific Users</SelectItem>
                </SelectContent>
              </Select>
              
              {recipientType === "specific" && (
                <Input 
                  className="mt-2" 
                  placeholder="Enter user IDs or emails (comma separated)" 
                />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="schedule" 
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="schedule" className="text-sm">Schedule for later</label>
            </div>
            
            {isScheduled && (
              <div className="space-y-2">
                <label htmlFor="scheduleDate" className="text-sm font-medium">Schedule Date & Time</label>
                <Input 
                  id="scheduleDate" 
                  type="datetime-local" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSendNotification}
            >
              <Send className="h-4 w-4 mr-2" />
              {isScheduled ? "Schedule Notification" : "Send Notification"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>View all sent and scheduled notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentNotifications.map(notification => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {notification.body}
                      </div>
                    </TableCell>
                    <TableCell>{notification.recipients}</TableCell>
                    <TableCell>{notification.sentAt}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={notification.status === "Delivered" ? "secondary" : "outline"}
                      >
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Resend</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
