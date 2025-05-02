
import { FC, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutGrid, MessageSquare, Plus, Settings, LogOut, Image } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useChat, ModelType } from '@/context/chat-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/common/ModeToggle';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout: FC<ChatLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { 
    conversations, 
    currentConversationId, 
    selectConversation, 
    createNewConversation,
    deleteConversation,
    currentModel,
    setCurrentModel
  } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNewChat = () => {
    createNewConversation();
    closeSidebar();
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    closeSidebar();
  };

  const handleSelectModel = (model: ModelType) => {
    setCurrentModel(model);
    createNewConversation(model);
    closeSidebar();
  };

  // Mobile drawer for sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
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
          <span className="font-bold text-xl">QuantumAI</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full justify-start" 
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>

        <div className="space-y-1">
          <h3 className="text-sm font-medium">Models</h3>
          <div className="rounded-md border overflow-hidden">
            <div 
              className={cn(
                "p-2 cursor-pointer hover:bg-accent flex items-center",
                currentModel === "gpt-4o-mini" && "bg-accent"
              )}
              onClick={() => handleSelectModel("gpt-4o-mini")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">GPT-4o mini</span>
                <span className="text-xs text-muted-foreground">Fast, efficient AI assistant</span>
              </div>
            </div>
            <div 
              className={cn(
                "p-2 cursor-pointer hover:bg-accent flex items-center",
                currentModel === "gpt-4o" && "bg-accent"
              )}
              onClick={() => handleSelectModel("gpt-4o")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">GPT-4o</span>
                <span className="text-xs text-muted-foreground">Advanced reasoning and understanding</span>
              </div>
            </div>
            <div 
              className={cn(
                "p-2 cursor-pointer hover:bg-accent flex items-center",
                currentModel === "gpt-4.5-preview" && "bg-accent"
              )}
              onClick={() => handleSelectModel("gpt-4.5-preview")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">GPT-4.5 Preview</span>
                <span className="text-xs text-muted-foreground">Latest cutting-edge capabilities</span>
              </div>
            </div>
            <div 
              className={cn(
                "p-2 cursor-pointer hover:bg-accent flex items-center",
                currentModel === "dall-e-3" && "bg-accent"
              )}
              onClick={() => handleSelectModel("dall-e-3")}
            >
              <Image className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">DALL-E 3</span>
                <span className="text-xs text-muted-foreground">Generate images from text</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium">Recent chats</h3>
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center justify-between rounded-md p-2 text-sm cursor-pointer hover:bg-accent",
                  currentConversationId === conversation.id && "bg-accent"
                )}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-center max-w-[80%]">
                  {conversation.model === "dall-e-3" ? (
                    <Image className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">{conversation.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-sm text-muted-foreground p-2">
                No conversations yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-medium truncate max-w-[140px]">
              {user?.name}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div
        className={cn(
          "border-r bg-background w-72 hidden md:block p-4 overflow-auto",
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
