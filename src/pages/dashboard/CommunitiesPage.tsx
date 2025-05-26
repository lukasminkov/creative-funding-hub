
import { useState, useEffect } from "react";
import { Plus, Users, Globe, Lock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CreateCommunityDialog from "@/components/communities/CreateCommunityDialog";

interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: 'free' | 'one_time' | 'subscription';
  price: number;
  currency: string;
  banner_image: string | null;
  is_private: boolean;
  member_count?: number;
  created_at: string;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setError(null);
      console.log('Fetching communities...');
      
      // First, let's try a simple query to see if the basic table works
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Communities data:', data);

      // For now, set member_count to 0 for all communities
      // We can enhance this later with a separate query
      const communitiesWithCount = data?.map(community => ({
        ...community,
        member_count: 0
      })) || [];

      setCommunities(communitiesWithCount);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setError('Failed to load communities');
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityCreated = () => {
    fetchCommunities();
    setShowCreateDialog(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'free':
        return <Globe className="h-4 w-4" />;
      case 'one_time':
        return <DollarSign className="h-4 w-4" />;
      case 'subscription':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'one_time':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'subscription':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Communities</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {error}</p>
            <Button 
              onClick={fetchCommunities} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">
            Create and manage your communities
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>

      {communities.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <CardTitle>No communities yet</CardTitle>
            <CardDescription>
              Create your first community to start building your audience
            </CardDescription>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Community
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {community.name}
                      {community.is_private && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {community.description || 'No description provided'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(community.type)}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(community.type)}
                        {community.type === 'free' ? 'Free' : 
                         community.type === 'one_time' ? 'One-time' : 'Subscription'}
                      </span>
                    </Badge>
                    {community.type !== 'free' && (
                      <span className="text-sm font-medium">
                        {community.currency} {community.price}
                        {community.type === 'subscription' && '/month'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {community.member_count || 0} members
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCommunityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCommunityCreated={handleCommunityCreated}
      />
    </div>
  );
}
