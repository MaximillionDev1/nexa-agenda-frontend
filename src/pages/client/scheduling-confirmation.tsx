import { useParams, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { PublicLayout } from '@/layouts/PublicLayout'
import { apiService } from '@/services/api'
import { Button } from '@/components/ui/Button'
import {
  CheckCircle,
  Copy,
  MessageCircle,
  Home,
  Calendar,
  Clock,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface LocationState {
  customerPhone?: string
}

export default function SchedulingConfirmationPage() {
  const { publicCode } = useParams<{ publicCode: string }>()
  const navigate = useNavigate()
  const location = useLocation() as { state?: LocationState }
  const customerPhone = location.state?.customerPhone || ''

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', publicCode],
    queryFn: () => {
      if (!publicCode) throw new Error('Código não fornecido')
      return apiService.lookupAppointment({
        publicCode,
        customerPhone,
      })
    },
  })

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Carregando confirmação...</p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!appointment) {
    return (
      <PublicLayout>
        <div className="py-20 container-app max-w-md mx-auto">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Agendamento não encontrado</p>
            <Button onClick={() => navigate('/')}>Voltar ao início</Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appointment.publicCode)
    toast.success('Código copiado!')
  }

  const handleShareWhatsApp = () => {
    const message = `Olá! Meu agendamento foi confirmado!\n\n📅 ${format(
      new Date(appointment.appointmentDate),
      'dd/MM/yyyy',
      { locale: ptBR }
    )}\n🕐 ${appointment.startTime}\n💇 ${
      appointment.service.name
    }\n💰 R$ ${Number.parseFloat(appointment.service.price).toFixed(2)}\n\nCódigo: ${
      appointment.publicCode
    }`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const endTime = new Date(
    new Date(appointment.startTime).getTime() +
      appointment.service.duration * 60000
  )

  const formattedDate = format(new Date(appointment.appointmentDate), 'dd/MM/yyyy', {
    locale: ptBR,
  })

  const formattedEndTime = format(endTime, 'HH:mm')

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="container-app max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <CheckCircle className="w-20 h-20 text-success" />
            </motion.div>

            <h1 className="text-4xl font-bold mb-2">Agendamento confirmado!</h1>
            <p className="text-text-secondary text-lg">
              Tudo pronto. Visualize os detalhes abaixo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-success/10 to-success/5 border border-success/30 rounded-xl p-8 mb-8 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{appointment.service.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-y border-success/20">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Data</p>
                    <p className="font-semibold">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Horário</p>
                    <p className="font-semibold">
                      {appointment.startTime} às {formattedEndTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">⏱️ Duração</span>
                  <p className="font-semibold">{appointment.service.duration} minutos</p>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm text-text-secondary">Valor</p>
                    <p className="font-semibold text-success">
                      R$ {Number.parseFloat(appointment.service.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Código do agendamento</p>
                <div className="flex items-center gap-3 bg-background/50 border border-success/20 rounded-lg p-4">
                  <code className="font-mono font-bold text-lg">
                    {appointment.publicCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="ml-auto p-2 hover:bg-success/10 rounded-lg transition-colors text-success"
                    aria-label="Copiar código"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-text-secondary">
                  Guarde este código. Você precisará dele para consultar seu agendamento.
                </p>
              </div>
            </div>
          </motion.div>

          {appointment.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/50 border border-card rounded-xl p-6 mb-8"
            >
              <p className="text-sm text-text-secondary mb-2">Sua observação</p>
              <p className="text-sm">{appointment.notes}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Compartilhar no WhatsApp
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Voltar ao Início
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center"
          >
            <p className="text-sm text-text-secondary mb-3">
              Quer consultar seu agendamento depois?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/lookup')}
            >
              Acessar página de consulta
            </Button>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  )
}