
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Clock, Download, Search, Filter, CreditCard, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function FinancesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: financialData, isLoading } = useQuery({
    queryKey: ["financial-data"],
    queryFn: () => {
      const stored = localStorage.getItem("financial-data");
      return stored ? JSON.parse(stored) : {
        totalEarnings: 24500,
        pendingPayments: 3200,
        thisMonthEarnings: 5800,
        avgPaymentTime: "3-5 days",
        transactions: [
          {
            id: "1",
            date: "2024-01-15",
            description: "Campaign Payment - TikTok Content",
            campaign: "Summer Fashion Collection",
            platform: "TikTok",
            status: "completed",
            amount: 850,
            type: "incoming",
            from: "Fashion Brand Ltd",
            to: "Your Account",
            transactionId: "TXN-2024-001"
          },
          {
            id: "2", 
            date: "2024-01-12",
            description: "Instagram Reel Payment",
            campaign: "Tech Product Launch",
            platform: "Instagram",
            status: "completed",
            amount: 1200,
            type: "incoming",
            from: "Tech Innovations Inc",
            to: "Your Account",
            transactionId: "TXN-2024-002"
          },
          {
            id: "3",
            date: "2024-01-10",
            description: "YouTube Sponsorship",
            campaign: "Gaming Setup Review",
            platform: "YouTube",
            status: "pending",
            amount: 2500,
            type: "incoming",
            from: "Gaming Gear Co",
            to: "Your Account",
            transactionId: "TXN-2024-003"
          },
          {
            id: "4",
            date: "2024-01-08",
            description: "Platform Fee",
            campaign: "Service Fee",
            platform: "Payper",
            status: "completed",
            amount: 45,
            type: "outgoing",
            from: "Your Account",
            to: "Payper Platform",
            transactionId: "TXN-2024-004"
          }
        ]
      };
    }
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredTransactions = financialData.transactions.filter((transaction: any) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "incoming") return matchesSearch && transaction.type === "incoming";
    if (activeTab === "outgoing") return matchesSearch && transaction.type === "outgoing";
    if (activeTab === "pending") return matchesSearch && transaction.status === "pending";
    
    return matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Settings
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              ${financialData.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Pending Payments</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ${financialData.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-orange-600">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">This Month</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              ${financialData.thisMonthEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600">January 2024</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Avg. Payment Time</CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {financialData.avgPaymentTime}
            </div>
            <p className="text-xs text-purple-600">Processing time</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your payment transactions and financial activity</CardDescription>
            </div>
            
            <div className="flex gap-2">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="incoming">Incoming</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        {transaction.type === "incoming" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">From: {transaction.from}</div>
                          <div className="text-muted-foreground">To: {transaction.to}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.campaign}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.type === "incoming" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "incoming" ? "+" : "-"}${transaction.amount.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No transactions found matching your search" : "No transactions yet"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
