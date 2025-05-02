
import { MessageSquare, Image, Download } from 'lucide-react';

export default function FeaturesSection() {
  return (
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
  );
}
