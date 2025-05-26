
import { Link } from "react-router-dom";
import { BarChart3, CreditCard, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "TikTok Shop Analytics Tool",
    description: "Analyze TikTok Shop performance and metrics to optimize your campaigns",
    icon: BarChart3,
    path: "/dashboard/tools/tiktok-analytics",
    status: "Coming Soon",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Increased Commission Links",
    description: "Generate enhanced commission links for TikTok Shop products",
    icon: CreditCard,
    path: "/dashboard/tools/commission-links",
    status: "Coming Soon",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "AI Video Transcription Tool",
    description: "Automatically transcribe and analyze video content with AI",
    icon: MessageSquare,
    path: "/dashboard/tools/video-transcription",
    status: "Coming Soon",
    gradient: "from-purple-500 to-indigo-500"
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
            Creator Tools
          </h1>
          <p className="text-lg text-muted-foreground">
            Powerful tools to enhance your content creation and campaign management
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.title} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-semibold">{tool.title}</CardTitle>
                  {tool.status && (
                    <span className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                      {tool.status}
                    </span>
                  )}
                </div>
                
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <Button 
                  asChild
                  variant="ghost" 
                  className="w-full justify-between hover:bg-accent/50 group-hover:bg-accent/70 transition-colors"
                  disabled={tool.status === "Coming Soon"}
                >
                  <Link to={tool.path}>
                    <span>Access Tool</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              More tools coming soon! Stay tuned for updates.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
