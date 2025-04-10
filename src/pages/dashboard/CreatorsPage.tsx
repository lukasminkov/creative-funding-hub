
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare } from "lucide-react";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock creators data
const mockAllCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    platforms: ["instagram", "tiktok"],
    totalCampaigns: 4,
    totalViews: 125000,
    status: "active"
  },
  {
    id: 2,
    name: "Mike Peters",
    avatar: "https://i.pravatar.cc/150?u=mike",
    platforms: ["tiktok", "youtube"],
    totalCampaigns: 3,
    totalViews: 98500,
    status: "active"
  },
  {
    id: 3,
    name: "Jessica Williams",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    platforms: ["instagram", "twitter"],
    totalCampaigns: 6,
    totalViews: 215200,
    status: "active"
  },
  {
    id: 4,
    name: "Tyler Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=tyler",
    platforms: ["instagram", "tiktok", "youtube"],
    totalCampaigns: 2,
    totalViews: 56000,
    status: "active"
  },
  {
    id: 5,
    name: "Aisha Patel",
    avatar: "https://i.pravatar.cc/150?u=aisha",
    platforms: ["tiktok"],
    totalCampaigns: 5,
    totalViews: 142000,
    status: "active"
  },
  {
    id: 6,
    name: "Marcus Green",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    platforms: ["instagram", "youtube"],
    totalCampaigns: 3,
    totalViews: 89500,
    status: "active"
  }
];

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Filter creators based on search
  const filteredCreators = mockAllCreators.filter(
    creator => creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageCreator = (creatorId: number, creatorName: string) => {
    toast.success(`Opening message with ${creatorName}`);
    navigate("/dashboard/messages", { 
      state: { 
        creatorId, 
        creatorName,
        initiateMessage: true 
      } 
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Creators</h2>
          <p className="text-muted-foreground">
            Manage and view all creators you've worked with
          </p>
        </div>
        <Button>Invite Creator</Button>
      </div>

      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Creators</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCreators.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Campaigns</TableHead>
                    <TableHead>Total Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCreators.map((creator) => (
                    <TableRow key={creator.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{creator.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {creator.platforms.map(platform => (
                            <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                              <SocialIcon platform={platform} />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{creator.totalCampaigns}</TableCell>
                      <TableCell>{creator.totalViews.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleMessageCreator(creator.id, creator.name)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Message {creator.name}</span>
                          </Button>
                          <Button variant="ghost" size="sm">View Profile</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No creators found matching your search</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
