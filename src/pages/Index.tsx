
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronRight, Image, ArrowDown, LayoutGrid, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import ThemeToggle from '@/components/common/ThemeToggle';
import AppInstallBanner from '@/components/common/AppInstallBanner';
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleExample = (prompt: string, model?: ModelType) => {
    if (user) {
      // In a real app, you'd create a conversation with this prompt pre-filled
      navigate('/chat', { state: { initialPrompt: prompt, model } });
    } else {
      navigate('/login');
    }
  };

  // Simple show/hide animation to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
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

      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Experience the power of <span className="text-primary">Quantum AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto">
            Your personal AI assistant powered by cutting-edge language models. Chat, generate content, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/about')}>
              Learn More
            </Button>
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="ghost" onClick={() => {
              const featuresSection = document.getElementById('features');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Features
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Examples Section */}
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

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Powerful features</h2>
          <p className="text-xl text-muted-foreground mb-12 text-center">Everything you need in an AI assistant</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-xl p-6">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced AI Models</h3>
              <p className="text-muted-foreground">Access to the latest OpenAI models, from GPT-4o mini to GPT-4.5 Preview.</p>
            </div>

            <div className="border rounded-xl p-6">
              <Image className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Image Generation</h3>
              <p className="text-muted-foreground">Create stunning, detailed images with DALL-E 3 from your text descriptions.</p>
            </div>

            <div className="border rounded-xl p-6">
              <Download className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Install as App</h3>
              <p className="text-muted-foreground">Install QuantumAI on your device for a better experience and offline access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the future of AI?</h2>
          <p className="text-xl mb-10 opacity-90">Join thousands of users already enhancing their productivity with QuantumAI.</p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8" 
            onClick={handleGetStarted}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-background border-t">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-bold">QuantumAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} QuantumAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      <AppInstallBanner />
    </div>
  );
};

export default Index;
