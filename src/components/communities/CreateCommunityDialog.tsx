
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommunityCreated: () => void;
}

export default function CreateCommunityDialog({
  open,
  onOpenChange,
  onCommunityCreated
}: CreateCommunityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    type: "free" as 'free' | 'one_time' | 'subscription',
    price: 0,
    currency: "USD",
    isPrivate: false,
    maxMembers: null as number | null,
    discordServerId: "",
    discordRoleId: ""
  });
  const [loading, setLoading] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create a community');
        return;
      }

      const { error } = await supabase
        .from('communities')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            slug: formData.slug,
            owner_id: user.id,
            type: formData.type,
            price: formData.type === 'free' ? 0 : formData.price,
            currency: formData.currency,
            is_private: formData.isPrivate,
            max_members: formData.maxMembers,
            discord_server_id: formData.discordServerId || null,
            discord_role_id: formData.discordRoleId || null
          }
        ]);

      if (error) throw error;

      toast.success('Community created successfully!');
      onCommunityCreated();
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        slug: "",
        type: "free",
        price: 0,
        currency: "USD",
        isPrivate: false,
        maxMembers: null,
        discordServerId: "",
        discordRoleId: ""
      });
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter community name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="community-url-slug"
              required
            />
            <p className="text-sm text-muted-foreground">
              This will be your community's URL: /communities/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your community..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Community Type</Label>
            <Select value={formData.type} onValueChange={(value: 'free' | 'one_time' | 'subscription') => 
              setFormData(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="one_time">One-time Payment</SelectItem>
                <SelectItem value="subscription">Monthly Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type !== 'free' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, currency: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
            />
            <Label htmlFor="private">Private Community</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Max Members (optional)</Label>
            <Input
              id="maxMembers"
              type="number"
              min="1"
              value={formData.maxMembers || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                maxMembers: e.target.value ? parseInt(e.target.value) : null 
              }))}
              placeholder="Unlimited"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discord Integration (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="discordServerId">Discord Server ID</Label>
              <Input
                id="discordServerId"
                value={formData.discordServerId}
                onChange={(e) => setFormData(prev => ({ ...prev, discordServerId: e.target.value }))}
                placeholder="123456789012345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discordRoleId">Discord Role ID</Label>
              <Input
                id="discordRoleId"
                value={formData.discordRoleId}
                onChange={(e) => setFormData(prev => ({ ...prev, discordRoleId: e.target.value }))}
                placeholder="123456789012345678"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
