
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ChatLayout from '@/components/layout/ChatLayout';
import { useChat, ModelType } from '@/context/chat-context';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { MessageSquare } from 'lucide-react';

const Chat = () => {
  const { 
    conversations, 
    currentConversationId, 
    createNewConversation, 
    sendMessage,
    currentModel,
    setCurrentModel,
    generateImage
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Get the current conversation
  const currentConversation = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId) 
    : null;

  // Handle initial prompt from examples
  useEffect(() => {
    const state = location.state as { initialPrompt?: string; model?: ModelType } | null;
    
    if (state?.initialPrompt) {
      const model = state.model || currentModel;
      
      // Create a new conversation with the selected model
      const convId = createNewConversation(model);
      setCurrentModel(model);
      
      // Use setTimeout to allow the state to update
      setTimeout(() => {
        if (model === "dall-e-3") {
          generateImage(state.initialPrompt!);
        } else {
          sendMessage(state.initialPrompt!, model);
        }
        
        // Clear the location state
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  return (
    <ChatLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          {currentConversation && currentConversation.messages.length > 0 ? (
            <div>
              {currentConversation.messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">How can I help you today?</h2>
              <p className="text-muted-foreground text-center max-w-md">
                {currentModel === "dall-e-3" 
                  ? "Describe the image you want to generate in detail. The more specific, the better the results."
                  : "Ask me anything, from answering questions to generating content. I'm powered by advanced AI models to assist you."
                }
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t">
          <ChatInput model={currentModel} />
        </div>
      </div>
    </ChatLayout>
  );
};

export default Chat;
