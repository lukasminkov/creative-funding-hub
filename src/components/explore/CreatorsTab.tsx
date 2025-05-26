
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import CreatorCard from "./CreatorCard";

interface CreatorsTabProps {
  isLoading: boolean;
  topCreators: any[];
  regularCreators: any[];
}

export default function CreatorsTab({ isLoading, topCreators, regularCreators }: CreatorsTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </div>
              </div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Creators */}
      {topCreators.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-purple-500" />
            <h3 className="text-xl font-semibold">Top Creators</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCreators.map((creator: any) => (
              <CreatorCard key={creator.id} creator={creator} isTop={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Creators */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Creators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCreators.map((creator: any) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
        {regularCreators.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No creators found</p>
          </div>
        )}
      </div>
    </div>
  );
}
