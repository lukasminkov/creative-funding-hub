
import { Campaign, Submission } from "./campaign-types";

export const generateMockSubmissions = (campaigns: Campaign[]): Submission[] => {
  if (!campaigns || campaigns.length === 0) return [];
  
  const submissions: Submission[] = [];
  
  // For each campaign, generate some submissions
  campaigns.forEach(campaign => {
    // Number of submissions based on campaign type
    const numSubmissions = campaign.type === 'retainer' ? 5 : 
                          campaign.type === 'payPerView' ? 3 : 2;
    
    for (let i = 0; i < numSubmissions; i++) {
      const isApproved = Math.random() > 0.7;
      const isPending = !isApproved && Math.random() > 0.3;
      
      const submission: Submission = {
        id: `submission-${campaign.id}-${i}`,
        creator_id: `creator-${i}`,
        creator_name: `Creator ${i + 1}`,
        creator_avatar: `https://i.pravatar.cc/150?u=${i}`,
        campaign_id: campaign.id,
        campaign_title: campaign.title,
        campaign_type: campaign.type as any,
        submitted_date: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
        payment_amount: campaign.type === 'retainer' 
          ? campaign.creatorTiers?.[0]?.price || 1000
          : campaign.type === 'payPerView'
            ? Math.floor(Math.random() * 5000) / 10
            : 0,
        views: Math.floor(Math.random() * 50000),
        status: isApproved ? 'approved' : isPending ? 'pending' : 'denied',
        platform: campaign.platforms?.[Math.floor(Math.random() * campaign.platforms.length)] || 'TikTok',
        platformUsername: `@creator${i + 1}`,
        content: `https://example.com/content-${campaign.id}-${i}`
      };
      
      submissions.push(submission);
    }
  });
  
  return submissions;
};

// Initialize mock data in local storage if none exists
export const initMockData = () => {
  // Check if we already have submissions
  const existingSubmissions = localStorage.getItem("submissions");
  if (!existingSubmissions) {
    // Get campaigns from local storage
    const campaignsStr = localStorage.getItem("campaigns");
    if (campaignsStr) {
      try {
        const campaigns = JSON.parse(campaignsStr);
        if (Array.isArray(campaigns) && campaigns.length > 0) {
          const submissions = generateMockSubmissions(campaigns);
          localStorage.setItem("submissions", JSON.stringify(submissions));
          console.log("Initialized mock submission data:", submissions.length);
        }
      } catch (e) {
        console.error("Error parsing campaigns for mock data:", e);
      }
    }
  }
};
