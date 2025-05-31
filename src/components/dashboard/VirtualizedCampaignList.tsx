
import React, { useMemo } from 'react';
import { VirtualList } from '@/components/ui/virtual-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { MessageSquare, Eye } from 'lucide-react';
import { Campaign } from '@/types/campaign.types';
import { formatCurrency } from '@/lib/campaign-types';

interface VirtualizedCampaignListProps {
  campaigns: Campaign[];
  onViewDetails: (campaign: Campaign) => void;
  onMessageBrand?: (brandId: string, brandName: string) => void;
  containerHeight?: number;
}

const CAMPAIGN_ITEM_HEIGHT = 280;

export default function VirtualizedCampaignList({
  campaigns,
  onViewDetails,
  onMessageBrand,
  containerHeight = 600
}: VirtualizedCampaignListProps) {
  const campaignItems = useMemo(() => campaigns, [campaigns]);

  const renderCampaignItem = (campaign: Campaign, index: number) => (
    <div className="p-3">
      <Card className="h-full">
        <div className="h-40 relative">
          {campaign.bannerImage ? (
            <OptimizedImage
              src={campaign.bannerImage}
              alt={campaign.title || 'Campaign'}
              className="w-full h-full object-cover rounded-t-lg"
              aspectRatio="16/9"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
              <div className="text-center">
                <h4 className="font-medium text-lg">{campaign.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {campaign.type?.charAt(0).toUpperCase() + campaign.type?.slice(1)} Campaign
                </p>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium truncate">{campaign.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {campaign.brandName && `${campaign.brandName} • `}
                {campaign.type}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                Budget: <span className="font-medium">
                  {formatCurrency(campaign.totalBudget || 0, campaign.currency as any)}
                </span>
              </div>
              <Badge variant="outline">
                {campaign.status || 'Draft'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onViewDetails(campaign)}
                aria-label={`View details for ${campaign.title}`}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {campaign.brandId && campaign.brandName && onMessageBrand && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onMessageBrand(campaign.brandId!, campaign.brandName!)}
                  aria-label={`Message ${campaign.brandName}`}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (campaignItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No campaigns found</p>
      </div>
    );
  }

  return (
    <VirtualList
      items={campaignItems}
      itemHeight={CAMPAIGN_ITEM_HEIGHT}
      containerHeight={containerHeight}
      renderItem={renderCampaignItem}
      className="border rounded-lg"
    />
  );
}
