import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Skip to main content link */}
      <Link
        to="#main-content"
        className="skip-to-main text-sm font-medium"
      >
        Skip to main content
      </Link>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}