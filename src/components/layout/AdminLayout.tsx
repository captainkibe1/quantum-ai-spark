
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/common/ModeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart,
      current: location.pathname === '/admin/analytics',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings',
    },
  ];
  
  // Mobile drawer for sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <div className="h-[80vh] overflow-auto px-4 py-6">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">QuantumAI Admin</span>
        </Link>
        <div className="flex items-center">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden ml-1"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              item.current
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
            )}
            onClick={closeSidebar}
            aria-current={item.current ? 'page' : undefined}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                item.current ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r">
        <div className="flex flex-col flex-grow overflow-y-auto bg-background p-4">
          <SidebarContent />
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar with mobile menu */}
        <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-background border-b">
          <div className="flex flex-1 px-4 sm:px-6 items-center justify-between">
            <div className="lg:hidden">
              <MobileSidebar />
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="lg:hidden">
                <p className="text-sm font-semibold">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
