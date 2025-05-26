
import { Campaign, Submission } from "./campaign-types";

// Mock Campaigns Data
export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "Summer Fashion Collection 2024",
    description: "Showcase our latest summer collection with authentic lifestyle content that resonates with Gen Z fashion enthusiasts.",
    type: "retainer",
    contentType: "UGC",
    category: "Fashion",
    platforms: ["TikTok", "Instagram Reels"],
    totalBudget: 15000,
    currency: "USD",
    endDate: new Date("2024-08-15"),
    visibility: "public",
    countryAvailability: "usa",
    brandName: "StyleCo",
    brandId: "brand-1",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    trackingLink: "https://styleco.com/summer2024",
    guidelines: {
      dos: ["Show authentic styling", "Include product tags", "Use natural lighting"],
      donts: ["Don't use competitors' products", "Avoid overly edited content", "No inappropriate language"]
    },
    requirements: ["Must be 18+", "US-based creators only", "Minimum 10K followers"],
    applicationDeadline: new Date("2024-07-01"),
    submissionDeadline: new Date("2024-08-01"),
    creatorTiers: [
      { name: "Micro", minFollowers: 1000, maxFollowers: 10000, price: 500 },
      { name: "Macro", minFollowers: 10000, maxFollowers: 100000, price: 1500 },
      { name: "Mega", minFollowers: 100000, maxFollowers: 1000000, price: 5000 }
    ]
  },
  {
    id: "camp-2",
    title: "Tech Innovation Showcase",
    description: "Demonstrate our latest AI-powered gadgets in real-world scenarios.",
    type: "payPerView",
    contentType: "UGC",
    category: "Tech",
    platforms: ["YouTube Shorts", "TikTok"],
    totalBudget: 25000,
    currency: "USD",
    endDate: new Date("2024-09-30"),
    visibility: "public",
    countryAvailability: "worldwide",
    brandName: "TechFlow",
    brandId: "brand-2",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    ratePerThousand: 5.0,
    maxPayoutPerSubmission: 2000,
    guidelines: {
      dos: ["Show product functionality", "Include unboxing", "Honest reviews"],
      donts: ["Don't exaggerate claims", "No fake reactions", "Avoid technical jargon"]
    },
    requirements: ["Tech-focused content", "English speaking", "Good video quality"]
  },
  {
    id: "camp-3",
    title: "Fitness Challenge 2024",
    description: "30-day fitness transformation challenge with our premium workout gear.",
    type: "challenge",
    contentType: "UGC",
    category: "Fitness",
    platforms: ["Instagram Reels", "TikTok"],
    totalBudget: 50000,
    currency: "USD",
    endDate: new Date("2024-10-15"),
    visibility: "applicationOnly",
    countryAvailability: "usa",
    brandName: "FitGear Pro",
    brandId: "brand-3",
    bannerImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    prizePool: {
      first: 10000,
      second: 5000,
      third: 2500,
      participants: 500
    },
    guidelines: {
      dos: ["Document real progress", "Use our equipment", "Tag fitness goals"],
      donts: ["No unsafe exercises", "Don't promote other brands", "No body shaming"]
    },
    requirements: ["Fitness enthusiasts", "30-day commitment", "Progress documentation"]
  },
  {
    id: "camp-4",
    title: "Sustainable Living Tips",
    description: "Share eco-friendly lifestyle tips using our sustainable products.",
    type: "retainer",
    contentType: "UGC",
    category: "Lifestyle",
    platforms: ["TikTok", "Instagram Reels"],
    totalBudget: 12000,
    currency: "USD",
    endDate: new Date("2024-11-30"),
    visibility: "public",
    countryAvailability: "worldwide",
    brandName: "EcoLife",
    brandId: "brand-4",
    bannerImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    creatorTiers: [
      { name: "Eco Starter", minFollowers: 5000, maxFollowers: 25000, price: 800 },
      { name: "Green Influencer", minFollowers: 25000, maxFollowers: 100000, price: 2000 }
    ]
  },
  {
    id: "camp-5",
    title: "Gaming Setup Showcase",
    description: "Feature our gaming peripherals in epic gaming setups and gameplay.",
    type: "payPerView",
    contentType: "UGC",
    category: "Gaming",
    platforms: ["YouTube Shorts", "TikTok"],
    totalBudget: 18000,
    currency: "USD",
    endDate: new Date("2024-12-20"),
    visibility: "public",
    countryAvailability: "worldwide",
    brandName: "GameTech",
    brandId: "brand-5",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    ratePerThousand: 4.0,
    maxPayoutPerSubmission: 1500
  }
];

// Mock Submissions Data
export const mockSubmissions: Submission[] = [
  {
    id: "sub-1",
    creator_id: "creator-1",
    creator_name: "Emma Rodriguez",
    creator_avatar: "https://i.pravatar.cc/150?u=emma",
    campaign_id: "camp-1",
    campaign_title: "Summer Fashion Collection 2024",
    campaign_type: "retainer",
    submitted_date: new Date("2024-06-15"),
    payment_amount: 1500,
    views: 45000,
    status: "approved",
    platform: "TikTok",
    platformUsername: "@emmastyle",
    content: "https://tiktok.com/@emmastyle/video1"
  },
  {
    id: "sub-2",
    creator_id: "creator-2",
    creator_name: "Jake Thompson",
    creator_avatar: "https://i.pravatar.cc/150?u=jake",
    campaign_id: "camp-2",
    campaign_title: "Tech Innovation Showcase",
    campaign_type: "payPerView",
    submitted_date: new Date("2024-06-18"),
    payment_amount: 800,
    views: 32000,
    status: "approved",
    platform: "YouTube Shorts",
    platformUsername: "@jaketech",
    content: "https://youtube.com/shorts/abc123"
  },
  {
    id: "sub-3",
    creator_id: "creator-3",
    creator_name: "Sofia Chen",
    creator_avatar: "https://i.pravatar.cc/150?u=sofia",
    campaign_id: "camp-1",
    campaign_title: "Summer Fashion Collection 2024",
    campaign_type: "retainer",
    submitted_date: new Date("2024-06-20"),
    payment_amount: 2000,
    views: 68000,
    status: "approved",
    platform: "Instagram Reels",
    platformUsername: "@sofiastyle",
    content: "https://instagram.com/reel/xyz789"
  },
  {
    id: "sub-4",
    creator_id: "creator-4",
    creator_name: "Marcus Johnson",
    creator_avatar: "https://i.pravatar.cc/150?u=marcus",
    campaign_id: "camp-3",
    campaign_title: "Fitness Challenge 2024",
    campaign_type: "challenge",
    submitted_date: new Date("2024-06-22"),
    payment_amount: 500,
    views: 28000,
    status: "pending",
    platform: "TikTok",
    platformUsername: "@marcusfit",
    content: "https://tiktok.com/@marcusfit/video2"
  },
  {
    id: "sub-5",
    creator_id: "creator-5",
    creator_name: "Lily Park",
    creator_avatar: "https://i.pravatar.cc/150?u=lily",
    campaign_id: "camp-4",
    campaign_title: "Sustainable Living Tips",
    campaign_type: "retainer",
    submitted_date: new Date("2024-06-25"),
    payment_amount: 1200,
    views: 39000,
    status: "approved",
    platform: "Instagram Reels",
    platformUsername: "@lilyeco",
    content: "https://instagram.com/reel/eco123"
  },
  {
    id: "sub-6",
    creator_id: "creator-6",
    creator_name: "Alex Rivera",
    creator_avatar: "https://i.pravatar.cc/150?u=alex",
    campaign_id: "camp-5",
    campaign_title: "Gaming Setup Showcase",
    campaign_type: "payPerView",
    submitted_date: new Date("2024-06-28"),
    payment_amount: 600,
    views: 25000,
    status: "approved",
    platform: "YouTube Shorts",
    platformUsername: "@alexgaming",
    content: "https://youtube.com/shorts/gaming456"
  }
];

// Mock Creators Data for Explore Page
export const mockCreators = [
  {
    id: "creator-1",
    name: "Emma Rodriguez",
    username: "@emmastyle",
    avatar: "https://i.pravatar.cc/150?u=emma",
    category: "Fashion",
    followers: "125K",
    engagement: "8.5%",
    campaigns: 12,
    earned: "$15.2K",
    viewsGenerated: "2.1M",
    platforms: ["TikTok", "Instagram"],
    isTop: true,
    itemType: "creator"
  },
  {
    id: "creator-2",
    name: "Jake Thompson", 
    username: "@jaketech",
    avatar: "https://i.pravatar.cc/150?u=jake",
    category: "Technology",
    followers: "89K",
    engagement: "7.2%",
    campaigns: 8,
    earned: "$12.8K",
    viewsGenerated: "1.5M",
    platforms: ["YouTube", "TikTok"],
    isTop: true,
    itemType: "creator"
  },
  {
    id: "creator-3",
    name: "Sofia Chen",
    username: "@sofiastyle", 
    avatar: "https://i.pravatar.cc/150?u=sofia",
    category: "Lifestyle",
    followers: "156K",
    engagement: "9.1%",
    campaigns: 15,
    earned: "$18.5K",
    viewsGenerated: "2.8M",
    platforms: ["Instagram", "TikTok"],
    isTop: true,
    itemType: "creator"
  },
  {
    id: "creator-4",
    name: "Marcus Johnson",
    username: "@marcusfit",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    category: "Fitness",
    followers: "78K",
    engagement: "6.8%",
    campaigns: 10,
    earned: "$9.2K",
    viewsGenerated: "1.2M",
    platforms: ["TikTok", "Instagram"],
    itemType: "creator"
  },
  {
    id: "creator-5",
    name: "Lily Park",
    username: "@lilyeco",
    avatar: "https://i.pravatar.cc/150?u=lily",
    category: "Lifestyle",
    followers: "92K",
    engagement: "7.9%",
    campaigns: 11,
    earned: "$11.7K",
    viewsGenerated: "1.8M",
    platforms: ["Instagram", "YouTube"],
    itemType: "creator"
  },
  {
    id: "creator-6",
    name: "Alex Rivera",
    username: "@alexgaming",
    avatar: "https://i.pravatar.cc/150?u=alex",
    category: "Gaming",
    followers: "134K",
    engagement: "8.3%",
    campaigns: 9,
    earned: "$13.9K",
    viewsGenerated: "2.3M",
    platforms: ["YouTube", "TikTok"],
    itemType: "creator"
  }
];

// Add progress to campaigns for explore page
export const mockCampaignsWithProgress = mockCampaigns.map(campaign => ({
  ...campaign,
  progress: Math.floor(Math.random() * 100),
  featured: Math.random() > 0.7,
  itemType: "campaign"
}));

// Mock Communities Data
export const mockCommunities = [
  {
    id: "comm-1",
    name: "Fashion Creators Hub",
    description: "Connect with fashion enthusiasts and discover trending style collaborations",
    memberCount: 1247,
    type: "free",
    category: "Fashion",
    isPrivate: false,
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    owner: "StyleCo",
    tags: ["Fashion", "Style", "Trends"]
  },
  {
    id: "comm-2", 
    name: "Tech Innovators Network",
    description: "Premium community for tech reviewers and early adopters",
    memberCount: 892,
    type: "paid",
    price: 29.99,
    category: "Technology",
    isPrivate: true,
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
    owner: "TechFlow",
    tags: ["Tech", "Innovation", "Reviews"]
  },
  {
    id: "comm-3",
    name: "Fitness Warriors",
    description: "Join the ultimate fitness community and transform your content",
    memberCount: 2156,
    type: "free",
    category: "Fitness",
    isPrivate: false,
    bannerImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    owner: "FitGear Pro",
    tags: ["Fitness", "Health", "Motivation"]
  }
];

// Mock Financial Data
export const mockFinancialData = {
  totalEarnings: 47650,
  pendingPayments: 8420,
  thisMonthEarnings: 12350,
  avgPaymentTime: "7 days",
  transactions: [
    {
      id: "tx-1",
      date: "2024-06-28",
      description: "Summer Fashion Collection - Video #1",
      amount: 1500,
      status: "completed",
      campaign: "Summer Fashion Collection 2024",
      platform: "TikTok"
    },
    {
      id: "tx-2", 
      date: "2024-06-25",
      description: "Tech Innovation Showcase - Review Video",
      amount: 800,
      status: "completed",
      campaign: "Tech Innovation Showcase",
      platform: "YouTube Shorts"
    },
    {
      id: "tx-3",
      date: "2024-06-22",
      description: "Sustainable Living Tips - Tutorial",
      amount: 1200,
      status: "pending",
      campaign: "Sustainable Living Tips",
      platform: "Instagram Reels"
    },
    {
      id: "tx-4",
      date: "2024-06-20",
      description: "Gaming Setup Showcase - Unboxing",
      amount: 600,
      status: "completed",
      campaign: "Gaming Setup Showcase", 
      platform: "YouTube Shorts"
    }
  ]
};

// Mock Messages Data
export const mockMessages = [
  {
    id: "msg-1",
    campaignId: "camp-1",
    campaignTitle: "Summer Fashion Collection 2024",
    brandName: "StyleCo",
    lastMessage: "Thanks for the amazing content! The engagement has been fantastic.",
    timestamp: new Date("2024-06-28T14:30:00"),
    unread: true,
    messages: [
      {
        id: "m1",
        sender: "brand",
        senderName: "Sarah from StyleCo",
        content: "Hi Emma! We love your submission for the summer collection campaign.",
        timestamp: new Date("2024-06-28T10:00:00")
      },
      {
        id: "m2", 
        sender: "creator",
        senderName: "Emma Rodriguez",
        content: "Thank you! I had so much fun creating this content. The pieces are gorgeous!",
        timestamp: new Date("2024-06-28T10:15:00")
      },
      {
        id: "m3",
        sender: "brand",
        senderName: "Sarah from StyleCo", 
        content: "Thanks for the amazing content! The engagement has been fantastic.",
        timestamp: new Date("2024-06-28T14:30:00")
      }
    ]
  },
  {
    id: "msg-2",
    campaignId: "camp-2",
    campaignTitle: "Tech Innovation Showcase",
    brandName: "TechFlow",
    lastMessage: "Could you share the analytics for your latest video?",
    timestamp: new Date("2024-06-27T16:45:00"),
    unread: false,
    messages: [
      {
        id: "m4",
        sender: "brand",
        senderName: "Mike from TechFlow",
        content: "Great tech review! Our audience loved the detailed breakdown.",
        timestamp: new Date("2024-06-27T09:30:00")
      },
      {
        id: "m5",
        sender: "creator", 
        senderName: "Jake Thompson",
        content: "I'm glad the technical details resonated well with viewers!",
        timestamp: new Date("2024-06-27T11:20:00")
      },
      {
        id: "m6",
        sender: "brand",
        senderName: "Mike from TechFlow",
        content: "Could you share the analytics for your latest video?",
        timestamp: new Date("2024-06-27T16:45:00")
      }
    ]
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: "notif-1",
    type: "payment",
    title: "Payment Received",
    message: "You received $1,500 for Summer Fashion Collection campaign",
    timestamp: new Date("2024-06-28T15:00:00"),
    read: false,
    action: "View Payment"
  },
  {
    id: "notif-2",
    type: "campaign",
    title: "New Campaign Match",
    message: "Tech Innovation Showcase campaign matches your profile",
    timestamp: new Date("2024-06-27T12:30:00"),
    read: false,
    action: "View Campaign"
  },
  {
    id: "notif-3",
    type: "submission",
    title: "Submission Approved",
    message: "Your sustainable living video has been approved!",
    timestamp: new Date("2024-06-26T09:15:00"),
    read: true,
    action: "View Submission"
  },
  {
    id: "notif-4",
    type: "message",
    title: "New Message",
    message: "StyleCo sent you a message about your latest submission",
    timestamp: new Date("2024-06-25T14:45:00"),
    read: true,
    action: "View Message"
  }
];

// Initialize all mock data
export const initAllMockData = () => {
  console.log("Initializing comprehensive mock data...");
  
  // Store campaigns
  localStorage.setItem("campaigns", JSON.stringify(mockCampaigns));
  
  // Store submissions  
  localStorage.setItem("submissions", JSON.stringify(mockSubmissions));
  
  // Store creators for explore
  localStorage.setItem("explore-creators", JSON.stringify(mockCreators));
  
  // Store campaigns with progress for explore
  localStorage.setItem("explore-campaigns", JSON.stringify(mockCampaignsWithProgress));
  
  // Store communities
  localStorage.setItem("communities", JSON.stringify(mockCommunities));
  
  // Store financial data
  localStorage.setItem("financial-data", JSON.stringify(mockFinancialData));
  
  // Store messages
  localStorage.setItem("messages", JSON.stringify(mockMessages));
  
  // Store notifications
  localStorage.setItem("notifications", JSON.stringify(mockNotifications));
  
  console.log("All mock data initialized successfully!");
};
