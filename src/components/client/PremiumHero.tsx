import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

export function PremiumHero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-card/20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-app py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Agendamento inteligente</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            Seu horário.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-primary">
              Sua rotina.
            </span>{" "}
            Tudo organizado.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Agende seus serviços em poucos cliques. Sem filas, sem complicações, sem estresse. A
            solução perfeita para gerenciar seus compromissos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/scheduling")}
              className="group"
            >
              Começar a Agendar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/lookup")}>
              Consultar Agendamento
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
          >
            {[
              {
                id: "fast",
                icon: <Zap className="w-6 h-6" />,
                title: "Rápido",
                description: "Agende em segundos",
              },
              {
                id: "secure",
                icon: <Shield className="w-6 h-6" />,
                title: "Seguro",
                description: "Seus dados protegidos",
              },
              {
                id: "available",
                icon: <Clock className="w-6 h-6" />,
                title: "Disponível",
                description: "Acesse 24/7",
              },
            ].map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5 }}
                className="bg-card/50 border border-card rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-card"
          >
            {[
              { id: "users", number: "10K+", label: "Usuários" },
              { id: "appointments", number: "50K+", label: "Agendamentos" },
              { id: "countries", number: "50+", label: "Países" },
              { id: "uptime", number: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.id} className="text-center py-4">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
