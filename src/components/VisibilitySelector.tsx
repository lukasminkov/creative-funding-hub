
import { useState } from "react";
import { VisibilityType, VISIBILITY_TYPES, ApplicationQuestion, QuestionType, QUESTION_TYPES, RestrictedAccess } from "@/lib/campaign-types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Lock, Users, Plus, X, Image, Typography, Calculator, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VisibilitySelectorProps {
  visibility: VisibilityType;
  applicationQuestions?: ApplicationQuestion[];
  restrictedAccess?: RestrictedAccess;
  onChange: (
    visibility: VisibilityType, 
    applicationQuestions?: ApplicationQuestion[], 
    restrictedAccess?: RestrictedAccess
  ) => void;
}

const VisibilitySelector = ({ 
  visibility, 
  applicationQuestions = [], 
  restrictedAccess = { type: 'invite', inviteLink: '' },
  onChange 
}: VisibilitySelectorProps) => {
  const [questions, setQuestions] = useState<ApplicationQuestion[]>(applicationQuestions);
  const [accessType, setAccessType] = useState<'offer' | 'invite'>(restrictedAccess.type || 'invite');
  const [inviteLink, setInviteLink] = useState(restrictedAccess.inviteLink || '');

  // Mock data for offers - in a real app this would come from an API
  const availableOffers = [
    { id: "offer1", name: "Premium Creator Network" },
    { id: "offer2", name: "Fashion Influencer Program" },
    { id: "offer3", name: "Beauty Brand Partnership" }
  ];
  const [selectedOffers, setSelectedOffers] = useState<string[]>(restrictedAccess.offerIds || []);

  const handleVisibilityChange = (value: VisibilityType) => {
    if (value === "applicationOnly" && questions.length === 0) {
      // Add a default question when switching to application mode
      addQuestion();
    }

    onChange(
      value, 
      value === "applicationOnly" ? questions : undefined,
      value === "restricted" ? { 
        type: accessType, 
        offerIds: accessType === 'offer' ? selectedOffers : undefined,
        inviteLink: accessType === 'invite' ? inviteLink : undefined
      } : undefined
    );
  };

  const addQuestion = () => {
    const newQuestion: ApplicationQuestion = {
      id: crypto.randomUUID(),
      question: "",
      type: "text",
      required: false
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    if (visibility === "applicationOnly") {
      onChange(visibility, updatedQuestions, undefined);
    }
  };

  const updateQuestion = (id: string, field: keyof ApplicationQuestion, value: any) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    );
    
    setQuestions(updatedQuestions);
    
    if (visibility === "applicationOnly") {
      onChange(visibility, updatedQuestions, undefined);
    }
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    
    if (visibility === "applicationOnly") {
      onChange(visibility, updatedQuestions, undefined);
    }
  };

  const handleOfferToggle = (offerId: string) => {
    let newSelectedOffers;
    
    if (selectedOffers.includes(offerId)) {
      newSelectedOffers = selectedOffers.filter(id => id !== offerId);
    } else {
      newSelectedOffers = [...selectedOffers, offerId];
    }
    
    setSelectedOffers(newSelectedOffers);
    
    if (visibility === "restricted" && accessType === 'offer') {
      onChange(
        visibility, 
        undefined, 
        { 
          type: 'offer', 
          offerIds: newSelectedOffers 
        }
      );
    }
  };

  const handleInviteLinkChange = (link: string) => {
    setInviteLink(link);
    
    if (visibility === "restricted" && accessType === 'invite') {
      onChange(
        visibility, 
        undefined, 
        { 
          type: 'invite', 
          inviteLink: link 
        }
      );
    }
  };

  const handleAccessTypeChange = (type: 'offer' | 'invite') => {
    setAccessType(type);
    
    if (visibility === "restricted") {
      onChange(
        visibility, 
        undefined, 
        { 
          type,
          offerIds: type === 'offer' ? selectedOffers : undefined,
          inviteLink: type === 'invite' ? inviteLink : undefined
        }
      );
    }
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "text":
        return <Typography className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "number":
        return <Calculator className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <Typography className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Campaign Visibility</Label>
        <RadioGroup 
          value={visibility} 
          onValueChange={(value) => handleVisibilityChange(value as VisibilityType)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
        >
          <Label
            htmlFor="visibility-public"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
              visibility === "public" && "border-primary"
            )}
          >
            <RadioGroupItem
              value="public"
              id="visibility-public"
              className="sr-only"
            />
            <Globe className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">Public</p>
              <p className="text-xs text-muted-foreground">
                Visible to everyone
              </p>
            </div>
          </Label>
          
          <Label
            htmlFor="visibility-application"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
              visibility === "applicationOnly" && "border-primary"
            )}
          >
            <RadioGroupItem
              value="applicationOnly"
              id="visibility-application"
              className="sr-only"
            />
            <Users className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">Application Only</p>
              <p className="text-xs text-muted-foreground">
                Creators must apply
              </p>
            </div>
          </Label>
          
          <Label
            htmlFor="visibility-restricted"
            className={cn(
              "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
              visibility === "restricted" && "border-primary"
            )}
          >
            <RadioGroupItem
              value="restricted"
              id="visibility-restricted"
              className="sr-only"
            />
            <Lock className="mb-3 h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium leading-none">Restricted</p>
              <p className="text-xs text-muted-foreground">
                Limited to specific creators
              </p>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {/* Application Only Settings */}
      {visibility === "applicationOnly" && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Application Questions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  className="h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Question
                </Button>
              </div>
              
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No questions added yet. Add questions for creators to answer when applying.
                  </div>
                ) : (
                  questions.map((q) => (
                    <div
                      key={q.id}
                      className="grid grid-cols-[1fr,auto] gap-4 items-start border border-border rounded-md p-3"
                    >
                      <div className="space-y-3 w-full">
                        <div className="space-y-1 w-full">
                          <Input
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                            placeholder="Enter your question"
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                            <span>Answer type:</span>
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={q.required}
                                onChange={(e) => updateQuestion(q.id, "required", e.target.checked)}
                                className="rounded text-primary w-3 h-3"
                              />
                              <span>Required</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {QUESTION_TYPES.map((type) => (
                            <Button
                              key={type}
                              variant={q.type === type ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs px-2 flex items-center gap-1.5"
                              onClick={() => updateQuestion(q.id, "type", type)}
                            >
                              {getQuestionTypeIcon(type)}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mt-1"
                        onClick={() => removeQuestion(q.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restricted Access Settings */}
      {visibility === "restricted" && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <RadioGroup
                value={accessType}
                onValueChange={(value) => handleAccessTypeChange(value as 'offer' | 'invite')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offer" id="offer-access" />
                  <Label htmlFor="offer-access">Available to members of these offers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invite" id="invite-access" />
                  <Label htmlFor="invite-access">Available by invite link</Label>
                </div>
              </RadioGroup>
              
              {accessType === 'offer' && (
                <div className="pt-3 pb-1">
                  <div className="text-sm mb-3">Select offers that can participate:</div>
                  <div className="space-y-2">
                    {availableOffers.map((offer) => (
                      <div key={offer.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`offer-${offer.id}`}
                          checked={selectedOffers.includes(offer.id)}
                          onChange={() => handleOfferToggle(offer.id)}
                          className="mr-2 rounded text-primary"
                        />
                        <Label htmlFor={`offer-${offer.id}`} className="text-sm">
                          {offer.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {selectedOffers.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Select at least one offer to enable this option.
                    </p>
                  )}
                </div>
              )}
              
              {accessType === 'invite' && (
                <div className="pt-3">
                  <Label htmlFor="invite-link" className="text-sm mb-2 block">
                    Invite Link (optional)
                  </Label>
                  <Input
                    id="invite-link"
                    value={inviteLink}
                    onChange={(e) => handleInviteLinkChange(e.target.value)}
                    placeholder="https://example.com/invite/xyz123"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to auto-generate a link when campaign is published.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisibilitySelector;
