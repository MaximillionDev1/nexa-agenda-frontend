import type { ReactNode } from 'react'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="border-b border-card bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">Nexa</div>
              <div className="text-sm text-text-secondary">Agenda</div>
            </div>
            <nav className="flex gap-4">
              <a
                href="/"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Home
              </a>
              <a
                href="/scheduling"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Agendar
              </a>
              <a
                href="/lookup"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Consultar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-card bg-card/50 mt-20">
        <div className="container-app py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Nexa Agenda</h3>
              <p className="text-text-secondary text-sm">
                Seu horário. Sua rotina. Tudo organizado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="/" className="hover:text-text transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/scheduling" className="hover:text-text transition-colors">
                    Agendar
                  </a>
                </li>
                <li>
                  <a href="/lookup" className="hover:text-text transition-colors">
                    Consultar Agendamento
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <p className="text-sm text-text-secondary">
                (11) 99999-9999
                <br />
                contato@nexaagenda.com
              </p>
            </div>
          </div>
          <div className="border-t border-card pt-8 text-center text-text-secondary text-sm">
            <p>&copy; 2026 Nexa Agenda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}