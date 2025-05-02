
import { FC } from 'react';
import { Message } from '@/context/chat-context';
import { cn } from '@/lib/utils';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "py-8 first:pt-0 last:pb-0",
        isUser ? "" : "bg-accent/40"
      )}
    >
      <div className="container max-w-4xl flex gap-4">
        <div className="mt-0.5">
          {isUser ? (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
              <User className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary shadow">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
            {message.pending ? (
              <div className="flex items-center h-6">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-slow" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-slow [animation-delay:0.2s] ml-1" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-slow [animation-delay:0.4s] ml-1" />
              </div>
            ) : (
              <>
                <MarkdownRenderer content={message.content} />
                
                {message.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={message.imageUrl} 
                      alt="AI generated image" 
                      className="rounded-lg max-w-full max-h-[512px] object-contain"
                    />
                  </div>
                )}
                
                {message.audioUrl && (
                  <div className="mt-4">
                    <audio 
                      src={message.audioUrl} 
                      controls 
                      className="w-full"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          {!message.pending && (
            <div className="flex items-center">
              <p className="text-xs text-muted-foreground">
                {message.model === "dall-e-3" ? "DALL-E 3" : message.model.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
