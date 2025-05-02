
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversations: 0,
    activeUsers: 0,
    apiUsage: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Get registered users
      const storedUsers = localStorage.getItem("ai-chat-registered-users");
      const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Get conversations
      const conversations = localStorage.getItem("ai-chat-conversations");
      const parsedConversations = conversations ? JSON.parse(conversations) : [];
      
      setStats({
        totalUsers: registeredUsers.length + 1, // +1 for admin
        totalConversations: parsedConversations.length,
        activeUsers: Math.floor(Math.random() * 10) + 1, // Random number for demo
        apiUsage: parsedConversations.reduce((total: number, conv: any) => {
          return total + (conv.messages?.length || 0);
        }, 0)
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name} - here's an overview of QuantumAI.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">5%</span>
              <span className="text-muted-foreground ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalConversations}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">18%</span>
              <span className="text-muted-foreground ml-1">from last week</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              API Usage
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.apiUsage}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total messages processed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>User</div>
                <div>Activity</div>
                <div>Time</div>
              </div>
              <div className="grid grid-cols-3 text-sm border-t py-3">
                <div>User 1</div>
                <div>Created a new conversation</div>
                <div className="text-muted-foreground">2 minutes ago</div>
              </div>
              <div className="grid grid-cols-3 text-sm border-t py-3">
                <div>User 2</div>
                <div>Generated an image</div>
                <div className="text-muted-foreground">15 minutes ago</div>
              </div>
              <div className="grid grid-cols-3 text-sm border-t py-3">
                <div>User 3</div>
                <div>Joined the platform</div>
                <div className="text-muted-foreground">1 hour ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
