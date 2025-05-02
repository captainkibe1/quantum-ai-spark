
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data for charts
const monthlyData = [
  { name: 'Jan', users: 30, conversations: 150, apiCalls: 450 },
  { name: 'Feb', users: 45, conversations: 230, apiCalls: 670 },
  { name: 'Mar', users: 75, conversations: 280, apiCalls: 890 },
  { name: 'Apr', users: 120, conversations: 390, apiCalls: 1250 },
  { name: 'May', users: 190, conversations: 450, apiCalls: 1700 },
];

const weeklyData = [
  { name: 'Mon', users: 15, conversations: 65, apiCalls: 210 },
  { name: 'Tue', users: 20, conversations: 78, apiCalls: 245 },
  { name: 'Wed', users: 25, conversations: 90, apiCalls: 300 },
  { name: 'Thu', users: 18, conversations: 85, apiCalls: 270 },
  { name: 'Fri', users: 22, conversations: 95, apiCalls: 310 },
  { name: 'Sat', users: 30, conversations: 120, apiCalls: 370 },
  { name: 'Sun', users: 25, conversations: 105, apiCalls: 340 },
];

const modelUsageData = [
  { name: 'GPT-4o mini', value: 450 },
  { name: 'GPT-4o', value: 300 },
  { name: 'GPT-4.5', value: 200 },
  { name: 'DALL-E 3', value: 150 },
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your app's performance and user engagement metrics.
        </p>
      </div>
      
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <div className="inline-flex items-center rounded-md border p-1 text-sm">
            <button
              className={`px-3 py-1 rounded-sm ${timeframe === 'weekly' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${timeframe === 'monthly' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeframe === 'weekly' ? weeklyData : monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversations" stroke="#8884d8" name="Conversations" />
                    <Line type="monotone" dataKey="apiCalls" stroke="#82ca9d" name="API Calls" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeframe === 'weekly' ? weeklyData : monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" name="New Users" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeframe === 'weekly' ? weeklyData : monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversations" stroke="#82ca9d" name="Conversations per User" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={modelUsageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
