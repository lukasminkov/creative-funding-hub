
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
import { Search, MoreHorizontal, ChevronDown, Filter, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock user data - in a real app, this would come from your database
  const users = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com", 
      role: "Admin", 
      status: "Active",
      createdAt: "2023-01-15",
      avatar: "https://github.com/shadcn.png"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      role: "Brand Manager", 
      status: "Active",
      createdAt: "2023-02-20",
      avatar: ""
    },
    { 
      id: 3, 
      name: "Bob Johnson", 
      email: "bob@example.com", 
      role: "Creator", 
      status: "Inactive",
      createdAt: "2023-03-10",
      avatar: "https://github.com/shadcn.png"
    },
    { 
      id: 4, 
      name: "Alice Williams", 
      email: "alice@example.com", 
      role: "Creator", 
      status: "Active",
      createdAt: "2023-04-05",
      avatar: ""
    },
    { 
      id: 5, 
      name: "Charlie Brown", 
      email: "charlie@example.com", 
      role: "Brand Manager", 
      status: "Active",
      createdAt: "2023-05-12",
      avatar: "https://github.com/shadcn.png"
    },
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage all users across the platform</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search users..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Total {filteredUsers.length} users found</CardDescription>
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
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Deactivate User
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
