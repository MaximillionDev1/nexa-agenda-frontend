import { useQuery } from '@tanstack/react-query'
import { PublicLayout } from '@/layouts/PublicLayout'
import { PremiumHero } from '@/components/client/PremiumHero'
import { Button } from '@/components/ui/Button'
import { apiService } from '@/services/api'
import type { IService, INextAvailableSlot } from '@/types'
import { Clock, MapPin, Scissors, Zap, Droplets, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Sparkles: <div className="w-8 h-8">✨</div>,
  Droplets: <Droplets className="w-8 h-8" />,
  Check: <Check className="w-8 h-8" />,
}

export default function HomePage() {
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
      <PremiumHero />

      {/* Next Available Slot */}
      {nextSlot && (
        <section className="py-12 bg-card/30 border-y border-card">
          <div className="container-app text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 bg-card border border-primary/30 rounded-full px-6 py-3"
            >
              <Clock className="w-5 h-5 text-primary" />
              <span>
                Próximo horário:{' '}
                <span className="font-semibold text-primary">{nextSlot.formatted}</span>
              </span>
            </motion.div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Oferecemos uma ampla variedade de serviços de qualidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card/50 border border-card rounded-xl p-6 backdrop-blur-sm hover:border-primary transition-colors"
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

                <Button variant="primary" size="sm" className="w-full">
                  Agendar
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher Nexa Agenda?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'benefit-1',
                icon: '⚡',
                title: 'Rápido e Fácil',
                description: 'Agende em poucos cliques, sem burocracia.',
              },
              {
                id: 'benefit-2',
                icon: '🔒',
                title: 'Seguro',
                description: 'Seus dados estão seguros e criptografados.',
              },
              {
                id: 'benefit-3',
                icon: '📱',
                title: 'Acessível',
                description: 'Acesse de qualquer dispositivo, a qualquer hora.',
              },
            ].map((benefit) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-20">
        <div className="container-app">
          <div className="bg-card/50 border border-card rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Horário de Funcionamento</h3>
            </div>

            <div className="space-y-3">
              {[
  { id: 'weekdays', day: 'Segunda a Sexta', hours: '09:00 - 18:00' },
  { id: 'saturday', day: 'Sábado', hours: '09:00 - 16:00' },
  { id: 'sunday', day: 'Domingo', hours: 'Fechado' },
].map((schedule) => (
  <div key={schedule.id}
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