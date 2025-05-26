
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MessageSquare, Filter, MoreHorizontal, Eye, 
  Star, TrendingUp, Users, Grid, List
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Enhanced mock creators data
const mockAllCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    bio: "Fashion & lifestyle content creator passionate about sustainable fashion",
    platforms: ["instagram", "tiktok", "youtube"],
    totalCampaigns: 150,
    totalViews: 2450000,
    totalEarnings: 32500,
    avgEngagementRate: 4.2,
    rating: 4.8,
    status: "active",
    categories: ["Fashion", "Lifestyle", "Beauty"],
    isVerified: true,
    followers: {
      instagram: 245000,
      tiktok: 180000,
      youtube: 95000
    }
  },
  {
    id: 2,
    name: "Mike Peters",
    username: "@mikepeters",
    avatar: "https://i.pravatar.cc/150?u=mike",
    bio: "Tech enthusiast and gaming content creator",
    platforms: ["tiktok", "youtube", "twitch"],
    totalCampaigns: 98,
    totalViews: 1890000,
    totalEarnings: 45200,
    avgEngagementRate: 5.1,
    rating: 4.9,
    status: "active",
    categories: ["Technology", "Gaming", "Reviews"],
    isVerified: true,
    followers: {
      tiktok: 320000,
      youtube: 450000,
      twitch: 125000
    }
  },
  {
    id: 3,
    name: "Jessica Williams",
    username: "@jessicawilliams",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    bio: "Travel and food blogger sharing adventures around the world",
    platforms: ["instagram", "twitter", "youtube"],
    totalCampaigns: 75,
    totalViews: 1560000,
    totalEarnings: 28900,
    avgEngagementRate: 3.8,
    rating: 4.6,
    status: "active",
    categories: ["Travel", "Food", "Lifestyle"],
    isVerified: false,
    followers: {
      instagram: 185000,
      twitter: 95000,
      youtube: 78000
    }
  },
  {
    id: 4,
    name: "Tyler Rodriguez",
    username: "@tylerrodriguez",
    avatar: "https://i.pravatar.cc/150?u=tyler",
    bio: "Fitness trainer and wellness coach inspiring healthy lifestyles",
    platforms: ["instagram", "tiktok", "youtube"],
    totalCampaigns: 62,
    totalViews: 1230000,
    totalEarnings: 19800,
    avgEngagementRate: 6.2,
    rating: 4.7,
    status: "active",
    categories: ["Fitness", "Health", "Wellness"],
    isVerified: true,
    followers: {
      instagram: 156000,
      tiktok: 89000,
      youtube: 67000
    }
  },
  {
    id: 5,
    name: "Aisha Patel",
    username: "@aishapatel",
    avatar: "https://i.pravatar.cc/150?u=aisha",
    bio: "Beauty guru and makeup artist creating stunning looks",
    platforms: ["tiktok", "instagram", "youtube"],
    totalCampaigns: 89,
    totalViews: 1780000,
    totalEarnings: 35600,
    avgEngagementRate: 4.9,
    rating: 4.8,
    status: "active",
    categories: ["Beauty", "Makeup", "Fashion"],
    isVerified: true,
    followers: {
      tiktok: 234000,
      instagram: 198000,
      youtube: 112000
    }
  },
  {
    id: 6,
    name: "Marcus Green",
    username: "@marcusgreen",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    bio: "Comedy creator and entertainer bringing laughs daily",
    platforms: ["instagram", "youtube", "tiktok"],
    totalCampaigns: 43,
    totalViews: 945000,
    totalEarnings: 15400,
    avgEngagementRate: 7.1,
    rating: 4.5,
    status: "active",
    categories: ["Comedy", "Entertainment"],
    isVerified: false,
    followers: {
      instagram: 125000,
      youtube: 89000,
      tiktok: 167000
    }
  }
];

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(mockAllCreators.flatMap(creator => creator.categories)))];
  
  // Filter creators based on search and category
  const filteredCreators = mockAllCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || creator.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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

  const CreatorCard = ({ creator }: { creator: typeof mockAllCreators[0] }) => (
    <Card className="glass-card card-hover group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="text-lg">{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{creator.name}</h3>
              {creator.isVerified && (
                <Badge variant="default" className="bg-blue-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{creator.username}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/creators/${creator.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMessageCreator(creator.id, creator.name)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Platforms */}
        <div className="flex gap-2 mb-4">
          {creator.platforms.map(platform => (
            <div key={platform} className="bg-secondary/50 p-2 rounded-full">
              <SocialIcon platform={platform} />
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {creator.categories.slice(0, 3).map(category => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-bold">{creator.totalCampaigns}</div>
            <div className="text-xs text-muted-foreground">Campaigns</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              ${(creator.totalEarnings / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{creator.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link to={`/dashboard/creators/${creator.id}`}>
              View Profile
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleMessageCreator(creator.id, creator.name)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Creators</h2>
          <p className="text-muted-foreground">
            Discover and connect with talented content creators
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "table" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Creators</p>
                <p className="text-2xl font-bold">{mockAllCreators.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Creators</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockAllCreators.filter(c => c.isVerified).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">
                  {mockAllCreators.reduce((sum, c) => sum + c.totalCampaigns, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(mockAllCreators.reduce((sum, c) => sum + c.rating, 0) / mockAllCreators.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators by name, username, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map(category => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "All Categories" : category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <Card className="glass-card">
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
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
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
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{creator.name}</div>
                                {creator.isVerified && (
                                  <Badge variant="default" className="bg-blue-500">
                                    <Star className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{creator.username}</div>
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
                        <TableCell>${creator.totalEarnings.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{creator.rating}</span>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleMessageCreator(creator.id, creator.name)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/dashboard/creators/${creator.id}`}>
                                View Profile
                              </Link>
                            </Button>
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
      )}

      {filteredCreators.length === 0 && searchQuery && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No creators found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
              <Button onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
