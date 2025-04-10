
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, Search, User, Building2, Users, Moon, Phone, 
  Video, MoreVertical, Link2, Paperclip
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  type: 'user' | 'brand';
  isOnline: boolean;
  messages: Message[];
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [tabValue, setTabValue] = useState("all");
  
  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "conv-1",
      name: "Emma Johnson",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Thank you for your help with the payment issue!",
      lastMessageTime: new Date(2023, 8, 15, 15, 30),
      unread: 2,
      type: 'user',
      isOnline: true,
      messages: [
        {
          id: "msg-1",
          senderId: "user-1",
          text: "Hi, I'm having trouble with a payment for the Nike campaign. It says it's pending but it's been over a week now.",
          timestamp: new Date(2023, 8, 15, 14, 22),
          isAdmin: false
        },
        {
          id: "msg-2",
          senderId: "admin-1",
          text: "Hello Emma, let me look into that for you. Can you please provide me with the transaction ID?",
          timestamp: new Date(2023, 8, 15, 14, 25),
          isAdmin: true
        },
        {
          id: "msg-3",
          senderId: "user-1",
          text: "Sure, the transaction ID is tx-2435-abcd.",
          timestamp: new Date(2023, 8, 15, 14, 28),
          isAdmin: false
        },
        {
          id: "msg-4",
          senderId: "admin-1",
          text: "Thanks! I can see the issue now. The payment was delayed due to a verification check. I've manually approved it now, so the funds should be in your account within 24 hours.",
          timestamp: new Date(2023, 8, 15, 15, 10),
          isAdmin: true
        },
        {
          id: "msg-5",
          senderId: "user-1",
          text: "Thank you for your help with the payment issue!",
          timestamp: new Date(2023, 8, 15, 15, 30),
          isAdmin: false
        }
      ]
    },
    {
      id: "conv-2",
      name: "Nike Brand Team",
      avatar: "",
      lastMessage: "When can we expect the analytics report for our last campaign?",
      lastMessageTime: new Date(2023, 8, 14, 11, 45),
      unread: 1,
      type: 'brand',
      isOnline: false,
      messages: [
        {
          id: "msg-6",
          senderId: "brand-1",
          text: "When can we expect the analytics report for our last campaign?",
          timestamp: new Date(2023, 8, 14, 11, 45),
          isAdmin: false
        }
      ]
    },
    {
      id: "conv-3",
      name: "James Wilson",
      avatar: "https://github.com/shadcn.png",
      lastMessage: "Is there a way to extend my submission deadline?",
      lastMessageTime: new Date(2023, 8, 13, 9, 20),
      unread: 0,
      type: 'user',
      isOnline: true,
      messages: [
        {
          id: "msg-7",
          senderId: "user-2",
          text: "Is there a way to extend my submission deadline?",
          timestamp: new Date(2023, 8, 13, 9, 20),
          isAdmin: false
        }
      ]
    },
    {
      id: "conv-4",
      name: "Apple Marketing",
      avatar: "",
      lastMessage: "We'd like to increase our campaign budget. How do we proceed?",
      lastMessageTime: new Date(2023, 8, 12, 16, 5),
      unread: 0,
      type: 'brand',
      isOnline: true,
      messages: [
        {
          id: "msg-8",
          senderId: "brand-2",
          text: "We'd like to increase our campaign budget. How do we proceed?",
          timestamp: new Date(2023, 8, 12, 16, 5),
          isAdmin: false
        }
      ]
    },
  ];
  
  // Filter conversations based on search term and tab
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === "all") return matchesSearch;
    if (tabValue === "users") return matchesSearch && conv.type === 'user';
    if (tabValue === "brands") return matchesSearch && conv.type === 'brand';
    
    return matchesSearch;
  });
  
  // Sort by last message time (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => 
    b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
  );
  
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedConversation) return;
    
    // For demo purposes only - in a real app you'd update the state properly
    // and likely make an API call to save the message
    setCurrentMessage("");
  };
  
  return (
    <div className="p-8 h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Messages</h1>
          <p className="text-muted-foreground">Communicate with users and brands</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search conversations..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full" value={tabValue} onValueChange={setTabValue}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1 px-2 py-2">
            {sortedConversations.length > 0 ? (
              <div className="space-y-2">
                {sortedConversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-secondary' 
                        : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          {conversation.avatar ? (
                            <AvatarImage src={conversation.avatar} />
                          ) : null}
                          <AvatarFallback>
                            {conversation.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">
                            {conversation.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(conversation.lastMessageTime, 'MMM d')}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm text-muted-foreground truncate max-w-[70%]">
                            {conversation.lastMessage}
                          </div>
                          
                          {conversation.unread > 0 && (
                            <Badge className="px-1.5 py-px text-xs rounded-full min-w-[20px] text-center">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No conversations found
              </div>
            )}
          </ScrollArea>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {selectedConversation.avatar ? (
                      <AvatarImage src={selectedConversation.avatar} />
                    ) : null}
                    <AvatarFallback>
                      {selectedConversation.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {selectedConversation.name}
                      {selectedConversation.type === 'brand' ? (
                        <Building2 className="h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedConversation.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          message.isAdmin 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {format(message.timestamp, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Type your message..." 
                      className="pr-10" 
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <div className="flex justify-center mb-4">
                  <MessageBubble className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Custom message bubble icon
const MessageBubble = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
