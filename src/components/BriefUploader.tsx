
import { useState } from "react";
import { Upload, Link2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BriefUploaderProps {
  briefType?: 'link' | 'file';
  briefValue?: string;
  onBriefChange: (type: 'link' | 'file', value: string) => void;
}

const BriefUploader = ({ briefType = 'link', briefValue = '', onBriefChange }: BriefUploaderProps) => {
  const [activeTab, setActiveTab] = useState<'link' | 'file'>(briefType);
  const [linkValue, setLinkValue] = useState(briefType === 'link' ? briefValue : '');
  const [fileName, setFileName] = useState(briefType === 'file' ? briefValue : '');

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'link' | 'file');
    // Clear values when switching tabs
    if (value === 'link' && briefType === 'file') {
      onBriefChange('link', linkValue || '');
    } else if (value === 'file' && briefType === 'link') {
      onBriefChange('file', fileName || '');
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkValue(e.target.value);
    onBriefChange('link', e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to storage and get a URL
      // For demo purposes, we'll just store the file name
      setFileName(file.name);
      onBriefChange('file', file.name);
      toast.success("Brief file uploaded successfully");
    }
  };

  const clearFile = () => {
    setFileName('');
    onBriefChange('file', '');
  };

  return (
    <div className="space-y-4">
      <Label>Campaign Brief</Label>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="link" className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="brief-link">Brief URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="brief-link"
                type="url"
                placeholder="https://example.com/brief.pdf"
                value={linkValue}
                onChange={handleLinkChange}
                className="flex-grow"
              />
              {linkValue && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(linkValue, '_blank')}
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="file" className="pt-4">
          <div className="space-y-4">
            {fileName ? (
              <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/20">
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-grow text-sm truncate">{fileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-sm font-medium mb-1">
                  Upload campaign brief
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  PDF, DOCX, or other document formats
                </p>
                <Button type="button" variant="secondary" size="sm" asChild>
                  <label>
                    Browse Files
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BriefUploader;
