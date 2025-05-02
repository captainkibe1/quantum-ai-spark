
import { FC, useRef, FormEvent, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat, ModelType } from '@/context/chat-context';

interface ChatInputProps {
  model: ModelType;
}

const ChatInput: FC<ChatInputProps> = ({ model }) => {
  const { sendMessage, isProcessing, generateImage } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const message = input.trim();
    if (!message || isProcessing) return;
    
    setInput('');
    
    if (model === "dall-e-3") {
      await generateImage(message);
    } else {
      await sendMessage(message, model);
    }
    
    // Focus the textarea after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              model === "dall-e-3"
                ? "Describe the image you'd like to generate..."
                : "Message QuantumAI..."
            }
            className="resize-none min-h-[60px] py-3 pr-12 text-base"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 bottom-2"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          {model === "dall-e-3" 
            ? "Using DALL-E 3 to generate images from your descriptions"
            : `Using ${model} model. QuantumAI may produce inaccurate information.`
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
