import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📅</span>
              <div>
                <h3 className="font-bold text-lg text-text">Nexa Agenda</h3>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Service scheduling platform
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Make scheduling easy and efficient for your business.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/scheduling"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Schedule Service
                </Link>
              </li>
              <li>
                <Link
                  to="/lookup"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Check Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Admin Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-text mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone
                  size={16}
                  className="text-primary flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href="tel:+5511949805847"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  +55 (11) 94980-5847
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail
                  size={16}
                  className="text-primary flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href="mailto:support@nexaagenda.com"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  support@nexaagenda.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-primary flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-text-secondary">
                  São Paulo, SP, Brazil
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-card my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-secondary">
          <p>
            &copy; {currentYear} Nexa Agenda. All rights reserved.
          </p>
          <p>
            Built with <span className="text-primary">❤️</span> for better scheduling
          </p>
        </div>
      </div>
    </footer>
  );
}