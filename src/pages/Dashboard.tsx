
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";

const Dashboard = () => {
  const [isCreating, setIsCreating] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">Campaign Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                Create Campaign
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isCreating ? (
          <CampaignCreator onCancel={() => setIsCreating(false)} onSubmit={() => setIsCreating(false)} />
        ) : (
          <div className="grid gap-8">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-medium mb-4">No campaigns yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first campaign to get started
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Create Campaign
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
