
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
import { DollarSign } from "lucide-react";

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  onConfirm: (submission: Submission) => Promise<void>;
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
}: PaymentConfirmationDialogProps) {
  if (!submission) return null;

  const handleConfirm = async () => {
    await onConfirm(submission);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to process a payment to the following creator:
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
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment amount:</span>
            <span className="text-lg font-bold">${submission.payment_amount}</span>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-primary">
            <DollarSign className="mr-2 h-4 w-4" />
            Confirm Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
