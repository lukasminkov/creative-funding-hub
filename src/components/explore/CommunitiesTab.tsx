
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Lock, Star, MessageSquare } from "lucide-react";

interface CommunitiesTabProps {
  isLoading: boolean;
  featuredCommunities: any[];
  regularCommunities: any[];
}

export default function CommunitiesTab({ 
  isLoading, 
  featuredCommunities, 
  regularCommunities 
}: CommunitiesTabProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Communities */}
      {featuredCommunities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold">Featured Communities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCommunities.map((community: any) => (
              <Card key={community.id} className="overflow-hidden border-2 border-yellow-200">
                <div className="h-32 relative">
                  <img 
                    src={community.bannerImage}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {community.name}
                        {community.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                      <CardDescription className="text-sm">by {community.owner}</CardDescription>
                    </div>
                  </div>
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
                      {community.type === 'paid' ? `Join for $${community.price}` : 'Join Free'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Communities */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Communities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCommunities.map((community: any) => (
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
                <CardDescription className="text-sm">by {community.owner}</CardDescription>
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
                  <Button className="flex-1" size="sm" variant="outline">
                    {community.type === 'paid' ? `Join for $${community.price}` : 'Join Free'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {regularCommunities.length === 0 && featuredCommunities.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No communities found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
