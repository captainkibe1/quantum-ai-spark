
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Search, User, Users, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  joinDate: string;
  lastActive: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get admin user
      const adminUser: UserData = {
        id: "admin-1",
        name: "Admin User",
        email: "me@admin.com", 
        isAdmin: true,
        joinDate: "2024-01-01",
        lastActive: new Date().toISOString().split('T')[0],
      };
      
      // Get regular users from localStorage
      const storedUsers = localStorage.getItem("ai-chat-registered-users");
      let regularUsers: UserData[] = [];
      
      if (storedUsers) {
        try {
          // Parse and transform stored users into the format we need
          regularUsers = JSON.parse(storedUsers).map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false,
            joinDate: new Date().toISOString().split('T')[0], // Just use today's date as a placeholder
            lastActive: new Date().toISOString().split('T')[0], // Just use today's date as a placeholder
          }));
        } catch (e) {
          console.error("Failed to parse stored users", e);
        }
      }
      
      // Combine admin and regular users
      setUsers([adminUser, ...regularUsers]);
      setLoading(false);
    };
    
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    // Don't allow deletion of admin user
    if (userId === "admin-1") {
      toast({
        title: "Cannot Delete Admin",
        description: "The admin user cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    // Update the UI
    setUsers(users.filter(user => user.id !== userId));
    
    // Update localStorage (in a real app, this would be an API call)
    const storedUsers = localStorage.getItem("ai-chat-registered-users");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        const updatedUsers = parsedUsers.filter((user: any) => user.id !== userId);
        localStorage.setItem("ai-chat-registered-users", JSON.stringify(updatedUsers));
        
        toast({
          title: "User Deleted",
          description: "The user has been successfully removed.",
        });
      } catch (e) {
        console.error("Failed to update stored users", e);
        toast({
          title: "Error",
          description: "Failed to delete the user.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          View and manage all users of the application.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <User className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin 
                          ? "bg-primary/10 text-primary" 
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit user</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
