
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  handleGetStarted: () => void;
}

export default function CTASection({ handleGetStarted }: CTASectionProps) {
  return (
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
  );
}
