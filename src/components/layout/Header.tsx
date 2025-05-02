
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/98c6c85b-4c8c-458b-a9c8-81b0d89c7a16.png" 
            alt="QuantumAI" 
            className="h-8 w-8"
          />
          <span className="font-bold text-xl">QuantumAI</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Button onClick={() => navigate('/chat')}>Go to Chat</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>Log in</Button>
              <Button onClick={() => navigate('/register')}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
