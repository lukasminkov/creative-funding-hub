
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Submission } from "@/lib/campaign-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  onConfirm: (submission: Submission) => Promise<void>;
  isDenial?: boolean;
  onDeny?: (submission: Submission, reason: string) => Promise<void>;
}

// Generate initials from name
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function PaymentConfirmationDialog({
  open,
  onOpenChange,
  submission,
  onConfirm,
  isDenial = false,
  onDeny,
}: PaymentConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [denialReasonError, setDenialReasonError] = useState(false);

  if (!submission) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(submission);
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  const handleDeny = async () => {
    if (isDenial && (!denialReason || denialReason.trim() === "")) {
      setDenialReasonError(true);
      return;
    }
    
    setIsProcessing(true);
    try {
      if (onDeny) {
        await onDeny(submission, denialReason);
      }
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDenial ? "Deny Submission" : "Confirm Payment"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDenial ? 
              "You are about to deny this submission. Please provide a reason:" : 
              "You are about to process a payment to the following creator:"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 p-4 border rounded-md">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              {submission.creator_avatar ? (
                <AvatarImage src={submission.creator_avatar} alt={submission.creator_name} />
              ) : (
                <AvatarFallback>{getInitials(submission.creator_name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h4 className="font-medium">{submission.creator_name}</h4>
              <p className="text-sm text-muted-foreground">{submission.campaign_title}</p>
            </div>
          </div>
          
          {!isDenial && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment amount:</span>
              <span className="text-lg font-bold">${submission.payment_amount}</span>
            </div>
          )}
        </div>
        
        {isDenial && (
          <div className="space-y-2">
            <Label htmlFor="denial-reason">Reason for denial <span className="text-red-500">*</span></Label>
            <Textarea 
              id="denial-reason" 
              placeholder="Please explain why this submission is being denied..." 
              value={denialReason} 
              onChange={(e) => {
                setDenialReason(e.target.value);
                if (e.target.value.trim() !== "") {
                  setDenialReasonError(false);
                }
              }}
              className={denialReasonError ? "border-red-500" : ""}
            />
            {denialReasonError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                A reason is required for denying a submission
              </p>
            )}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          {isDenial ? (
            <AlertDialogAction 
              onClick={handleDeny} 
              className="bg-destructive hover:bg-destructive/90" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Deny Submission"}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction 
              onClick={handleConfirm} 
              className="bg-primary" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
