
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CampaignCreator from "@/components/CampaignCreator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign, convertCampaignToDatabase } from "@/lib/campaign-utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/campaign-types";

export default function CampaignEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [additionalBudget, setAdditionalBudget] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "savedCard" | "bank">("card");
  const [savedCards, setSavedCards] = useState<Array<{id: string, last4: string, brand: string}>>([
    {id: "card_1", last4: "4242", brand: "Visa"},
    {id: "card_2", last4: "5555", brand: "Mastercard"}
  ]);
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0]?.id || "");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-edit', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching campaign:", error);
        throw new Error("Campaign not found");
      }
      
      if (!data) {
        throw new Error("Campaign not found");
      }
      
      return convertDatabaseCampaign(data);
    }
  });

  const handleSubmitCampaign = async (updatedCampaign: Campaign) => {
    try {
      if (!id || !campaign) return;
      
      // Ensure the budget stays the same as the original campaign
      const finalCampaign = {
        ...updatedCampaign,
        totalBudget: campaign.totalBudget
      };
      
      // Format for database using the utility
      const formattedCampaign = convertCampaignToDatabase(finalCampaign);
      
      // Update in Supabase
      const { error } = await supabase
        .from('campaigns')
        .update(formattedCampaign)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign: " + error.message);
        return;
      }
      
      toast.success("Campaign updated successfully!");
      navigate(`/dashboard/campaigns/${id}`);
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleCancelEdit = () => {
    navigate(`/dashboard/campaigns/${id}`);
  };

  const handleAddBudget = () => {
    setShowAddBudgetModal(true);
  };

  const handleProcessBudgetAddition = async () => {
    if (!campaign || additionalBudget <= 0) return;
    
    setIsProcessing(true);
    
    try {
      // Calculate fees
      const marketplaceFee = additionalBudget * 0.02; // 2% marketplace fee
      const cardFee = paymentMethod === "card" || paymentMethod === "savedCard" ? additionalBudget * 0.029 + 0.30 : 0; // 2.9% + $0.30 for card payments
      const totalAmount = additionalBudget + marketplaceFee + cardFee;
      
      // Process payment (simulate for now)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update campaign budget in database
      const newTotalBudget = campaign.totalBudget + additionalBudget;
      
      const { error } = await supabase
        .from('campaigns')
        .update({ total_budget: newTotalBudget })
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success(`Added ${formatCurrency(additionalBudget, campaign.currency)} to campaign budget`);
      setShowAddBudgetModal(false);
      // Refresh the campaign data
      window.location.reload();
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("Failed to add budget: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePaymentMethod = (save: boolean) => {
    if (save) {
      toast.success("Payment method saved for future use");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        </div>
        <div className="h-[500px] w-full bg-muted rounded"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're trying to edit doesn't exist or was deleted.</p>
        <Button onClick={() => navigate("/dashboard/campaigns")}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(`/dashboard/campaigns/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/dashboard/campaigns/${id}`} className="hover:underline">{campaign.title}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Edit</span>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Campaign</h1>
          <p className="text-muted-foreground">Update your campaign details and settings</p>
        </div>
        <Button onClick={handleAddBudget}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <CampaignCreator 
        onSubmit={handleSubmitCampaign}
        onCancel={handleCancelEdit}
        campaign={campaign}
        isEditing={true}
        disableBudgetEdit={true}
      />
      
      {/* Add Budget Modal */}
      <Dialog open={showAddBudgetModal} onOpenChange={setShowAddBudgetModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Budget to Campaign</DialogTitle>
            <DialogDescription>
              Increase your campaign budget to reach more creators
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="additionalBudget">Additional Budget</Label>
              <Input 
                id="additionalBudget" 
                type="number" 
                min="1"
                value={additionalBudget || ""}
                onChange={(e) => setAdditionalBudget(Number(e.target.value))}
                placeholder="Enter amount to add" 
              />
              <p className="text-sm text-muted-foreground">
                Current budget: {formatCurrency(campaign.totalBudget, campaign.currency)}
              </p>
            </div>
            
            {additionalBudget > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                  {savedCards.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setPaymentMethod("savedCard")}>
                        <RadioGroupItem value="savedCard" id="savedCard" />
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label htmlFor="savedCard" className="cursor-pointer flex-grow">Saved Cards</Label>
                      </div>
                      
                      {paymentMethod === "savedCard" && (
                        <div className="mt-2 pl-7">
                          <RadioGroup value={selectedCard} onValueChange={setSelectedCard} className="space-y-2">
                            {savedCards.map(card => (
                              <div key={card.id} className="flex items-center space-x-2 border border-border/60 rounded-lg p-2 cursor-pointer hover:bg-accent/30 transition-colors">
                                <RadioGroupItem value={card.id} id={card.id} />
                                <Label htmlFor={card.id} className="cursor-pointer flex-grow">
                                  {card.brand} •••• {card.last4}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setPaymentMethod("card")}>
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="card" className="cursor-pointer flex-grow">New Credit/Debit Card</Label>
                  </div>
                  
                  {paymentMethod === "card" && (
                    <div className="pl-7 pt-2 flex items-center">
                      <input 
                        type="checkbox" 
                        id="saveCard" 
                        className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-primary"
                        onChange={(e) => handleSavePaymentMethod(e.target.checked)}
                      />
                      <Label htmlFor="saveCard" className="text-sm">Save this card for future payments</Label>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setPaymentMethod("bank")}>
                    <RadioGroupItem value="bank" id="bank" />
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="bank" className="cursor-pointer flex-grow">Bank Transfer</Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === "bank" && (
                  <p className="text-sm text-muted-foreground">
                    Bank transfers have no processing fee but may take 2-3 business days to process.
                  </p>
                )}
                
                <div className="mt-4 space-y-3 bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Additional Budget</span>
                      <span>{formatCurrency(additionalBudget, campaign.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee (2%)</span>
                      <span>{formatCurrency(additionalBudget * 0.02, campaign.currency)}</span>
                    </div>
                    {(paymentMethod === "card" || paymentMethod === "savedCard") && (
                      <div className="flex justify-between">
                        <span>Payment Processing Fee</span>
                        <span>{formatCurrency(additionalBudget * 0.029 + 0.30, campaign.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t border-border/60">
                      <span>Total</span>
                      <span>
                        {formatCurrency(
                          additionalBudget + 
                          (additionalBudget * 0.02) + 
                          ((paymentMethod === "card" || paymentMethod === "savedCard") ? (additionalBudget * 0.029 + 0.30) : 0), 
                          campaign.currency
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBudgetModal(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleProcessBudgetAddition} disabled={isProcessing || additionalBudget <= 0}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Add Budget`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
