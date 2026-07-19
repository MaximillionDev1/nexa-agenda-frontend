import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { IService } from "@/types";
import type { ServiceFormData } from "@/hooks/useServicesAdmin";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required").min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration must be at most 8 hours"),
  price: z.string().min(1, "Price is required"), // Agora é string
  icon: z.string().min(1, "Icon is required"),
});

type ServiceFormInputs = z.infer<typeof serviceSchema>;

const ICON_OPTIONS = [
  { value: "scissors", label: "✂️", title: "Haircut" },
  { value: "bath", label: "🛁", title: "Bath" },
  { value: "massage", label: "💆", title: "Massage" },
  { value: "nails", label: "💅", title: "Nails" },
  { value: "sparkles", label: "✨", title: "Spa" },
  { value: "smile", label: "😁", title: "Smile" },
  { value: "heart", label: "❤️", title: "Health" },
  { value: "zap", label: "⚡", title: "Energy" },
];

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  loading?: boolean;
  service?: IService | null;
}

export function ServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  service,
}: ServiceFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ServiceFormInputs>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: "",
      icon: "sparkles",
    },
  });

  // Update form when service or modal state changes
  useEffect(() => {
    if (isOpen) {
      if (service) {
        reset({
          name: service.name,
          description: service.description || "",
          duration: service.duration,
          price: service.price, // Agora é string
          icon: service.icon,
        });
      } else {
        reset({
          name: "",
          description: "",
          duration: 30,
          price: "",
          icon: "sparkles",
        });
      }
    }
  }, [service, reset, isOpen]);

  const selectedIcon = watch("icon");

  const handleFormSubmit = (data: ServiceFormInputs) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
      duration: data.duration,
      price: data.price,
      icon: data.icon,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-card rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-50"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-text">
            {service ? "Edit Service" : "Create Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Service Name */}
          <div>
            <label
              htmlFor="service-name"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Service Name *
            </label>
            <input
              id="service-name"
              type="text"
              placeholder="e.g., Haircut"
              {...register("name")}
              className="w-full px-3 py-2 bg-background border border-card rounded-lg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="service-description"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Description
            </label>
            <textarea
              id="service-description"
              placeholder="Service description (optional)"
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-card rounded-lg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="service-duration"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Duration (minutes) *
            </label>
            <input
              id="service-duration"
              type="number"
              min={15}
              max={480}
              step={15}
              {...register("duration", { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-background border border-card rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
            {errors.duration && (
              <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="service-price"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Price (R$) *
            </label>
            <input
              id="service-price"
              type="text"
              placeholder="0.00"
              {...register("price")}
              className="w-full px-3 py-2 bg-background border border-card rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>

          {/* Icon */}
          <fieldset>
            <legend className="block text-sm font-medium text-text-secondary mb-2">Icon *</legend>
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  htmlFor={`icon-${option.value}`}
                  className={`flex items-center justify-center aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                    selectedIcon === option.value
                      ? "border-primary bg-primary/10"
                      : "border-card hover:border-primary/50"
                  }`}
                  title={option.title}
                >
                  <input
                    id={`icon-${option.value}`}
                    type="radio"
                    {...register("icon")}
                    value={option.value}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="text-2xl" aria-hidden="true">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.icon && <p className="text-sm text-red-500 mt-1">{errors.icon.message}</p>}
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {service ? "Update Service" : "Create Service"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
