import { ArrowLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Campaign } from "@/lib/campaign-types";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ChatMessage {
  id: number;
  sender: {
    id: string;
    name: string;
    avatar: string;
    type: "brand" | "creator";
  };
  content: string;
  timestamp: string;
}

export default function CampaignChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-chat', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching campaign:", error);
        throw new Error("Campaign not found");
      }
      
      if (!data) {
        throw new Error("Campaign not found");
      }
      
      generateMockMessagesForCampaign(data.id);
      
      return data as Campaign;
    }
  });

  const generateMockMessagesForCampaign = (campaignId: string) => {
    const mockMessages: ChatMessage[] = [
      {
        id: 1,
        sender: {
          id: "brand-1",
          name: "You",
          avatar: "",
          type: "brand"
        },
        content: `Hi team, welcome to the campaign chat for "${campaign?.title || 'this campaign'}"! This is where we'll coordinate all activities.`,
        timestamp: "2023-08-15T09:00:00Z"
      },
      {
        id: 2,
        sender: {
          id: "creator-1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?u=sarah",
          type: "creator"
        },
        content: "Thanks for the opportunity! I've already started brainstorming some ideas for the content. When would you like to see the first draft?",
        timestamp: "2023-08-15T09:15:00Z"
      }
    ];
    
    setMessages(mockMessages);
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: {
        id: "brand-1",
        name: "You",
        avatar: "",
        type: "brand"
      },
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        </div>
        <div className="h-[600px] w-full bg-muted rounded"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or was deleted.</p>
        <Button onClick={() => navigate("/dashboard/campaigns")}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(`/dashboard/campaigns/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/dashboard/campaigns/${id}`} className="hover:underline">{campaign.title}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Chat</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{campaign.title} - Chat</h1>
        <p className="text-muted-foreground">
          Communicate with creators working on this campaign
        </p>
      </div>

      <div className="border rounded-lg bg-card">
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt="Sarah J" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=mike" alt="Mike P" />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=jessica" alt="Jessica W" />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="font-medium">Campaign Group Chat</div>
              <div className="text-xs text-muted-foreground">You and 3 creators</div>
            </div>
          </div>
        </div>
        
        <div className="h-[500px] p-4 overflow-y-auto flex flex-col space-y-4">
          {messages.map(message => {
            const isMyMessage = message.sender.type === "brand";
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                  {!isMyMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <div className={`flex gap-2 items-end ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                      {!isMyMessage && (
                        <span className="text-xs font-medium">{message.sender.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>
                    <div 
                      className={`rounded-lg p-3 ${
                        isMyMessage 
                          ? 'bg-primary/20 text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t p-4">
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
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
