
import { MainPageDownloadButtons } from '@/components/common/app-install/InstallButtons';

export default function DownloadSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Download QuantumAI</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get the best experience by installing our app on your device. Access QuantumAI offline and enjoy native-like performance.
        </p>
        <MainPageDownloadButtons />
        <p className="mt-4 text-sm text-muted-foreground">
          Available for iOS, Android, and desktop browsers
        </p>
      </div>
    </section>
  );
}
