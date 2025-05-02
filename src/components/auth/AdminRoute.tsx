
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { Loader } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not logged in at all
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isAdmin) {
    // Redirect to chat page if logged in but not an admin
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
