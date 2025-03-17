
import { useState } from "react";
import { PlusCircle, X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GuidelinesListProps {
  dos: string[];
  donts: string[];
  onChange: (guidelines: { dos: string[]; donts: string[] }) => void;
  maxItems?: number;
}

const GuidelinesList = ({ 
  dos, 
  donts, 
  onChange, 
  maxItems = 5 
}: GuidelinesListProps) => {
  const [activeTab, setActiveTab] = useState<"dos" | "donts">("dos");
  const [newDo, setNewDo] = useState("");
  const [newDont, setNewDont] = useState("");

  const handleAddDo = () => {
    if (newDo.trim() && dos.length < maxItems) {
      onChange({ dos: [...dos, newDo.trim()], donts });
      setNewDo("");
    }
  };

  const handleAddDont = () => {
    if (newDont.trim() && donts.length < maxItems) {
      onChange({ dos, donts: [...donts, newDont.trim()] });
      setNewDont("");
    }
  };

  const handleRemoveDo = (index: number) => {
    const updatedDos = dos.filter((_, i) => i !== index);
    onChange({ dos: updatedDos, donts });
  };

  const handleRemoveDont = (index: number) => {
    const updatedDonts = donts.filter((_, i) => i !== index);
    onChange({ dos, donts: updatedDonts });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: "dos" | "donts") => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === "dos") {
        handleAddDo();
      } else {
        handleAddDont();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Guidelines</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Add Do's and Don'ts for creators (up to {maxItems} each)
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "dos" | "donts")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dos" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Do's ({dos.length}/{maxItems})
          </TabsTrigger>
          <TabsTrigger value="donts" className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            Don'ts ({donts.length}/{maxItems})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dos" className="mt-4">
          <div className="space-y-2">
            {dos.map((doItem, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-green-500/10 border border-green-200 p-2.5 rounded-md group"
              >
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <p className="flex-grow text-sm">{doItem}</p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                  onClick={() => handleRemoveDo(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {dos.length < maxItems && (
              <div className="flex items-center gap-2">
                <Input
                  value={newDo}
                  onChange={(e) => setNewDo(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "dos")}
                  placeholder="Add a do..."
                  className="flex-grow"
                  maxLength={100}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDo}
                  disabled={!newDo.trim()}
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2 text-green-500" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="donts" className="mt-4">
          <div className="space-y-2">
            {donts.map((dontItem, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-red-500/10 border border-red-200 p-2.5 rounded-md group"
              >
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="flex-grow text-sm">{dontItem}</p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                  onClick={() => handleRemoveDont(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {donts.length < maxItems && (
              <div className="flex items-center gap-2">
                <Input
                  value={newDont}
                  onChange={(e) => setNewDont(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "donts")}
                  placeholder="Add a don't..."
                  className="flex-grow"
                  maxLength={100}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDont}
                  disabled={!newDont.trim()}
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2 text-red-500" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuidelinesList;
