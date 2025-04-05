
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Campaign, formatCurrency } from "@/lib/campaign-types";
import { CreditCard, Building2, Loader2 } from "lucide-react";

interface CampaignPaymentModalProps {
  campaign: Campaign;
  open: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const CampaignPaymentModal = ({ campaign, open, onClose, onPaymentComplete }: CampaignPaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "savedCard" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [savedCards, setSavedCards] = useState<Array<{id: string, last4: string, brand: string}>>([
    {id: "card_1", last4: "4242", brand: "Visa"},
    {id: "card_2", last4: "5555", brand: "Mastercard"}
  ]);
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0]?.id || "");
  
  // Calculate fees
  const campaignBudget = campaign.totalBudget;
  const marketplaceFee = campaignBudget * 0.02; // 2% marketplace fee
  const cardFee = (paymentMethod === "card" || paymentMethod === "savedCard") ? campaignBudget * 0.029 + 0.30 : 0; // 2.9% + $0.30 for card payments
  const totalAmount = campaignBudget + marketplaceFee + cardFee;
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // If saveCard is true, we would add the card to the user's saved cards
      onPaymentComplete();
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Launch Campaign</DialogTitle>
          <DialogDescription>
            Complete payment to launch your campaign
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Campaign Budget</span>
                  <span className="font-medium">{formatCurrency(campaignBudget, campaign.currency)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Marketplace Fee (2%)</span>
                  <span>{formatCurrency(marketplaceFee, campaign.currency)}</span>
                </li>
                {(paymentMethod === "card" || paymentMethod === "savedCard") && (
                  <li className="flex justify-between">
                    <span>Card Processing Fee</span>
                    <span>{formatCurrency(cardFee, campaign.currency)}</span>
                  </li>
                )}
                <li className="flex justify-between border-t border-border/60 mt-3 pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatCurrency(totalAmount, campaign.currency)}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
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
                <Label htmlFor="card" className="cursor-pointer flex-grow">Credit/Debit Card</Label>
              </div>
              
              {paymentMethod === "card" && (
                <div className="pl-7 pt-2 flex items-center">
                  <input 
                    type="checkbox" 
                    id="saveCard" 
                    className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-primary"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
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
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(totalAmount, campaign.currency)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPaymentModal;
