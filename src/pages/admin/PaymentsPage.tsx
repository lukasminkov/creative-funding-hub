
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, Download, Calendar, ArrowUpDown, CreditCard, 
  DollarSign, BarChart, MoreHorizontal, FileText, RefreshCw, AlertCircle
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  // Mock payments data
  const payments = [
    { 
      id: "tx-1", 
      date: "2023-09-15", 
      amount: 1500.00,
      status: "paid",
      creator: "Emma Johnson",
      campaign: "Summer Collection Launch",
      brand: "Nike",
      paymentMethod: "Stripe Connect",
      paymentId: "py_1O3PqR2eZvKYlo2CwJQpFXAM"
    },
    { 
      id: "tx-2", 
      date: "2023-09-14", 
      amount: 850.00,
      status: "pending",
      creator: "James Wilson",
      campaign: "New iPhone Launch Campaign",
      brand: "Apple",
      paymentMethod: "Stripe Connect",
      paymentId: "py_1O3Gr2eZvKYlo2CJ75kpZJA"
    },
    { 
      id: "tx-3", 
      date: "2023-09-12", 
      amount: 2200.00,
      status: "paid",
      creator: "Olivia Brown",
      campaign: "Summer Refreshment Challenge",
      brand: "Coca-Cola",
      paymentMethod: "Stripe Connect",
      paymentId: "py_1O3HsR2eZvKYlo2Cf9QzoaBC"
    },
    { 
      id: "tx-4", 
      date: "2023-09-10", 
      amount: 1200.00,
      status: "failed",
      creator: "Michael Davis",
      campaign: "Galaxy Z Fold Promotion",
      brand: "Samsung",
      paymentMethod: "Stripe Connect",
      paymentId: "py_1O3JcR2eZvKYlo2CWUkXZIRD"
    },
    { 
      id: "tx-5", 
      date: "2023-09-08", 
      amount: 750.00,
      status: "paid",
      creator: "Sophia Martinez",
      campaign: "New Movie Trailer Campaign",
      brand: "Disney",
      paymentMethod: "Stripe Connect",
      paymentId: "py_1O3KdR2eZvKYlo2CxYtRoAVE"
    },
  ];
  
  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => 
    payment.creator.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Helper for status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid": return "secondary";
      case "pending": return "outline";
      case "failed": return "destructive";
      default: return "outline";
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage all payments in the platform</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">$286,400.00</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12.4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">42</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+5 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">98.5%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>All payment transactions across the platform</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search transactions..." 
                  className="pl-8 w-[250px]" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-mono text-xs">{payment.paymentId}</div>
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.creator}</TableCell>
                  <TableCell>
                    <div>{payment.campaign}</div>
                    <div className="text-xs text-muted-foreground">{payment.brand}</div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry Payment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Report Issue
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
