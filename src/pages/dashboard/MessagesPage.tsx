
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CampaignChat {
  id: string;
  campaignId: string;
  campaignTitle: string;
  messages: {
    id: number;
    sender: string;
    time: string;
    content: string;
  }[];
  unread: number;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [campaignChats, setCampaignChats] = useState<CampaignChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<CampaignChat | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  
  // Fetch campaigns to display in the messages page
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns-for-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Generate mock chats for the fetched campaigns
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const generatedChats: CampaignChat[] = campaigns.map((campaign, index) => {
        // Generate a random number of unread messages (0-3)
        const unread = Math.floor(Math.random() * 4);
        
        // Generate a mock last message
        const mockSenders = ["Sarah J.", "Mike P.", "Jessica W.", "Tyler R."];
        const mockMessages = [
          "I've submitted the content for review",
          "When is the deadline for the next submission?",
          "The product arrived, I'll start working on it soon",
          "Can I get more details about the target audience?"
        ];
        
        const randomSenderIndex = index % mockSenders.length;
        const randomMessageIndex = index % mockMessages.length;
        
        return {
          id: `chat-${campaign.id}`,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          messages: [
            {
              id: 1,
              sender: mockSenders[randomSenderIndex],
              time: index === 0 ? "Just now" : index === 1 ? "Yesterday" : `${index} days ago`,
              content: mockMessages[randomMessageIndex]
            }
          ],
          unread
        };
      });
      
      setCampaignChats(generatedChats);
      if (generatedChats.length > 0 && !selectedChat) {
        setSelectedChat(generatedChats[0]);
      }
    }
  }, [campaigns]);
  
  const handleChatSelect = (chat: CampaignChat) => {
    setSelectedChat(chat);
    // In a real application, you would mark messages as read here
    setCampaignChats(
      campaignChats.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
  };
  
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChat) return;
    
    // Add message to the selected chat
    const updatedChats = campaignChats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: "You",
              time: "Just now",
              content: inputMessage
            }
          ]
        };
      }
      return chat;
    });
    
    setCampaignChats(updatedChats);
    setSelectedChat(
      updatedChats.find(chat => chat.id === selectedChat.id) || null
    );
    setInputMessage("");
  };
  
  // Filter chats based on search term
  const filteredChats = campaignChats.filter(chat => 
    chat.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleNavigateToCampaignChat = (campaignId: string) => {
    navigate(`/dashboard/campaigns/${campaignId}/chat`);
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading campaigns...
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchTerm ? "No matching chats found" : "No campaigns yet"}
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div 
                      key={chat.id} 
                      className={`p-3 hover:bg-muted cursor-pointer ${
                        selectedChat?.id === chat.id ? 'bg-muted' : 
                        chat.unread > 0 ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => handleChatSelect(chat)}
                      onDoubleClick={() => handleNavigateToCampaignChat(chat.campaignId)}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{chat.campaignTitle}</span>
                        {chat.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      {chat.messages.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback>{chat.messages[chat.messages.length - 1].sender.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-medium">{chat.messages[chat.messages.length - 1].sender}</span>
                              <span className="text-xs text-muted-foreground">{chat.messages[chat.messages.length - 1].time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.messages[chat.messages.length - 1].content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedChat.campaignTitle.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {selectedChat.campaignTitle}
                        <div className="text-sm text-muted-foreground font-normal">
                          {selectedChat.messages.length > 0 
                            ? `${new Set(selectedChat.messages.map(m => m.sender)).size} participants` 
                            : "No messages yet"}
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="h-[400px] p-4 flex flex-col overflow-y-auto">
                    <div className="space-y-4 mt-auto">
                      {selectedChat.messages.map((message, index) => {
                        const isMyMessage = message.sender === "You";
                        
                        return (
                          <div key={index} className="flex flex-col gap-1 items-start">
                            <div className={`flex ${isMyMessage ? 'ml-auto flex-row-reverse' : ''}`}>
                              {!isMyMessage && (
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div 
                                className={`rounded-lg p-3 max-w-[80%] ${
                                  isMyMessage 
                                    ? 'bg-primary/10 text-primary-foreground' 
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                            <span className={`text-xs text-muted-foreground ${isMyMessage ? 'ml-auto' : 'ml-10'}`}>
                              {isMyMessage ? 'You' : message.sender} • {message.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground text-center">
                      Double-click on a campaign to open the full chat page
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
                <div>
                  <p className="mb-2">Select a campaign chat to start messaging</p>
                  {campaignChats.length === 0 && !isLoading && (
                    <p className="text-sm">No campaigns available yet</p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
