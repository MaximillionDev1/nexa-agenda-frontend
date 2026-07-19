import { Link } from 'react-router-dom';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip to main content link */}
      <Link
        to="#main-content"
        className="skip-to-main text-sm font-medium"
      >
        Skip to main content
      </Link>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}