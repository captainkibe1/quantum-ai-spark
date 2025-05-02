
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import ThemeToggle from '@/components/common/ThemeToggle';
import { InstallButton } from '@/components/common/app-install/InstallDialog';
import { InstallPromptProvider } from '@/components/common/app-install/InstallPromptContext';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">QuantumAI</span>
        </div>
        <div className="flex items-center gap-4">
          <InstallPromptProvider>
            <InstallButton variant="ghost" size="icon" />
          </InstallPromptProvider>
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
