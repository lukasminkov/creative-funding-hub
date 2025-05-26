
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Plus, Users, Lock, Star, MessageSquare, Settings } from "lucide-react";
import CreateCommunityDialog from "@/components/communities/CreateCommunityDialog";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: communities = [], isLoading, refetch } = useQuery({
    queryKey: ["my-communities"],
    queryFn: () => {
      const stored = localStorage.getItem("communities");
      const allCommunities = stored ? JSON.parse(stored) : [];
      // Filter to show only communities created by current user
      // For demo purposes, we'll show communities where owner matches "Current User"
      return allCommunities.filter((community: any) => 
        community.owner === "Current User" || community.ownerId === "current-user-id"
      );
    }
  });

  const handleCommunityCreated = () => {
    refetch();
    setShowCreateDialog(false);
  };

  // Filter my communities
  const filteredCommunities = communities.filter((community: any) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search my communities..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
        </div>
      </div>

      {/* My Communities */}
      <div>
        <h3 className="text-xl font-semibold mb-4">My Communities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community: any) => (
            <Card key={community.id} className="overflow-hidden">
              <div className="h-32 relative">
                <img 
                  src={community.bannerImage}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                {community.type === 'paid' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default">${community.price}</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {community.name}
                  {community.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  Created by you • {community.memberCount.toLocaleString()} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{community.description}</p>
                
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                  <Badge variant="outline">{community.category}</Badge>
                </div>

                <div className="flex gap-1 mb-3">
                  {community.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Manage
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredCommunities.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm ? "No communities found" : "No communities created yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first community to get started"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Community
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateCommunityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCommunityCreated={handleCommunityCreated}
      />
    </div>
  );
}
