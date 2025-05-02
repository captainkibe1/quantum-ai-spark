
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}
