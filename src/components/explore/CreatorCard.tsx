
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Heart, Crown, DollarSign, Activity, Eye } from "lucide-react";

interface CreatorCardProps {
  creator: any;
  isTop?: boolean;
}

export default function CreatorCard({ creator, isTop = false }: CreatorCardProps) {
  return (
    <Card className={`overflow-hidden ${isTop ? 'border-2 border-purple-400 shadow-lg' : ''}`}>
      {isTop && (
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-3 py-1 text-xs font-medium text-white flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Top Creator
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{creator.name}</h3>
            <p className="text-muted-foreground text-sm">{creator.username}</p>
            <Badge variant="secondary" className="mt-1">{creator.category}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-medium">{creator.followers}</span>
            </div>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-3 w-3" />
              <span className="font-medium">{creator.engagement}</span>
            </div>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="font-medium">{creator.campaigns}</span>
            </div>
            <p className="text-xs text-muted-foreground">Campaigns</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium">{creator.earned}</span>
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="text-center col-span-2">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="font-medium">{creator.viewsGenerated}</span>
            </div>
            <p className="text-xs text-muted-foreground">Views Generated</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {creator.platforms.map((platform: string) => (
            <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              {platform}
            </span>
          ))}
        </div>
        
        <Link to={`/dashboard/creators/${creator.id}`}>
          <Button className="w-full" variant="outline">View Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
