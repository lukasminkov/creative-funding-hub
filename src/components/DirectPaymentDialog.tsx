
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DirectPaymentFormData } from "@/lib/campaign-types";

interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

interface Campaign {
  id: string;
  title: string;
}

// Form validation schema
const formSchema = z.object({
  campaign_id: z.string().min(1, { message: "Please select a campaign" }),
  creator_id: z.string().min(1, { message: "Please select a creator" }),
  payment_amount: z.number().min(1, { message: "Amount must be at least 1" }),
  note: z.string().min(5, { message: "Note must be at least 5 characters" }),
});

interface DirectPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DirectPaymentFormData) => Promise<void>;
}

export default function DirectPaymentDialog({ 
  open, 
  onOpenChange,
  onSubmit 
}: DirectPaymentDialogProps) {
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaign_id: "",
      creator_id: "",
      payment_amount: 0,
      note: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Fetch campaigns for dropdown
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title');
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Error fetching campaigns",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Campaign[];
    }
  });

  // Fetch creators for dropdown (in a real app, this would be a more sophisticated query)
  const { data: creators = [] } = useQuery<Creator[]>({
    queryKey: ['creators-list'],
    queryFn: async () => {
      // Fetch unique creators from submissions
      const { data, error } = await supabase
        .from('submissions')
        .select('creator_id, creator_name, creator_avatar')
        .order('creator_name')
        
      if (error) {
        console.error('Error fetching creators:', error);
        toast({
          title: "Error fetching creators",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      // Deduplicate creators based on ID
      const uniqueCreators = data.reduce((acc: {[key: string]: Creator}, curr) => {
        if (!acc[curr.creator_id]) {
          acc[curr.creator_id] = {
            id: curr.creator_id,
            name: curr.creator_name,
            avatar: curr.creator_avatar
          };
        }
        return acc;
      }, {});
      
      return Object.values(uniqueCreators);
    }
  });

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing direct payment:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Direct Payment</DialogTitle>
          <DialogDescription>
            Make a direct payment to a creator. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The campaign to associate with this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creator_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a creator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creators.map((creator) => (
                        <SelectItem key={creator.id} value={creator.id}>
                          {creator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The creator who will receive this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        className="pl-8"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The amount to be paid to the creator
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a payment note..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Required - Add a description for this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Process Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
