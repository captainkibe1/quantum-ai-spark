
import { MessageSquare, Image, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { ModelType } from '@/context/chat-context';

const examples = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Answer questions",
    description: "Get instant answers to any question, from simple facts to complex topics.",
    prompt: "Explain quantum computing in simple terms."
  },
  {
    icon: <Image className="h-5 w-5" />,
    title: "Generate images",
    description: "Create stunning, realistic images from text descriptions.",
    prompt: "A beautiful sunset over a calm lake with mountains in the background.",
    useModel: "dall-e-3" as ModelType
  },
  {
    icon: <LayoutGrid className="h-5 w-5" />,
    title: "Creative writing",
    description: "Draft stories, poems, articles and more with creative assistance.",
    prompt: "Write a short poem about artificial intelligence."
  }
];

export default function ExamplesSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleExample = (prompt: string, model?: ModelType) => {
    if (user) {
      // In a real app, you'd create a conversation with this prompt pre-filled
      navigate('/chat', { state: { initialPrompt: prompt, model } });
    } else {
      navigate('/login');
    }
  };
  
  return (
    <section className="py-16 bg-accent">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Try these examples</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleExample(example.prompt, example.useModel)}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  {example.icon}
                </div>
                <h3 className="font-semibold text-lg">{example.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{example.description}</p>
              <div className="bg-accent p-3 rounded-lg text-sm">{example.prompt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
