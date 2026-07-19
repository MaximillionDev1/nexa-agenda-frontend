import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { IService } from "@/types";
import { Scissors, Zap, Droplets, Check } from "lucide-react";

interface Step1ServiceSelectionProps {
  selectedServiceId?: string;
  onSelectService: (serviceId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Sparkles: <div className="text-xl">✨</div>,
  Droplets: <Droplets className="w-6 h-6" />,
  Check: <Check className="w-6 h-6" />,
};

export function Step1ServiceSelection({
  selectedServiceId,
  onSelectService,
}: Step1ServiceSelectionProps) {
  const { data: services = [], isLoading } = useQuery<IService[]>({
    queryKey: ["services"],
    queryFn: () => apiService.getServices(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Escolha o serviço desejado</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <motion.button
            key={service.id}
            onClick={() => onSelectService(service.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedServiceId === service.id
                ? "border-primary bg-primary/10"
                : "border-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedServiceId === service.id
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {iconMap[service.icon]}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-text-secondary mb-3">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{service.duration}min</span>
                  <span className="font-semibold text-primary">
                    R$ {Number.parseFloat(service.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedServiceId === service.id && <div className="text-primary">✓</div>}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
