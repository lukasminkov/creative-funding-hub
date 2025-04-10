
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, ChevronDown, Filter, Building2, Plus } from "lucide-react";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock brands data
  const brands = [
    { 
      id: 1, 
      name: "Nike", 
      industry: "Fashion & Apparel", 
      campaigns: 12, 
      status: "Active",
      createdAt: "2023-01-15",
      logo: "https://github.com/shadcn.png"
    },
    { 
      id: 2, 
      name: "Apple", 
      industry: "Technology", 
      campaigns: 8, 
      status: "Active",
      createdAt: "2023-02-20",
      logo: ""
    },
    { 
      id: 3, 
      name: "Coca-Cola", 
      industry: "Food & Beverage", 
      campaigns: 15, 
      status: "Active",
      createdAt: "2023-03-10",
      logo: "https://github.com/shadcn.png"
    },
    { 
      id: 4, 
      name: "Samsung", 
      industry: "Technology", 
      campaigns: 6, 
      status: "Inactive",
      createdAt: "2023-04-05",
      logo: ""
    },
    { 
      id: 5, 
      name: "Disney", 
      industry: "Entertainment", 
      campaigns: 10, 
      status: "Active",
      createdAt: "2023-05-12",
      logo: "https://github.com/shadcn.png"
    },
  ];
  
  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    brand.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brands Management</h1>
          <p className="text-muted-foreground">Manage all brands across the platform</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search brands..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Brand</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>All Brands</CardTitle>
              <CardDescription>Total {filteredBrands.length} brands found</CardDescription>
            </div>
            
            <Button variant="outline" size="sm" className="h-8">
              <ChevronDown className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map(brand => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={brand.logo} />
                        <AvatarFallback>
                          {brand.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{brand.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{brand.industry}</TableCell>
                  <TableCell>{brand.campaigns}</TableCell>
                  <TableCell>
                    <Badge variant={brand.status === "Active" ? "default" : "secondary"}>
                      {brand.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{brand.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Brand</DropdownMenuItem>
                        <DropdownMenuItem>View Campaigns</DropdownMenuItem>
                        <DropdownMenuItem>Edit Brand</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Deactivate Brand
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
