
import { ChevronRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({ handleGetStarted }: { handleGetStarted: () => void }) {
  const navigate = useNavigate();

  return (
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
  );
}
