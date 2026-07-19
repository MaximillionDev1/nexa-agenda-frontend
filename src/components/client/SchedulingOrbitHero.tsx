import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function SchedulingOrbitHero() {
  const navigate = useNavigate()

  const orbitVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      },
    },
  }

  const dotVariants = {
    float: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        delay: i * 0.2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    }),
  }

  return (
    <div className="relative min-h-screen bg-background text-text overflow-hidden flex items-center justify-center px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

      {/* Animated Background Circles */}
      <div className="absolute inset-0">
        {/* Orbit 1 */}
        <motion.div
          variants={orbitVariants}
          animate="rotate"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/20 rounded-full"
        />

        {/* Orbit 2 */}
        <motion.div
          variants={orbitVariants}
          animate="rotate"
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-primary-light/20 rounded-full"
        />

        {/* Orbiting Dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dotVariants}
            animate="float"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `rotate(${(i * 120) % 360}deg) translateY(-200px)`,
            }}
          >
            <div className="w-3 h-3 bg-primary-light rounded-full shadow-lg shadow-primary-light/50" />
          </motion.div>
        ))}

        {/* Center Clock Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-2xl shadow-primary/50"
          >
            <Clock className="w-8 h-8 text-background" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Seu horário.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Sua rotina.
            </span>
            <br />
            Tudo organizado.
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-text-secondary text-lg"
        >
          Agende seus serviços de forma rápida e segura. Sem filas, sem complicações.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/scheduling')}
            className="group"
          >
            Agendar Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/lookup')}
          >
            <Calendar className="w-5 h-5" />
            Consultar Agendamento
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 gap-4 pt-8"
        >
          {[
  { id: 'appointments', number: '500+', label: 'Agendamentos' },
  { id: 'rating', number: '4.9★', label: 'Avaliação' },
].map((stat) => (
  <div key={stat.id} className="text-center">
              <p className="text-2xl font-bold text-primary">{stat.number}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}