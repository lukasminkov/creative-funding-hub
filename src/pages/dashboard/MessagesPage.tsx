
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock messages data
const mockCampaignMessages = [
  {
    id: 1,
    campaignId: "campaign-1",
    campaignTitle: "Summer Collection UGC",
    messages: [
      { id: 101, sender: "Sarah J.", time: "9:45 AM", content: "I've submitted the first video for review" }
    ],
    unread: 3
  },
  {
    id: 2,
    campaignId: "campaign-2",
    campaignTitle: "Fitness Product Review",
    messages: [
      { id: 201, sender: "Mike P.", time: "Yesterday", content: "When is the deadline for the second submission?" }
    ],
    unread: 0
  },
  {
    id: 3,
    campaignId: "campaign-3",
    campaignTitle: "Tech Gadget Unboxing",
    messages: [
      { id: 301, sender: "Jessica W.", time: "2 days ago", content: "The product arrived, I'll start shooting tomorrow" }
    ],
    unread: 1
  },
  {
    id: 4,
    campaignId: "campaign-4",
    campaignTitle: "Holiday Campaign",
    messages: [
      { id: 401, sender: "Tyler R.", time: "1 week ago", content: "Can I get some more details about the target audience?" }
    ],
    unread: 0
  }
];

export default function MessagesPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages</h2>
          <p className="text-muted-foreground">
            Campaign communications with creators
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Campaign Chats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockCampaignMessages.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`p-3 hover:bg-muted cursor-pointer ${chat.unread > 0 ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{chat.campaignTitle}</span>
                      {chat.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>{chat.messages[0].sender.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{chat.messages[0].sender}</span>
                          <span className="text-xs text-muted-foreground">{chat.messages[0].time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.messages[0].content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    Summer Collection UGC
                    <div className="text-sm text-muted-foreground font-normal">
                      3 participants
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-[400px] p-4 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-end gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Hi, I've submitted the first video for review. Let me know if you need any changes!</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-10">Sarah J. • 9:45 AM</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 items-end">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Thanks Sarah! I'll take a look at it and get back to you shortly.</p>
                    </div>
                    <span className="text-xs text-muted-foreground">You • 9:50 AM</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 items-end">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">The video looks great! I just have one small suggestion - can you make the product more visible in the opening shot?</p>
                    </div>
                    <span className="text-xs text-muted-foreground">You • 10:15 AM</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-end gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Sure thing! I'll reshoot that part and submit an updated version.</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-10">Sarah J. • 10:20 AM</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="relative">
                  <Input
                    placeholder="Type a message..."
                    className="pr-20"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
                    Send
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
