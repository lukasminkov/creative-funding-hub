
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock data for brands
const mockBrands = [
  { id: 1, name: "Nike", type: "Brand", joinedDate: "2023-05-15" },
  { id: 2, name: "Adidas", type: "Brand", joinedDate: "2023-06-22" },
  { id: 3, name: "Apple", type: "Brand", joinedDate: "2023-04-10" },
  { id: 4, name: "Samsung", type: "Brand", joinedDate: "2023-07-05" },
  { id: 5, name: "Coca-Cola", type: "Brand", joinedDate: "2023-03-18" },
  { id: 6, name: "John Smith", type: "Creator", joinedDate: "2023-08-12" },
  { id: 7, name: "Emma Watson", type: "Creator", joinedDate: "2023-09-03" },
  { id: 8, name: "David Miller", type: "Creator", joinedDate: "2023-10-25" }
];

export function ViewAsButton() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountType, setAccountType] = useState<string>("all");

  // Filter the brands based on search term and account type
  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = accountType === "all" || brand.type.toLowerCase() === accountType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleViewAs = (brand: typeof mockBrands[0]) => {
    toast.success(`Now viewing as: ${brand.name}`);
    setOpen(false);
    
    // In a real app, this would redirect to the dashboard with the impersonated user's session
    // For demo purposes, we'll just show a toast
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="gap-2 bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200 hover:text-amber-950"
      >
        <Eye className="h-4 w-4" />
        View As
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>View As User/Brand</DialogTitle>
            <DialogDescription>
              Impersonate a user or brand to view the application from their perspective.
              This is an admin-only feature for troubleshooting purposes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="brand">Brands</SelectItem>
                  <SelectItem value="creator">Creators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell>{brand.type}</TableCell>
                        <TableCell>{brand.joinedDate}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAs(brand)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View As
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No accounts found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
