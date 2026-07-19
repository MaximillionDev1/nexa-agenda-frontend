import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-card sticky top-0 z-40">
      <nav className="container-app flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg sm:text-xl text-primary hover:text-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
        >
          <span className="text-2xl">📅</span>
          <span className="hidden sm:inline">Nexa Agenda</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-text hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1"
          >
            Início
          </Link>
          <Link
            to="/scheduling"
            className="text-sm font-medium text-text hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1"
          >
            Agendar
          </Link>
          <Link
            to="/lookup"
            className="text-sm font-medium text-text hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1"
          >
            Consultar Agendamento
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-sm min-h-[44px] flex items-center"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-background rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Alternar menu de navegação"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-card bg-card/95 backdrop-blur-sm"
          >
            <div className="container-app py-4 space-y-2 flex flex-col">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-text hover:bg-background rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Início
              </Link>
              <Link
                to="/scheduling"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-text hover:bg-background rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Agendar
              </Link>
              <Link
                to="/lookup"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-text hover:bg-background rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Consultar Agendamento
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}