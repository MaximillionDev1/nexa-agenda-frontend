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
                  Plataforma de agendamento
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Facilitando agendamentos para seu negócio com eficiência e praticidade.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold text-text mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/scheduling"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Agendar Serviço
                </Link>
              </li>
              <li>
                <Link
                  to="/lookup"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Consultar Agendamento
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Área Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold text-text mb-4">Suporte</h4>
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
                  São Paulo, SP, Brasil
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
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Termos de Serviço
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-1"
                >
                  Política de Cookies
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
            &copy; {currentYear} Nexa Agenda. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido com <span className="text-primary">❤️</span> para melhor agendamento
          </p>
        </div>
      </div>
    </footer>
  );
}