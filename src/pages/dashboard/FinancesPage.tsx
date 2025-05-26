
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Wallet, 
  CreditCard, ArrowUpRight, ArrowDownLeft, Filter, Lock, TrendingDown
} from "lucide-react";
import { formatCurrency } from "@/lib/campaign-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock financial data
const mockFinancialData = {
  accountBalance: 25000.00,
  committed: 18500.00, // Money committed to active campaigns
  paidOut: 12750.00, // Money paid out to creators
  transactions: [
    {
      id: "txn_001",
      type: "deposit",
      description: "Stripe Deposit",
      amount: 10000.00,
      fee: 815.00, // 3% Stripe + 5% marketplace
      netAmount: 9185.00,
      date: "2023-09-15",
      status: "completed",
      reference: "ch_3O3PqR2eZvKYlo2CwJQpFXAM"
    },
    {
      id: "txn_002",
      type: "payout",
      description: "Payment to Emma Johnson - Summer Collection",
      amount: 1500.00,
      fee: 0,
      netAmount: -1500.00,
      date: "2023-09-14",
      status: "completed",
      reference: "Summer Collection Campaign"
    },
    {
      id: "txn_003",
      type: "campaign_funding",
      description: "Campaign Budget Allocation - Spring Launch",
      amount: 5000.00,
      fee: 0,
      netAmount: -5000.00,
      date: "2023-09-13",
      status: "completed",
      reference: "Spring Launch Campaign"
    },
    {
      id: "txn_004",
      type: "deposit",
      description: "Stripe Deposit",
      amount: 25000.00,
      fee: 2037.50,
      netAmount: 22962.50,
      date: "2023-09-10",
      status: "completed",
      reference: "ch_3O3Gr2eZvKYlo2CJ75kpZJA"
    },
    {
      id: "txn_005",
      type: "payout",
      description: "Payment to James Wilson - iPhone Campaign",
      amount: 850.00,
      fee: 0,
      netAmount: -850.00,
      date: "2023-09-09",
      status: "completed",
      reference: "iPhone Launch Campaign"
    }
  ]
};

export default function FinancesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredTransactions = mockFinancialData.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "payout":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "campaign_funding":
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "payout":
        return "text-red-600";
      case "campaign_funding":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Finances</h2>
          <p className="text-muted-foreground">
            Overview of your account balance, committed funds, and payouts
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Funds
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockFinancialData.accountBalance, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available for campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Committed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(mockFinancialData.committed, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Allocated to campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Paid Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(mockFinancialData.paidOut, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">To creators</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFinancialData.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'deposit' ? '+' : ''}
                        {formatCurrency(transaction.netAmount, 'USD')}
                      </p>
                      {transaction.fee > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Fee: {formatCurrency(transaction.fee, 'USD')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-[250px]">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="payout">Payouts</SelectItem>
                      <SelectItem value="campaign_funding">Campaign Funding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount, 'USD')}</TableCell>
                        <TableCell>
                          {transaction.fee > 0 ? formatCurrency(transaction.fee, 'USD') : '-'}
                        </TableCell>
                        <TableCell className={getTransactionColor(transaction.type)}>
                          {transaction.type === 'deposit' ? '+' : ''}
                          {formatCurrency(transaction.netAmount, 'USD')}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <code className="px-1 py-0.5 bg-muted rounded text-xs">
                            {transaction.reference}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
