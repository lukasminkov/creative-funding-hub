
import { PlusCircle, X, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
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
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    if (activeTab === "dos" && dos.length < maxItems) {
      const updatedDos = [...dos, newItem.trim()];
      onChange({ dos: updatedDos, donts });
    } else if (activeTab === "donts" && donts.length < maxItems) {
      const updatedDonts = [...donts, newItem.trim()];
      onChange({ dos, donts: updatedDonts });
    }
    
    setNewItem("");
  };

  const handleRemoveItem = (index: number) => {
    if (activeTab === "dos") {
      const updatedDos = dos.filter((_, i) => i !== index);
      onChange({ dos: updatedDos, donts });
    } else {
      const updatedDonts = donts.filter((_, i) => i !== index);
      onChange({ dos, donts: updatedDonts });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Guidelines</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Add dos and don'ts for creators to follow
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as "dos" | "donts")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="dos" className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Do's
          </TabsTrigger>
          <TabsTrigger value="donts" className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-500" />
            Don'ts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dos" className="mt-0 space-y-3">
          <div className="space-y-2">
            {dos.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-green-500/10 p-2.5 rounded-md"
              >
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <p className="flex-grow text-sm">{item}</p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                  onClick={() => handleRemoveItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {dos.length < maxItems && (
              <div className="flex items-center gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a do..."
                  className="flex-grow"
                  maxLength={100}
                />
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItem.trim()}
                  className="shrink-0"
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="donts" className="mt-0 space-y-3">
          <div className="space-y-2">
            {donts.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-red-500/10 p-2.5 rounded-md"
              >
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="flex-grow text-sm">{item}</p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-60 hover:opacity-100"
                  onClick={() => handleRemoveItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {donts.length < maxItems && (
              <div className="flex items-center gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a don't..."
                  className="flex-grow"
                  maxLength={100}
                />
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItem.trim()}
                  className="shrink-0"
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
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
