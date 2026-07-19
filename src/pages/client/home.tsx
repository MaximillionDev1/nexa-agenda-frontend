import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { SchedulingOrbitHero } from '@/components/client/SchedulingOrbitHero'
import { Button } from '@/components/ui/Button'
import { apiService } from '@/services/api'
import type { IService, INextAvailableSlot } from '@/types'
import { Clock, MapPin, Zap, Droplets, Check, Scissors } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Sparkles: <div className="w-8 h-8">✨</div>,
  Droplets: <Droplets className="w-8 h-8" />,
  Check: <Check className="w-8 h-8" />,
}

export default function HomePage() {
  const navigate = useNavigate()

  const { data: services = [] } = useQuery<IService[]>({
    queryKey: ['services'],
    queryFn: () => apiService.getServices(),
  })

  const { data: nextSlot } = useQuery<INextAvailableSlot>({
    queryKey: ['nextAvailableSlot'],
    queryFn: () => apiService.getNextAvailableSlot(),
  })

  return (
    <PublicLayout>
      {/* Hero Section */}
      <SchedulingOrbitHero />

      {/* Next Available Slot */}
      {nextSlot && (
        <section className="py-12 bg-card/30 border-y border-card">
          <div className="container-app text-center">
            <div className="inline-flex items-center gap-3 bg-card border border-primary/30 rounded-full px-6 py-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>
                Próximo horário disponível:{' '}
                <span className="font-semibold text-primary">{nextSlot.formatted}</span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Oferecemos uma ampla variedade de serviços de qualidade para atender suas
              necessidades. Escolha o serviço desejado e agende seu horário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card/50 border border-card rounded-lg p-6 hover:border-primary transition-colors hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {iconMap[service.icon] || <Scissors className="w-6 h-6" />}
                </div>

                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{service.description}</p>

                <div className="space-y-2 mb-6 pt-4 border-t border-card/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Duração</span>
                    <span className="font-medium">{service.duration}min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Preço</span>
                    <span className="font-medium text-primary">
                      R$ {Number.parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/scheduling')}
                >
                  Agendar Este Serviço
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher a Nexa Agenda?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Rápido e Fácil',
                description: 'Agende em poucos cliques, sem burocracia.',
              },
              {
                icon: '🔒',
                title: 'Seguro',
                description: 'Seus dados estão seguros e criptografados.',
              },
              {
                icon: '📱',
                title: 'Acessível',
                description: 'Acesse de qualquer dispositivo, a qualquer hora.',
              },
            ].map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="py-20">
        <div className="container-app">
          <div className="bg-card/50 border border-card rounded-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Horário de Funcionamento</h3>
            </div>

            <div className="space-y-3">
              {[
                { day: 'Segunda a Sexta', hours: '09:00 - 18:00' },
                { day: 'Sábado', hours: '09:00 - 16:00' },
                { day: 'Domingo', hours: 'Fechado' },
              ].map((schedule) => (
                <div
                  key={schedule.day}
                  className="flex items-center justify-between pb-3 border-b border-card/50 last:border-0"
                >
                  <span className="font-medium">{schedule.day}</span>
                  <span className="text-text-secondary">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}