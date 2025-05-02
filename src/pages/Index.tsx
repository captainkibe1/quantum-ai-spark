
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ExamplesSection from '@/components/home/ExamplesSection';
import DownloadSection from '@/components/home/DownloadSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

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

  // Simple show/hide animation to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection handleGetStarted={handleGetStarted} />
      <ExamplesSection />
      <DownloadSection />
      <FeaturesSection />
      <CTASection handleGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Index;
