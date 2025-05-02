
import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";

export type ModelType = 
  | "gpt-4o-mini" 
  | "gpt-4o" 
  | "gpt-4.5-preview"
  | "dall-e-3"
  | "text-to-speech";

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model: ModelType;
  pending?: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: ModelType;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  createNewConversation: (model?: ModelType) => string;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, model?: ModelType) => Promise<void>;
  deleteConversation: (conversationId: string) => void;
  clearConversations: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isProcessing: boolean;
  currentModel: ModelType;
  setCurrentModel: (model: ModelType) => void;
  generateImage: (prompt: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ai-chat-conversations';
const API_KEY_STORAGE_KEY = 'ai-chat-api-key';

// Helper function to save conversations to localStorage
const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversations));
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      } catch (e) {
        console.error("Failed to parse saved conversations", e);
        return [];
      }
    }
    return [];
  });
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<ModelType>("gpt-4o-mini");

  const { toast } = useToast();

  // Save API key to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }, [apiKey]);

  // Save conversations to localStorage whenever they change
  React.useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const createNewConversation = (model: ModelType = "gpt-4o-mini") => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      model: model,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setCurrentModel(model);
    
    return newConversation.id;
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setCurrentModel(conversation.model);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  const clearConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
  };

  const updateConversationTitle = (conversationId: string, messages: Message[]) => {
    if (messages.length <= 1) return;
    
    // Use the first user message as the title
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      // Truncate to a reasonable length for a title
      const title = firstUserMessage.content.length > 30
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
      
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? {...c, title} 
            : c
        )
      );
    }
  };

  const sendMessage = async (content: string, model: ModelType = currentModel) => {
    if (!content.trim()) return;
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in the settings",
        variant: "destructive",
      });
      return;
    }
    
    // Create a conversation if none exists
    let convId = currentConversationId;
    if (!convId) {
      convId = createNewConversation(model);
    }
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content,
      timestamp: new Date(),
      model: model
    };
    
    const pendingMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      model: model,
      pending: true
    };
    
    // Update conversation with user message and pending assistant message
    setConversations(prev => 
      prev.map(c => 
        c.id === convId 
          ? {
              ...c,
              messages: [...c.messages, userMessage, pendingMessage],
              updatedAt: new Date(),
              model: model
            }
          : c
      )
    );
    
    setIsProcessing(true);
    
    try {
      // Find the current conversation after update
      const currentConversation = conversations.find(c => c.id === convId);
      if (!currentConversation) throw new Error("Conversation not found");
      
      // Build conversation history for context
      const conversationHistory = [
        ...currentConversation.messages.filter(m => !m.pending),
        userMessage
      ];
      
      // Format messages for OpenAI API
      const messages = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Make API request to OpenAI
      // In a real implementation, this should be done through a backend service
      // This is a simulated response for demo purposes
      const simulatedResponse = await new Promise<string>((resolve) => {
        setTimeout(() => {
          // Simulate different responses based on the content
          if (content.toLowerCase().includes('hello')) {
            resolve("Hello! How can I help you today?");
          } else if (content.toLowerCase().includes('help')) {
            resolve("I'm here to help! What do you need assistance with?");
          } else if (model === "gpt-4o") {
            resolve("This is a simulated response from GPT-4o. In a real implementation, this would connect to the OpenAI API with your API key.");
          } else if (model === "gpt-4.5-preview") {
            resolve("This is a simulated response from GPT-4.5 Preview. This would be a more advanced response with better reasoning capabilities.");
          } else {
            resolve("I understand you're asking about: " + content + "\n\nThis is a simulated AI response. In a real implementation, this would connect to the OpenAI API.");
          }
        }, 2000); // Simulate network delay
      });
      
      // Update the conversation with the AI response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: simulatedResponse,
        timestamp: new Date(),
        model: model
      };
      
      setConversations(prev => 
        prev.map(c => 
          c.id === convId 
            ? {
                ...c,
                // Replace the pending message with the actual response
                messages: c.messages.map(m => 
                  m.pending ? assistantMessage : m
                ),
                updatedAt: new Date()
              }
            : c
        )
      );
      
      // Update the conversation title if this is the first exchange
      const updatedConversation = conversations.find(c => c.id === convId);
      if (updatedConversation) {
        updateConversationTitle(convId, [...updatedConversation.messages, userMessage, assistantMessage]);
      }
      
    } catch (error) {
      console.error("Failed to get AI response:", error);
      
      toast({
        title: "Error",
        description: "Failed to get a response from the AI",
        variant: "destructive",
      });
      
      // Remove the pending message
      setConversations(prev => 
        prev.map(c => 
          c.id === convId 
            ? {
                ...c,
                messages: c.messages.filter(m => !m.pending)
              }
            : c
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const generateImage = async (prompt: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in the settings",
        variant: "destructive",
      });
      return;
    }
    
    // Create a conversation if none exists or switch to a new image conversation
    let convId = currentConversationId;
    if (!convId || currentModel !== "dall-e-3") {
      convId = createNewConversation("dall-e-3");
    }
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: `Generate image: ${prompt}`,
      timestamp: new Date(),
      model: "dall-e-3"
    };
    
    const pendingMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: 'Generating image...',
      timestamp: new Date(),
      model: "dall-e-3",
      pending: true
    };
    
    // Update conversation with user message and pending assistant message
    setConversations(prev => 
      prev.map(c => 
        c.id === convId 
          ? {
              ...c,
              messages: [...c.messages, userMessage, pendingMessage],
              updatedAt: new Date(),
              model: "dall-e-3"
            }
          : c
      )
    );
    
    setIsProcessing(true);
    
    try {
      // Simulate image generation (in a real app, this would call DALL-E API)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use a placeholder image URL
      const placeholderImageUrl = "https://via.placeholder.com/512x512.png?text=AI+Generated+Image";
      
      // Update the conversation with the AI response including image
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `Here's an image based on your prompt: "${prompt}"`,
        timestamp: new Date(),
        model: "dall-e-3",
        imageUrl: placeholderImageUrl
      };
      
      setConversations(prev => 
        prev.map(c => 
          c.id === convId 
            ? {
                ...c,
                // Replace the pending message with the actual response
                messages: c.messages.map(m => 
                  m.pending ? assistantMessage : m
                ),
                updatedAt: new Date(),
                title: `Image: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`
              }
            : c
        )
      );
      
    } catch (error) {
      console.error("Failed to generate image:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate the image",
        variant: "destructive",
      });
      
      // Remove the pending message
      setConversations(prev => 
        prev.map(c => 
          c.id === convId 
            ? {
                ...c,
                messages: c.messages.filter(m => !m.pending)
              }
            : c
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider 
      value={{
        conversations, 
        currentConversationId, 
        createNewConversation,
        selectConversation,
        sendMessage,
        deleteConversation,
        clearConversations,
        apiKey,
        setApiKey,
        isProcessing,
        currentModel,
        setCurrentModel,
        generateImage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
